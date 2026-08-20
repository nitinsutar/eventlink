import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!vendor) {
      redirect("/dashboard/vendor/onboarding");
    }
    redirect("/dashboard/vendor");
  }

  if (profile?.role === "manager") {
    if (!profile.full_name || !profile.company_name) {
      redirect("/dashboard/manager/setup");
    }
    redirect("/dashboard/manager");
  }

  // Fallback
  redirect("/explore");
}
