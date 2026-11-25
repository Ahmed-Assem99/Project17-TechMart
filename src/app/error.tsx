"use client"; // Error boundaries must be Client Components
import { useEffect } from "react";

import ErrorState from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";

// Shown instead of a page that threw an error (for example when the API is down).
// In production Next.js hides the real message of server errors, so the text is general.
export default function ErrorPage({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-8 sm:px-4 lg:py-12">
      <ErrorState
        title="We couldn't load this page"
        message="The store is having a problem right now. Please try again in a moment."
      >
        <Button size="lg" className="h-11 rounded-full px-6" onClick={() => retry()}>
          Try again
        </Button>
      </ErrorState>
    </main>
  );
}
