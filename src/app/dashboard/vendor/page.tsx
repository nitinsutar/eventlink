import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { MediaUploader } from "@/components/vendor/media-uploader";
import { MediaItem } from "@/components/vendor/media-item";
import { StartChatButton } from "@/components/chat/start-chat-button";
import {
  Star,
  Eye,
  MessageSquare,
  Image as ImageIcon,
  CalendarCheck,
} from "lucide-react";

export default async function VendorDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: vendor } = await supabase
    .from("vendor_profiles")
    .select("*")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .single();

  if (!vendor) {
    redirect("/dashboard/vendor/onboarding");
  }

  const { data: media } = await supabase
    .from("media")
    .select("*")
    .eq("vendor_id", vendor.id)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  const { data: inquiries } = await supabase
    .from("inquiries")
    .select("*")
    .eq("vendor_id", vendor.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(10);

  const { count: bookingCount } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("vendor_id", vendor.id)
    .eq("status", "requested")
    .is("deleted_at", null);

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
              href="/dashboard/vendor/bookings"
              className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline"
            >
              Bookings
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
              {vendor.business_name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              {vendor.primary_city} · {vendor.categories?.slice(0, 3).join(", ")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard/vendor/bookings">
              <Button variant="outline" size="sm">
                <CalendarCheck className="h-4 w-4" />
                Bookings{bookingCount ? ` (${bookingCount})` : ""}
              </Button>
            </Link>
            <Link href="/dashboard/messages">
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4" />
                Messages
              </Button>
            </Link>
            <Link href="/dashboard/vendor/edit">
              <Button size="sm">Edit Profile</Button>
            </Link>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
              <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Score
            </div>
            <p className="mt-1.5 text-2xl font-bold sm:mt-2 sm:text-3xl">
              {vendor.profile_completion_score}%
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
              <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Views
            </div>
            <p className="mt-1.5 text-2xl font-bold sm:mt-2 sm:text-3xl">
              {vendor.view_count || 0}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
              <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Inquiries
            </div>
            <p className="mt-1.5 text-2xl font-bold sm:mt-2 sm:text-3xl">
              {inquiries?.length || 0}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
              <ImageIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Photos
            </div>
            <p className="mt-1.5 text-2xl font-bold sm:mt-2 sm:text-3xl">
              {media?.length || 0}
            </p>
          </div>
        </div>

        <section className="mt-10 sm:mt-12">
          <h2 className="text-lg font-semibold">Portfolio</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            First image becomes the cover. Tap trash to remove (recoverable).
          </p>
          <div className="mt-4 sm:mt-6">
            <MediaUploader vendorId={vendor.id} />
          </div>
          {media && media.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-8 sm:grid-cols-3 sm:gap-3 md:grid-cols-4">
              {media.map((item) => (
                <MediaItem
                  key={item.id}
                  id={item.id}
                  url={item.url}
                  caption={item.caption}
                  isCover={item.is_cover}
                  vendorId={vendor.id}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-10 sm:mt-12">
          <h2 className="text-lg font-semibold">Recent Inquiries</h2>
          {!inquiries || inquiries.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-border py-10 text-center">
              <p className="text-sm text-muted-foreground">
                No inquiries yet. Share your public profile to get leads.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="rounded-xl border border-border bg-card p-3.5 sm:p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium">
                          {inq.contact_name || "Event Manager"}
                        </p>
                        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium capitalize sm:hidden">
                          {inq.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {inq.message}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {inq.contact_phone && `${inq.contact_phone} · `}
                        {inq.event_type && `${inq.event_type} · `}
                        {inq.city && `${inq.city} · `}
                        {new Date(inq.created_at).toLocaleDateString("en-IN")}
                      </p>
                      {inq.design_url && (
                        <a
                          href={inq.design_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block text-xs font-medium text-accent hover:underline"
                        >
                          View design →
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                      <span className="hidden rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium capitalize sm:inline">
                        {inq.status}
                      </span>
                      <StartChatButton
                        vendorId={vendor.id}
                        managerId={inq.manager_id}
                        inquiryId={inq.id}
                        initialMessage={inq.message}
                        label="Reply"
                        className="w-full sm:w-auto"
                      />
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
