"use client";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "cn";

export default function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [current, setCurrent] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-muted ring-1 ring-foreground/10">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={images[current]}
              alt={`${title} – image ${current + 1}`}
              fill
              priority={current === 0}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image, i) => (
            <button
              key={image}
              type="button"
              aria-label={`Show image ${i + 1}`}
              onClick={() => setCurrent(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/10 transition-all",
                i === current
                  ? "ring-2 ring-primary"
                  : "opacity-70 hover:opacity-100",
              )}
            >
              <Image src={image} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
