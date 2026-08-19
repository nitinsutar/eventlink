import Link from "next/link";
import { Search, Star, MapPin, Shield, ArrowRight, Sparkles } from "lucide-react";
import { CITIES, CATEGORIES } from "@/types/database";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground font-bold text-lg">
              E
            </div>
            <span className="text-xl font-semibold tracking-tight">
              Event<span className="text-accent">Link</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/explore" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
              Explore
            </Link>
            <Link href="/for-vendors" className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
              For Vendors
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden text-sm font-medium text-muted-foreground transition hover:text-foreground sm:block">
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-background to-background" />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
              <Sparkles className="h-4 w-4" />
              India's Event Marketplace
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Find the perfect{" "}
              <span className="text-accent">vendors & artists</span> for every event
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              From sound & lights to photo/video, anchors, decor and full production teams.
              Trusted by event managers across India.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <div className="relative flex-1 max-w-md">
                <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <select
                  className="h-12 w-full appearance-none rounded-xl border border-border bg-card pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select city
                  </option>
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <select
                  className="h-12 w-full appearance-none rounded-xl border border-border bg-card pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Category
                  </option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <Link
                href="/explore"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-8 text-sm font-semibold text-accent-foreground transition hover:bg-accent/90"
              >
                Find Talent
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-border bg-card/50">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-8 px-4 py-6 text-sm text-muted-foreground sm:gap-12">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-accent" />
            <span>Verified reviews</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-accent" />
            <span>Top-rated vendors</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-accent" />
            <span>10+ major cities</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Browse by category</h2>
          <p className="mt-2 text-muted-foreground">
            Everything you need for weddings, corporate & live events
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/explore?category=${encodeURIComponent(cat)}`}
              className="group flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-5 text-center transition hover:border-accent/50 hover:shadow-md"
            >
              <span className="text-sm font-medium group-hover:text-accent">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12 sm:py-16">
          <h2 className="text-2xl font-bold sm:text-3xl">Are you a vendor or artist?</h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
            Create your free profile, showcase your work, and get discovered by event managers across India.
          </p>
          <Link
            href="/signup?role=vendor"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold text-accent-foreground transition hover:bg-accent/90"
          >
            Join as Vendor
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground">
                E
              </div>
              <span className="font-semibold">
                Event<span className="text-accent">Link</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} EventLink. Built for the Indian event industry.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
