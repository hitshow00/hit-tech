// Hit Tech — Système de limitation de débit (Rate Limiting) en mémoire
// Protège les Server Actions sensibles (authentification, formulaires de contact, etc.) contre les abus par force brute.

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

// Nettoyage périodique pour éviter toute fuite de mémoire (toutes les 10 minutes)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of memoryStore.entries()) {
      if (record.resetAt <= now) {
        memoryStore.delete(key);
      }
    }
  }, 10 * 60 * 1000).unref?.();
}

export interface RateLimitOptions {
  keyPrefix: string;
  maxRequests: number;
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetInSeconds: number;
}

/**
 * Vérifie et incrémente le compteur pour un identifiant donné (IP, email ou jeton).
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const key = `${options.keyPrefix}:${identifier}`;
  const record = memoryStore.get(key);

  if (!record || record.resetAt <= now) {
    memoryStore.set(key, {
      count: 1,
      resetAt: now + options.windowMs,
    });
    return {
      success: true,
      remaining: options.maxRequests - 1,
      resetInSeconds: Math.ceil(options.windowMs / 1000),
    };
  }

  if (record.count >= options.maxRequests) {
    const resetInSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
    return {
      success: false,
      remaining: 0,
      resetInSeconds,
    };
  }

  record.count += 1;
  const resetInSeconds = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
  return {
    success: true,
    remaining: options.maxRequests - record.count,
    resetInSeconds,
  };
}
