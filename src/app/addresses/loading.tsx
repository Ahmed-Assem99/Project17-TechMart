// Shown while the addresses load. It also acts as the <Suspense> boundary
// Next.js needs for the uncached fetch in page.tsx, which lets `next build` succeed.
export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-4xl animate-pulse px-6 py-8 sm:px-4 lg:py-12">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <div className="h-9 w-56 rounded bg-muted" />
          <div className="mt-3 h-4 w-72 rounded bg-muted" />
        </div>
        <div className="h-11 w-36 rounded-full bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="h-44 rounded-2xl bg-muted/60" />
        ))}
      </div>
    </main>
  );
}
