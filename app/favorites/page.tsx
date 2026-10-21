import SavedProducts from "@/components/componants/SavedProducts";

export default function FavoritesPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-brand-ink">
        Your favorites
      </h1>
      <SavedProducts mode="favorites" />
    </main>
  );
}
