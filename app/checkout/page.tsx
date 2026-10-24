import CheckoutForm from "@/components/componants/CheckoutForm";

export default function CheckoutPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-accent">
          Training demo
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-brand-ink">
          Checkout
        </h1>
        <p className="mt-2 max-w-2xl text-brand-text-secondary">
          Review your cart and practice completing the checkout form. This page
          does not process real orders or payments.
        </p>
      </div>
      <CheckoutForm />
    </main>
  );
}
