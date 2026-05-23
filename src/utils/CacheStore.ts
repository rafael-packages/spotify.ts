interface CacheEntry<T> {
  data: T;
  expiry: number;
}

export class CacheStore {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTtl: number;

  constructor(defaultTtlSeconds = 60) {
    this.defaultTtl = defaultTtlSeconds * 1000;
  }

  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  public set<T>(key: string, data: T, ttlSeconds?: number): void {
    const ttl = ttlSeconds !== undefined ? ttlSeconds * 1000 : this.defaultTtl;
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl,
    });
  }

  public delete(key: string): void {
    this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }
}
