import Link from "next/link";
import { Headphones, Mail, MapPin, Phone, RotateCcw, ShieldCheck, Truck } from "lucide-react";

import Logo from "@/components/layout/Logo";

const linkGroups = [
  {
    title: "Shop",
    links: [
      { label: "All products", href: "/products" },
      { label: "Categories", href: "/categories" },
      { label: "Brands", href: "/brands" },
      { label: "Cart", href: "/cart" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Track order", href: "#" },
      { label: "Shipping info", href: "#" },
      { label: "Returns", href: "#" },
      { label: "FAQs", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Privacy policy", href: "#" },
      { label: "Terms of service", href: "#" },
    ],
  },
];

const contacts = [
  { icon: MapPin, text: "Cairo, Egypt" },
  { icon: Phone, text: "+20 100 000 0000" },
  { icon: Mail, text: "support@techmart.com" },
];

const badges = [
  { icon: Truck, text: "Fast delivery" },
  { icon: ShieldCheck, text: "Secure checkout" },
  { icon: RotateCcw, text: "Easy returns" },
  { icon: Headphones, text: "24/7 support" },
];

const payments = ["Visa", "Mastercard", "Cash on delivery"];

export default function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/40">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-4">
        <div className="grid grid-cols-2 gap-6 border-b py-8 lg:grid-cols-4">
          {badges.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 text-sm font-medium">
              <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Icon className="size-4" />
              </span>
              {text}
            </div>
          ))}
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Logo />
            <p className="max-w-sm text-sm text-muted-foreground">
              Your one-stop shop for electronics, fashion and home essentials. Quality products from trusted brands,
              delivered to your door.
            </p>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              {contacts.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2">
                  <Icon className="size-4 text-foreground" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          {linkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-4 text-sm font-semibold">{group.title}</h3>
              <ul className="flex flex-col gap-3 text-sm">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t py-6 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 TechMart. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-2">
            {payments.map((payment) => (
              <span key={payment} className="rounded-md bg-background px-2.5 py-1 font-medium ring-1 ring-foreground/10">
                {payment}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
