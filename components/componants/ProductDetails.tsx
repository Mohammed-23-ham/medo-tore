"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { MdFavorite, MdFavoriteBorder, MdStarRate } from "react-icons/md";
import { getProduct } from "@/lib/api/products";
import { useProductStore } from "@/lib/store/products";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function ProductDetails({
  productId,
}: {
  productId: number;
}) {
  const { data: product, error, isPending, isError } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId),
  });
  const addToCart = useProductStore((state) => state.addToCart);
  const toggleFavorite = useProductStore((state) => state.toggleFavorite);
  const hasHydrated = useProductStore((state) => state.hasHydrated);
  const isFavorite = useProductStore((state) =>
    state.favorites.some((favorite) => favorite.id === productId),
  );

  if (isPending) {
    return (
      <main className="mx-auto min-h-[50vh] w-full max-w-7xl px-4 py-16 text-center text-brand-text-secondary sm:px-6 lg:px-8">
        Loading product...
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto min-h-[50vh] w-full max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p role="alert" className="text-red-700">
          Could not load this product: {error.message}
        </p>
        <Link
          href="/shop"
          className="mt-5 inline-flex rounded-full bg-brand-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-accent-hover"
        >
          Back to shop
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-brand-text-secondary">
        <Link href="/shop" className="hover:text-brand-accent">
          Shop
        </Link>
        <span aria-hidden="true" className="mx-2">
          /
        </span>
        <span className="text-brand-ink">{product.title}</span>
      </nav>

      <article className="grid gap-8 rounded-3xl border border-brand-border bg-white p-5 shadow-sm sm:p-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-brand-surface-muted">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 50vw"
            className="object-contain p-6 sm:p-10"
          />
        </div>

        <div className="flex flex-col justify-center">
          {product.category && (
            <p className="text-sm font-semibold capitalize text-brand-accent">
              {product.category.replaceAll("-", " ")}
            </p>
          )}
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">
            {product.title}
          </h1>
          {product.brand && (
            <p className="mt-3 text-sm text-brand-text-secondary">
              Brand: {product.brand}
            </p>
          )}
          {typeof product.rating === "number" && (
            <p className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-ink">
              <MdStarRate aria-hidden="true" className="size-5 text-amber-500" />
              {product.rating.toFixed(1)} / 5
            </p>
          )}
          <p className="mt-6 text-2xl font-bold text-brand-ink">
            {priceFormatter.format(product.price)}
          </p>
          <p className="mt-5 leading-7 text-brand-text-secondary">
            {product.description}
          </p>
          {typeof product.stock === "number" && (
            <p className="mt-4 text-sm text-brand-text-secondary">
              {product.stock > 0
                ? `${product.stock} in stock`
                : "Currently out of stock"}
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={!hasHydrated || product.stock === 0}
              onClick={() => addToCart(product)}
              className="rounded-full bg-brand-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add to cart
            </button>
            <button
              type="button"
              disabled={!hasHydrated}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              aria-pressed={isFavorite}
              onClick={() => toggleFavorite(product)}
              className="flex size-12 items-center justify-center rounded-full border border-brand-border text-brand-accent transition-colors hover:bg-brand-surface-muted disabled:cursor-wait"
            >
              {isFavorite ? (
                <MdFavorite aria-hidden="true" className="size-5" />
              ) : (
                <MdFavoriteBorder aria-hidden="true" className="size-5" />
              )}
            </button>
          </div>
        </div>
      </article>
    </main>
  );
}
