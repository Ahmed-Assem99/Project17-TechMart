import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import AuthShowcase from "@/components/auth/AuthShowcase";
import SigninForm from "@/components/auth/SigninForm";

export default function Signin() {
  return (
    <main className="relative flex w-full flex-1 items-center justify-center overflow-hidden px-4 py-10 sm:px-6 lg:py-16">
      {/* Soft lime glows behind the card */}
      <div className="pointer-events-none absolute top-0 left-1/2 -z-10 size-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 -z-10 size-80 translate-x-1/3 translate-y-1/3 rounded-full bg-primary/15 blur-3xl" />

      <div className="grid w-full max-w-6xl animate-in overflow-hidden rounded-[2rem] bg-background shadow-2xl ring-1 shadow-primary/10 ring-foreground/10 duration-500 fade-in slide-in-from-bottom-4 lg:min-h-160 lg:grid-cols-[1.05fr_1fr]">
        <AuthShowcase />

        <div className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-14">
          <div className="mx-auto w-full max-w-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary-foreground ring-1 ring-primary/30">
              <span className="size-1.5 animate-pulse rounded-full bg-primary" />
              Welcome back
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Sign in to your account
            </h1>
            <p className="mt-2 text-muted-foreground">
              Enter your details to continue shopping.
            </p>

            <div className="mt-8">
              <SigninForm />
            </div>

            <div className="my-8 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              New to TechMart?
              <span className="h-px flex-1 bg-border" />
            </div>

            <Link
              href="/auth/signup"
              className="group flex h-12 items-center justify-center gap-1.5 rounded-full text-sm font-semibold ring-1 ring-foreground/15 transition-colors hover:bg-muted"
            >
              Create an account
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
