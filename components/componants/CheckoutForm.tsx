"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useProductStore } from "@/lib/store/products";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function inputClassName() {
  return "mt-2 w-full rounded-xl border border-brand-border bg-white px-4 py-3 text-brand-ink outline-none transition focus:border-brand-accent focus:ring-2 focus:ring-brand-focus";
}

export default function CheckoutForm() {
  const cart = useProductStore((state) => state.cart);
  const hasHydrated = useProductStore((state) => state.hasHydrated);
  const clearCart = useProductStore((state) => state.clearCart);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.currentTarget.reset();
    clearCart();
    setOrderConfirmed(true);
  }

  if (!hasHydrated) {
    return (
      <p className="py-16 text-center text-brand-text-secondary">
        Loading your cart...
      </p>
    );
  }

  if (orderConfirmed) {
    return (
      <section
        aria-live="polite"
        className="mx-auto max-w-2xl rounded-3xl border border-brand-border bg-white px-6 py-14 text-center shadow-sm sm:px-10"
      >
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-green-50 text-2xl text-green-700">
          ✓
        </span>
        <h2 className="mt-5 text-2xl font-bold text-brand-ink">
          Demo order confirmed
        </h2>
        <p className="mt-3 leading-7 text-brand-text-secondary">
          This was a training simulation only. No payment was processed, and
          your card details were not saved or sent anywhere.
        </p>
        <Link
          href="/shop"
          className="mt-7 inline-flex rounded-full bg-brand-accent px-6 py-3 font-semibold text-white hover:bg-brand-accent-hover"
        >
          Continue shopping
        </Link>
      </section>
    );
  }

  if (cart.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-brand-border bg-white px-6 py-14 text-center">
        <p className="text-brand-text-secondary">
          Your cart is empty. Add products before starting checkout.
        </p>
        <Link
          href="/shop"
          className="mt-5 inline-flex rounded-full bg-brand-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-accent-hover"
        >
          Browse products
        </Link>
      </section>
    );
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <form
        autoComplete="off"
        onSubmit={handleSubmit}
        className="space-y-8 rounded-3xl border border-brand-border bg-white p-5 shadow-sm sm:p-8"
      >
        <div
          role="note"
          className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950"
        >
          <strong>Training demo only:</strong> Do not enter real payment details.
          This form does not send or store card information and does not charge
          a payment.
        </div>

        <fieldset className="space-y-4">
          <legend className="mb-4 text-lg font-semibold text-brand-ink">
            Contact and shipping
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-brand-ink">
              First name
              <input
                className={inputClassName()}
                name="firstName"
                autoComplete="given-name"
                required
              />
            </label>
            <label className="text-sm font-medium text-brand-ink">
              Last name
              <input
                className={inputClassName()}
                name="lastName"
                autoComplete="family-name"
                required
              />
            </label>
          </div>
          <label className="block text-sm font-medium text-brand-ink">
            Email
            <input
              className={inputClassName()}
              type="email"
              name="email"
              autoComplete="email"
              required
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-brand-ink">
              Country
              <input
                className={inputClassName()}
                name="country"
                autoComplete="country-name"
                required
              />
            </label>
            <label className="text-sm font-medium text-brand-ink">
              City or state
              <input
                className={inputClassName()}
                name="cityOrState"
                autoComplete="address-level1"
                required
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="mb-4 text-lg font-semibold text-brand-ink">
            Demo payment details
          </legend>
          <label className="block text-sm font-medium text-brand-ink">
            Credit card number
            <input
              className={inputClassName()}
              type="text"
              name="cardNumber"
              inputMode="numeric"
              autoComplete="off"
              maxLength={19}
              pattern="[0-9]{13,19}"
              title="Enter 13 to 19 digits without spaces."
              placeholder="Digits only"
              required
            />
          </label>
          <label className="block max-w-xs text-sm font-medium text-brand-ink">
            Card security code
            <input
              className={inputClassName()}
              type="password"
              name="securityCode"
              inputMode="numeric"
              autoComplete="off"
              maxLength={4}
              pattern="[0-9]{3,4}"
              title="Enter a 3 or 4 digit code."
              required
            />
          </label>
        </fieldset>

        <label className="flex items-start gap-3 text-sm leading-6 text-brand-text-secondary">
          <input
            type="checkbox"
            name="agreeToTerms"
            required
            className="mt-1 size-4 shrink-0 accent-brand-accent"
          />
          <span>
            I agree to the training demo terms and understand this does not
            create a real order or payment.
          </span>
        </label>

        <button
          type="submit"
          className="w-full rounded-full bg-brand-accent px-6 py-3.5 font-semibold text-white transition-colors hover:bg-brand-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-accent"
        >
          Confirm demo order
        </button>
      </form>

      <aside className="rounded-3xl border border-brand-border bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-brand-ink">Order summary</h2>
        <ul className="mt-5 divide-y divide-brand-border">
          {cart.map(({ product, quantity }) => (
            <li key={product.id} className="flex items-center gap-3 py-4">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-brand-surface-muted">
                <Image
                  src={product.thumbnail}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-contain p-1"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-medium text-brand-ink">
                  {product.title}
                </p>
                <p className="mt-1 text-xs text-brand-text-secondary">
                  Quantity: {quantity}
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold text-brand-ink">
                {priceFormatter.format(product.price * quantity)}
              </p>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-brand-border pt-4 font-bold text-brand-ink">
          <span>Demo total</span>
          <span>{priceFormatter.format(total)}</span>
        </div>
      </aside>
    </div>
  );
}
