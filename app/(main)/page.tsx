"use client";

import {
  MdAutorenew,
  MdLocalShipping,
  MdStarRate,
  MdVerified,
} from "react-icons/md";
import Link from "next/link";
import SavedProducts from "@/components/componants/SavedProducts";
import { useProductStore } from "@/lib/store/products";

const benefits = [
  { icon: MdVerified, label: "Premium Quality" },
  { icon: MdLocalShipping, label: "Fast Delivery" },
  { icon: MdAutorenew, label: "Easy Returns" },
  { icon: MdStarRate, label: "Top Rated" },
];

export default function Home() {
  const cart = useProductStore((state) => state.cart);
  const favorites = useProductStore((state) => state.favorites);
  const hasHydrated = useProductStore((state) => state.hasHydrated);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <main className="min-h-screen bg-brand-surface px-4 py-6 sm:px-6 lg:px-8">
      <section
        className="scroll-reveal relative isolate mx-auto flex min-h-[460px] max-w-7xl items-center overflow-hidden rounded-3xl bg-cover bg-center bg-no-repeat px-6 py-16 shadow-xl sm:px-10 md:min-h-[560px] lg:px-16"
        style={{ backgroundImage: "url('/media/hero.webp')" }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/10"
        />
        <div className="relative z-10 max-w-xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
            Find something you love
          </p>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Welcome to Medo-Tore
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-white/85 sm:text-lg">
            Explore a world of the latest trends in fashion, beauty, electronics,
            and fine food.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-accent px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-brand-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Shop now
          </Link>
        </div>
      </section>

      <section
        aria-label="Shopping benefits"
        className="scroll-reveal mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {benefits.map(({ icon: Icon, label }) => (
          <article
            key={label}
            className="motion-card flex items-center gap-4 rounded-2xl border border-brand-border bg-white p-5 shadow-sm"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-brand-accent">
              <Icon aria-hidden="true" className="size-6" />
            </span>
            <h2 className="font-semibold text-brand-ink">{label}</h2>
          </article>
        ))}
      </section>

      <section
        aria-labelledby="cart-products-heading"
        className="scroll-reveal mx-auto mt-14 max-w-7xl"
      >
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2
              id="cart-products-heading"
              className="text-2xl font-bold tracking-tight text-brand-ink"
            >
              Cart products
            </h2>
            <span className="text-sm text-brand-text-secondary">
              {hasHydrated ? `${cartCount} items` : "Loading..."}
            </span>
          </div>
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-full bg-brand-accent px-5 py-2.5 text-sm font-semibold text-white opacity-60"
          >
            Buy (coming soon)
          </button>
        </div>
        <SavedProducts mode="cart" />
      </section>

      <section
        aria-labelledby="favorite-products-heading"
        className="scroll-reveal mx-auto mt-14 max-w-7xl pb-10"
      >
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2
              id="favorite-products-heading"
              className="text-2xl font-bold tracking-tight text-brand-ink"
            >
              Favorite products
            </h2>
            <span className="text-sm text-brand-text-secondary">
              {hasHydrated ? `${favorites.length} items` : "Loading..."}
            </span>
          </div>
          <Link
            href="/favorites"
            className="text-sm font-semibold text-brand-accent hover:text-brand-accent-hover"
          >
            View all
          </Link>
        </div>
        <SavedProducts mode="favorites" />
      </section>
    </main>
  );
}
