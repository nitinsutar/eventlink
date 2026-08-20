import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export default async function MessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  // Get vendor profile id if vendor
  let vendorProfileId: string | null = null;
  if (profile.role === "vendor") {
    const { data: vendor } = await supabase
      .from("vendor_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();
    vendorProfileId = vendor?.id || null;
  }

  let conversations: any[] = [];

  if (profile.role === "manager") {
    const { data } = await supabase
      .from("conversations")
      .select(
        `
        *,
        vendor:vendor_profiles(id, business_name, primary_city, cover_image_url)
      `
      )
      .eq("manager_id", user.id)
      .order("last_message_at", { ascending: false });
    conversations = data || [];
  } else if (vendorProfileId) {
    const { data } = await supabase
      .from("conversations")
      .select(
        `
        *,
        manager:profiles(id, full_name, company_name)
      `
      )
      .eq("vendor_id", vendorProfileId)
      .order("last_message_at", { ascending: false });
    conversations = data || [];
  }

  // Fetch last message for each conversation
  const withLastMessage = await Promise.all(
    conversations.map(async (c) => {
      const { data: lastMsg } = await supabase
        .from("messages")
        .select("body, created_at, sender_id")
        .eq("conversation_id", c.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return { ...c, lastMessage: lastMsg };
    })
  );

  const backHref =
    profile.role === "vendor" ? "/dashboard/vendor" : "/dashboard/manager";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground">
              E
            </div>
            <span className="font-semibold">
              Event<span className="text-accent">Link</span>
            </span>
          </Link>
          <Link href={backHref}>
            <Button variant="outline" size="sm">
              Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-6 w-6 text-accent" />
          <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
        </div>
        <p className="mt-1 text-muted-foreground">
          Conversations with {profile.role === "vendor" ? "event managers" : "vendors"}
        </p>

        {withLastMessage.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-border py-16 text-center">
            <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground/40" />
            <p className="mt-4 text-muted-foreground">No conversations yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {profile.role === "manager"
                ? "Send an inquiry, then message the vendor from your dashboard"
                : "When managers send inquiries, you can reply here"}
            </p>
          </div>
        ) : (
          <div className="mt-8 divide-y divide-border rounded-2xl border border-border overflow-hidden">
            {withLastMessage.map((c) => {
              const title =
                profile.role === "manager"
                  ? c.vendor?.business_name || "Vendor"
                  : c.manager?.full_name ||
                    c.manager?.company_name ||
                    "Event Manager";
              const subtitle =
                profile.role === "manager"
                  ? c.vendor?.primary_city
                  : c.manager?.company_name;

              return (
                <Link
                  key={c.id}
                  href={`/dashboard/messages/${c.id}`}
                  className="flex items-start gap-4 bg-card p-4 transition hover:bg-secondary/40"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-bold text-accent">
                    {title.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium truncate">{title}</p>
                      {c.lastMessage && (
                        <span className="text-xs text-muted-foreground shrink-0">
                          {new Date(c.lastMessage.created_at).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "short" }
                          )}
                        </span>
                      )}
                    </div>
                    {subtitle && (
                      <p className="text-xs text-muted-foreground">{subtitle}</p>
                    )}
                    {c.lastMessage && (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                        {c.lastMessage.body}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
