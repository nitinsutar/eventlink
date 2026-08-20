import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Building2, Briefcase, MapPin, Search, Heart } from "lucide-react";

export default async function ManagerDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "manager") {
    redirect("/dashboard");
  }

  // If profile is incomplete, send to setup
  if (!profile.full_name || !profile.company_name) {
    redirect("/dashboard/manager/setup");
  }

  const { data: inquiries } = await supabase
    .from("inquiries")
    .select("*, vendor:vendor_profiles(business_name, primary_city, slug, categories)")
    .eq("manager_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const { count: shortlistCount } = await supabase
    .from("favorites")
    .select("*", { count: "exact", head: true })
    .eq("manager_id", user.id);

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
              href="/dashboard/manager/shortlist"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Shortlist
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {profile.full_name}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {profile.designation && (
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  {profile.designation}
                </span>
              )}
              {profile.company_name && (
                <span className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" />
                  {profile.company_name}
                </span>
              )}
              {profile.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {profile.city}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/manager/setup">
              <Button variant="outline" size="sm">
                Edit Profile
              </Button>
            </Link>
            <Link href="/dashboard/manager/shortlist">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4" />
                Shortlist ({shortlistCount || 0})
              </Button>
            </Link>
            <Link href="/explore">
              <Button size="sm">
                <Search className="h-4 w-4" />
                Find Vendors
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Inquiries */}
        <section className="mt-12">
          <h2 className="text-lg font-semibold">Your Inquiries</h2>
          {!inquiries || inquiries.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-border py-12 text-center">
              <p className="text-muted-foreground">No inquiries sent yet</p>
              <Link
                href="/explore"
                className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
              >
                Browse vendors →
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {inquiries.map((inq: any) => (
                <div
                  key={inq.id}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">
                        {inq.vendor?.business_name || "Vendor"}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {inq.message}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {inq.event_type && `${inq.event_type} · `}
                        {inq.city && `${inq.city} · `}
                        {new Date(inq.created_at).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium capitalize shrink-0">
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
