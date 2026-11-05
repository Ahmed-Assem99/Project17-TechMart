"use client";
import Link from "next/link";
import { ArrowLeft, Building2, Hash, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useParams } from "next/navigation";
import apiServices from "@/services/apiServices";

const labelClassName = "flex items-center gap-2 text-sm font-medium";
const iconClassName = "size-4 text-muted-foreground";
const inputClassName = "h-11 rounded-xl px-3";


export default function Checkout() {
  const [details, setDetails] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
const {cartId}=useParams()

 async function handleCheckout(){
    const response = await apiServices.Checkout(cartId as string,{
      shippingAddress:{
        details,
        phone,
        city
      }
    })
    open(response.session.url,"_self")
  }
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-8 sm:px-4 lg:py-12">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to cart
      </Link>

      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
        Checkout
      </h1>
      <p className="mt-2 text-muted-foreground">
        Where should we deliver your order?
      </p>

      <form className="mt-8 flex flex-col gap-5 rounded-3xl bg-muted/40 p-6 ring-1 ring-foreground/10 sm:p-8">
        <div className="flex flex-col gap-2">
          <label htmlFor="details" className={labelClassName}>
            <MapPin className={iconClassName} />
            Address details
          </label>
          <Input
            id="details"
            name="details"
            placeholder="Street, building, apartment"
            autoComplete="street-address"
            className={inputClassName}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className={labelClassName}>
            <Phone className={iconClassName} />
            Phone number
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="01000000000"
            autoComplete="tel"
            className={inputClassName}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>


          <div className="flex flex-col gap-2">
            <label htmlFor="city" className={labelClassName}>
              <Building2 className={iconClassName} />
              City
            </label>
            <Input
              id="city"
              name="city"
              placeholder="Cairo"
              autoComplete="address-level2"
              className={inputClassName}
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />


          {/* <div className="flex flex-col gap-2">
            <label htmlFor="postalCode" className={labelClassName}>
              <Hash className={iconClassName} />
              Postal code
            </label>
            <Input
              id="postalCode"
              name="postalCode"
              inputMode="numeric"
              placeholder="12345"
              autoComplete="postal-code"
              className={inputClassName}
                          value={postalCode}
            onChange={(e)=>setPostalCode(e.target.value)}
            />
          </div> */}
        </div>

        <Button
          className="mt-2 h-12 w-full rounded-full text-base"
          onClick={handleCheckout}
        >
          Place order
        </Button>
      </form>
    </main>
  );
}
