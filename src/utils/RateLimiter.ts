export class RateLimiter {
  private queue: Array<() => void> = [];
  private timestamps: number[] = [];
  private processing: boolean = false;
  private readonly maxRequests: number;
  private readonly timeWindowMs: number;

  constructor(maxRequests = 50, timeWindowMs = 5000) {
    this.maxRequests = maxRequests;
    this.timeWindowMs = timeWindowMs;
  }

  public async schedule<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const now = Date.now();
      this.timestamps = this.timestamps.filter((t) => now - t < this.timeWindowMs);

      if (this.timestamps.length >= this.maxRequests) {
        const oldest = this.timestamps[0];
        const waitTime = this.timeWindowMs - (now - oldest);
        await new Promise((r) => setTimeout(r, waitTime));
        continue;
      }

      const task = this.queue.shift();
      if (task) {
        this.timestamps.push(Date.now());
        task();
      }
    }

    this.processing = false;
  }
}
