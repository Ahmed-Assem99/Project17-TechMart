import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import apiServices from "@/services/apiServices";

export default async function Categories() {
  // Both requests start together instead of one after the other
  const [categoriesResponse, products] = await Promise.all([
    apiServices.getCategories(),
    apiServices.getAllProducts(),
  ]);

  // How many products each category has: { [categoryId]: count }
  const productCount: Record<string, number> = {};
  for (const product of products) {
    productCount[product.category._id] = (productCount[product.category._id] ?? 0) + 1;
  }

  // Categories that have products come first. [...] copies so we don't sort the original
  const categories = [...(categoriesResponse.data ?? [])].sort(
    (a, b) => (productCount[b._id] ?? 0) - (productCount[a._id] ?? 0),
  );

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-4 lg:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Shop by category</h1>
        <p className="mt-2 text-muted-foreground">
          {categories.length} categories to explore, from electronics to fashion.
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {categories.map((category, index) => {
          const count = productCount[category._id] ?? 0;
          return (
            <li key={category._id}>
              <Link
                href={`/categories/${category._id}`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl bg-card ring-1 ring-foreground/10 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <Image
                    src={category.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    // The first row is visible right away, so load it first (better LCP)
                    loading={index < 4 ? "eager" : undefined}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                {/* Name below the photo: some photos have their own text printed on them */}
                <div className="flex items-center justify-between gap-2 p-4">
                  <div className="min-w-0">
                    <h2 className="truncate font-semibold sm:text-lg">{category.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {count > 0 ? `${count} ${count === 1 ? "product" : "products"}` : "Coming soon"}
                    </p>
                  </div>
                  <span className="hidden size-9 shrink-0 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-primary group-hover:text-primary-foreground sm:flex">
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
