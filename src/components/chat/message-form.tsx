"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Send, Paperclip, X, FileText } from "lucide-react";

interface MessageFormProps {
  conversationId: string;
  senderId: string;
}

export function MessageForm({ conversationId, senderId }: MessageFormProps) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() && !file) return;

    setLoading(true);
    const supabase = createClient();

    let attachmentUrl: string | null = null;
    let attachmentFilename: string | null = null;
    let attachmentType: string | null = null;

    if (file) {
      const ext = file.name.split(".").pop();
      const path = `chat/${senderId}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        setLoading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("portfolio").getPublicUrl(path);

      attachmentUrl = publicUrl;
      attachmentFilename = file.name;
      attachmentType = file.type.startsWith("image/") ? "image" : "document";
    }

    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: senderId,
      body: body.trim() || (attachmentFilename ? `Shared: ${attachmentFilename}` : ""),
      attachment_url: attachmentUrl,
      attachment_filename: attachmentFilename,
      attachment_type: attachmentType,
    });

    if (!error) {
      await supabase
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversationId);

      setBody("");
      setFile(null);
      router.refresh();
    }

    setLoading(false);
  };

  return (
    <div className="border-t border-border bg-background safe-area-bottom">
      {file && (
        <div className="flex items-center gap-2 px-3 pt-3 sm:px-4">
          <div className="flex flex-1 items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2 text-sm min-w-0">
            <FileText className="h-4 w-4 text-accent shrink-0" />
            <span className="truncate">{file.name}</span>
          </div>
          <button
            type="button"
            onClick={() => setFile(null)}
            className="rounded-full p-1.5 hover:bg-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2 p-3 sm:p-4">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          aria-label="Attach file"
        >
          <Paperclip className="h-5 w-5" />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.xls,.xlsx"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setFile(f);
          }}
        />

        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Type a message..."
          className="min-h-11 flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          disabled={loading}
        />

        <Button
          type="submit"
          disabled={loading || (!body.trim() && !file)}
          size="icon"
          className="h-11 w-11 shrink-0 rounded-xl"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
