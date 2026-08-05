import { UserProfile } from "@/types/user";

export function checkSubscriptionValidity(user: UserProfile): {
  isValid: boolean;
  reason?: string;
  daysRemaining: number;
} {
  const now = new Date();
  const periodEnd = new Date(user.subscriptionPeriodEnd);

  // Check if overall 30-day billing cycle has expired
  if (now > periodEnd || user.subscriptionStatus !== "active") {
    const diffTime = periodEnd.getTime() - now.getTime();
    const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    
    return {
      isValid: false,
      reason: "Subscription period has expired or is inactive.",
      daysRemaining,
    };
  }

  // Calculate days remaining in current 30-day cycle
  const diffTime = periodEnd.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    isValid: true,
    daysRemaining,
  };
}

/**
  Helper to compute new subscription dates upon signup or renewal (30 days)
 */
export function create30DaySubscriptionDates() {
  const now = new Date();
  const periodEnd = new Date();
  periodEnd.setDate(now.getDate() + 30); // 30 Days validity

  return {
    subscriptionPeriodStart: now.toISOString(),
    subscriptionPeriodEnd: periodEnd.toISOString(),
  };
}