import type { Express, Request, Response } from "express";
import Stripe from "stripe";
import { storage } from "./storage";
import { isAuthenticated } from "./replitAuth";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is required');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// Subscription plan configurations
const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Ingyenes',
    price: 0,
    priceId: null,
    features: ['3 ingyenes kurzus', 'Alapvető tananyagok', 'Közösségi fórum']
  },
  plus: {
    name: 'Plus',
    price: 18880, // HUF
    priceId: process.env.STRIPE_PLUS_PRICE_ID,
    interval: 'month',
    features: ['Korlátlan kurzusok', 'HD videók', 'Prioritásos támogatás']
  },
  annual: {
    name: 'Éves Plus',
    price: 12880, // HUF per month, billed annually
    priceId: process.env.STRIPE_ANNUAL_PRICE_ID,
    interval: 'year',
    features: ['Minden Plus funkció', '32% megtakarítás', 'VIP közösség']
  }
};

export function registerSubscriptionRoutes(app: Express) {
  
  // Get current user subscription
  app.get("/api/subscription/current", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        subscriptionType: user.subscriptionType || 'free',
        subscriptionStatus: user.subscriptionStatus || 'active',
        subscriptionEndDate: user.subscriptionEndDate,
        stripeCustomerId: user.stripeCustomerId,
        stripeSubscriptionId: user.stripeSubscriptionId
      });
    } catch (error) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({ error: "Failed to fetch subscription" });
    }
  });

  // Create subscription
  app.post("/api/subscription/create", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const { planId } = req.body;
      
      if (!planId || !SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS]) {
        return res.status(400).json({ error: "Invalid plan ID" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const plan = SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS];

      // Handle free plan
      if (planId === 'free') {
        await storage.updateUserSubscription(userId, {
          subscriptionType: 'free',
          subscriptionStatus: 'active',
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          subscriptionEndDate: null
        });
        
        return res.json({ 
          success: true, 
          message: "Switched to free plan",
          subscriptionType: 'free'
        });
      }

      // Create or get Stripe customer
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email || '',
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          metadata: {
            userId: userId
          }
        });
        customerId = customer.id;
        await storage.updateUserSubscription(userId, { stripeCustomerId: customerId });
      }

      // Create Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: plan.priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${req.protocol}://${req.get('host')}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.protocol}://${req.get('host')}/subscription/plans`,
        metadata: {
          userId: userId,
          planId: planId
        },
        subscription_data: {
          metadata: {
            userId: userId,
            planId: planId
          }
        }
      });

      res.json({
        success: true,
        checkoutUrl: session.url,
        sessionId: session.id
      });

    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ error: "Failed to create subscription" });
    }
  });

  // Handle successful subscription
  app.get("/api/subscription/success", async (req: Request, res: Response) => {
    try {
      const { session_id } = req.query;
      
      if (!session_id) {
        return res.status(400).json({ error: "Missing session ID" });
      }

      const session = await stripe.checkout.sessions.retrieve(session_id as string, {
        expand: ['subscription']
      });

      if (session.payment_status === 'paid' && session.subscription) {
        const subscription = session.subscription as Stripe.Subscription;
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId;

        if (userId && planId) {
          await storage.updateUserSubscription(userId, {
            subscriptionType: planId,
            subscriptionStatus: 'active',
            stripeSubscriptionId: subscription.id,
            subscriptionEndDate: new Date(subscription.current_period_end * 1000)
          });
        }
      }

      // Redirect to success page
      res.redirect(`/?subscription=success`);
    } catch (error) {
      console.error("Error handling subscription success:", error);
      res.redirect(`/?subscription=error`);
    }
  });

  // Cancel subscription
  app.post("/api/subscription/cancel", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || !user.stripeSubscriptionId) {
        return res.status(400).json({ error: "No active subscription found" });
      }

      // Cancel at period end to allow access until billing cycle ends
      await stripe.subscriptions.update(user.stripeSubscriptionId, {
        cancel_at_period_end: true
      });

      await storage.updateUserSubscription(userId, {
        subscriptionStatus: 'canceled'
      });

      res.json({ 
        success: true, 
        message: "Subscription will be canceled at the end of the billing period" 
      });

    } catch (error) {
      console.error("Error canceling subscription:", error);
      res.status(500).json({ error: "Failed to cancel subscription" });
    }
  });

  // Stripe webhook handler
  app.post("/api/subscription/webhook", async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !endpointSecret) {
      return res.status(400).send('Missing signature or webhook secret');
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return res.status(400).send('Webhook signature verification failed');
    }

    try {
      switch (event.type) {
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          const subscription = event.data.object as Stripe.Subscription;
          const userId = subscription.metadata.userId;
          
          if (userId) {
            const status = subscription.status === 'active' ? 'active' : 
                          subscription.status === 'canceled' ? 'canceled' : 'inactive';
            
            await storage.updateUserSubscription(userId, {
              subscriptionStatus: status,
              subscriptionEndDate: new Date(subscription.current_period_end * 1000)
            });
          }
          break;

        case 'invoice.payment_failed':
          const invoice = event.data.object as Stripe.Invoice;
          if (invoice.subscription) {
            const sub = await stripe.subscriptions.retrieve(invoice.subscription as string);
            const userId = sub.metadata.userId;
            
            if (userId) {
              await storage.updateUserSubscription(userId, {
                subscriptionStatus: 'past_due'
              });
            }
          }
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Error handling webhook:', error);
      res.status(500).json({ error: 'Webhook handler failed' });
    }
  });

  // Get subscription plans
  app.get("/api/subscription/plans", async (req: Request, res: Response) => {
    try {
      res.json({
        plans: Object.entries(SUBSCRIPTION_PLANS).map(([id, plan]) => ({
          id,
          ...plan
        }))
      });
    } catch (error) {
      console.error("Error fetching plans:", error);
      res.status(500).json({ error: "Failed to fetch plans" });
    }
  });
}