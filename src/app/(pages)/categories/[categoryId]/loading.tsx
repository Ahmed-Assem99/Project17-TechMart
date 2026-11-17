// Skeleton while a category loads (also the <Suspense> boundary for the uncached fetch)
export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-7xl animate-pulse px-6 py-8 sm:px-4 lg:py-12">
      <div className="mb-8 h-4 w-56 rounded bg-muted" />
      <div className="mb-8 flex items-center gap-6 rounded-3xl bg-muted/40 p-6 ring-1 ring-foreground/10">
        <div className="size-24 rounded-2xl bg-muted" />
        <div className="flex flex-col gap-2">
          <div className="h-3 w-20 rounded bg-muted" />
          <div className="h-9 w-56 rounded bg-muted" />
          <div className="h-4 w-40 rounded bg-muted" />
        </div>
      </div>
      <div className="mb-8 flex flex-wrap gap-2">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-9 w-28 rounded-full bg-muted" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="aspect-[3/4] rounded-2xl bg-muted" />
        ))}
      </div>
    </main>
  );
}
