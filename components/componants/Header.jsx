"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AiOutlineSearch } from "react-icons/ai";
import { BsFillCartFill } from "react-icons/bs";
import { MdFavorite, MdHeartBroken } from "react-icons/md";
import { getProducts } from "@/lib/api/products";
import { useProductStore } from "@/lib/store/products";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function ProductImage({ product }) {
  return (
    <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-brand-surface-muted">
      <Image
        src={product.thumbnail}
        alt=""
        fill
        sizes="56px"
        className="object-contain p-1"
      />
    </div>
  );
}

function SearchResults({ query, products, isPending, isError, error }) {
  if (isPending) {
    return <p className="p-4 text-sm text-brand-text-secondary">Loading products...</p>;
  }

  if (isError) {
    return (
      <p role="alert" className="p-4 text-sm text-red-700">
        Could not search products: {error.message}
      </p>
    );
  }

  const matches = products
    .filter((product) =>
      `${product.title} ${product.description}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
    )
    .slice(0, 6);

  if (matches.length === 0) {
    return <p className="p-4 text-sm text-brand-text-secondary">No products found.</p>;
  }

  return (
    <>
      <ul className="divide-y divide-brand-border">
        {matches.map((product) => (
          <li key={product.id}>
            <Link
              href={`/products/${product.id}`}
              className="flex items-center gap-3 p-3 transition-colors hover:bg-brand-surface-muted"
            >
              <ProductImage product={product} />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm font-medium text-brand-ink">
                  {product.title}
                </p>
                <p className="mt-1 text-sm text-brand-text-secondary">
                  {priceFormatter.format(product.price)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/shop"
        className="block border-t border-brand-border px-4 py-3 text-center text-sm font-semibold text-brand-accent hover:bg-brand-surface-muted"
      >
        View all products
      </Link>
    </>
  );
}

export default function Header() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [search, setSearch] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { data, error, isPending, isError } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
  const cart = useProductStore((state) => state.cart);
  const favorites = useProductStore((state) => state.favorites);
  const hasHydrated = useProductStore((state) => state.hasHydrated);
  const addToCart = useProductStore((state) => state.addToCart);
  const removeFromCart = useProductStore((state) => state.removeFromCart);
  const removeFavorite = useProductStore((state) => state.removeFavorite);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
  const resultsVisible = search.trim().length > 0;

  function toggleMenu(menu) {
    setActiveMenu((current) => (current === menu ? null : menu));
  }

  return (
    <header className="sticky top-0 z-50 border-b border-brand-border bg-brand-surface shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-4 px-4 py-5 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 text-2xl font-bold tracking-tight text-brand-ink transition-colors hover:text-brand-accent"
          aria-label="Medo-Tore home"
        >
          Medo<span className="text-brand-accent">-</span>Tore
        </Link>

        <div
          className={`order-3 relative w-full sm:order-none sm:block sm:max-w-md ${
            mobileSearchOpen ? "block" : "hidden"
          }`}
        >
          <form
            role="search"
            onSubmit={(event) => event.preventDefault()}
            className="flex w-full overflow-hidden rounded-full border border-brand-border bg-brand-surface-muted transition focus-within:border-brand-accent focus-within:ring-4 focus-within:ring-brand-focus"
          >
            <input
              type="search"
              name="q"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
              aria-controls="product-search-results"
              className="min-w-0 flex-1 bg-transparent px-5 py-3 text-sm text-brand-ink outline-none placeholder:text-brand-text-muted"
            />
            <button
              type="submit"
              aria-label="Search products"
              className="m-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-accent text-white transition-colors hover:bg-brand-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-focus"
            >
              <AiOutlineSearch aria-hidden="true" className="size-5" />
            </button>
          </form>
          {resultsVisible && (
            <div
              id="product-search-results"
              className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-2xl border border-brand-border bg-white shadow-lg"
            >
              <SearchResults
                query={search}
                products={data ?? []}
                isPending={isPending}
                isError={isError}
                error={error}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label={mobileSearchOpen ? "Close search" : "Open search"}
            aria-expanded={mobileSearchOpen}
            onClick={() => {
              setMobileSearchOpen((open) => !open);
              setSearch("");
            }}
            className="flex size-11 items-center justify-center rounded-full text-brand-text-secondary transition-colors hover:bg-brand-surface-muted hover:text-brand-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent sm:hidden"
          >
            <AiOutlineSearch aria-hidden="true" className="size-5" />
          </button>

          <div className="relative">
            <button
              type="button"
              aria-label={`Favorites${favorites.length ? `, ${favorites.length} saved` : ""}`}
              aria-expanded={activeMenu === "favorites"}
              aria-controls="favorites-menu"
              onClick={() => toggleMenu("favorites")}
              className="relative flex size-11 items-center justify-center rounded-full text-brand-text-secondary transition-colors hover:bg-brand-surface-muted hover:text-brand-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
            >
              <MdFavorite aria-hidden="true" className="size-5" />
              {favorites.length > 0 && (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-brand-accent text-xs font-semibold text-white">
                  {favorites.length}
                </span>
              )}
            </button>
            {activeMenu === "favorites" && (
              <section
                id="favorites-menu"
                aria-label="Favorite products"
                className="absolute right-0 top-full z-50 mt-3 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-brand-border bg-white shadow-lg"
              >
                <h2 className="border-b border-brand-border px-4 py-3 font-semibold text-brand-ink">
                  Favorites
                </h2>
                {!hasHydrated ? (
                  <p className="p-4 text-sm text-brand-text-secondary">Loading saved products...</p>
                ) : favorites.length === 0 ? (
                  <p className="p-4 text-sm text-brand-text-secondary">You have no favorite products yet.</p>
                ) : (
                  <ul className="max-h-80 divide-y divide-brand-border overflow-y-auto">
                    {favorites.map((product) => (
                      <li key={product.id} className="flex items-center gap-3 p-3">
                        <ProductImage product={product} />
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-1 text-sm font-medium text-brand-ink">
                            {product.title}
                          </p>
                          <p className="mt-1 text-sm text-brand-text-secondary">
                            {priceFormatter.format(product.price)}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            type="button"
                            disabled={!hasHydrated}
                            onClick={() => addToCart(product)}
                            className="rounded-full bg-brand-accent px-3 py-2 text-xs font-semibold text-white hover:bg-brand-accent-hover disabled:opacity-60"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            aria-label={`Remove ${product.title} from favorites`}
                            onClick={() => removeFavorite(product.id)}
                            className="flex size-9 items-center justify-center rounded-full text-red-700 hover:bg-red-50"
                          >
                            <MdHeartBroken aria-hidden="true" className="size-5" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              aria-label={`Shopping cart${cartCount ? `, ${cartCount} items` : ""}`}
              aria-expanded={activeMenu === "cart"}
              aria-controls="cart-menu"
              onClick={() => toggleMenu("cart")}
              className="relative flex size-11 items-center justify-center rounded-full text-brand-text-secondary transition-colors hover:bg-brand-surface-muted hover:text-brand-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
            >
              <BsFillCartFill aria-hidden="true" className="size-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-brand-accent text-xs font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </button>
            {activeMenu === "cart" && (
              <section
                id="cart-menu"
                aria-label="Shopping cart"
                className="absolute right-0 top-full z-50 mt-3 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-brand-border bg-white shadow-lg"
              >
                <h2 className="border-b border-brand-border px-4 py-3 font-semibold text-brand-ink">
                  Shopping cart
                </h2>
                {!hasHydrated ? (
                  <p className="p-4 text-sm text-brand-text-secondary">Loading saved products...</p>
                ) : cart.length === 0 ? (
                  <p className="p-4 text-sm text-brand-text-secondary">Your cart is empty.</p>
                ) : (
                  <>
                    <ul className="max-h-80 divide-y divide-brand-border overflow-y-auto">
                      {cart.map(({ product, quantity }) => (
                        <li key={product.id} className="flex items-center gap-3 p-3">
                          <ProductImage product={product} />
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-1 text-sm font-medium text-brand-ink">
                              {product.title}
                            </p>
                            <p className="mt-1 text-sm text-brand-text-secondary">
                              {quantity} × {priceFormatter.format(product.price)}
                            </p>
                          </div>
                          <button
                            type="button"
                            aria-label={`Remove ${product.title} from cart`}
                            onClick={() => removeFromCart(product.id)}
                            className="flex size-9 shrink-0 items-center justify-center rounded-full text-red-700 hover:bg-red-50"
                          >
                            <span aria-hidden="true" className="text-xl leading-none">×</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-brand-border p-4">
                      <p className="mb-3 flex justify-between font-semibold text-brand-ink">
                        <span>Total</span>
                        <span>{priceFormatter.format(cartTotal)}</span>
                      </p>
                      <Link
                        href="/checkout"
                        className="block w-full rounded-full bg-brand-accent px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-accent-hover"
                      >
                        Proceed to checkout
                      </Link>
                    </div>
                  </>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
