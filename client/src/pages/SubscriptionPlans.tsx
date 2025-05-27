import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { 
  Check, Star, Crown, Zap, Users, BookOpen, 
  Video, Download, MessageCircle, Shield,
  ArrowRight, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface SubscriptionPlan {
  id: string;
  name: string;
  displayName: string;
  price: number;
  period: string;
  originalPrice?: number;
  description: string;
  features: string[];
  highlighted?: boolean;
  icon: React.ReactNode;
  color: string;
  badge?: string;
}

export default function SubscriptionPlans() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'free',
      displayName: 'Ingyenes',
      price: 0,
      period: 'örökre',
      description: 'Kezdd el a tanulást alapvető funkciókkal',
      features: [
        'Hozzáférés 3 ingyenes kurzushoz',
        'Alapvető tananyagok',
        'Közösségi fórum',
        'Mobil alkalmazás',
        'Alapvető tanúsítványok'
      ],
      icon: <BookOpen className="h-6 w-6" />,
      color: 'from-gray-500 to-gray-600'
    },
    {
      id: 'plus',
      name: 'plus',
      displayName: 'Plus',
      price: 18880,
      period: 'hó',
      description: 'Teljes hozzáférés minden funkcióhoz',
      features: [
        'Korlátlan hozzáférés minden kurzushoz',
        'Exkluzív Plus tartalmak',
        'HD videók letöltése',
        'Prioritásos ügyfélszolgálat',
        'Haladó analitikák',
        'Személyre szabott tanulási útvonalak',
        'Élő webináriumok',
        'Hálózati funkciók'
      ],
      highlighted: true,
      icon: <Star className="h-6 w-6" />,
      color: 'from-blue-500 to-purple-600',
      badge: 'Legnépszerűbb'
    },
    {
      id: 'annual',
      name: 'annual',
      displayName: 'Éves Plus',
      price: 12880,
      originalPrice: 18880,
      period: 'hó',
      description: 'Plus előfizetés éves fizetéssel és extra kedvezményekkel',
      features: [
        'Minden Plus funkció',
        '32% megtakarítás évente',
        'Exkluzív éves előfizetői tartalmak',
        'Korai hozzáférés új kurzusokhoz',
        'VIP közösségi hozzáférés',
        'Személyes tanulási mentor',
        'Karrier tanácsadás',
        'Iparági kapcsolatok'
      ],
      icon: <Crown className="h-6 w-6" />,
      color: 'from-purple-500 to-pink-600',
      badge: 'Legjobb érték'
    }
  ];

  // Get current user subscription
  const { data: currentSubscription } = useQuery({
    queryKey: ['/api/subscription/current'],
    enabled: !!user,
  });

  // Create subscription mutation
  const createSubscriptionMutation = useMutation({
    mutationFn: async (planId: string) => {
      const response = await apiRequest('POST', '/api/subscription/create', { planId });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        toast({
          title: "Előfizetés frissítve",
          description: "Az előfizetésed sikeresen frissítve lett!",
        });
        queryClient.invalidateQueries({ queryKey: ['/api/subscription/current'] });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Hiba történt",
        description: error.message || "Nem sikerült létrehozni az előfizetést.",
        variant: "destructive",
      });
    }
  });

  const handleSubscribe = (planId: string) => {
    if (!user) {
      toast({
        title: "Bejelentkezés szükséges",
        description: "Kérjük, jelentkezz be az előfizetés létrehozásához.",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedPlan(planId);
    createSubscriptionMutation.mutate(planId);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('hu-HU').format(price);
  };

  const getCurrentPlanId = () => {
    return currentSubscription?.subscriptionType || 'free';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Válaszd ki a neked megfelelő csomagot
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Fejleszd magad velünk
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Három különböző előfizetési csomagot kínálunk, hogy minden tanulási igényt kielégítsünk. 
            Válaszd azt, amely a legjobban illik hozzád!
          </p>
        </div>

        {/* Current subscription info */}
        {user && (
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-2 rounded-full">
              <Shield className="h-4 w-4" />
              Jelenlegi előfizetésed: <span className="font-medium">
                {subscriptionPlans.find(p => p.id === getCurrentPlanId())?.displayName || 'Ingyenes'}
              </span>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {subscriptionPlans.map((plan) => {
            const isCurrentPlan = getCurrentPlanId() === plan.id;
            const isSelected = selectedPlan === plan.id;
            
            return (
              <Card 
                key={plan.id} 
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                  plan.highlighted 
                    ? 'ring-2 ring-blue-500 shadow-2xl scale-105 z-10' 
                    : isCurrentPlan 
                      ? 'ring-2 ring-green-500 shadow-lg'
                      : 'hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                {plan.badge && (
                  <div className={`absolute -top-0 left-0 right-0 bg-gradient-to-r ${plan.color} text-white text-center py-2 text-sm font-medium`}>
                    {plan.badge}
                  </div>
                )}

                <CardHeader className={`text-center ${plan.badge ? 'pt-12' : 'pt-6'}`}>
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center text-white shadow-lg`}>
                    {plan.icon}
                  </div>
                  
                  <CardTitle className="text-2xl font-bold mb-2">
                    {plan.displayName}
                  </CardTitle>
                  
                  <div className="mb-4">
                    {plan.price === 0 ? (
                      <div className="text-4xl font-bold text-gray-900 dark:text-white">
                        Ingyenes
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        {plan.originalPrice && (
                          <span className="text-lg line-through text-gray-400">
                            {formatPrice(plan.originalPrice)} Ft
                          </span>
                        )}
                        <div className="text-4xl font-bold text-gray-900 dark:text-white">
                          {formatPrice(plan.price)} Ft
                        </div>
                        <span className="text-gray-600 dark:text-gray-400">
                          / {plan.period}
                        </span>
                      </div>
                    )}
                    
                    {plan.originalPrice && (
                      <div className="text-sm text-green-600 font-medium mt-1">
                        {Math.round((1 - plan.price / plan.originalPrice) * 100)}% megtakarítás
                      </div>
                    )}
                  </div>
                  
                  <CardDescription className="text-center">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {isCurrentPlan ? (
                    <Button 
                      className="w-full" 
                      variant="outline"
                      disabled
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Jelenlegi csomag
                    </Button>
                  ) : (
                    <Button
                      className={`w-full font-medium ${
                        plan.highlighted 
                          ? `bg-gradient-to-r ${plan.color} text-white hover:opacity-90` 
                          : ''
                      }`}
                      variant={plan.highlighted ? "default" : "outline"}
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={createSubscriptionMutation.isPending && isSelected}
                    >
                      {createSubscriptionMutation.isPending && isSelected ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Feldolgozás...
                        </>
                      ) : plan.price === 0 ? (
                        <>
                          Ingyenes kezdés
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      ) : (
                        <>
                          Előfizetés kezdése
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Comparison */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Részletes funkció összehasonlítás
          </h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden max-w-5xl mx-auto">
            <div className="grid grid-cols-4 gap-4 p-6 bg-gray-50 dark:bg-gray-700">
              <div className="font-semibold text-gray-900 dark:text-white">Funkciók</div>
              <div className="text-center font-semibold text-gray-900 dark:text-white">Ingyenes</div>
              <div className="text-center font-semibold text-blue-600">Plus</div>
              <div className="text-center font-semibold text-purple-600">Éves Plus</div>
            </div>
            
            <Separator />
            
            <div className="p-6 space-y-4">
              {[
                { feature: 'Kurzusok száma', free: '3', plus: 'Korlátlan', annual: 'Korlátlan' },
                { feature: 'Videó letöltés', free: '✗', plus: '✓', annual: '✓' },
                { feature: 'Személyre szabott tanulás', free: '✗', plus: '✓', annual: '✓' },
                { feature: 'Élő webináriumok', free: '✗', plus: '✓', annual: '✓' },
                { feature: 'Prioritásos támogatás', free: '✗', plus: '✓', annual: '✓' },
                { feature: 'Személyes mentor', free: '✗', plus: '✗', annual: '✓' },
                { feature: 'VIP közösség', free: '✗', plus: '✗', annual: '✓' },
                { feature: 'Korai hozzáférés', free: '✗', plus: '✗', annual: '✓' }
              ].map((row, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 py-2">
                  <div className="text-gray-700 dark:text-gray-300">{row.feature}</div>
                  <div className="text-center text-gray-600">{row.free}</div>
                  <div className="text-center text-blue-600">{row.plus}</div>
                  <div className="text-center text-purple-600">{row.annual}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Gyakran ismételt kérdések
          </h2>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mikor leszek terhelve?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  A fizetés az előfizetés aktiválásakor történik meg. Az éves csomagnál egy összegben fizetsz egy évre előre.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lemondhatom bármikor?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Igen, bármikor lemondhatod az előfizetésed. A már kifizetett időszak végéig hozzáférhetsz a Plus funkciókhoz.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mi a különbség a Plus és az Éves Plus között?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Az Éves Plus ugyanazokat a funkciókat tartalmazza, mint a Plus, de 32%-kal olcsóbb és extra exkluzív tartalmakat is kapsz.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}