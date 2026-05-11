"use client";

import { useState, type FormEvent } from "react";
import { LockIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

type CheckoutFormProps = {
  planName: string;
  amount: number;
  period: "monthly" | "yearly";
  email: string;
};

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function CheckoutForm({
  planName,
  amount,
  period,
  email,
}: CheckoutFormProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [pending, setPending] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setTimeout(() => {
      setPending(false);
      toast.info("Stripe placeholder", {
        description:
          "Real payments aren't wired up yet — this form is a Stripe stub.",
      });
    }, 1200);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <section className="rounded-xl border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Contact</h2>
          <span className="text-xs text-muted-foreground">
            Receipt sent here
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={email}
            autoComplete="email"
            required
          />
        </div>
      </section>

      <section className="rounded-xl border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Payment details</h2>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <LockIcon className="size-3" aria-hidden />
            Stripe placeholder
          </span>
        </div>

        <div className="grid gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="card-name">Cardholder name</Label>
            <Input
              id="card-name"
              name="card-name"
              placeholder="Name on card"
              autoComplete="cc-name"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="card-number">Card number</Label>
            <Input
              id="card-number"
              name="card-number"
              inputMode="numeric"
              placeholder="1234 1234 1234 1234"
              autoComplete="cc-number"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="card-expiry">Expiration</Label>
              <Input
                id="card-expiry"
                name="card-expiry"
                inputMode="numeric"
                placeholder="MM / YY"
                autoComplete="cc-exp"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="card-cvc">CVC</Label>
              <Input
                id="card-cvc"
                name="card-cvc"
                inputMode="numeric"
                placeholder="123"
                autoComplete="cc-csc"
                value={cvc}
                onChange={(e) =>
                  setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                required
              />
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <h3 className="mb-4 text-sm font-semibold">Billing address</h3>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="country">Country</Label>
              <NativeSelect
                className="w-full"
                id="country"
                name="country"
                defaultValue="TR"
              >
                <NativeSelectOption value="TR">Türkiye</NativeSelectOption>
                <NativeSelectOption value="US">
                  United States
                </NativeSelectOption>
                <NativeSelectOption value="GB">
                  United Kingdom
                </NativeSelectOption>
                <NativeSelectOption value="DE">Germany</NativeSelectOption>
                <NativeSelectOption value="FR">France</NativeSelectOption>
                <NativeSelectOption value="NL">Netherlands</NativeSelectOption>
              </NativeSelect>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="postal">Postal code</Label>
              <Input
                id="postal"
                name="postal"
                placeholder="34000"
                autoComplete="postal-code"
                required
              />
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={pending}
        >
          {pending
            ? "Processing…"
            : `Pay $${amount} · ${planName} ${period}`}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          By confirming, you agree to our terms. You can cancel anytime from
          Settings. This is a Stripe placeholder — no card will be charged.
        </p>
      </div>
    </form>
  );
}
