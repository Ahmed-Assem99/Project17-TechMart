import Link from "next/link";
import { Package } from "lucide-react";

import apiServices from "@/services/apiServices";
import OrderCard from "@/components/orders/OrderCard";
import RequestError from "@/components/shared/RequestError";
import { Button } from "@/components/ui/button";
import { toResult } from "@/lib/apiError";

// Two requests, one after the other: the second one needs the id from the first
async function getMyOrders() {
  // Step 1: ask the API who owns the token -> gives us the user id
  const verified = await apiServices.verifyToken();
  // Step 2: use the user id to get their orders
  return apiServices.getUserOrders(verified.decoded.id);
}

export default async function Orders() {
  const result = await toResult(getMyOrders());

  if (!result.ok) {
    return (
      <main className="mx-auto w-full max-w-4xl px-6 py-8 sm:px-4 lg:py-12">
        <RequestError
          title="We couldn't load your orders"
          message={result.error.message}
          needsSignIn={result.error.isUnauthorized}
        />
      </main>
    );
  }

  const orders = result.data;

  // The API returns oldest first; show the newest order at the top.
  // [...orders] copies the array so we don't change the original
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-8 sm:px-4 lg:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          My orders
        </h1>
        {sortedOrders.length > 0 && (
          <p className="mt-2 text-muted-foreground">
            {sortedOrders.length}{" "}
            {sortedOrders.length === 1 ? "order" : "orders"} placed
          </p>
        )}
      </div>

      {sortedOrders.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-muted/40 px-6 py-20 text-center ring-1 ring-foreground/10">
          <span className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Package className="size-7" />
          </span>
          <h2 className="text-2xl font-bold tracking-tight">No orders yet</h2>
          <p className="max-w-sm text-muted-foreground">
            When you place an order, it will show up here so you can track it.
          </p>
          <Button
            size="lg"
            className="h-11 rounded-full px-6"
            nativeButton={false}
            render={<Link href="/products" />}
          >
            Start shopping
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {sortedOrders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </main>
  );
}
