import SavedProducts from "@/components/componants/SavedProducts";
import Link from "next/link";

export default function CartPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-brand-ink">
        Your cart
      </h1>
      <SavedProducts mode="cart" />
      <div className="mt-8 flex justify-end">
        <Link
          href="/checkout"
          className="inline-flex rounded-full bg-brand-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-accent-hover"
        >
          Proceed to checkout
        </Link>
      </div>
    </main>
  );
}
