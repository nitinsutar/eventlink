import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatINR } from "@/lib/utils";
import { Star, MapPin, Shield, ArrowLeft } from "lucide-react";
import { InquiryForm } from "@/components/vendor/inquiry-form";
import { ReviewForm } from "@/components/vendor/review-form";
import { ReviewsList } from "@/components/vendor/reviews-list";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ city: string; category: string; slug: string }>;
}

export default async function VendorPublicProfilePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: vendor } = await supabase
    .from("vendor_profiles")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!vendor) {
    notFound();
  }

  const { data: media } = await supabase
    .from("media")
    .select("*")
    .eq("vendor_id", vendor.id)
    .order("sort_order", { ascending: true });

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, manager:profiles(full_name)")
    .eq("vendor_id", vendor.id)
    .order("created_at", { ascending: false });

  // Increment view count (non-blocking)
  supabase
    .from("vendor_profiles")
    .update({ view_count: (vendor.view_count || 0) + 1 })
    .eq("id", vendor.id)
    .then(() => {});

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link
            href="/explore"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Explore
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground">
              E
            </div>
            <span className="font-semibold">
              Event<span className="text-accent">Link</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="overflow-hidden rounded-3xl border border-border bg-card">
          {/* Cover */}
          <div className="aspect-[21/9] bg-secondary/40">
            {vendor.cover_image_url || (media && media[0]) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={vendor.cover_image_url || media![0].url}
                alt={vendor.business_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-6xl font-bold text-muted-foreground/20">
                  {vendor.business_name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {vendor.business_name}
                  </h1>
                  {vendor.verification_status !== "unverified" && (
                    <Shield className="h-5 w-5 text-accent" />
                  )}
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {vendor.primary_city}
                  </span>
                  {vendor.average_rating > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      {Number(vendor.average_rating).toFixed(1)} ({vendor.review_count} reviews)
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {(vendor.categories || []).map((cat: string) => (
                    <span
                      key={cat}
                      className="rounded-full bg-secondary px-3 py-1 text-xs font-medium"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="w-full space-y-4 lg:w-80">
                <InquiryForm
                  vendorId={vendor.id}
                  vendorName={vendor.business_name}
                  vendorCategories={vendor.categories || []}
                />
              </div>
            </div>

            {/* About */}
            {vendor.bio && (
              <div className="mt-10">
                <h2 className="text-lg font-semibold">About</h2>
                <p className="mt-2 whitespace-pre-line text-muted-foreground">
                  {vendor.bio}
                </p>
              </div>
            )}

            {/* Stats */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {vendor.years_experience && (
                <div className="rounded-xl bg-secondary/50 p-4 text-center">
                  <p className="text-2xl font-bold">{vendor.years_experience}+</p>
                  <p className="text-xs text-muted-foreground">Years Exp.</p>
                </div>
              )}
              {vendor.team_size && (
                <div className="rounded-xl bg-secondary/50 p-4 text-center">
                  <p className="text-2xl font-bold">{vendor.team_size}</p>
                  <p className="text-xs text-muted-foreground">Team Size</p>
                </div>
              )}
              <div className="rounded-xl bg-secondary/50 p-4 text-center">
                <p className="text-2xl font-bold">{vendor.view_count || 0}</p>
                <p className="text-xs text-muted-foreground">Profile Views</p>
              </div>
              <div className="rounded-xl bg-secondary/50 p-4 text-center">
                <p className="text-2xl font-bold">{vendor.profile_completion_score}%</p>
                <p className="text-xs text-muted-foreground">Profile Score</p>
              </div>
            </div>

            {/* Portfolio Gallery */}
            {media && media.length > 0 && (
              <div className="mt-10">
                <h2 className="text-lg font-semibold">Portfolio</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {media.map((item) => (
                    <div
                      key={item.id}
                      className="aspect-square overflow-hidden rounded-xl border border-border"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.url}
                        alt={item.caption || vendor.business_name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Packages */}
            {vendor.packages && vendor.packages.length > 0 && (
              <div className="mt-10">
                <h2 className="text-lg font-semibold">Packages</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {vendor.packages.map((pkg: any, i: number) => (
                    <div key={i} className="rounded-2xl border border-border p-5">
                      <h3 className="font-semibold">{pkg.title}</h3>
                      <p className="mt-2 text-xl font-bold text-accent">
                        {formatINR(pkg.price_min)}
                        {pkg.price_max ? ` – ${formatINR(pkg.price_max)}` : "+"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="mt-10">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold">Reviews</h2>
                <ReviewForm vendorId={vendor.id} vendorName={vendor.business_name} />
              </div>
              <div className="mt-6">
                <ReviewsList
                  reviews={reviews || []}
                  averageRating={vendor.average_rating}
                  reviewCount={vendor.review_count}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
