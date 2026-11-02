import Link from "next/link";
import {
  ArrowRight,
  Baby,
  BookOpen,
  Headphones,
  Home as HomeIcon,
  Laptop,
  RotateCcw,
  ShieldCheck,
  Shirt,
  ShoppingBasket,
  Smartphone,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const perks = [
  { icon: Truck, title: "Free delivery", text: "On orders over 500 EGP" },
  { icon: ShieldCheck, title: "Secure payment", text: "100% protected checkout" },
  { icon: RotateCcw, title: "Easy returns", text: "14-day return policy" },
  { icon: Headphones, title: "24/7 support", text: "We're here to help" },
];

const categories = [
  { icon: Smartphone, name: "Mobiles" },
  { icon: Laptop, name: "Electronics" },
  { icon: Shirt, name: "Men's Fashion" },
  { icon: Sparkles, name: "Women's Fashion" },
  { icon: HomeIcon, name: "Home" },
  { icon: ShoppingBasket, name: "SuperMarket" },
  { icon: Baby, name: "Baby & Toys" },
  { icon: BookOpen, name: "Books" },
];

const brands = ["Samsung", "Apple", "Sony", "Adidas", "Puma", "DeFacto", "LC Waikiki", "Canon"];

const heroTiles = [
  { icon: Smartphone, label: "Mobiles", className: "col-span-2 row-span-2" },
  { icon: Headphones, label: "Audio", className: "" },
  { icon: Laptop, label: "Laptops", className: "" },
  { icon: Shirt, label: "Fashion", className: "col-span-2" },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 size-80 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-6 py-16 sm:px-4 lg:grid-cols-2 lg:py-24">
          <div className="flex flex-col items-start gap-6">
            <span className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-medium backdrop-blur">
              <span className="size-2 rounded-full bg-primary" />
              New season deals are live
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Everything you love,{" "}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10">one cart away.</span>
                <span className="absolute inset-x-0 bottom-1 -z-0 h-3 bg-primary/70 sm:h-4" />
              </span>
            </h1>
            <p className="max-w-lg text-lg text-muted-foreground">
              Shop the latest electronics, fashion and home essentials from the brands you trust, with fast delivery
              and easy returns.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="h-11 px-5" nativeButton={false} render={<Link href="/products" />}>
                Shop now
                <ArrowRight data-icon="inline-end" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 px-5"
                nativeButton={false}
                render={<Link href="/categories" />}
              >
                Browse categories
              </Button>
            </div>
            <div className="flex items-center gap-3 pt-2 text-sm text-muted-foreground">
              <div className="flex">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              Loved by shoppers across Egypt
            </div>
          </div>

          <div className="grid aspect-square w-full max-w-lg grid-cols-3 grid-rows-3 gap-4 justify-self-center lg:justify-self-end">
            {heroTiles.map(({ icon: Icon, label, className }, i) => (
              <div
                key={label}
                className={`flex flex-col justify-between rounded-3xl p-5 ring-1 ring-foreground/10 ${
                  i === 0 ? "bg-primary text-primary-foreground" : "bg-card"
                } ${className}`}
              >
                <Icon className={i === 0 ? "size-16" : "size-8"} strokeWidth={1.5} />
                <span className={i === 0 ? "text-2xl font-bold" : "text-sm font-medium"}>{label}</span>
              </div>
            ))}
            <div className="col-span-1 flex flex-col justify-center rounded-3xl bg-foreground p-5 text-background">
              <span className="text-3xl font-bold">-50%</span>
              <span className="text-xs opacity-70">Selected items</span>
            </div>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="border-y bg-muted/40">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-6 px-6 py-8 sm:px-4 lg:grid-cols-4">
          {perks.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Icon className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-4">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Shop by category</h2>
            <p className="mt-1 text-muted-foreground">Find exactly what you&apos;re looking for.</p>
          </div>
          <Button variant="ghost" nativeButton={false} render={<Link href="/categories" />}>
            View all
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map(({ icon: Icon, name }) => (
            <Link key={name} href="/categories" className="group">
              <Card className="items-center gap-3 py-6 text-center transition-all group-hover:-translate-y-1 group-hover:shadow-lg">
                <CardContent className="flex flex-col items-center gap-3">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-muted transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-7" strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-medium">{name}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Promo banner */}
      <section className="mx-auto w-full max-w-7xl px-6 sm:px-4">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-12 text-primary-foreground sm:px-12">
          <div className="pointer-events-none absolute -right-16 -bottom-24 size-72 rounded-full bg-primary-foreground/10" />
          <div className="pointer-events-none absolute right-24 -top-20 size-48 rounded-full bg-primary-foreground/10" />
          <div className="relative flex flex-col items-start gap-4 sm:max-w-md">
            <span className="text-sm font-semibold tracking-wider uppercase">Limited time</span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Up to 50% off this week&apos;s top picks</h2>
            <p className="opacity-80">Grab the best deals on gadgets and fashion before they&apos;re gone.</p>
            <Button
              size="lg"
              className="h-11 bg-primary-foreground px-5 text-primary hover:bg-primary-foreground/90"
              nativeButton={false}
              render={<Link href="/products" />}
            >
              Shop the sale
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-4">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Top brands</h2>
            <p className="mt-1 text-muted-foreground">Original products from names you know.</p>
          </div>
          <Button variant="ghost" nativeButton={false} render={<Link href="/brands" />}>
            All brands
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {brands.map((brand) => (
            <Link
              key={brand}
              href="/brands"
              className="flex h-20 items-center justify-center rounded-xl text-lg font-bold tracking-tight text-muted-foreground ring-1 ring-foreground/10 transition-colors hover:bg-muted hover:text-foreground"
            >
              {brand}
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t bg-muted/40">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-4 px-6 py-16 text-center sm:px-4">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Get exclusive deals first</h2>
          <p className="max-w-md text-muted-foreground">
            Subscribe to our newsletter and be the first to hear about new arrivals and special offers.
          </p>
          <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="h-11 flex-1 rounded-lg border bg-background px-4 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            <Button className="h-11 px-5">Subscribe</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
