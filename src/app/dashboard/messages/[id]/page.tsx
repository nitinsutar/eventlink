import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MessageForm } from "@/components/chat/message-form";
import { ChatBookingPanel } from "@/components/chat/chat-booking-panel";
import { ArrowLeft, FileText } from "lucide-react";
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
    .is("deleted_at", null)
    .single();

  if (!conversation) notFound();

  const isManager = conversation.manager_id === user.id;
  const isVendor =
    profile.role === "vendor" && conversation.vendor?.user_id === user.id;

  if (!isManager && !isVendor) {
    redirect("/dashboard/messages");
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", id)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("conversation_id", id)
    .neq("sender_id", user.id)
    .is("read_at", null)
    .is("deleted_at", null);

  const title = isManager
    ? conversation.vendor?.business_name || "Vendor"
    : conversation.manager?.full_name ||
      conversation.manager?.company_name ||
      "Event Manager";

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      <header className="shrink-0 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-3 px-3 sm:h-16 sm:px-4">
          <Link
            href="/dashboard/messages"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{title}</p>
            {isManager && conversation.vendor?.primary_city && (
              <p className="truncate text-xs text-muted-foreground">
                {conversation.vendor.primary_city}
              </p>
            )}
            {!isManager && conversation.manager?.company_name && (
              <p className="truncate text-xs text-muted-foreground">
                {conversation.manager.company_name}
              </p>
            )}
          </div>
        </div>
      </header>

      {conversation.vendor && (
        <ChatBookingPanel
          vendorId={conversation.vendor.id}
          vendorName={conversation.vendor.business_name || "Vendor"}
          managerId={conversation.manager_id}
          conversationId={id}
          isManager={isManager}
        />
      )}

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col min-h-0">
        <div className="flex-1 space-y-2 overflow-y-auto px-3 py-4 sm:space-y-3 sm:px-4 sm:py-6">
          {!messages || messages.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
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
                      "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm sm:max-w-[75%]",
                      mine
                        ? "rounded-br-md bg-accent text-accent-foreground"
                        : "rounded-bl-md bg-secondary text-foreground"
                    )}
                  >
                    {msg.body && (
                      <p className="whitespace-pre-wrap break-words">{msg.body}</p>
                    )}
                    {msg.attachment_url && (
                      <a
                        href={msg.attachment_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "mt-2 flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium",
                          mine
                            ? "bg-black/10 hover:bg-black/15"
                            : "bg-background/80 hover:bg-background"
                        )}
                      >
                        <FileText className="h-4 w-4 shrink-0" />
                        <span className="truncate">
                          {msg.attachment_filename || "Attachment"}
                        </span>
                      </a>
                    )}
                    <p
                      className={cn(
                        "mt-1 text-[10px]",
                        mine
                          ? "text-accent-foreground/70"
                          : "text-muted-foreground"
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

        <div className="shrink-0">
          <MessageForm conversationId={id} senderId={user.id} />
        </div>
      </main>
    </div>
  );
}
