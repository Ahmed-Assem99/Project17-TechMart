"use client";
import Image from "next/image";
import Link from "next/link";
import { useContext, useRef } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { ProductElement } from "@/types/response";
import apiServices from "@/services/apiServices";
import { counterContext } from "@/contexts/counterContext";

type CartItemProps = {
  item: ProductElement;
  onCountChange: (productId: string, count: number) => void;
  onRemove: (productId: string) => void;
};

export default function CartItem({
  item,
  onCountChange,
  onRemove,
}: CartItemProps) {
  const { product } = item;
const {setNumOfCartItems}=useContext(counterContext)
  // WHAT IS useRef?
  // useRef is a small box that keeps a value between re-renders.
  // You read and write the value through `.current`.
  // Changing `.current` does NOT re-render the component, unlike useState.
  //
  // WHY THE TIMER NEEDS IT:
  // - A normal `let` inside this component is created again on every re-render,
  //   so we would lose the old timer and could never cancel it.
  // - A `let` outside the component is one timer shared by ALL products,
  //   so clicking on product B would cancel product A's update.
  // - useState would work, but it re-renders for nothing: the timer isn't on screen.
  // With useRef, each CartItem on the page gets its own box with its own timer.
  const timeOut = useRef<ReturnType<typeof setTimeout>>(undefined);

  // A second box: the last count the server accepted.
  // If a request fails, we use it to put the correct number back.
  const confirmedCount = useRef(item.count);

  // THE FAST CLICKS FIX, for example clicking + three times starting from 1:
  //
  // Before: the number only changed after the API responded. So item.count stayed 1,
  // and every click sent 1 + 1 = 2. Three clicks only added one.
  //
  // Now: the number changes immediately, and the API call happens later.
  //   Click 1: screen shows 2, timer starts
  //   Click 2: screen shows 3, old timer cancelled, new timer starts
  //   Click 3: screen shows 4, old timer cancelled, new timer starts
  //   500ms with no clicks: one request is sent with count = 4
  function updateCount(newCount: number) {
    // Step 1: update the screen now. CartContents re-renders this component with
    // the new item.count, so the next click starts from the new number.
    onCountChange(product._id, newCount);

    // Step 2: cancel the request that was waiting from the previous click.
    clearTimeout(timeOut.current);

    // Step 3: wait 500ms, then send only the latest count to the server.
    timeOut.current = setTimeout(async () => {
      // .catch turns a network failure into null, so it's handled as a failure below
      const response = await apiServices
        .updateProductCount(product._id, newCount)
        .catch(() => null);

      if (response?.status === "success") {
        // The server accepted it, so remember this as the correct count.
        confirmedCount.current = newCount;
        setNumOfCartItems(response.numOfCartItems)
      } else {
        // The request failed, but the screen already shows the new number.
        // Put back the last count the server accepted so the screen isn't wrong.
        onCountChange(product._id, confirmedCount.current);
      }
    }, 500);
  }

  async function removeItem() {
    clearTimeout(timeOut.current);
    const response = await apiServices.removeProductFromCart(product._id);
    if (response.status === "success") {
      onRemove(product._id);
      setNumOfCartItems(response.numOfCartItems)
    }
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
      className="flex gap-4 rounded-2xl bg-card p-4 ring-1 ring-foreground/10"
    >
      <Link
        href={`/products/${product._id}`}
        className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-muted sm:size-28"
      >
        <Image
          src={product.imageCover}
          alt={product.title}
          fill
          sizes="112px"
          className="object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              {product.category.name}
            </p>
            <Link
              href={`/products/${product._id}`}
              className="line-clamp-1 font-semibold hover:underline"
            >
              {product.title}
            </Link>
            <p className="text-xs text-muted-foreground">
              {product.brand.name}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Remove ${product.title}`}
            className="shrink-0 rounded-full text-muted-foreground hover:text-destructive"
            onClick={removeItem}
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
              onClick={() => updateCount(item.count - 1)}
            >
              <Minus />
            </Button>
            <span className="w-8 text-center text-sm font-semibold tabular-nums">
              {item.count}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Increase quantity"
              className="mr-1 rounded-full"
              disabled={item.count >= product.quantity}
              onClick={() => updateCount(item.count + 1)}
            >
              <Plus />
            </Button>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">
              {formatPrice(item.price * item.count)}
            </p>
            {item.count > 1 && (
              <p className="text-xs text-muted-foreground">
                {formatPrice(item.price)} each
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.li>
  );
}
