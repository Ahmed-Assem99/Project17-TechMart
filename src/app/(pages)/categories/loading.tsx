// Skeleton while categories load (also the <Suspense> boundary for the uncached fetch)
export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-7xl animate-pulse px-6 py-8 sm:px-4 lg:py-12">
      <div className="mb-8">
        <div className="h-9 w-64 rounded bg-muted" />
        <div className="mt-3 h-4 w-80 rounded bg-muted" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="overflow-hidden rounded-3xl ring-1 ring-foreground/10">
            <div className="aspect-square bg-muted" />
            <div className="flex flex-col gap-2 p-4">
              <div className="h-5 w-2/3 rounded bg-muted" />
              <div className="h-4 w-1/3 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
