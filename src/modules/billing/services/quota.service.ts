import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';
import { SUBSCRIPTION_TIERS, SubscriptionTierKey, TierConfig } from '@/config/tiers';

export type SubscriptionTier = SubscriptionTierKey | 'unpaid' | 'free';

export interface DurationQuotaResult {
  allowed: boolean;
  tier: SubscriptionTierKey;
  monthlyLimitSeconds: number;
  monthlyLimitMinutes: number;
  secondsUsedThisMonth: number;
  secondsRemaining: number;
  minutesRemaining: number;
  error?: string;
}

export interface QuotaCheckResult extends DurationQuotaResult {
  dailyLimit: number;
  currentCount: number;
  remaining: number;
}

/**
 * Validate and increment monthly video duration usage for a user.
 * Firestore Document Path: `monthly_usage/{userId}_{YYYY-MM}`
 */
export async function checkAndIncrementUsage(
  userId: string,
  requestedSeconds: number = 30, // Default 30s video render segment
  userTier: SubscriptionTier = 'starter'
): Promise<DurationQuotaResult> {
  const normalizedTierKey: SubscriptionTierKey =
    userTier === 'pro' || userTier === 'business' ? userTier : 'starter';

  const tierConfig: TierConfig = SUBSCRIPTION_TIERS[normalizedTierKey];
  const monthlyLimitSeconds = tierConfig.monthlyLimitSeconds;
  const monthlyLimitMinutes = tierConfig.monthlyMinutes;

  const currentYearMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const usageDocId = `${userId || 'guest'}_${currentYearMonth}`;
  const usageDocRef = doc(db, 'monthly_usage', usageDocId);

  try {
    const docSnap = await getDoc(usageDocRef);
    let secondsUsedThisMonth = 0;

    if (docSnap.exists()) {
      secondsUsedThisMonth = docSnap.data().secondsUsedThisMonth || 0;
    }

    if (secondsUsedThisMonth + requestedSeconds > monthlyLimitSeconds) {
      const secondsRemaining = Math.max(0, monthlyLimitSeconds - secondsUsedThisMonth);
      const minutesRemaining = Number((secondsRemaining / 60).toFixed(1));
      return {
        allowed: false,
        tier: normalizedTierKey,
        monthlyLimitSeconds,
        monthlyLimitMinutes,
        secondsUsedThisMonth,
        secondsRemaining,
        minutesRemaining,
        error: `Monthly video duration limit reached (${tierConfig.name}: ${monthlyLimitMinutes} mins / ${monthlyLimitSeconds}s). Used ${secondsUsedThisMonth}s this month. Upgrade to Pro ($19 / 50m) or Business ($29 / 100m) for more render time.`,
      };
    }

    // Record incremented usage in Firestore
    const newUsedSeconds = secondsUsedThisMonth + requestedSeconds;
    await setDoc(
      usageDocRef,
      {
        userId: userId || 'guest',
        billingYearMonth: currentYearMonth,
        monthlyPrice: tierConfig.price,
        tier: normalizedTierKey,
        secondsUsedThisMonth: increment(requestedSeconds),
        monthlyLimitSeconds,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    const secondsRemaining = Math.max(0, monthlyLimitSeconds - newUsedSeconds);
    const minutesRemaining = Number((secondsRemaining / 60).toFixed(1));

    return {
      allowed: true,
      tier: normalizedTierKey,
      monthlyLimitSeconds,
      monthlyLimitMinutes,
      secondsUsedThisMonth: newUsedSeconds,
      secondsRemaining,
      minutesRemaining,
    };
  } catch (error) {
    console.warn('[QuotaService] Firestore monthly duration check fallback:', error);
    // Offline/Fallback: allow generation if Firestore read fails
    return {
      allowed: true,
      tier: normalizedTierKey,
      monthlyLimitSeconds,
      monthlyLimitMinutes,
      secondsUsedThisMonth: requestedSeconds,
      secondsRemaining: monthlyLimitSeconds - requestedSeconds,
      minutesRemaining: Number(((monthlyLimitSeconds - requestedSeconds) / 60).toFixed(1)),
    };
  }
}

/**
 * Backward-compatible helper used across API routes
 */
export async function checkAndEnforceDailyQuota(
  userId: string,
  userTier: SubscriptionTier = 'starter'
): Promise<QuotaCheckResult> {
  const durationCheck = await checkAndIncrementUsage(userId, 30, userTier);

  return {
    ...durationCheck,
    dailyLimit: durationCheck.monthlyLimitMinutes,
    currentCount: Math.ceil(durationCheck.secondsUsedThisMonth / 60),
    remaining: Math.max(0, durationCheck.minutesRemaining),
  };
}
