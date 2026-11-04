"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { CartResponse } from "@/types/response";
import apiServices from "@/services/apiServices";

export default function CartContents({ cart }: { cart: CartResponse }) {
  const [items, setItems] = useState(cart.data?.products ?? []);

  const itemsCount = items.reduce((sum, item) => sum + item.count, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.count, 0);

  function updateCount(itemId: string, count: number) {
    setItems((current) =>
      current.map((item) => (item._id === itemId ? { ...item, count } : item)),
    );
  }

  async function removeItem(productId: string) {
    const response = await apiServices.removeProductFromCart(productId)
    if (response.status === "success") {
      setItems((current) => current.filter((item) => item.product._id !== productId));
    }
  }

  async function clearCart() {
    const response = await apiServices.clearProductsFromCart()
        if (response.status === "success") {
    setItems([]);
        }
  }

  if (!cart.data) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl bg-muted/40 px-6 py-20 text-center ring-1 ring-foreground/10">
        <h2 className="text-xl font-semibold">We couldn&apos;t load your cart</h2>
        <p className="max-w-sm text-sm text-muted-foreground">{cart.message}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl bg-muted/40 px-6 py-20 text-center ring-1 ring-foreground/10">
        <span className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <ShoppingBag className="size-7" />
        </span>
        <h2 className="text-2xl font-bold tracking-tight">Your cart is empty</h2>
        <p className="max-w-sm text-muted-foreground">
          Looks like you haven&apos;t added anything yet. Explore our products and find something you love.
        </p>
        <Button size="lg" className="h-11 rounded-full px-6" nativeButton={false} render={<Link href="/products" />}>
          Start shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {itemsCount} {itemsCount === 1 ? "item" : "items"} in your cart
          </p>
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={clearCart}>
            <Trash2 />
            Clear cart
          </Button>
        </div>

        <ul className="flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.li
                key={item._id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
                className="flex gap-4 rounded-2xl bg-card p-4 ring-1 ring-foreground/10"
              >
                <Link
                  href={`/products/${item.product._id}`}
                  className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-muted sm:size-28"
                >
                  <Image
                    src={item.product.imageCover}
                    alt={item.product.title}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs tracking-wide text-muted-foreground uppercase">
                        {item.product.category.name}
                      </p>
                      <Link
                        href={`/products/${item.product._id}`}
                        className="line-clamp-1 font-semibold hover:underline"
                      >
                        {item.product.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">{item.product.brand.name}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Remove ${item.product.title}`}
                      className="shrink-0 rounded-full text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.product._id)}
                    >
                      <Trash2 />
                    </Button>
                  </div>

                  <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-2">
                    <div className="flex h-9 items-center rounded-full ring-1 ring-foreground/15">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Decrease quantity"
                        className="ml-1 rounded-full"
                        disabled={item.count <= 1}
                        onClick={() => updateCount(item._id, item.count - 1)}
                      >
                        <Minus />
                      </Button>
                      <span className="w-8 text-center text-sm font-semibold tabular-nums">{item.count}</span>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Increase quantity"
                        className="mr-1 rounded-full"
                        disabled={item.count >= item.product.quantity}
                        onClick={() => updateCount(item._id, item.count + 1)}
                      >
                        <Plus />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{formatPrice(item.price * item.count)}</p>
                      {item.count > 1 && (
                        <p className="text-xs text-muted-foreground">{formatPrice(item.price)} each</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <Link
          href="/products"
          className="inline-flex items-center gap-2 self-start text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Continue shopping
        </Link>
      </section>

      <aside className="h-fit rounded-3xl bg-muted/40 p-6 ring-1 ring-foreground/10 lg:sticky lg:top-32">
        <h2 className="text-lg font-semibold">Order summary</h2>
        <dl className="mt-6 flex flex-col gap-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal ({itemsCount} items)</dt>
            <dd className="font-medium">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Shipping</dt>
            <dd className="font-medium">Calculated at checkout</dd>
          </div>
          <div className="mt-3 flex justify-between border-t pt-4 text-base">
            <dt className="font-semibold">Total</dt>
            <dd className="text-xl font-bold">{formatPrice(subtotal)}</dd>
          </div>
        </dl>

        <motion.div whileTap={{ scale: 0.97 }} className="mt-6">
          <Button className="h-12 w-full rounded-full text-base">Proceed to checkout</Button>
        </motion.div>

        <ul className="mt-6 flex flex-col gap-3 text-xs text-muted-foreground">
          <li className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-foreground" />
            Secure checkout, 100% protected
          </li>
          <li className="flex items-center gap-2">
            <Truck className="size-4 text-foreground" />
            Free delivery on orders over 500 EGP
          </li>
        </ul>
      </aside>
    </div>
  );
}
