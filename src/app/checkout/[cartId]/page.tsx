import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import apiServices from "@/services/apiServices";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import RequestError from "@/components/shared/RequestError";
import { toResult } from "@/lib/apiError";

// A server component now: it loads the saved addresses before the page is sent,
// and CheckoutForm (a client component) handles picking one and clicking.
export default async function Checkout({
  params,
}: {
  params: Promise<{ cartId: string }>;
}) {
  const { cartId } = await params;
  const result = await toResult(apiServices.getAddresses());

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-8 sm:px-4 lg:py-12">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to cart
      </Link>

      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
        Checkout
      </h1>
      <p className="mt-2 text-muted-foreground">
        Where should we deliver your order?
      </p>

      {result.ok ? (
        <CheckoutForm cartId={cartId} initialAddresses={result.data.data} />
      ) : (
        <div className="mt-8">
          <RequestError
            title="We couldn't load your addresses"
            message={result.error.message}
            needsSignIn={result.error.isUnauthorized}
          />
        </div>
      )}
    </main>
  );
}
