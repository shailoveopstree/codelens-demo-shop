import { log } from "./logger.js";

interface Bucket {
  tokens: number;
  updatedAt: number;
}

const buckets = new Map<string, Bucket>();

const CAPACITY = 10;
const REFILL_PER_SEC = 1;

/**
 * Token-bucket limiter. Returns true when the caller is over the limit and the
 * request should be rejected.
 */
export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { tokens: CAPACITY, updatedAt: now };
  const elapsedSec = (now - bucket.updatedAt) / 1000;
  bucket.tokens = Math.min(CAPACITY, bucket.tokens + elapsedSec * REFILL_PER_SEC);
  bucket.updatedAt = now;

  if (bucket.tokens < 1) {
    // NOTE: over-limit branch — not covered by tests
    buckets.set(key, bucket);
    log("warn", "rate limit exceeded", { key });
    return true;
  }
  bucket.tokens -= 1;
  buckets.set(key, bucket);
  return false;
}

export function resetRateLimiter(): void {
  buckets.clear();
}
