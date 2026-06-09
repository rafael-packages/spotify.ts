export class SpotifyError extends Error {
  public status?: number;
  public reason?: string;

  constructor(message: string, status?: number, reason?: string) {
    super(message);
    this.name = 'SpotifyError';
    this.status = status;
    this.reason = reason;

    if ((Error as any).captureStackTrace) {
      (Error as any).captureStackTrace(this, SpotifyError);
    }
  }
}
