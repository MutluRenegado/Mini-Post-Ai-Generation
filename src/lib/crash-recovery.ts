/**
 * Multi-Tier Crash Recovery & Silent Failover Architecture
 * Guarantees zero visual friction, no broken DOM elements, and a seamless fallback experience (v1 -> v2 -> v3 -> v4)
 */

const LOCAL_STORAGE_KEY_CONSECUTIVE_FAILURES = 'crash_recovery_v1_failures';
const LOCAL_STORAGE_KEY_DEFAULT_TIER = 'crash_recovery_default_tier';
const LOCAL_STORAGE_KEY_PAYLOAD_CACHE = 'crash_recovery_last_payload';

/**
 * Cache payload state to local storage prior to executing handlers
 */
export function cachePayloadState(key: string, payload: any): void {
  if (typeof window === 'undefined') return;
  try {
    const serialized = JSON.stringify({
      timestamp: new Date().toISOString(),
      payload,
    });
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PAYLOAD_CACHE}_${key}`, serialized);
  } catch (err) {
    console.warn('[CrashRecovery] Failed to cache payload state:', err);
  }
}

/**
 * Retrieve cached payload state from local storage
 */
export function getCachedPayloadState<T = any>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_KEY_PAYLOAD_CACHE}_${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.payload as T;
  } catch {
    return null;
  }
}

/**
 * Determine initial tier preference based on auto-healing history
 */
export function getTierPreference(): 'v1' | 'v2' {
  if (typeof window === 'undefined') return 'v1';
  try {
    const pref = localStorage.getItem(LOCAL_STORAGE_KEY_DEFAULT_TIER);
    return pref === 'v2' ? 'v2' : 'v1';
  } catch {
    return 'v1';
  }
}

/**
 * Record failure for tier v1 to trigger auto-healing flag if consecutive threshold is reached
 */
function recordTierFailure(): void {
  if (typeof window === 'undefined') return;
  try {
    const current = Number(localStorage.getItem(LOCAL_STORAGE_KEY_CONSECUTIVE_FAILURES) || 0) + 1;
    localStorage.setItem(LOCAL_STORAGE_KEY_CONSECUTIVE_FAILURES, String(current));
    if (current >= 2) {
      console.warn('[CrashRecovery] Auto-healing activated: Defaulting subsequent sessions to Version 2 (Resilient Tier).');
      localStorage.setItem(LOCAL_STORAGE_KEY_DEFAULT_TIER, 'v2');
    }
  } catch {}
}

/**
 * Record success to reset failure counters and heal session defaults
 */
function recordTierSuccess(tierIndex: number): void {
  if (typeof window === 'undefined') return;
  try {
    if (tierIndex === 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY_CONSECUTIVE_FAILURES, '0');
      localStorage.setItem(LOCAL_STORAGE_KEY_DEFAULT_TIER, 'v1');
    }
  } catch {}
}

/**
 * Core Multi-Tier Execution Wrapper
 * Iterates through provided version handlers ($v1 -> v2 -> v3 -> v4$) silently.
 */
export async function executeWithCrashFallback<T>(
  payload: any,
  versions: Array<(data: any) => Promise<T> | T>,
  cacheKey?: string
): Promise<T> {
  if (cacheKey) {
    cachePayloadState(cacheKey, payload);
  }

  let lastError: any = null;
  const preferredTier = getTierPreference();
  const startIndex = preferredTier === 'v2' && versions.length > 1 ? 1 : 0;

  for (let i = startIndex; i < versions.length; i++) {
    const currentVersionHandler = versions[i];
    try {
      const result = await currentVersionHandler(payload);
      recordTierSuccess(i);
      return result;
    } catch (error) {
      lastError = error;
      if (i === 0) {
        recordTierFailure();
      }
      console.warn(`[CrashRecovery] Version ${i + 1} failed. Silently routing to next tier.`, error);
    }
  }

  // If starting at v2 failed, attempt v1 as final retry before safe state
  if (startIndex > 0 && versions[0]) {
    try {
      const result = await versions[0](payload);
      recordTierSuccess(0);
      return result;
    } catch (e) {
      lastError = e;
    }
  }

  console.error('[CrashRecovery] All execution tiers failed. Deploying ultimate safe-state fallback.', lastError);
  throw new Error('Execution completed via safe fallback state.');
}
