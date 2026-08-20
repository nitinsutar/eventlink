"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaUploaderProps {
  vendorId: string;
  onUploadComplete?: () => void;
}

export function MediaUploader({ vendorId, onUploadComplete }: MediaUploaderProps) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newPreviews = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, 8)
      .map((file) => ({ file, url: URL.createObjectURL(file) }));
    setPreviews((prev) => [...prev, ...newPreviews].slice(0, 12));
  };

  const removePreview = (index: number) => {
    setPreviews((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[index].url);
      next.splice(index, 1);
      return next;
    });
  };

  const handleUpload = async () => {
    if (previews.length === 0) return;
    setUploading(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Not authenticated");
      setUploading(false);
      return;
    }

    try {
      // Check if vendor already has a cover
      const { data: existingCover } = await supabase
        .from("media")
        .select("id")
        .eq("vendor_id", vendorId)
        .eq("is_cover", true)
        .maybeSingle();

      let firstUploadedUrl: string | null = null;

      for (let i = 0; i < previews.length; i++) {
        const { file } = previews[i];
        const ext = file.name.split(".").pop();
        const path = `${user.id}/${Date.now()}-${i}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("portfolio")
          .upload(path, file, { cacheControl: "3600", upsert: false });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("portfolio").getPublicUrl(path);

        const isCover = !existingCover && i === 0;

        await supabase.from("media").insert({
          vendor_id: vendorId,
          type: "image",
          url: publicUrl,
          sort_order: i,
          is_cover: isCover,
        });

        if (isCover) {
          firstUploadedUrl = publicUrl;
        }
      }

      // Set cover_image_url on vendor profile so Explore cards show it
      if (firstUploadedUrl) {
        await supabase
          .from("vendor_profiles")
          .update({
            cover_image_url: firstUploadedUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("id", vendorId);
      }

      setPreviews([]);
      onUploadComplete?.();
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-secondary/30 px-6 py-12 transition hover:border-accent/50 hover:bg-secondary/50"
        )}
      >
        <Upload className="h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-sm font-medium">Click or drag images here</p>
        <p className="mt-1 text-xs text-muted-foreground">PNG, JPG up to 8 images</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {previews.map((p, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removePreview(i)}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {previews.length > 0 && (
        <Button onClick={handleUpload} disabled={uploading} className="w-full">
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <ImageIcon className="h-4 w-4" />
              Upload {previews.length} image{previews.length > 1 ? "s" : ""}
            </>
          )}
        </Button>
      )}
    </div>
  );
}
