import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";
import { Star, MapPin, Heart } from "lucide-react";
import { FavoriteButton } from "@/components/manager/favorite-button";

export default async function ShortlistPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "manager") {
    redirect("/dashboard");
  }

  const { data: favorites } = await supabase
    .from("favorites")
    .select(
      `
      vendor_id,
      created_at,
      vendor:vendor_profiles (
        id,
        business_name,
        slug,
        primary_city,
        categories,
        average_rating,
        review_count,
        packages,
        cover_image_url
      )
    `
    )
    .eq("manager_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground">
              E
            </div>
            <span className="font-semibold">
              Event<span className="text-accent">Link</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/manager"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link
              href="/explore"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Explore
            </Link>
            <form action="/auth/signout" method="post">
              <Button variant="outline" size="sm" type="submit">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-center gap-3">
          <Heart className="h-6 w-6 fill-red-500 text-red-500" />
          <h1 className="text-2xl font-bold tracking-tight">My Shortlist</h1>
        </div>
        <p className="mt-1 text-muted-foreground">
          Vendors you’ve saved for future events
        </p>

        {!favorites || favorites.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-border py-16 text-center">
            <Heart className="mx-auto h-10 w-10 text-muted-foreground/40" />
            <p className="mt-4 text-muted-foreground">Your shortlist is empty</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse vendors and tap the heart to save them here
            </p>
            <Link href="/explore" className="mt-6 inline-block">
              <Button>Explore Vendors</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((fav: any) => {
              const vendor = fav.vendor;
              if (!vendor) return null;

              const firstCategory = vendor.categories?.[0] || "general";
              const citySlug = (vendor.primary_city || "all-india")
                .toLowerCase()
                .replace(/\s+/g, "-");
              const categorySlug = firstCategory
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/\//g, "-");

              return (
                <div
                  key={vendor.id}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card transition hover:border-accent/50 hover:shadow-md"
                >
                  <Link href={`/${citySlug}/${categorySlug}/${vendor.slug}`}>
                    <div className="aspect-[16/10] bg-secondary/50 flex items-center justify-center">
                      {vendor.cover_image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={vendor.cover_image_url}
                          alt={vendor.business_name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl font-bold text-muted-foreground/30">
                          {vendor.business_name.charAt(0)}
                        </span>
                      )}
                    </div>
                  </Link>

                  <div className="absolute right-3 top-3">
                    <FavoriteButton vendorId={vendor.id} size="sm" />
                  </div>

                  <div className="p-4">
                    <Link href={`/${citySlug}/${categorySlug}/${vendor.slug}`}>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold group-hover:text-accent">
                          {vendor.business_name}
                        </h3>
                        {vendor.average_rating > 0 && (
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                            <span>{Number(vendor.average_rating).toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {vendor.primary_city}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {(vendor.categories || []).slice(0, 3).map((cat: string) => (
                          <span
                            key={cat}
                            className="rounded-full bg-secondary px-2 py-0.5 text-xs"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                      {vendor.packages?.[0] && (
                        <p className="mt-3 text-sm font-medium">
                          From {formatINR(vendor.packages[0].price_min)}
                        </p>
                      )}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
