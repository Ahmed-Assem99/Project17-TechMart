import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { cn } from "cn";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 text-2xl/none font-bold tracking-tight",
        className,
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <ShoppingBag className="size-4.5" />
      </span>
      TechMart
    </Link>
  );
}
