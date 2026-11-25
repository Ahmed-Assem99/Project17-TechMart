import { ReactNode } from "react";
import { CircleAlert } from "lucide-react";

// The look of every "something went wrong" screen. `children` are the buttons
export default function ErrorState({
  title,
  message,
  children,
}: {
  title: string;
  message: string;
  children?: ReactNode;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-4 rounded-3xl bg-muted/40 px-6 py-20 text-center ring-1 ring-foreground/10"
    >
      <span className="flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <CircleAlert className="size-7" />
      </span>
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <p className="max-w-sm text-muted-foreground">{message}</p>
      {children}
    </div>
  );
}
