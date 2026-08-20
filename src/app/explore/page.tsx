import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CITIES, CATEGORIES } from "@/types/database";
import { formatINR } from "@/lib/utils";
import { Star, MapPin, Search } from "lucide-react";

export const dynamic = "force-dynamic";

interface SearchParams {
  city?: string;
  category?: string;
  q?: string;
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const city = params.city || "";
  const category = params.category || "";
  const q = params.q || "";

  const supabase = await createClient();

  let query = supabase
    .from("vendor_profiles")
    .select("*")
    .eq("is_active", true)
    .order("average_rating", { ascending: false });

  if (city && city !== "All India") {
    query = query.or(`primary_city.eq.${city},serviceable_cities.cs.{${city}}`);
  }

  if (category) {
    query = query.contains("categories", [category]);
  }

  if (q) {
    query = query.or(`business_name.ilike.%${q}%,bio.ilike.%${q}%`);
  }

  const { data: vendors } = await query.limit(24);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground">E</div>
            <span className="font-semibold">Event<span className="text-accent">Link</span></span>
          </Link>
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">Log in</Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Explore Vendors</h1>
        <p className="mt-1 text-muted-foreground">Find the perfect talent for your next event</p>

        <form className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input name="q" defaultValue={q} placeholder="Search by name or keyword..." className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm" />
          </div>
          <select name="city" defaultValue={city} className="h-11 rounded-xl border border-border bg-card px-4 text-sm">
            <option value="">All Cities</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select name="category" defaultValue={category} className="h-11 rounded-xl border border-border bg-card px-4 text-sm">
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button type="submit" className="h-11 rounded-xl bg-accent px-6 text-sm font-semibold text-accent-foreground">Search</button>
        </form>

        <div className="mt-10">
          {!vendors || vendors.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border py-20 text-center">
              <p className="text-muted-foreground">No vendors found. Try different filters or be the first to create a profile.</p>
              <Link href="/signup?role=vendor" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">Join as a Vendor →</Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {vendors.map((vendor) => {
                const firstCategory = vendor.categories?.[0] || "general";
                const citySlug = (vendor.primary_city || "all-india").toLowerCase().replace(/\s+/g, "-");
                const categorySlug = firstCategory.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "-");

                return (
                  <Link key={vendor.id} href={`/${citySlug}/${categorySlug}/${vendor.slug}`} className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:border-accent/50 hover:shadow-md">
                    <div className="aspect-[16/10] bg-secondary/50 flex items-center justify-center">
                      <span className="text-4xl font-bold text-muted-foreground/30">{vendor.business_name.charAt(0)}</span>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold group-hover:text-accent">{vendor.business_name}</h3>
                        {vendor.average_rating > 0 && (
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                            <span>{Number(vendor.average_rating).toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" /> {vendor.primary_city}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {(vendor.categories || []).slice(0, 3).map((cat: string) => (
                          <span key={cat} className="rounded-full bg-secondary px-2 py-0.5 text-xs">{cat}</span>
                        ))}
                      </div>
                      {vendor.packages?.[0] && (
                        <p className="mt-3 text-sm font-medium">From {formatINR(vendor.packages[0].price_min)}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
