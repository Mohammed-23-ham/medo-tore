import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-surface px-4 py-6 sm:px-6 lg:px-8">
      <section
        className="relative isolate mx-auto flex min-h-[460px] max-w-7xl items-center overflow-hidden rounded-3xl bg-cover bg-center bg-no-repeat px-6 py-16 shadow-xl sm:px-10 md:min-h-[560px] lg:px-16"
        style={{ backgroundImage: "url('/media/hero.webp')" }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/10"
        />
        <div className="relative z-10 max-w-xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
            Find something you love
          </p>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Welcome to Medo-Tore
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-white/85 sm:text-lg">
            Explore a world of the latest trends in fashion, beauty, electronics,
            and fine food.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-accent px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-brand-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Shop now
          </Link>
        </div>
      </section>
    </main>
  );
}
