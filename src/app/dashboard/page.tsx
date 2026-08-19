import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.role === "vendor") {
    const { data: vendor } = await supabase
      .from("vendor_profiles")
      .select("id, business_name, profile_completion_score")
      .eq("user_id", user.id)
      .single();

    if (!vendor) {
      redirect("/dashboard/vendor/onboarding");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground">
              E
            </div>
            <span className="font-semibold">Event<span className="text-accent">Link</span></span>
          </Link>
          <form action="/auth/signout" method="post">
            <Button variant="outline" size="sm" type="submit">
              Sign out
            </Button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="text-3xl font-bold">
          Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}!
        </h1>
        <p className="mt-2 text-muted-foreground">
          You are signed in as a <span className="font-medium text-foreground capitalize">{profile?.role}</span>.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {profile?.role === "manager" && (
            <>
              <Link
                href="/explore"
                className="rounded-2xl border border-border bg-card p-6 transition hover:border-accent/50 hover:shadow-md"
              >
                <h3 className="font-semibold">Explore Vendors</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Find talent by city and category
                </p>
              </Link>
              <Link
                href="/dashboard/shortlist"
                className="rounded-2xl border border-border bg-card p-6 transition hover:border-accent/50 hover:shadow-md"
              >
                <h3 className="font-semibold">My Shortlist</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Saved vendors for your events
                </p>
              </Link>
            </>
          )}

          {profile?.role === "vendor" && (
            <>
              <Link
                href="/dashboard/vendor"
                className="rounded-2xl border border-border bg-card p-6 transition hover:border-accent/50 hover:shadow-md"
              >
                <h3 className="font-semibold">Vendor Dashboard</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Manage profile, media & inquiries
                </p>
              </Link>
              <Link
                href="/dashboard/vendor/edit"
                className="rounded-2xl border border-border bg-card p-6 transition hover:border-accent/50 hover:shadow-md"
              >
                <h3 className="font-semibold">Edit Profile</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Update your business details & packages
                </p>
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
