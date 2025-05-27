import type { Express, Request, Response } from "express";
import Stripe from "stripe";
import { storage } from "./storage";
import { requireAuth } from "./auth";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export function registerSubscriptionRoutes(app: Express) {
  // Create subscription endpoint
  app.post('/api/create-subscription', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const { priceId } = req.body;

      if (!user?.claims?.email) {
        return res.status(400).json({ error: 'User email required' });
      }

      // Create or retrieve Stripe customer
      let customerId = user.stripeCustomerId;
      
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.claims.email,
          name: `${user.claims.first_name || ''} ${user.claims.last_name || ''}`.trim(),
        });
        customerId = customer.id;
        
        // Update user with Stripe customer ID
        await storage.updateUserSubscription(user.claims.sub, {
          stripeCustomerId: customerId
        });
      }

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      const invoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

      res.json({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      console.error('Error creating subscription:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Stripe webhook handler
  app.post('/api/stripe/webhook', async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated': {
          const subscription = event.data.object as Stripe.Subscription;
          const customer = await stripe.customers.retrieve(subscription.customer as string);
          
          if ('email' in customer && customer.email) {
            const user = await storage.getUserByEmail(customer.email);
            if (user) {
              await storage.updateUserSubscription(user.id, {
                subscriptionType: subscription.status === 'active' ? 'premium' : 'free',
                subscriptionStatus: subscription.status,
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: subscription.customer as string,
                subscriptionEndDate: new Date(subscription.current_period_end * 1000),
              });
            }
          }
          break;
        }
        
        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          const customer = await stripe.customers.retrieve(subscription.customer as string);
          
          if ('email' in customer && customer.email) {
            const user = await storage.getUserByEmail(customer.email);
            if (user) {
              await storage.updateUserSubscription(user.id, {
                subscriptionType: 'free',
                subscriptionStatus: 'cancelled',
                stripeSubscriptionId: null,
                subscriptionEndDate: null,
              });
            }
          }
          break;
        }
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  });

  // Get user subscription status
  app.get('/api/subscription/status', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const dbUser = await storage.getUser(user.claims.sub);
      
      res.json({
        subscriptionType: dbUser?.subscriptionType || 'free',
        subscriptionStatus: dbUser?.subscriptionStatus || 'inactive',
        subscriptionEndDate: dbUser?.subscriptionEndDate,
      });
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      res.status(500).json({ error: 'Failed to fetch subscription status' });
    }
  });
}