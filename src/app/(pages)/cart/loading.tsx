export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-7xl animate-pulse px-6 py-8 sm:px-4 lg:py-12">
      <div className="mb-8 h-9 w-56 rounded bg-muted" />
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-36 rounded-2xl bg-muted" />
          ))}
        </div>
        <div className="h-80 rounded-3xl bg-muted" />
      </div>
    </main>
  );
}
