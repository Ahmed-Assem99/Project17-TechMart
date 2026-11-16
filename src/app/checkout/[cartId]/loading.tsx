// Shown while the checkout page loads the saved addresses. It also acts as the
// <Suspense> boundary Next.js needs for that uncached fetch, so `next build` succeeds.
export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-2xl animate-pulse px-6 py-8 sm:px-4 lg:py-12">
      <div className="h-4 w-24 rounded bg-muted" />
      <div className="mt-4 h-9 w-48 rounded bg-muted" />
      <div className="mt-3 h-4 w-64 rounded bg-muted" />
      <div className="mt-8 flex flex-col gap-3 rounded-3xl bg-muted/40 p-6 ring-1 ring-foreground/10 sm:p-8">
        <div className="mb-2 h-6 w-40 rounded bg-muted" />
        {[0, 1].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-muted" />
        ))}
        <div className="h-14 rounded-2xl bg-muted/60" />
      </div>
      <div className="mt-6 h-12 rounded-full bg-muted" />
    </main>
  );
}
