import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground">E</div>
            <span className="font-semibold">Event<span className="text-accent">Link</span></span>
          </Link>
          <form action="/auth/signout" method="post">
            <Button variant="outline" size="sm" type="submit">Sign out</Button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Welcome back, {vendor.business_name}</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">Profile Completion</p>
            <p className="mt-1 text-3xl font-bold">{vendor.profile_completion_score}%</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">Profile Views</p>
            <p className="mt-1 text-3xl font-bold">{vendor.view_count || 0}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">Reviews</p>
            <p className="mt-1 text-3xl font-bold">{vendor.review_count || 0}</p>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Link href="/dashboard/vendor/edit">
            <Button>Edit Profile</Button>
          </Link>
          <Link href="/explore">
            <Button variant="outline">View Explore</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
