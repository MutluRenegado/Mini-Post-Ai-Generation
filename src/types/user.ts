export interface UserProfile {
  uid: string;
  email: string;
  profileGroupId: string; // Postproxy tenant ID
  subscriptionStatus: "active" | "canceled" | "past_due" | "none";
  tier: "starter" | "pro" | "business";
  
  // Validity & Billing Cycle
  subscriptionPeriodStart: string; // ISO String (e.g. "2026-07-24T00:00:00.000Z")
  subscriptionPeriodEnd: string;   // ISO String (e.g. "2026-08-24T00:00:00.000Z") — Valid for 30 days
  
  // Quota Tracking
  dailyPostQuota: number;          // Starter: 20 | Pro: 30 | Business: 50
  postsUsedToday: number;
  lastQuotaReset: string;          // ISO String tracking daily reset
}