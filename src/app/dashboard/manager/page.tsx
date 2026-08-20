import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { StartChatButton } from "@/components/chat/start-chat-button";
import {
  Building2,
  Briefcase,
  MapPin,
  Search,
  Heart,
  MessageSquare,
  CalendarCheck,
} from "lucide-react";

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

  if (!profile.full_name || !profile.company_name) {
    redirect("/dashboard/manager/setup");
  }

  const { data: inquiries } = await supabase
    .from("inquiries")
    .select(
      "*, vendor:vendor_profiles(id, business_name, primary_city, slug, categories)"
    )
    .eq("manager_id", user.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(10);

  const { count: shortlistCount } = await supabase
    .from("favorites")
    .select("*", { count: "exact", head: true })
    .eq("manager_id", user.id);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-3 sm:h-16 sm:px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground">
              E
            </div>
            <span className="font-semibold">
              Event<span className="text-accent">Link</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/dashboard/messages"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Messages
            </Link>
            <Link
              href="/dashboard/manager/bookings"
              className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline"
            >
              Bookings
            </Link>
            <Link
              href="/dashboard/manager/shortlist"
              className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline"
            >
              Shortlist
            </Link>
            <form action="/auth/signout" method="post">
              <Button variant="outline" size="sm" type="submit">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-3 py-8 sm:px-4 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
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
          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard/manager/bookings">
              <Button variant="outline" size="sm">
                <CalendarCheck className="h-4 w-4" />
                Bookings
              </Button>
            </Link>
            <Link href="/dashboard/messages">
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4" />
                Messages
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

        <section className="mt-10 sm:mt-12">
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
                  className="rounded-xl border border-border bg-card p-3.5 sm:p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
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
                    <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium capitalize">
                        {inq.status}
                      </span>
                      {inq.vendor?.id && (
                        <StartChatButton
                          vendorId={inq.vendor.id}
                          managerId={user.id}
                          inquiryId={inq.id}
                          label="Message"
                        />
                      )}
                    </div>
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
