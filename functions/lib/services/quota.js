"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TIER_DAILY_LIMITS = void 0;
exports.enforceDailyQuota = enforceDailyQuota;
const firestore_1 = require("firebase-admin/firestore");
exports.TIER_DAILY_LIMITS = {
    starter: 20,
    pro: 30,
    business: 50,
    unpaid: 0,
    free: 0,
};
/**
 * Enforces daily usage quotas stored in Firestore using atomic transactions
 */
async function enforceDailyQuota(userId, userTier = 'starter') {
    const normalizedTier = userTier && exports.TIER_DAILY_LIMITS[userTier] !== undefined ? userTier : 'starter';
    const dailyLimit = exports.TIER_DAILY_LIMITS[normalizedTier];
    if (dailyLimit === 0) {
        return {
            allowed: false,
            tier: normalizedTier,
            dailyLimit: 0,
            currentCount: 0,
            remaining: 0,
            error: 'Daily quota limit reached. Free/unpaid accounts have 0 daily requests. Please subscribe to Starter (20/day), Pro (30/day), or Business (50/day).',
        };
    }
    const todayStr = new Date().toISOString().split('T')[0];
    const db = (0, firestore_1.getFirestore)();
    const usageRef = db.doc(`daily_usage/${userId}_${todayStr}`);
    try {
        return await db.runTransaction(async (transaction) => {
            const docSnap = await transaction.get(usageRef);
            let currentCount = 0;
            if (docSnap.exists) {
                currentCount = docSnap.data()?.count || 0;
            }
            if (currentCount >= dailyLimit) {
                return {
                    allowed: false,
                    tier: normalizedTier,
                    dailyLimit,
                    currentCount,
                    remaining: 0,
                    error: `Daily quota of ${dailyLimit} requests reached for ${normalizedTier.toUpperCase()} plan today.`,
                };
            }
            const newCount = currentCount + 1;
            transaction.set(usageRef, {
                userId,
                date: todayStr,
                count: newCount,
                updatedAt: new Date().toISOString(),
            }, { merge: true });
            return {
                allowed: true,
                tier: normalizedTier,
                dailyLimit,
                currentCount: newCount,
                remaining: Math.max(0, dailyLimit - newCount),
            };
        });
    }
    catch (err) {
        console.warn('[enforceDailyQuota] Firestore transaction fallback:', err);
        return {
            allowed: true,
            tier: normalizedTier,
            dailyLimit,
            currentCount: 1,
            remaining: dailyLimit - 1,
        };
    }
}
//# sourceMappingURL=quota.js.map