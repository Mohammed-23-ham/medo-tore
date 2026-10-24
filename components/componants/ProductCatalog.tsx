"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { getProducts } from "@/lib/api/products";
import { useProductStore } from "@/lib/store/products";
import type { Product } from "@/lib/api/products";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const pageSize = 25;
type SortOrder = "price-asc" | "price-desc" | "title-asc" | "title-desc";

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
    <article className="motion-card overflow-hidden rounded-2xl border border-brand-border bg-white shadow-sm">
      <div className="relative">
        <Link
          href={`/products/${product.id}`}
          aria-label={`View ${product.title}`}
          className="relative block aspect-[4/3] bg-brand-surface-muted"
        >
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            loading={eagerImage ? "eager" : "lazy"}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-4"
          />
        </Link>
        {product.category && (
          <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium capitalize text-brand-text-secondary shadow-sm">
            {product.category.replaceAll("-", " ")}
          </span>
        )}
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
        <h2 className="line-clamp-1 font-semibold text-brand-ink transition-colors hover:text-brand-accent">
          <Link href={`/products/${product.id}`}>{product.title}</Link>
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
            disabled={!hasHydrated || product.stock === 0}
            onClick={() => addToCart(product)}
            className="rounded-full bg-brand-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}

export default function ProductCatalog() {
  const [category, setCategory] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("title-asc");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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

  const categories = [...new Set(data.map((product) => product.category)
    .filter((value): value is string => Boolean(value)))].sort((a, b) =>
      a.localeCompare(b),
    );
  const filteredProducts = data.filter((product) => {
    const matchesCategory = !category || product.category === category;
    const matchesSearch = `${product.title} ${product.description}`
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    return matchesCategory && matchesSearch;
  });
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOrder) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "title-desc":
        return b.title.localeCompare(a.title);
      default:
        return a.title.localeCompare(b.title);
    }
  });
  const pageCount = Math.ceil(sortedProducts.length / pageSize);
  const pageProducts = sortedProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const firstVisibleProduct = sortedProducts.length
    ? (currentPage - 1) * pageSize + 1
    : 0;
  const lastVisibleProduct = Math.min(currentPage * pageSize, sortedProducts.length);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[270px_minmax(0,1fr)]">
      <aside className="self-start rounded-2xl border border-brand-border bg-white p-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
        <h2 className="mb-4 text-lg font-semibold text-brand-ink">
          Find products
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <label className="text-sm font-medium text-brand-ink">
          Search the catalog
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name or description"
            className="mt-2 w-full rounded-xl border border-brand-border bg-brand-surface px-4 py-2.5 font-normal outline-none transition focus:border-brand-accent focus:ring-2 focus:ring-brand-focus"
          />
        </label>
        <label className="text-sm font-medium text-brand-ink">
          Category
          <select
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setCurrentPage(1);
            }}
            className="mt-2 w-full rounded-xl border border-brand-border bg-brand-surface px-4 py-2.5 font-normal capitalize outline-none transition focus:border-brand-accent focus:ring-2 focus:ring-brand-focus"
          >
            <option value="">All categories</option>
            {categories.map((productCategory) => (
              <option key={productCategory} value={productCategory}>
                {productCategory.replaceAll("-", " ")}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-brand-ink">
          Sort by
          <select
            value={sortOrder}
            onChange={(event) => {
              const value = event.target.value;
              if (
                value === "price-asc" ||
                value === "price-desc" ||
                value === "title-asc" ||
                value === "title-desc"
              ) {
                setSortOrder(value);
              }
              setCurrentPage(1);
            }}
            className="mt-2 w-full rounded-xl border border-brand-border bg-brand-surface px-4 py-2.5 font-normal outline-none transition focus:border-brand-accent focus:ring-2 focus:ring-brand-focus"
          >
            <option value="title-asc">Name: A to Z</option>
            <option value="title-desc">Name: Z to A</option>
            <option value="price-asc">Price: Low to high</option>
            <option value="price-desc">Price: High to low</option>
          </select>
        </label>
        </div>
      </aside>

      <section aria-label="Product results" className="min-w-0">
        <p className="mb-4 text-sm text-brand-text-secondary" aria-live="polite">
          {sortedProducts.length
            ? `Showing ${firstVisibleProduct}-${lastVisibleProduct} of ${sortedProducts.length} products`
            : "No products match your search."}
        </p>

        {sortedProducts.length === 0 && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategory("");
              setCurrentPage(1);
            }}
            className="mb-6 rounded-full border border-brand-border px-5 py-2.5 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-surface-muted"
          >
            Clear filters
          </button>
        )}

        {pageProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pageProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                eagerImage={index === 0}
              />
            ))}
          </div>
        )}

        {pageCount > 1 && (
          <nav
            aria-label="Product pages"
            className="mt-10 flex flex-wrap items-center justify-center gap-2"
          >
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => page - 1)}
              className="rounded-full border border-brand-border px-4 py-2 text-sm font-medium text-brand-ink transition hover:bg-brand-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                  onClick={() => setCurrentPage(page)}
                  className={`size-10 rounded-full text-sm font-semibold transition ${
                    currentPage === page
                      ? "bg-brand-accent text-white"
                      : "border border-brand-border text-brand-ink hover:bg-brand-surface-muted"
                  }`}
                >
                  {page}
                </button>
              ),
            )}
            <button
              type="button"
              disabled={currentPage === pageCount}
              onClick={() => setCurrentPage((page) => page + 1)}
              className="rounded-full border border-brand-border px-4 py-2 text-sm font-medium text-brand-ink transition hover:bg-brand-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        )}
      </section>
    </div>
  );
}
