"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
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
    <article className="motion-card flex h-full flex-col overflow-hidden rounded-2xl border border-brand-border bg-white shadow-sm">
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-brand-surface-muted">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 33vw, 25vw"
          className="object-contain p-4"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h2 className="font-semibold text-brand-ink">{product.title}</h2>
        <p className="mt-1 line-clamp-2 text-sm text-brand-text-secondary">
          {product.description}
        </p>
        <p className="mt-3 font-bold text-brand-ink">
          {priceFormatter.format(product.price)}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
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
                className="ml-auto text-sm font-medium text-red-700 hover:underline"
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
                className="ml-auto text-sm font-medium text-red-700 hover:underline"
              >
                Remove
              </button>
            </>
          )}
        </div>
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
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [snapCount, setSnapCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    const updateDots = () => {
      setSelectedIndex(api.selectedScrollSnap());
      setSnapCount(api.scrollSnapList().length);
    };

    updateDots();
    api.on("select", updateDots);
    api.on("reInit", updateDots);

    return () => {
      api.off("select", updateDots);
      api.off("reInit", updateDots);
    };
  }, [api]);

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
      <Carousel
        setApi={setApi}
        opts={{ align: "start" }}
        aria-label={mode === "cart" ? "Cart products" : "Favorite products"}
      >
        <CarouselContent className="-ml-4 cursor-grab active:cursor-grabbing">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="pl-4 sm:basis-1/3 lg:basis-1/4"
            >
              <SavedProductCard product={product} mode={mode} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          aria-label="Scroll to previous products"
          className="left-2 z-10 size-10 border-brand-border bg-white text-brand-ink shadow-md hover:bg-brand-surface-muted"
        />
        <CarouselNext
          aria-label="Scroll to next products"
          className="right-2 z-10 size-10 border-brand-border bg-white text-brand-ink shadow-md hover:bg-brand-surface-muted"
        />
      </Carousel>
      {snapCount > 1 && (
        <div
          className="flex items-center justify-center gap-2 pt-2"
          aria-label="Carousel navigation"
        >
          {Array.from({ length: snapCount }, (_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={selectedIndex === index ? "true" : undefined}
              onClick={() => api?.scrollTo(index)}
              className={`h-2.5 rounded-full transition-all ${
                selectedIndex === index
                  ? "w-7 bg-brand-accent"
                  : "w-2.5 bg-brand-border hover:bg-brand-text-muted"
              }`}
            />
          ))}
        </div>
      )}
      {mode === "cart" && (
        <p className="pt-2 text-right text-lg font-bold text-brand-ink">
          Total: {priceFormatter.format(total)}
        </p>
      )}
    </div>
  );
}
