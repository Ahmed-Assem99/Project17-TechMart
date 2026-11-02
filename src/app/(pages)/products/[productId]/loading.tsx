export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-7xl animate-pulse px-6 py-8 sm:px-4 lg:py-12">
      <div className="mb-8 h-4 w-64 rounded bg-muted" />
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-4">
          <div className="aspect-square rounded-3xl bg-muted" />
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="aspect-square rounded-xl bg-muted" />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="h-6 w-32 rounded-full bg-muted" />
          <div className="h-10 w-3/4 rounded bg-muted" />
          <div className="h-4 w-40 rounded bg-muted" />
          <div className="h-24 rounded-2xl bg-muted" />
          <div className="h-12 rounded-full bg-muted" />
          <div className="h-40 rounded-xl bg-muted" />
        </div>
      </div>
    </main>
  );
}
