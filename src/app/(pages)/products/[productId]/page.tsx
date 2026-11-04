import Link from "next/link"
import { ChevronRight, RotateCcw, ShieldCheck, Star, Truck } from "lucide-react"

import apiServices from "@/services/apiServices"
import ProductGallery from "@/components/product/ProductGallery"
import ProductActions from "@/components/product/ProductActions"
import { formatPrice } from "@/lib/utils"
import { cn } from "cn"

interface ProductDetailsProps{
  params: Promise<{productId:string}>;
}

const perks = [
  { icon: Truck, title: "Free delivery", text: "On orders over 500 EGP" },
  { icon: RotateCcw, title: "Easy returns", text: "Within 14 days" },
  { icon: ShieldCheck, title: "Secure checkout", text: "100% protected" },
]

// Descriptions come as "Key\tValue" lines; split them into spec rows and plain text
function parseDescription(description: string) {
  const specs: { label: string; value: string }[] = []
  const text: string[] = []
  for (const line of description.split("\n")) {
    const [label, ...rest] = line.split("\t")
    if (rest.length) specs.push({ label: label.trim(), value: rest.join(" ").trim() })
    else if (line.trim()) text.push(line.trim())
  }
  return { specs, text }
}

export default async function ProductDetails({params}:ProductDetailsProps) {
  const { productId } = await params
  const { data: product } = await apiServices.getProductDetails(productId)

  const images = product.images.length ? product.images : [product.imageCover]
  const { specs, text } = parseDescription(product.description)
  const lowStock = product.quantity > 0 && product.quantity <= 10

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-4 lg:py-12">
      <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="size-4" />
        <Link href="/products" className="hover:text-foreground">Products</Link>
        <ChevronRight className="size-4" />
        <Link href="/categories" className="hover:text-foreground">{product.category.name}</Link>
        <ChevronRight className="size-4" />
        <span className="line-clamp-1 font-medium text-foreground">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={images} title={product.title} />

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                {product.category.name}
              </span>
              {product.subcategory.map((sub) => (
                <span key={sub._id} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                  {sub.name}
                </span>
              ))}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">{product.title}</h1>
            <p className="text-sm text-muted-foreground">
              by <Link href="/brands" className="font-medium text-foreground hover:underline">{product.brand.name}</Link>
            </p>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "size-4",
                      star <= Math.round(product.ratingsAverage)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-muted text-muted",
                    )}
                  />
                ))}
              </div>
              <span className="font-semibold">{product.ratingsAverage}</span>
              <span className="text-muted-foreground">({product.ratingsQuantity} reviews)</span>
              <span className="h-4 w-px bg-border" />
              <span className="text-muted-foreground">{product.sold.toLocaleString("en-US")} sold</span>
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4 rounded-2xl bg-muted/50 p-5 ring-1 ring-foreground/5">
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="text-3xl font-bold tracking-tight">{formatPrice(product.price)}</p>
            </div>
            <span
              className={cn(
                "flex items-center gap-2 text-sm font-medium",
                product.quantity === 0 ? "text-destructive" : lowStock ? "text-amber-600" : "text-[#64843f]",
              )}
            >
              <span className="size-2 rounded-full bg-current" />
              {product.quantity === 0
                ? "Out of stock"
                : lowStock
                  ? `Only ${product.quantity} left`
                  : `In stock (${product.quantity} available)`}
            </span>
          </div>

          <ProductActions maxQuantity={product.quantity} product={product}/>

          <div className="grid gap-3 sm:grid-cols-3">
            {perks.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-center gap-3 rounded-xl p-3 ring-1 ring-foreground/10">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Icon className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-xs text-muted-foreground">{text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 border-t pt-6">
            <h2 className="text-lg font-semibold">Product details</h2>
            {text.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-relaxed text-muted-foreground">{paragraph}</p>
            ))}
            {specs.length > 0 && (
              <dl className="divide-y overflow-hidden rounded-xl ring-1 ring-foreground/10">
                {specs.map(({ label, value }) => (
                  <div key={label} className="grid grid-cols-3 gap-4 px-4 py-3 text-sm odd:bg-muted/40">
                    <dt className="font-medium">{label}</dt>
                    <dd className="col-span-2 text-muted-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
