// Shown while the orders load. It also acts as the <Suspense> boundary
// Next.js needs for the uncached fetches in page.tsx, which lets `next build` succeed.
export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-4xl animate-pulse px-6 py-8 sm:px-4 lg:py-12">
      <div className="mb-8 h-9 w-48 rounded bg-muted" />
      <div className="flex flex-col gap-6">
        {[0, 1].map((i) => (
          <div key={i} className="overflow-hidden rounded-3xl ring-1 ring-foreground/10">
            <div className="flex justify-between bg-muted/40 px-6 py-4">
              <div className="h-10 w-36 rounded bg-muted" />
              <div className="h-6 w-40 rounded-full bg-muted" />
            </div>
            <div className="flex flex-col gap-4 px-6 py-4">
              {[0, 1].map((j) => (
                <div key={j} className="flex items-center gap-4">
                  <div className="size-16 rounded-xl bg-muted" />
                  <div className="h-4 flex-1 rounded bg-muted" />
                </div>
              ))}
            </div>
            <div className="h-24 border-t border-foreground/10 bg-muted/20" />
          </div>
        ))}
      </div>
    </main>
  );
}
