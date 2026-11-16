"use client";
import { useState } from "react";
import { Briefcase, House, LoaderCircle, MapPin, Pencil, Phone, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AddressI } from "@/types/response";

// Picks an icon from the address name: "Home" -> house, "Work" -> briefcase, else a pin.
// Exported so the checkout page shows the same icons
export function AddressIcon({ name, className }: { name: string; className?: string }) {
  const lower = name.toLowerCase();
  if (lower.includes("home")) return <House className={className} />;
  if (lower.includes("work") || lower.includes("office")) return <Briefcase className={className} />;
  return <MapPin className={className} />;
}

type AddressCardProps = {
  address: AddressI;
  onEdit: () => void;
  onDelete: () => Promise<void>;
};

export default function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
  // Deleting takes two clicks: the trash icon, then "Delete" to confirm
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      // If it worked, this card disappears anyway; if not, the buttons come back
      setIsDeleting(false);
      setIsConfirming(false);
    }
  }

  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl bg-card p-5 ring-1 ring-foreground/10 transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-foreground">
          <AddressIcon name={address.name} className="size-4.5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold">{address.name}</h3>
          <p className="text-sm text-muted-foreground">{address.city}</p>
        </div>
        {!isConfirming && (
          <div className="-mt-1 -mr-2 flex shrink-0">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Edit ${address.name}`}
              className="rounded-full text-muted-foreground"
              onClick={onEdit}
            >
              <Pencil />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Delete ${address.name}`}
              className="rounded-full text-muted-foreground hover:text-destructive"
              onClick={() => setIsConfirming(true)}
            >
              <Trash2 />
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5 text-sm">
        <p className="flex items-start gap-2">
          <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <span className="wrap-break-word">{address.details}</span>
        </p>
        <p className="flex items-center gap-2">
          <Phone className="size-4 shrink-0 text-muted-foreground" />
          {address.phone}
        </p>
      </div>

      {isConfirming && (
        <div className="mt-auto flex animate-in flex-wrap items-center justify-between gap-2 rounded-xl bg-destructive/10 px-3 py-2 fade-in">
          <p className="text-sm font-medium text-destructive">Delete this address?</p>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full"
              disabled={isDeleting}
              onClick={() => setIsConfirming(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="rounded-full"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting && <LoaderCircle className="animate-spin" />}
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
