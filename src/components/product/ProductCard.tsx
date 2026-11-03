"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, LoaderCircle, ShoppingCart, Star } from "lucide-react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { ProductI } from "@/interfaces/product";
import { formatDate, formatPrice } from "@/lib/utils";
import apiServices from "@/services/apiServices";
import {toast} from "@/components/ui/toast"

const MotionCard = motion.create(Card);

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? "100%" : "-100%" }),
  center: { x: 0 },
  exit: (direction: number) => ({ x: direction > 0 ? "-100%" : "100%" }),
};

export default function ProductCard({ product }: { product: ProductI }) {
  const images = product.images.length ? product.images : [product.imageCover];
  const [[current, direction], setSlide] = useState([0, 0]);

  function paginate(step: number) {
    setSlide([(current + step + images.length) % images.length, step]);
  }

  function goTo(index: number) {
    setSlide([index, index > current ? 1 : -1]);
  }

  const [isAdding, setIsAdding] = useState(false);

  async function addProductToCart(){
    setIsAdding(true)
    try {
      const response = await apiServices.addProductToCart(product._id)
      toast.add({
        title:response.status ?? response.statusMsg,
        description:response.message
      })
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group h-full pt-0 transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link href={`/products/${product._id}`} className="absolute inset-0">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={images[current]}
                alt={`${product.title} – image ${current + 1}`}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </motion.div>
          </AnimatePresence>
        </Link>

        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Previous image"
              onClick={() => paginate(-1)}
              className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-background/80 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Next image"
              onClick={() => paginate(1)}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-background/80 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            >
              <ChevronRight />
            </Button>
            <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
              {images.map((image, i) => (
                <button
                  key={image}
                  type="button"
                  aria-label={`Show image ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={cn(
                    "h-1.5 rounded-full bg-background/70 transition-all",
                    i === current ? "w-5 bg-primary" : "w-1.5",
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col gap-2">
        <CardDescription className="text-xs uppercase tracking-wide">
          {product.category.name}
        </CardDescription>
        <CardTitle className="line-clamp-1">
          <Link href={`/products/${product._id}`} className="hover:underline">
            {product.title}
          </Link>
        </CardTitle>
        <p className="flex items-center justify-between text-xs text-muted-foreground">
          {product.brand.name}
          <span>Added {formatDate(product.createdAt)}</span>
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold">
            {formatPrice(product.price)}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="size-4 fill-yellow-400 text-yellow-400" />
            {product.ratingsAverage}
            <span>({product.ratingsQuantity})</span>
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <motion.div whileTap={{ scale: 0.95 }} className="w-full">
          <Button onClick={addProductToCart} disabled={isAdding} className="w-full">
            {isAdding ? <LoaderCircle className="animate-spin" /> : <ShoppingCart />}
            {isAdding ? "Adding..." : "Add to cart"}
          </Button>
        </motion.div>
      </CardFooter>
    </MotionCard>
  );
}
