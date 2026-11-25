"use client";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Briefcase,
  Building2,
  House,
  LoaderCircle,
  MapPin,
  Phone,
  Tag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FieldError from "@/components/form/FieldError";
import { getErrorMessage } from "@/lib/apiError";
import { cn } from "cn";
import { AddressInput } from "@/types/response";

// The API saves anything (even a 3-digit phone), so the checks have to happen here.
// .trim() removes spaces at the start/end before checking and before sending
const addressSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Give this address a name, like Home or Work")
    .max(30, "Keep the name under 30 characters"),
  details: z
    .string()
    .trim()
    .min(5, "Add the street, building and apartment"),
  phone: z
    .string()
    .trim()
    // 01 + (0, 1, 2 or 5) + 8 more digits = an Egyptian mobile number
    .regex(/^01[0125]\d{8}$/, "Enter an 11-digit mobile number starting with 010, 011, 012 or 015"),
  city: z.string().trim().min(2, "City is required"),
});

const quickNames = [
  { label: "Home", icon: House },
  { label: "Work", icon: Briefcase },
];

const labelClassName = "flex items-center gap-2 text-sm font-medium";
const iconClassName = "size-4 text-muted-foreground";
const inputClassName = "h-11 rounded-xl px-3";

type AddressFormProps = {
  // Filled when editing, empty when adding
  defaultValues?: AddressInput;
  submitLabel: string;
  // If it throws, the form shows the error message
  onSubmit: (values: AddressInput) => Promise<void>;
  onCancel?: () => void;
};

export default function AddressForm({
  defaultValues = { name: "", details: "", phone: "", city: "" },
  submitLabel,
  onSubmit,
  onCancel,
}: AddressFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues,
    mode: "onTouched",
  });

  // Re-renders when "name" changes, so the Home/Work chip can light up
  const name = useWatch({ control, name: "name" });

  async function submit(values: AddressInput) {
    try {
      await onSubmit(values);
    } catch (error) {
      setError("root", { message: getErrorMessage(error) });
    }
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      noValidate
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="address-name" className={labelClassName}>
          <Tag className={iconClassName} />
          Address name
        </label>
        <div className="flex gap-2">
          {quickNames.map((quick) => (
            <button
              key={quick.label}
              type="button"
              onClick={() =>
                setValue("name", quick.label, { shouldValidate: true })
              }
              className={cn(
                "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium ring-1 ring-foreground/15 transition-colors hover:bg-muted",
                name === quick.label &&
                  "bg-primary text-primary-foreground ring-primary hover:bg-primary/90",
              )}
            >
              <quick.icon className="size-3.5" />
              {quick.label}
            </button>
          ))}
        </div>
        <Input
          id="address-name"
          placeholder="Home, Work, Mom's house..."
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "address-name-error" : undefined}
          className={inputClassName}
          {...register("name")}
        />
        <FieldError id="address-name-error" message={errors.name?.message} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="address-details" className={labelClassName}>
          <MapPin className={iconClassName} />
          Address details
        </label>
        <Input
          id="address-details"
          placeholder="Street, building, apartment"
          autoComplete="street-address"
          aria-invalid={!!errors.details}
          aria-describedby={errors.details ? "address-details-error" : undefined}
          className={inputClassName}
          {...register("details")}
        />
        <FieldError id="address-details-error" message={errors.details?.message} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="address-phone" className={labelClassName}>
            <Phone className={iconClassName} />
            Phone number
          </label>
          <Input
            id="address-phone"
            type="tel"
            inputMode="numeric"
            placeholder="01000000000"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "address-phone-error" : undefined}
            className={inputClassName}
            {...register("phone")}
          />
          <FieldError id="address-phone-error" message={errors.phone?.message} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="address-city" className={labelClassName}>
            <Building2 className={iconClassName} />
            City
          </label>
          <Input
            id="address-city"
            placeholder="Cairo"
            autoComplete="address-level2"
            aria-invalid={!!errors.city}
            aria-describedby={errors.city ? "address-city-error" : undefined}
            className={inputClassName}
            {...register("city")}
          />
          <FieldError id="address-city-error" message={errors.city?.message} />
        </div>
      </div>

      {/* Errors from the API (set with setError("root")) show here */}
      <FieldError id="address-form-error" message={errors.root?.message} />

      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-full px-6 sm:flex-1"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 rounded-full px-6 sm:flex-1"
        >
          {isSubmitting && <LoaderCircle className="animate-spin" />}
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
