"use client";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";

import CartItem from "@/components/cart/CartItem";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { CartResponse } from "@/types/response";
import apiServices from "@/services/apiServices";
import { counterContext } from "@/contexts/counterContext";

export default function CartContents({ cart }: { cart: CartResponse }) {

const {setNumOfCartItems}=useContext(counterContext)

useEffect(()=>{
setNumOfCartItems(cart.numOfCartItems)
},[])


  const [items, setItems] = useState(cart.data?.products ?? []);

  const itemsCount = items.reduce((sum, item) => sum + item.count, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.count,
    0,
  );

  function handleCountChange(productId: string, count: number) {
    setItems((current) =>
      current.map((item) =>
        item.product._id === productId ? { ...item, count } : item,
      ),
    );
  }

  function handleRemove(productId: string) {
    setItems((current) =>
      current.filter((item) => item.product._id !== productId),
    );

  }

  async function clearCart() {
    const response = await apiServices.clearProductsFromCart();
    if (response.status === "success") {
      setItems([]);
      setNumOfCartItems(0)
    }
  }

  if (!cart.data) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl bg-muted/40 px-6 py-20 text-center ring-1 ring-foreground/10">
        <h2 className="text-xl font-semibold">
          We couldn&apos;t load your cart
        </h2>
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
        <h2 className="text-2xl font-bold tracking-tight">
          Your cart is empty
        </h2>
        <p className="max-w-sm text-muted-foreground">
          Looks like you haven&apos;t added anything yet. Explore our products
          and find something you love.
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
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {itemsCount} {itemsCount === 1 ? "item" : "items"} in your cart
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={clearCart}
          >
            <Trash2 />
            Clear cart
          </Button>
        </div>

        <ul className="flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onCountChange={handleCountChange}
                onRemove={handleRemove}
              />
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
            <dt className="text-muted-foreground">
              Subtotal ({itemsCount} items)
            </dt>
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

        <motion.div whileTap={{ scale: 0.97 }} className="mt-6 flex justify-center items-center">
          <Link href={"/checkout/"+cart.cartId} className="h-full w-full px-5 py-4 font-bold rounded-full m-auto cursor-pointer text-center bg-[#9AE600]">
            Proceed to checkout
          </Link>
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
