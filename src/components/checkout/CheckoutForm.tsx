"use client";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CircleAlert, LoaderCircle, Phone, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import AddressForm from "@/components/addresses/AddressForm";
import { AddressIcon } from "@/components/addresses/AddressCard";
import apiServices from "@/services/apiServices";
import { AddressI, AddressInput } from "@/types/response";
import { cn } from "cn";

type CheckoutFormProps = {
  cartId: string;
  initialAddresses: AddressI[];
};

export default function CheckoutForm({ cartId, initialAddresses }: CheckoutFormProps) {
  const [addresses, setAddresses] = useState(initialAddresses);
  // The first saved address is picked by default
  const [selectedId, setSelectedId] = useState(initialAddresses[0]?._id ?? "");
  // No saved addresses yet -> show the "new address" form straight away
  const [isAddingNew, setIsAddingNew] = useState(initialAddresses.length === 0);
  const [isPlacing, setIsPlacing] = useState(false);
  const [error, setError] = useState("");

  // A new address typed at checkout is also saved to the address book
  async function handleAddNew(values: AddressInput): Promise<string | void> {
    const response = await apiServices.addAddress(values);
    if (response.status !== "success") return response.message ?? "Couldn't save the address";
    setAddresses(response.data);
    setSelectedId(response.data[response.data.length - 1]._id); // the API puts the new one last
    setIsAddingNew(false);
  }

  async function handleContinueToPayment() {
    if (!selectedId) return;
    setIsPlacing(true);
    setError("");
    try {
      // 1. We only keep the selected address's id; get its data from the API using that id
      const addressResponse = await apiServices.getAddress(selectedId);
      if (addressResponse.status !== "success") {
        throw new Error(addressResponse.message ?? "Couldn't load the selected address");
      }
      const { details, phone, city } = addressResponse.data;

      // 2. Send that address to the checkout API
      const response = await apiServices.Checkout(cartId, {
        shippingAddress: { details, phone, city },
      });
      if (response.status !== "success") throw new Error(response.message);
      // Go to Stripe's payment page (a full page change, so no router.push)
      window.location.href = response.session.url;
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Couldn't start the payment. Please try again.");
      setIsPlacing(false);
    }
  }

  return (
    <div className="mt-8 flex flex-col gap-6">
      <section className="rounded-3xl bg-muted/40 p-6 ring-1 ring-foreground/10 sm:p-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Shipping address</h2>
          {addresses.length > 0 && (
            <Link
              href="/addresses"
              className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Manage addresses
            </Link>
          )}
        </div>

        {/* Saved addresses as radio buttons: only one can be picked */}
        {addresses.length > 0 && (
          <fieldset className="flex flex-col gap-3">
            <legend className="sr-only">Choose a delivery address</legend>
            {addresses.map((address) => {
              const isSelected = address._id === selectedId && !isAddingNew;
              return (
                <label
                  key={address._id}
                  className={cn(
                    "flex cursor-pointer items-start gap-4 rounded-2xl bg-card p-4 ring-1 ring-foreground/10 transition-all hover:ring-foreground/25 has-focus-visible:ring-2 has-focus-visible:ring-ring",
                    isSelected && "bg-primary/5 ring-2 ring-primary hover:ring-primary",
                  )}
                >
                  {/* The real radio is hidden; the card around it is what you see and click */}
                  <input
                    type="radio"
                    name="address"
                    value={address._id}
                    checked={isSelected}
                    // On a full page load the streamed-in HTML arrives with the radio
                    // unchecked and React doesn't fix it while hydrating. This ref runs
                    // after every render and copies our state onto the real radio
                    ref={(radio) => {
                      if (radio) radio.checked = isSelected;
                    }}
                    onChange={() => {
                      setSelectedId(address._id);
                      setIsAddingNew(false);
                    }}
                    className="sr-only"
                  />
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                    <AddressIcon name={address.name} className="size-4.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{address.name}</span>
                    <span className="block text-sm wrap-break-word text-muted-foreground">
                      {address.details}, {address.city}
                    </span>
                    <span className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Phone className="size-3.5" />
                      {address.phone}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "mt-1 flex size-5 shrink-0 items-center justify-center rounded-full ring-1 ring-foreground/25 transition-colors",
                      isSelected && "bg-primary text-primary-foreground ring-primary",
                    )}
                  >
                    {isSelected && <Check className="size-3.5" strokeWidth={3} />}
                  </span>
                </label>
              );
            })}

            {!isAddingNew && (
              <button
                type="button"
                onClick={() => setIsAddingNew(true)}
                className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-foreground/15 p-4 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                <Plus className="size-4" />
                Add a new address
              </button>
            )}
          </fieldset>
        )}

        {/* The new-address form opens smoothly under the list */}
        <AnimatePresence initial={false}>
          {isAddingNew && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className={cn(addresses.length > 0 && "mt-3 rounded-2xl bg-card p-5 ring-1 ring-foreground/10")}>
                {addresses.length > 0 && <h3 className="mb-4 font-semibold">New address</h3>}
                <AddressForm
                  submitLabel="Save and use this address"
                  onSubmit={handleAddNew}
                  // Cancel only makes sense when there's a saved address to go back to
                  onCancel={addresses.length > 0 ? () => setIsAddingNew(false) : undefined}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {error && (
        <p role="alert" className="flex items-center gap-2 rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          <CircleAlert className="size-4 shrink-0" />
          {error}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <Button
          className="h-12 w-full rounded-full text-base"
          disabled={!selectedId || isAddingNew || isPlacing}
          onClick={handleContinueToPayment}
        >
          {isPlacing && <LoaderCircle className="animate-spin" />}
          {isPlacing ? "Redirecting to payment..." : "Continue to payment"}
        </Button>
        {isAddingNew && (
          <p className="text-center text-xs text-muted-foreground">
            Save the new address first, then continue to payment.
          </p>
        )}
      </div>
    </div>
  );
}
