"use client";
import { AnimatePresence, motion } from "framer-motion";
import { CircleAlert } from "lucide-react";

// A red message under a field that slides open/closed. Renders nothing without a message.
// Shared by SigninForm and AddressForm
export default function FieldError({
  id,
  message,
}: {
  id: string;
  message?: string;
}) {
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
