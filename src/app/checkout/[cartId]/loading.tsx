// Shown while the checkout page loads. It also acts as the <Suspense> boundary
// Next.js needs for useParams() in page.tsx, which lets `next build` succeed.
export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-2xl animate-pulse px-6 py-8 sm:px-4 lg:py-12">
      <div className="h-4 w-24 rounded bg-muted" />
      <div className="mt-4 h-9 w-48 rounded bg-muted" />
      <div className="mt-3 h-4 w-64 rounded bg-muted" />
      <div className="mt-8 flex flex-col gap-5 rounded-3xl bg-muted/40 p-6 ring-1 ring-foreground/10 sm:p-8">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="h-4 w-28 rounded bg-muted" />
            <div className="h-11 rounded-xl bg-muted" />
          </div>
        ))}
        <div className="mt-2 h-12 rounded-full bg-muted" />
      </div>
    </main>
  );
}
