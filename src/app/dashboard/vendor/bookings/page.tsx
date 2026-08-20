import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { BookingCard } from "@/components/booking/booking-card";
import { CalendarCheck } from "lucide-react";

export default async function VendorBookingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: vendor } = await supabase
    .from("vendor_profiles")
    .select("id, business_name")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .single();

  if (!vendor) redirect("/dashboard/vendor/onboarding");

  const { data: bookings } = await supabase
    .from("bookings")
    .select(
      `
      *,
      manager:profiles(id, full_name, company_name)
    `
    )
    .eq("vendor_id", vendor.id)
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
          <Link href="/dashboard/vendor">
            <Button variant="outline" size="sm">
              Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-3 py-8 sm:px-4 sm:py-10">
        <div className="flex items-center gap-3">
          <CalendarCheck className="h-6 w-6 text-accent" />
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Bookings</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Requests from event managers
        </p>

        {!bookings || bookings.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border py-14 text-center">
            <CalendarCheck className="mx-auto h-10 w-10 text-muted-foreground/40" />
            <p className="mt-4 text-muted-foreground">No booking requests yet</p>
          </div>
        ) : (
          <div className="mt-6 space-y-3 sm:mt-8">
            {bookings.map((b: any) => (
              <BookingCard
                key={b.id}
                booking={b}
                role="vendor"
                vendorUserId={user.id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
