import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "cn";

import apiServices from "@/services/apiServices";
import Breadcrumb from "@/components/shared/Breadcrumb";
import ProductGrid from "@/components/product/ProductGrid";

type CategoryDetailsProps = {
  params: Promise<{ categoryId: string }>;
  // ?sub=<subcategoryId> in the URL picks a subcategory filter
  searchParams: Promise<{ sub?: string }>;
};

const chipClassName =
  "inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium ring-1 ring-foreground/15 transition-colors hover:bg-muted";
const activeChipClassName = "bg-primary text-primary-foreground ring-primary hover:bg-primary/90";

export default async function CategoryDetails({ params, searchParams }: CategoryDetailsProps) {
  const { categoryId } = await params;
  const { sub } = await searchParams;

  const [categoryResponse, subcategoriesResponse, products] = await Promise.all([
    apiServices.getCategory(categoryId),
    apiServices.getSubcategories(categoryId),
    apiServices.getAllProducts({ category: categoryId }),
  ]);

  // Wrong id -> the API sends no data -> show Next.js's 404 page
  const category = categoryResponse.data;
  if (!category) notFound();

  const subcategories = subcategoriesResponse.data ?? [];
  // A product can belong to several subcategories
  const inSubcategory = (subcategoryId: string) =>
    products.filter((product) => product.subcategory.some((s) => s._id === subcategoryId));

  const activeSubcategory = subcategories.find((s) => s._id === sub);
  const shownProducts = activeSubcategory ? inSubcategory(activeSubcategory._id) : products;

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-4 lg:py-12">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/categories" },
          { label: category.name },
        ]}
      />

      <header className="mb-8 flex items-center gap-5 rounded-3xl bg-muted/40 p-5 ring-1 ring-foreground/10 sm:gap-6 sm:p-6">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-muted sm:size-24">
          <Image src={category.image} alt="" fill sizes="96px" loading="eager" className="object-cover" />
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Category</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{category.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? "product" : "products"} ·{" "}
            {subcategories.length} {subcategories.length === 1 ? "subcategory" : "subcategories"}
          </p>
        </div>
      </header>

      {subcategories.length > 0 && (
        <nav aria-label="Subcategories" className="mb-8 flex flex-wrap gap-2">
          {/* scroll={false}: keep the scroll position when switching filters */}
          <Link
            href={`/categories/${categoryId}`}
            scroll={false}
            className={cn(chipClassName, !activeSubcategory && activeChipClassName)}
          >
            All
            <span className="text-xs opacity-70">{products.length}</span>
          </Link>
          {subcategories.map((subcategory) => (
            <Link
              key={subcategory._id}
              href={`/categories/${categoryId}?sub=${subcategory._id}`}
              scroll={false}
              className={cn(chipClassName, activeSubcategory?._id === subcategory._id && activeChipClassName)}
            >
              {subcategory.name}
              <span className="text-xs opacity-70">{inSubcategory(subcategory._id).length}</span>
            </Link>
          ))}
        </nav>
      )}

      <ProductGrid
        products={shownProducts}
        emptyTitle={`No ${activeSubcategory?.name ?? category.name} products yet`}
      />
    </main>
  );
}
