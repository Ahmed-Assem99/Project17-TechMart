// Every failed API call throws this, so the UI always knows what went wrong:
// - status: the HTTP status, or 0 when the server couldn't be reached
// - message: text that is safe to show to the user
export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }

  // Not signed in, or the token is expired/invalid
  get isUnauthorized() {
    return this.status === 401;
  }
}

// The text to show for any caught error
export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  return error instanceof ApiError ? error.message : fallback;
}

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: ApiError };

// For Server Components: gives back the error instead of throwing it, so a page can
// show a message. Anything that isn't an ApiError (a bug, or the errors Next.js uses
// internally) is thrown again.
export async function toResult<T>(request: Promise<T>): Promise<ApiResult<T>> {
  try {
    return { ok: true, data: await request };
  } catch (error) {
    if (error instanceof ApiError) return { ok: false, error };
    throw error;
  }
}
