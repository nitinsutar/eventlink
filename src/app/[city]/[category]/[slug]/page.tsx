import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatINR } from "@/lib/utils";
import { Star, MapPin, Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  // Increment view count
  supabase
    .from("vendor_profiles")
    .update({ view_count: (vendor.view_count || 0) + 1 })
    .eq("id", vendor.id)
    .then(() => {});

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/explore" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Explore
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground">E</div>
            <span className="font-semibold">Event<span className="text-accent">Link</span></span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="overflow-hidden rounded-3xl border border-border bg-card">
          <div className="aspect-[21/9] bg-secondary/40 flex items-center justify-center">
            <span className="text-6xl font-bold text-muted-foreground/20">{vendor.business_name.charAt(0)}</span>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{vendor.business_name}</h1>
                  {vendor.verification_status !== "unverified" && <Shield className="h-5 w-5 text-accent" />}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{vendor.primary_city}</span>
                  {vendor.average_rating > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      {Number(vendor.average_rating).toFixed(1)} ({vendor.review_count} reviews)
                    </span>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(vendor.categories || []).map((cat: string) => (
                    <span key={cat} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">{cat}</span>
                  ))}
                </div>
              </div>
              <Button size="lg" className="shrink-0">Send Inquiry</Button>
            </div>

            {vendor.bio && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold">About</h2>
                <p className="mt-2 text-muted-foreground whitespace-pre-line">{vendor.bio}</p>
              </div>
            )}

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
          </div>
        </div>
      </main>
    </div>
  );
}
