"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { getProducts } from "@/lib/api/products";
import { useProductStore } from "@/lib/store/products";
import type { Product } from "@/lib/api/products";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function ProductCard({
  product,
  eagerImage,
}: {
  product: Product;
  eagerImage: boolean;
}) {
  const addToCart = useProductStore((state) => state.addToCart);
  const toggleFavorite = useProductStore((state) => state.toggleFavorite);
  const isFavorite = useProductStore((state) =>
    state.favorites.some((item) => item.id === product.id),
  );
  const hasHydrated = useProductStore((state) => state.hasHydrated);

  return (
    <article className="overflow-hidden rounded-2xl border border-brand-border bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] bg-brand-surface-muted">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          loading={eagerImage ? "eager" : "lazy"}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-4"
        />
        <button
          type="button"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFavorite}
          disabled={!hasHydrated}
          onClick={() => toggleFavorite(product)}
          className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full bg-white/95 text-brand-accent shadow-sm transition hover:bg-white disabled:cursor-wait"
        >
          {isFavorite ? (
            <MdFavorite aria-hidden="true" className="size-5" />
          ) : (
            <MdFavoriteBorder aria-hidden="true" className="size-5" />
          )}
        </button>
      </div>
      <div className="p-4">
        <h2 className="line-clamp-1 font-semibold text-brand-ink">
          {product.title}
        </h2>
        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-brand-text-secondary">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="font-bold text-brand-ink">
            {priceFormatter.format(product.price)}
          </span>
          <button
            type="button"
            disabled={!hasHydrated}
            onClick={() => addToCart(product)}
            className="rounded-full bg-brand-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-accent-hover disabled:cursor-wait disabled:opacity-60"
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}

export default function ProductCatalog() {
  const { data, error, isPending, isError } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  if (isPending) {
    return <p className="py-16 text-center text-brand-text-secondary">Loading products...</p>;
  }

  if (isError) {
    return (
      <p role="alert" className="py-16 text-center text-red-700">
        Could not load products: {error.message}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          eagerImage={index === 0}
        />
      ))}
    </div>
  );
}
