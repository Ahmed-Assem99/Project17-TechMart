import Image from "next/image";
import Link from "next/link";
import {
  Banknote,
  CalendarDays,
  CircleAlert,
  CircleCheck,
  CreditCard,
  MapPin,
  PackageCheck,
  Phone,
  Truck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { OrderI } from "@/types/response";

// No "use client": this card has no state or clicks, so it renders on the server
export default function OrderCard({ order }: { order: OrderI }) {
  const date = new Date(order.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // How many pieces in total (2 phones + 1 cable = 3 items)
  const itemsCount = order.cartItems.reduce((sum, item) => sum + item.count, 0);
  const subtotal = order.cartItems.reduce(
    (sum, item) => sum + item.price * item.count,
    0,
  );
  const isCard = order.paymentMethodType === "card";

  return (
    <article className="overflow-hidden rounded-3xl bg-card ring-1 ring-foreground/10">
      {/* Header: order number, date, and status */}
      <header className="flex flex-wrap items-center justify-between gap-3 bg-muted/40 px-5 py-4 sm:px-6">
        <div>
          <h2 className="font-semibold">Order #{order.id}</h2>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" />
            {date} · {itemsCount} {itemsCount === 1 ? "item" : "items"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {order.isPaid ? (
            <Badge className="h-6 px-2.5">
              <CircleCheck />
              Paid
            </Badge>
          ) : (
            <Badge variant="destructive" className="h-6 px-2.5">
              <CircleAlert />
              Not paid
            </Badge>
          )}
          {order.isDelivered ? (
            <Badge variant="secondary" className="h-6 px-2.5">
              <PackageCheck />
              Delivered
            </Badge>
          ) : (
            <Badge variant="outline" className="h-6 px-2.5">
              <Truck />
              On the way
            </Badge>
          )}
        </div>
      </header>

      {/* Products in this order */}
      <ul className="divide-y divide-foreground/10 px-5 sm:px-6">
        {order.cartItems.map((item) => (
          <li key={item._id} className="flex items-center gap-4 py-4">
            <Link
              href={`/products/${item.product._id}`}
              className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted"
            >
              <Image
                src={item.product.imageCover}
                alt={item.product.title}
                fill
                sizes="64px"
                className="object-cover"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                href={`/products/${item.product._id}`}
                className="line-clamp-1 text-sm font-medium hover:underline"
              >
                {item.product.title}
              </Link>
              <p className="text-xs text-muted-foreground">
                {item.product.brand?.name} · Qty {item.count} ×{" "}
                {formatPrice(item.price)}
              </p>
            </div>
            <p className="shrink-0 text-sm font-semibold">
              {formatPrice(item.price * item.count)}
            </p>
          </li>
        ))}
      </ul>

      {/* Footer: where it's going, how it was paid, and the totals */}
      <footer className="grid gap-5 border-t border-foreground/10 px-5 py-5 sm:grid-cols-[1fr_260px] sm:px-6">
        <div className="flex flex-col gap-2 text-sm">
          {order.shippingAddress ? (
            <>
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span>
                  {order.shippingAddress.details}, {order.shippingAddress.city}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-muted-foreground" />
                {order.shippingAddress.phone}
              </p>
            </>
          ) : (
            <p className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-4 shrink-0" />
              No shipping address
            </p>
          )}
          <p className="flex items-center gap-2">
            {isCard ? (
              <CreditCard className="size-4 shrink-0 text-muted-foreground" />
            ) : (
              <Banknote className="size-4 shrink-0 text-muted-foreground" />
            )}
            {isCard ? "Paid by card" : "Cash on delivery"}
          </p>
        </div>

        <dl className="flex flex-col gap-1.5 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <dt>Subtotal</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <dt>Shipping</dt>
            <dd>
              {order.shippingPrice ? formatPrice(order.shippingPrice) : "Free"}
            </dd>
          </div>
          {order.taxPrice > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <dt>Tax</dt>
              <dd>{formatPrice(order.taxPrice)}</dd>
            </div>
          )}
          <div className="mt-1 flex justify-between border-t border-foreground/10 pt-2.5 text-base font-bold">
            <dt>Total</dt>
            <dd>{formatPrice(order.totalOrderPrice)}</dd>
          </div>
        </dl>
      </footer>
    </article>
  );
}
