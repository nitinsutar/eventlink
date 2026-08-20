import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MessageForm } from "@/components/chat/message-form";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ConversationPage({ params }: Props) {
  const { id } = await params;
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

  const { data: conversation } = await supabase
    .from("conversations")
    .select(
      `
      *,
      vendor:vendor_profiles(id, business_name, primary_city, user_id),
      manager:profiles(id, full_name, company_name)
    `
    )
    .eq("id", id)
    .single();

  if (!conversation) notFound();

  // Authz: must be participant
  const isManager = conversation.manager_id === user.id;
  const isVendor =
    profile.role === "vendor" &&
    conversation.vendor?.user_id === user.id;

  if (!isManager && !isVendor) {
    redirect("/dashboard/messages");
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true });

  // Mark messages from the other party as read
  await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("conversation_id", id)
    .neq("sender_id", user.id)
    .is("read_at", null);

  const title = isManager
    ? conversation.vendor?.business_name || "Vendor"
    : conversation.manager?.full_name ||
      conversation.manager?.company_name ||
      "Event Manager";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-3xl items-center gap-3 px-4">
          <Link
            href="/dashboard/messages"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="font-semibold">{title}</p>
            {isManager && conversation.vendor?.primary_city && (
              <p className="text-xs text-muted-foreground">
                {conversation.vendor.primary_city}
              </p>
            )}
            {!isManager && conversation.manager?.company_name && (
              <p className="text-xs text-muted-foreground">
                {conversation.manager.company_name}
              </p>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col">
        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-6">
          {!messages || messages.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-12">
              No messages yet. Say hello.
            </p>
          ) : (
            messages.map((msg) => {
              const mine = msg.sender_id === user.id;
              return (
                <div
                  key={msg.id}
                  className={cn("flex", mine ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                      mine
                        ? "bg-accent text-accent-foreground rounded-br-md"
                        : "bg-secondary text-foreground rounded-bl-md"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{msg.body}</p>
                    <p
                      className={cn(
                        "mt-1 text-[10px]",
                        mine ? "text-accent-foreground/70" : "text-muted-foreground"
                      )}
                    >
                      {new Date(msg.created_at).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <MessageForm conversationId={id} senderId={user.id} />
      </main>
    </div>
  );
}
