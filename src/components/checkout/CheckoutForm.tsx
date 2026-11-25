"use client";
import { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Banknote,
  Check,
  CircleAlert,
  CreditCard,
  LoaderCircle,
  Phone,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import AddressForm from "@/components/addresses/AddressForm";
import { AddressIcon } from "@/components/addresses/AddressCard";
import { counterContext } from "@/contexts/counterContext";
import apiServices from "@/services/apiServices";
import { getErrorMessage } from "@/lib/apiError";
import { AddressI, AddressInput } from "@/types/response";
import { cn } from "cn";

type PaymentMethod = "card" | "cash";

const paymentMethods = [
  {
    value: "card",
    title: "Pay with card",
    text: "Secure online payment with Stripe",
    icon: CreditCard,
  },
  {
    value: "cash",
    title: "Cash on delivery",
    text: "Pay when your order arrives",
    icon: Banknote,
  },
] as const; // "as const" keeps value as "card" | "cash" instead of plain string

// The look of a selectable card (address or payment method)
const optionClassName =
  "flex cursor-pointer items-start gap-4 rounded-2xl bg-card p-4 ring-1 ring-foreground/10 transition-all hover:ring-foreground/25 has-focus-visible:ring-2 has-focus-visible:ring-ring";
const selectedOptionClassName = "bg-primary/5 ring-2 ring-primary hover:ring-primary";

// The round check mark on the right of a selectable card
function SelectedMark({ isSelected }: { isSelected: boolean }) {
  return (
    <span
      className={cn(
        "mt-1 flex size-5 shrink-0 items-center justify-center rounded-full ring-1 ring-foreground/25 transition-colors",
        isSelected && "bg-primary text-primary-foreground ring-primary",
      )}
    >
      {isSelected && <Check className="size-3.5" strokeWidth={3} />}
    </span>
  );
}

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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [isPlacing, setIsPlacing] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { setNumOfCartItems } = useContext(counterContext);
  const isCash = paymentMethod === "cash";

  // A new address typed at checkout is also saved to the address book
  // (errors aren't caught here: AddressForm shows them under the form)
  async function handleAddNew(values: AddressInput): Promise<void> {
    const response = await apiServices.addAddress(values);
    setAddresses(response.data);
    setSelectedId(response.data[response.data.length - 1]._id); // the API puts the new one last
    setIsAddingNew(false);
  }

  async function handlePlaceOrder() {
    if (!selectedId) return;
    setIsPlacing(true);
    setError("");
    try {
      // 1. We only keep the selected address's id; get its data from the API using that id
      const addressResponse = await apiServices.getAddress(selectedId);
      const { details, phone, city } = addressResponse.data;
      const shippingAddress = { details, phone, city };

      if (isCash) {
        // 2a. CASH: the order is created right away and the API empties the cart
        await apiServices.createCashOrder(cartId, { shippingAddress });
        setNumOfCartItems(0); // the navbar badge: the cart is empty now
        toast.add({ title: "Order placed", description: "You'll pay in cash when it arrives." });
        router.push("/allorders");
        return; // keep the button in its loading state while the page changes
      }

      // 2b. CARD: create a Stripe session and go to Stripe's payment page
      // (a different website, so window.location instead of router.push)
      const response = await apiServices.Checkout(cartId, { shippingAddress });
      window.location.href = response.session.url;
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          isCash
            ? "Couldn't place your order. Please try again."
            : "Couldn't start the payment. Please try again.",
        ),
      );
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
                  className={cn(optionClassName, isSelected && selectedOptionClassName)}
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
                  <SelectedMark isSelected={isSelected} />
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

      <section className="rounded-3xl bg-muted/40 p-6 ring-1 ring-foreground/10 sm:p-8">
        <h2 className="mb-5 text-lg font-semibold">Payment method</h2>
        <fieldset className="grid gap-3 sm:grid-cols-2">
          <legend className="sr-only">Choose how to pay</legend>
          {paymentMethods.map((method) => {
            const isSelected = paymentMethod === method.value;
            return (
              <label
                key={method.value}
                className={cn(optionClassName, isSelected && selectedOptionClassName)}
              >
                <input
                  type="radio"
                  name="payment"
                  value={method.value}
                  checked={isSelected}
                  // Same full-page-load fix as the address radios above
                  ref={(radio) => {
                    if (radio) radio.checked = isSelected;
                  }}
                  onChange={() => setPaymentMethod(method.value)}
                  className="sr-only"
                />
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                  <method.icon className="size-4.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{method.title}</span>
                  <span className="block text-sm text-muted-foreground">{method.text}</span>
                </span>
                <SelectedMark isSelected={isSelected} />
              </label>
            );
          })}
        </fieldset>
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
          onClick={handlePlaceOrder}
        >
          {isPlacing && <LoaderCircle className="animate-spin" />}
          {isPlacing
            ? isCash
              ? "Placing your order..."
              : "Redirecting to payment..."
            : isCash
              ? "Place order"
              : "Continue to payment"}
        </Button>
        {isAddingNew && (
          <p className="text-center text-xs text-muted-foreground">
            Save the new address first, then {isCash ? "place your order" : "continue to payment"}.
          </p>
        )}
      </div>
    </div>
  );
}
