// Skeleton while brands load (also the <Suspense> boundary for the uncached fetch)
export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-7xl animate-pulse px-6 py-8 sm:px-4 lg:py-12">
      <div className="mb-8">
        <div className="h-9 w-52 rounded bg-muted" />
        <div className="mt-3 h-4 w-72 rounded bg-muted" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {Array.from({ length: 18 }, (_, i) => (
          <div key={i} className="h-40 rounded-2xl bg-muted" />
        ))}
      </div>
    </main>
  );
}
