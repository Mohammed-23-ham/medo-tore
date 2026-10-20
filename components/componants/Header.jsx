import Link from "next/link";
import { AiOutlineSearch } from "react-icons/ai";
import { BsFillCartFill } from "react-icons/bs";
import { MdFavorite } from "react-icons/md";

export default function Header() {
  return (
    <header className="border-b border-brand-border bg-brand-surface">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-4 px-4 py-5 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 text-2xl font-bold tracking-tight text-brand-ink transition-colors hover:text-brand-accent"
          aria-label="Medo-Tore home"
        >
          Medo<span className="text-brand-accent">-</span>Tore
        </Link>

        <form
          role="search"
          className="order-3 flex w-full overflow-hidden rounded-full border border-brand-border bg-brand-surface-muted transition focus-within:border-brand-accent focus-within:ring-4 focus-within:ring-brand-focus sm:order-none sm:max-w-md"
        >
          <input
            type="search"
            name="q"
            placeholder="Search products..."
            aria-label="Search products"
            className="min-w-0 flex-1 bg-transparent px-5 py-3 text-sm text-brand-ink outline-none placeholder:text-brand-text-muted"
          />
          <button
            type="submit"
            aria-label="Submit search"
            className="m-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-accent text-white transition-colors hover:bg-brand-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-focus"
          >
            <AiOutlineSearch aria-hidden="true" className="size-5" />
          </button>
        </form>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="Favorites"
            className="flex size-11 items-center justify-center rounded-full text-brand-text-secondary transition-colors hover:bg-brand-surface-muted hover:text-brand-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
          >
            <MdFavorite aria-hidden="true" className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Shopping cart"
            className="flex size-11 items-center justify-center rounded-full text-brand-text-secondary transition-colors hover:bg-brand-surface-muted hover:text-brand-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
          >
            <BsFillCartFill aria-hidden="true" className="size-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
