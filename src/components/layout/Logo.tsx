import Image from "next/image";
import Link from "next/link";
import { cn } from "cn";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2 text-2xl/none font-bold tracking-tight",
        className,
      )}
    >
      <Image src="/favicon.ico" alt="" width={28} height={28} unoptimized />
      TechMart
    </Link>
  );
}
