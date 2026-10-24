import Link from "next/link";

const shopLinks = [
  { href: "/shop", label: "Shop products" },
  { href: "/favorites", label: "Your favorites" },
  { href: "/cart", label: "Your cart" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-brand-border bg-brand-surface text-brand-ink">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8 lg:py-16">
        <div>
          <Link
            href="/"
            aria-label="Medo-Tore home"
            className="inline-block text-2xl font-bold tracking-tight text-brand-ink transition-colors hover:text-brand-accent"
          >
            Medo<span className="text-brand-accent">-</span>Tore
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-brand-text-secondary">
            Find something you love. Explore everyday essentials and new
            favorites, all in one place.
          </p>
        </div>

        <nav aria-label="Footer shop links">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-ink">
            Explore
          </h2>
          <ul className="mt-4 space-y-3">
            {shopLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-brand-text-secondary transition-colors hover:text-brand-accent"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-ink">
            Need help?
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-6 text-brand-text-secondary">
            Browse our products or review the items you have saved in your cart.
          </p>
          <Link
            href="/shop"
            className="mt-4 inline-flex text-sm font-semibold text-brand-accent transition-colors hover:text-brand-accent-hover"
          >
            Start shopping
            <span aria-hidden="true" className="ml-2">
              →
            </span>
          </Link>
        </div>
      </div>

      <div className="border-t border-brand-border bg-brand-surface-muted">
        <p className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-brand-text-muted sm:px-6 sm:text-left lg:px-8">
          © {new Date().getFullYear()} Medo-Tore. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
