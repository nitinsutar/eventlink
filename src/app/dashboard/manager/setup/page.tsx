"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CITIES } from "@/types/database";
import { Loader2, Save } from "lucide-react";

export default function ManagerSetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [designation, setDesignation] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFullName(profile.full_name || "");
        setCompanyName(profile.company_name || "");
        setDesignation(profile.designation || "");
        setCity(profile.city || "");
        setPhone(profile.phone || "");
      }

      setLoading(false);
    }
    load();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Not authenticated");
      setSaving(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        company_name: companyName || null,
        designation: designation || null,
        city: city || null,
        phone: phone || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    router.push("/dashboard/manager");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground">
              E
            </div>
            <span className="font-semibold">
              Event<span className="text-accent">Link</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-4 py-10">
        <h1 className="text-2xl font-bold tracking-tight">Your Profile</h1>
        <p className="mt-1 text-muted-foreground">
          Tell vendors a bit about yourself so they know who is reaching out
        </p>

        <form onSubmit={handleSave} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name *</Label>
            <Input
              id="fullName"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName">Company / Agency name *</Label>
            <Input
              id="companyName"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Spark Events, Freelance, XYZ Corp"
            />
            <p className="text-xs text-muted-foreground">
              If you work independently, write "Freelance" or your brand name
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="designation">Designation</Label>
            <Input
              id="designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="e.g. Event Manager, Founder, Coordinator"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <select
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-border bg-card px-4 text-sm"
            >
              <option value="">Select city</option>
              {CITIES.filter((c) => c !== "All India").map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="98765 43210"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={saving} className="w-full" size="lg">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Profile
              </>
            )}
          </Button>
        </form>
      </main>
    </div>
  );
}
