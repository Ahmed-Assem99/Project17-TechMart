"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ProductActions({ maxQuantity }: { maxQuantity: number }) {
  const [quantity, setQuantity] = useState(1);
  const outOfStock = maxQuantity <= 0;

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="flex h-12 items-center justify-between rounded-full ring-1 ring-foreground/15 sm:w-36">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Decrease quantity"
          className="ml-1 rounded-full"
          disabled={quantity <= 1 || outOfStock}
          onClick={() => setQuantity((q) => q - 1)}
        >
          <Minus />
        </Button>
        <span className="w-8 text-center font-semibold tabular-nums">{quantity}</span>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Increase quantity"
          className="mr-1 rounded-full"
          disabled={quantity >= maxQuantity || outOfStock}
          onClick={() => setQuantity((q) => q + 1)}
        >
          <Plus />
        </Button>
      </div>

      <motion.div whileTap={{ scale: 0.97 }} className="flex-1">
        <Button className="h-12 w-full rounded-full text-base" disabled={outOfStock}>
          <ShoppingCart />
          {outOfStock ? "Out of stock" : "Add to cart"}
        </Button>
      </motion.div>

      <Button
        variant="outline"
        size="icon"
        aria-label="Add to wishlist"
        className="size-12 rounded-full"
      >
        <Heart />
      </Button>
    </div>
  );
}
