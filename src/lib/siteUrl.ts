// The address customers come back to after paying on Stripe, without a "/" at the end.
// NEXT_PUBLIC_SITE_URL decides it. If it isn't set, we use the address the customer is
// on right now, which is correct locally and on any Vercel URL.
export function getSiteUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) return siteUrl.replace(/\/+$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  throw new Error("NEXT_PUBLIC_SITE_URL is not set");
}
