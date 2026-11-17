import Image from "next/image";
import Link from "next/link";
import { cn } from "cn";

import apiServices from "@/services/apiServices";

export default async function Brands() {
  // getBrands and getAllProducts follow every page (the API sends max 50 at a time)
  const [allBrands, products] = await Promise.all([
    apiServices.getBrands(),
    apiServices.getAllProducts(),
  ]);

  // How many products each brand has: { [brandId]: count }
  const productCount: Record<string, number> = {};
  for (const product of products) {
    productCount[product.brand._id] = (productCount[product.brand._id] ?? 0) + 1;
  }

  // Brands with products first; the rest keep the API's order
  const brands = [...allBrands].sort(
    (a, b) => (productCount[b._id] ?? 0) - (productCount[a._id] ?? 0),
  );
  const brandsWithProducts = brands.filter((brand) => productCount[brand._id]).length;

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-4 lg:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Shop by brand</h1>
        <p className="mt-2 text-muted-foreground">
          {brands.length} brands, {brandsWithProducts} with products in stock right now.
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {brands.map((brand, index) => {
          const count = productCount[brand._id] ?? 0;
          return (
            <li key={brand._id}>
              <Link
                href={`/brands/${brand._id}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Logos have white backgrounds, so the box stays white in dark mode too */}
                <div className="relative aspect-[3/2] bg-white">
                  <Image
                    src={brand.image}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 16vw, (min-width: 640px) 33vw, 50vw"
                    // The first row is visible right away, so load it first (better LCP)
                    loading={index < 6 ? "eager" : undefined}
                    className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="border-t border-foreground/10 px-3 py-2.5">
                  <h2 className="truncate text-sm font-semibold">{brand.name}</h2>
                  <p className={cn("text-xs", count ? "text-muted-foreground" : "text-muted-foreground/60")}>
                    {count ? `${count} ${count === 1 ? "product" : "products"}` : "No products yet"}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
