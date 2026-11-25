"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { LoaderCircle } from "lucide-react";

import ErrorState from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";

type RequestErrorProps = {
  title: string;
  message: string;
  // true when the token is missing or expired: trying again can't help
  needsSignIn: boolean;
};

// Shown by a page whose request failed, with the button that can actually fix it
export default function RequestError({ title, message, needsSignIn }: RequestErrorProps) {
  const router = useRouter();
  const [isRetrying, startTransition] = useTransition();

  return (
    <ErrorState title={title} message={message}>
      {needsSignIn ? (
        // signOut first: a link to /auth/signin would be sent straight back by proxy.ts,
        // because the NextAuth cookie still exists even though the API token expired
        <Button
          size="lg"
          className="h-11 rounded-full px-6"
          onClick={() => signOut({ callbackUrl: "/auth/signin" })}
        >
          Sign in again
        </Button>
      ) : (
        <Button
          size="lg"
          className="h-11 rounded-full px-6"
          disabled={isRetrying}
          // refresh runs the Server Component again, which repeats the request
          onClick={() => startTransition(() => router.refresh())}
        >
          {isRetrying && <LoaderCircle className="animate-spin" />}
          Try again
        </Button>
      )}
    </ErrorState>
  );
}
