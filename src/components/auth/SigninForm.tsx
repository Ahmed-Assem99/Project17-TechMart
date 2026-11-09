"use client";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  CircleAlert,
  Eye,
  EyeOff,
  LoaderCircle,
  Lock,
  Mail,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";


// The rules for each field. zodResolver runs them and fills formState.errors
const signinSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// TypeScript type built from the schema: { email: string; password: string }
export type SigninValues = z.infer<typeof signinSchema>;

// Each field slides in a little after the previous one
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const labelClassName = "text-sm font-medium";
const iconClassName =
  "pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground";
const inputClassName =
  "h-12 rounded-2xl bg-muted/50 pl-11 shadow-xs transition-all hover:bg-muted/70 focus-visible:border-primary focus-visible:bg-background focus-visible:ring-primary/25 dark:bg-input/30";

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          id={id}
          role="alert"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-1.5 overflow-hidden text-xs font-medium text-destructive"
        >
          <CircleAlert className="size-3.5 shrink-0" />
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export default function SigninForm() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SigninValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: { email: "ahmeddd3333@gmail.com", password: "Ahmed@123" },
    mode: "onTouched",
  });
  const router = useRouter()

  // Only runs when every field passes the schema
  async function onSubmit(values: SigninValues) {
    const response = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
if(response?.ok){
router.push("/products")
}else{
  console.log(response)
  setError("root",{
    message:"Invalid email or password"
  })
}
  }

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-5"
    >
      <motion.div variants={item} className="flex flex-col gap-2">
        <label htmlFor="email" className={labelClassName}>
          Email
        </label>
        <div className="group relative">
          <Mail className={iconClassName} />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={inputClassName}
            {...register("email")}
          />
        </div>
        <FieldError id="email-error" message={errors.email?.message} />
      </motion.div>

      <motion.div variants={item} className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className={labelClassName}>
            Password
          </label>
          <Link
            href="#"
            className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <div className="group relative">
          <Lock className={iconClassName} />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            className={`${inputClassName} pr-12`}
            {...register("password")}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full text-muted-foreground"
            onClick={() => setShowPassword((show) => !show)}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={showPassword ? "hide" : "show"}
                initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                transition={{ duration: 0.15 }}
                className="flex"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </motion.span>
            </AnimatePresence>
          </Button>
        </div>
        <FieldError id="password-error" message={errors.password?.message} />
      </motion.div>

      {/* Errors set with setError("root", ...) are stored in errors.root, so they need their own spot */}
      <FieldError id="form-error" message={errors.root?.message} />

      <motion.div variants={item} whileTap={{ scale: 0.98 }} className="mt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="group h-12 w-full rounded-full text-base font-semibold shadow-lg shadow-primary/30 transition-shadow hover:shadow-xl hover:shadow-primary/40"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>
      </motion.div>
    </motion.form>
  );
}
