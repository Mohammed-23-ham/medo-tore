import ProductCatalog from "@/components/componants/ProductCatalog";

export default function ShopPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-brand-ink">
          Shop products
        </h1>
        <p className="mt-2 text-brand-text-secondary">
          Find your next favorite and add it to your cart or favorites.
        </p>
      </div>
      <ProductCatalog />
    </main>
  );
}
