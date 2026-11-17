import Link from "next/link";
import { PackageSearch } from "lucide-react";

import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { ProductI } from "@/interfaces/product";

// A responsive grid of ProductCards, or a friendly message when there are none.
// Used by the category and brand pages
export default function ProductGrid({
  products,
  emptyTitle = "No products yet",
  emptyText = "Check back soon, new products are added all the time.",
}: {
  products: ProductI[];
  emptyTitle?: string;
  emptyText?: string;
}) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl bg-muted/40 px-6 py-16 text-center ring-1 ring-foreground/10">
        <span className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <PackageSearch className="size-7" />
        </span>
        <h2 className="text-2xl font-bold tracking-tight">{emptyTitle}</h2>
        <p className="max-w-sm text-muted-foreground">{emptyText}</p>
        <Button
          size="lg"
          className="h-11 rounded-full px-6"
          nativeButton={false}
          render={<Link href="/products" />}
        >
          Browse all products
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
