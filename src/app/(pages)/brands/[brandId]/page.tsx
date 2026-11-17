import Image from "next/image";
import { notFound } from "next/navigation";

import apiServices from "@/services/apiServices";
import Breadcrumb from "@/components/shared/Breadcrumb";
import ProductGrid from "@/components/product/ProductGrid";

export default async function BrandDetails({
  params,
}: {
  params: Promise<{ brandId: string }>;
}) {
  const { brandId } = await params;

  const [brandResponse, products] = await Promise.all([
    apiServices.getBrand(brandId),
    apiServices.getAllProducts({ brand: brandId }),
  ]);

  // Wrong id -> the API sends no data -> show Next.js's 404 page
  const brand = brandResponse.data;
  if (!brand) notFound();

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-4 lg:py-12">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Brands", href: "/brands" },
          { label: brand.name },
        ]}
      />

      <header className="mb-8 flex items-center gap-5 rounded-3xl bg-muted/40 p-5 ring-1 ring-foreground/10 sm:gap-6 sm:p-6">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-foreground/10 sm:h-24 sm:w-36">
          <Image src={brand.image} alt="" fill sizes="144px" loading="eager" className="object-contain p-2" />
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Brand</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{brand.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>
      </header>

      <ProductGrid products={products} emptyTitle={`No ${brand.name} products yet`} />
    </main>
  );
}
