"use client";

import Image from "next/image";
import Link from "next/link";
import { useProductStore } from "@/lib/store/products";
import type { Product } from "@/lib/api/products";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function SavedProductCard({
  product,
  mode,
}: {
  product: Product;
  mode: "cart" | "favorites";
}) {
  const addToCart = useProductStore((state) => state.addToCart);
  const removeFromCart = useProductStore((state) => state.removeFromCart);
  const removeFavorite = useProductStore((state) => state.removeFavorite);
  const setCartQuantity = useProductStore((state) => state.setCartQuantity);
  const quantity = useProductStore(
    (state) =>
      state.cart.find((item) => item.product.id === product.id)?.quantity ?? 0,
  );

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-brand-border bg-white p-4 sm:flex-row sm:items-center">
      <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-xl bg-brand-surface-muted sm:size-28">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, 112px"
          className="object-contain p-2"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="font-semibold text-brand-ink">{product.title}</h2>
        <p className="mt-1 line-clamp-2 text-sm text-brand-text-secondary">
          {product.description}
        </p>
        <p className="mt-3 font-bold text-brand-ink">
          {priceFormatter.format(product.price)}
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {mode === "cart" ? (
          <>
            <button
              type="button"
              aria-label={`Decrease ${product.title} quantity`}
              onClick={() => setCartQuantity(product.id, quantity - 1)}
              className="flex size-9 items-center justify-center rounded-full border border-brand-border text-brand-ink hover:bg-brand-surface-muted"
            >
              −
            </button>
            <span className="min-w-8 text-center" aria-label="Quantity">
              {quantity}
            </span>
            <button
              type="button"
              aria-label={`Increase ${product.title} quantity`}
              onClick={() => addToCart(product)}
              className="flex size-9 items-center justify-center rounded-full border border-brand-border text-brand-ink hover:bg-brand-surface-muted"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => removeFromCart(product.id)}
              className="ml-2 text-sm font-medium text-red-700 hover:underline"
            >
              Remove
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => addToCart(product)}
              className="rounded-full bg-brand-accent px-4 py-2 text-sm font-semibold text-white hover:bg-brand-accent-hover"
            >
              Add to cart
            </button>
            <button
              type="button"
              onClick={() => removeFavorite(product.id)}
              className="ml-2 text-sm font-medium text-red-700 hover:underline"
            >
              Remove
            </button>
          </>
        )}
      </div>
    </article>
  );
}

export default function SavedProducts({
  mode,
}: {
  mode: "cart" | "favorites";
}) {
  const hasHydrated = useProductStore((state) => state.hasHydrated);
  const cart = useProductStore((state) => state.cart);
  const favorites = useProductStore((state) => state.favorites);
  const products = mode === "cart" ? cart.map((item) => item.product) : favorites;
  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  if (!hasHydrated) {
    return <p className="py-16 text-center text-brand-text-secondary">Loading saved products...</p>;
  }

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-brand-border px-6 py-16 text-center">
        <p className="text-brand-text-secondary">
          {mode === "cart"
            ? "Your cart is empty."
            : "You have no favorite products yet."}
        </p>
        <Link
          href="/shop"
          className="mt-5 inline-flex rounded-full bg-brand-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-accent-hover"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <SavedProductCard key={product.id} product={product} mode={mode} />
      ))}
      {mode === "cart" && (
        <p className="pt-2 text-right text-lg font-bold text-brand-ink">
          Total: {priceFormatter.format(total)}
        </p>
      )}
    </div>
  );
}
