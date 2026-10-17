"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api/products";


export default function Home() {
  const {
    data: products,
    isPending,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 60_000,
  });

  if (isPending) return <p className="p-8 text-brand-text-secondary">Loading products...</p>;
  if (error) return <p className="p-8 text-brand-ink" role="alert">Error: {error.message}</p>;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-sm font-medium text-brand-accent">THE COLLECTION</p>
          <h1 className="text-3xl font-semibold text-brand-ink">Products</h1>
        </div>
        <p className="pb-1 text-sm text-brand-text-muted">{products.length} items</p>
      </header>

      <section aria-label="Products" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <article
            key={product.id}
            className="overflow-hidden rounded-lg border border-brand-border bg-brand-surface transition-shadow hover:shadow-md"
          >
            <div className="aspect-4/3 overflow-hidden bg-brand-surface-muted">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="size-full object-contain p-5 transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h2 className="line-clamp-1 text-base font-semibold text-brand-ink">{product.title}</h2>
              <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-brand-text-secondary">
                {product.description}
              </p>
              <p className="mt-4 border-t border-brand-border pt-3 text-lg font-semibold text-brand-ink">
                ${product.price.toFixed(2)}
              </p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}