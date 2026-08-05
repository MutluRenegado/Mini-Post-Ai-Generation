export type SubscriptionTierKey = 'starter' | 'pro' | 'business';

export interface TierConfig {
  id: SubscriptionTierKey;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  popular?: boolean;
  icon?: 'zap' | 'building' | 'crown' | 'video' | 'clock' | 'qr';
  features: string[];
  stripePriceId?: string;
  monthlyLimitSeconds: number;
  monthlyMinutes: number;
}

export type SubscriptionTier = TierConfig;

export const SUBSCRIPTION_TIERS: Record<SubscriptionTierKey, TierConfig> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for individuals getting started.',
    price: 0,
    currency: 'USD',
    interval: 'month',
    icon: 'zap',
    features: ['1 Master Post -> 5 Platforms', '20 AI Generations / day', '10 Minutes Video Render / month'],
    monthlyLimitSeconds: 600,
    monthlyMinutes: 10,
  },
  pro: {
    id: 'pro',
    name: 'Professional',
    description: 'For creators and growing businesses.',
    price: 19,
    currency: 'USD',
    interval: 'month',
    popular: true,
    icon: 'building',
    features: ['Unlimited Multi-Platform Adaptations', '50 AI Generations / day', '50 Minutes Video Render / month'],
    monthlyLimitSeconds: 3000,
    monthlyMinutes: 50,
  },
  business: {
    id: 'business',
    name: 'Business',
    description: 'For teams and organizations.',
    price: 29,
    currency: 'USD',
    interval: 'month',
    icon: 'crown',
    features: ['Enterprise SLA & Priority Support', '100 AI Generations / day', '100 Minutes Video Render / month'],
    monthlyLimitSeconds: 6000,
    monthlyMinutes: 100,
  },
};