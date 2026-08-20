import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { MediaUploader } from "@/components/vendor/media-uploader";
import { Star, Eye, MessageSquare, Image as ImageIcon } from "lucide-react";

export default async function VendorDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: vendor } = await supabase
    .from("vendor_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!vendor) {
    redirect("/dashboard/vendor/onboarding");
  }

  const { data: media } = await supabase
    .from("media")
    .select("*")
    .eq("vendor_id", vendor.id)
    .order("sort_order", { ascending: true });

  const { data: inquiries } = await supabase
    .from("inquiries")
    .select("*")
    .eq("vendor_id", vendor.id)
    .order("created_at", { ascending: false })
    .limit(5);

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
            <Link href="/explore" className="text-sm text-muted-foreground hover:text-foreground">
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{vendor.business_name}</h1>
            <p className="mt-1 text-muted-foreground">
              {vendor.primary_city} · {vendor.categories?.slice(0, 3).join(", ")}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/${vendor.primary_city.toLowerCase().replace(/\s+/g, "-")}/${(vendor.categories?.[0] || "general").toLowerCase().replace(/\s+/g, "-").replace(/\//g, "-")}/${vendor.slug}`}>
              <Button variant="outline" size="sm">View Public Profile</Button>
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4" /> Profile Score
            </div>
            <p className="mt-2 text-3xl font-bold">{vendor.profile_completion_score}%</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" /> Views
            </div>
            <p className="mt-2 text-3xl font-bold">{vendor.view_count || 0}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageSquare className="h-4 w-4" /> Inquiries
            </div>
            <p className="mt-2 text-3xl font-bold">{inquiries?.length || 0}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ImageIcon className="h-4 w-4" /> Photos
            </div>
            <p className="mt-2 text-3xl font-bold">{media?.length || 0}</p>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="text-lg font-semibold">Portfolio</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload high-quality photos of your work. First image becomes the cover.
          </p>

          <div className="mt-6">
            <MediaUploader vendorId={vendor.id} />
          </div>

          {media && media.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {media.map((item) => (
                <div key={item.id} className="group relative aspect-square overflow-hidden rounded-xl border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.caption || ""}
                    className="h-full w-full object-cover"
                  />
                  {item.is_cover && (
                    <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                      Cover
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-12">
          <h2 className="text-lg font-semibold">Recent Inquiries</h2>
          {!inquiries || inquiries.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No inquiries yet. Share your public profile to start receiving leads.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm">{inq.message}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {inq.event_type && `${inq.event_type} · `}
                        {inq.city && `${inq.city} · `}
                        {new Date(inq.created_at).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium capitalize">
                      {inq.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
