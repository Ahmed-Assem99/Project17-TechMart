// Shown while the products are loading. It also acts as the <Suspense> boundary
// Next.js needs for the uncached fetch in page.tsx, which lets `next build` succeed.
export default function Loading() {
  return (
    <div className="container">
      <div className="grid animate-pulse grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="m-3 flex flex-col gap-3 rounded-2xl p-4 ring-1 ring-foreground/10">
            <div className="aspect-square rounded-xl bg-muted" />
            <div className="h-3 w-1/3 rounded bg-muted" />
            <div className="h-4 w-3/4 rounded bg-muted" />
            <div className="h-5 w-1/4 rounded bg-muted" />
            <div className="mt-2 h-10 rounded-full bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
