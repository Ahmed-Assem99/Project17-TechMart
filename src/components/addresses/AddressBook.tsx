"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPinPlus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { toast } from "@/components/ui/toast";
import apiServices from "@/services/apiServices";
import { AddressI, AddressInput } from "@/types/response";
import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";

export default function AddressBook({ initialAddresses }: { initialAddresses: AddressI[] }) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [isFormOpen, setIsFormOpen] = useState(false);
  // null = adding a new address, an address = editing that one
  const [editing, setEditing] = useState<AddressI | null>(null);
  // Changing a component's key remounts it, so the form starts fresh every time it opens
  const [formKey, setFormKey] = useState(0);

  function openForm(address: AddressI | null) {
    setEditing(address);
    setFormKey((key) => key + 1);
    setIsFormOpen(true);
  }

  async function handleSave(values: AddressInput): Promise<string | void> {
    // ADD: the API answers with the whole list, new address at the end
    if (!editing) {
      const response = await apiServices.addAddress(values);
      if (response.status !== "success") return response.message ?? "Couldn't save the address";
      setAddresses(response.data);
      toast.add({ title: "Address added", description: `"${values.name}" was saved.` });
      setIsFormOpen(false);
      return;
    }

    // EDIT, same name: PUT updates details/phone/city and keeps the same _id
    if (values.name === editing.name) {
      const response = await apiServices.updateAddress(editing._id, values);
      if (response.status !== "success") return response.message ?? "Couldn't update the address";
      setAddresses((list) =>
        list.map((address) => (address._id === editing._id ? response.data : address)),
      );
    } else {
      // EDIT, new name: the API's PUT ignores "name", so we save a new copy
      // with the new name, then delete the old one. Adding first means that
      // if the delete fails, the address isn't lost
      const added = await apiServices.addAddress(values);
      if (added.status !== "success") return added.message ?? "Couldn't update the address";
      const removed = await apiServices.removeAddress(editing._id);
      setAddresses(removed.status === "success" ? removed.data : added.data);
    }
    toast.add({ title: "Address updated", description: `"${values.name}" was saved.` });
    setIsFormOpen(false);
  }

  async function handleDelete(address: AddressI) {
    try {
      const response = await apiServices.removeAddress(address._id);
      if (response.status !== "success") throw new Error(response.message);
      setAddresses(response.data);
      toast.add({ title: "Address deleted", description: `"${address.name}" was removed.` });
    } catch {
      toast.add({ title: "Couldn't delete the address", description: "Please try again." });
    }
  }

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">My addresses</h1>
          <p className="mt-2 text-muted-foreground">
            Save the places you ship to, then pick one at checkout.
          </p>
        </div>
        {addresses.length > 0 && (
          <Button className="h-11 rounded-full px-5" onClick={() => openForm(null)}>
            <Plus />
            Add address
          </Button>
        )}
      </div>

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-muted/40 px-6 py-20 text-center ring-1 ring-foreground/10">
          <span className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <MapPinPlus className="size-7" />
          </span>
          <h2 className="text-2xl font-bold tracking-tight">No saved addresses</h2>
          <p className="max-w-sm text-muted-foreground">
            Add an address once and you won&apos;t have to type it again at checkout.
          </p>
          <Button size="lg" className="h-11 rounded-full px-6" onClick={() => openForm(null)}>
            <Plus />
            Add your first address
          </Button>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {/* layout + AnimatePresence: cards slide into place when one is added or removed */}
          <AnimatePresence initial={false}>
            {addresses.map((address) => (
              <motion.li
                key={address._id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
              >
                <AddressCard
                  address={address}
                  onEdit={() => openForm(address)}
                  onDelete={() => handleDelete(address)}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      {/* The add/edit form slides in from the right */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent
          side="right"
          className="gap-0 overflow-y-auto p-6 data-[side=right]:w-full data-[side=right]:sm:max-w-md"
        >
          <SheetTitle className="text-xl font-bold">
            {editing ? "Edit address" : "Add a new address"}
          </SheetTitle>
          <SheetDescription className="mt-1 mb-6">
            {editing ? "Update the details and save." : "Where should we deliver?"}
          </SheetDescription>
          <AddressForm
            key={formKey}
            defaultValues={
              editing
                ? { name: editing.name, details: editing.details, phone: editing.phone, city: editing.city }
                : undefined
            }
            submitLabel={editing ? "Save changes" : "Save address"}
            onSubmit={handleSave}
            onCancel={() => setIsFormOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
