import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { BookingCard } from "@/components/booking/booking-card";
import { CalendarCheck } from "lucide-react";

export default async function ManagerBookingsPage() {
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

  if (!profile || profile.role !== "manager") redirect("/dashboard");

  const { data: bookings } = await supabase
    .from("bookings")
    .select(
      `
      *,
      vendor:vendor_profiles(id, business_name, primary_city)
    `
    )
    .eq("manager_id", user.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-3 sm:h-16 sm:px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground">
              E
            </div>
            <span className="font-semibold">
              Event<span className="text-accent">Link</span>
            </span>
          </Link>
          <Link href="/dashboard/manager">
            <Button variant="outline" size="sm">
              Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-3 py-8 sm:px-4 sm:py-10">
        <div className="flex items-center gap-3">
          <CalendarCheck className="h-6 w-6 text-accent" />
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">My Bookings</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Requests you sent to vendors
        </p>

        {!bookings || bookings.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border py-14 text-center">
            <CalendarCheck className="mx-auto h-10 w-10 text-muted-foreground/40" />
            <p className="mt-4 text-muted-foreground">No bookings yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Open a chat with a vendor and tap Request Booking
            </p>
            <Link href="/explore" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
              Explore vendors →
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-3 sm:mt-8">
            {bookings.map((b: any) => (
              <BookingCard key={b.id} booking={b} role="manager" />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
