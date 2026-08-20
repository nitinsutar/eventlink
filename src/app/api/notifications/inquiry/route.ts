import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendInquiryNotification } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      vendorId,
      managerName,
      message,
      eventType,
      city,
      contactPhone,
      contactEmail,
    } = body;

    if (!vendorId || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get vendor profile + owner email
    const { data: vendor } = await supabaseAdmin
      .from("vendor_profiles")
      .select("business_name, user_id")
      .eq("id", vendorId)
      .single();

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(
      vendor.user_id
    );

    const to = authUser?.user?.email;
    if (!to) {
      return NextResponse.json({ error: "Vendor email not found" }, { status: 404 });
    }

    await sendInquiryNotification({
      to,
      vendorName: vendor.business_name,
      managerName: managerName || "Event Manager",
      message,
      eventType,
      city,
      contactPhone,
      contactEmail,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Inquiry notification error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to send notification" },
      { status: 500 }
    );
  }
}
