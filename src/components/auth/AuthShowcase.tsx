"use client";
import { motion } from "framer-motion";
import {
  Headphones,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

const perks = [
  { icon: ShieldCheck, text: "Secure checkout" },
  { icon: RotateCcw, text: "Easy returns" },
  { icon: Headphones, text: "24/7 support" },
];

// The dark brand panel shown next to the auth forms on large screens
export default function AuthShowcase() {
  return (
    <div className="relative hidden overflow-hidden bg-foreground p-10 text-background lg:flex lg:flex-col xl:p-12">
      {/* Grid pattern that fades out towards the edges */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.07)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_center,black_30%,transparent_75%)] bg-size-[36px_36px]" />

      {/* Slowly drifting lime glows */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-24 size-96 rounded-full bg-primary/35 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-24 -bottom-32 size-80 rounded-full bg-primary/25 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative flex items-center gap-2.5 text-xl font-bold tracking-tight"
      >
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <ShoppingBag className="size-4.5" />
        </span>
        TechMart
      </motion.div>

      <div className="relative my-auto py-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl leading-tight font-bold tracking-tight xl:text-5xl"
        >
          Everything tech,
          <br />
          <span className="text-primary">delivered</span> to your door.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 max-w-sm text-background/65"
        >
          Sign in to track your orders, manage your cart and check out faster.
        </motion.p>

        {/* Floating glass card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
          transition={{
            opacity: { duration: 0.6, delay: 0.35 },
            scale: { duration: 0.6, delay: 0.35 },
            y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 },
          }}
          className="mt-10 flex w-fit items-center gap-4 rounded-2xl bg-white/10 p-4 pr-6 ring-1 ring-white/15 backdrop-blur-md"
        >
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Truck className="size-5" />
          </span>
          <div>
            <p className="font-semibold">Free delivery</p>
            <p className="text-sm text-background/65">On orders over 500 EGP</p>
          </div>
        </motion.div>
      </div>

      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="relative flex flex-wrap gap-2"
      >
        {perks.map(({ icon: Icon, text }) => (
          <li
            key={text}
            className="flex items-center gap-2 rounded-full bg-white/5 px-3.5 py-2 text-sm text-background/80 ring-1 ring-white/10"
          >
            <Icon className="size-4 text-primary" />
            {text}
          </li>
        ))}
      </motion.ul>
    </div>
  );
}
