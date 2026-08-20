"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CITIES, CATEGORIES } from "@/types/database";
import { calculateProfileCompletion, cn } from "@/lib/utils";
import { Loader2, Check, ArrowLeft, Save } from "lucide-react";

export default function EditVendorProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [vendorId, setVendorId] = useState<string | null>(null);

  const [businessName, setBusinessName] = useState("");
  const [primaryCity, setPrimaryCity] = useState("");
  const [serviceableCities, setServiceableCities] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [packageTitle, setPackageTitle] = useState("");
  const [packagePriceMin, setPackagePriceMin] = useState("");
  const [packagePriceMax, setPackagePriceMax] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: vendor } = await supabase
        .from("vendor_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!vendor) {
        router.push("/dashboard/vendor/onboarding");
        return;
      }

      setVendorId(vendor.id);
      setBusinessName(vendor.business_name || "");
      setPrimaryCity(vendor.primary_city || "");
      setServiceableCities(vendor.serviceable_cities || []);
      setCategories(vendor.categories || []);
      setBio(vendor.bio || "");
      setYearsExperience(vendor.years_experience?.toString() || "");
      setTeamSize(vendor.team_size?.toString() || "");

      if (vendor.packages?.[0]) {
        setPackageTitle(vendor.packages[0].title || "");
        setPackagePriceMin(vendor.packages[0].price_min?.toString() || "");
        setPackagePriceMax(vendor.packages[0].price_max?.toString() || "");
      }

      setLoading(false);
    }
    load();
  }, [router]);

  const toggleCity = (city: string) => {
    setServiceableCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  const toggleCategory = (cat: string) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorId) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    const packages = packageTitle
      ? [
          {
            title: packageTitle,
            price_min: Number(packagePriceMin) || 0,
            price_max: Number(packagePriceMax) || undefined,
            currency: "INR",
          },
        ]
      : [];

    const completion = calculateProfileCompletion({
      business_name: businessName,
      primary_city: primaryCity,
      categories,
      bio,
      mediaCount: 0,
      packages,
      contact_preferences: true,
    });

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("vendor_profiles")
      .update({
        business_name: businessName,
        primary_city: primaryCity,
        serviceable_cities: serviceableCities.length
          ? serviceableCities
          : [primaryCity],
        categories,
        bio: bio || null,
        years_experience: yearsExperience ? Number(yearsExperience) : null,
        team_size: teamSize ? Number(teamSize) : null,
        packages,
        profile_completion_score: completion,
        updated_at: new Date().toISOString(),
      })
      .eq("id", vendorId);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    setSuccess(true);
    setSaving(false);
    setTimeout(() => router.push("/dashboard/vendor"), 1200);
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
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <Link
            href="/dashboard/vendor"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <span className="font-semibold">
            Event<span className="text-accent">Link</span>
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold tracking-tight">Edit Profile</h1>
        <p className="mt-1 text-muted-foreground">
          Keep your information up to date for better visibility
        </p>

        <form onSubmit={handleSave} className="mt-8 space-y-8">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Basic Info</h2>
            <div className="space-y-2">
              <Label htmlFor="businessName">Business / Brand Name *</Label>
              <Input
                id="businessName"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryCity">Primary City *</Label>
              <select
                id="primaryCity"
                required
                value={primaryCity}
                onChange={(e) => setPrimaryCity(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-border bg-card px-4 text-sm"
              >
                <option value="">Select city</option>
                {CITIES.filter((c) => c !== "All India").map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Also serviceable in</Label>
              <div className="flex flex-wrap gap-2">
                {CITIES.filter((c) => c !== "All India" && c !== primaryCity).map(
                  (city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => toggleCity(city)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-sm transition",
                        serviceableCities.includes(city)
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border hover:border-accent/40"
                      )}
                    >
                      {city}
                    </button>
                  )
                )}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Categories</h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={cn(
                    "flex items-center justify-center rounded-xl border p-3 text-sm font-medium transition",
                    categories.includes(cat)
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border hover:border-accent/40"
                  )}
                >
                  {categories.includes(cat) && (
                    <Check className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  {cat}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">About</h2>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                rows={5}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="flex w-full rounded-xl border border-border bg-card px-4 py-3 text-sm"
                placeholder="Tell event managers about your experience..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="years">Years of experience</Label>
                <Input
                  id="years"
                  type="number"
                  min="0"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team">Team size</Label>
                <Input
                  id="team"
                  type="number"
                  min="1"
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Starting Package</h2>
            <div className="space-y-2">
              <Label htmlFor="pkgTitle">Package name</Label>
              <Input
                id="pkgTitle"
                value={packageTitle}
                onChange={(e) => setPackageTitle(e.target.value)}
                placeholder="e.g. Full Day Package"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priceMin">Starting price (₹)</Label>
                <Input
                  id="priceMin"
                  type="number"
                  value={packagePriceMin}
                  onChange={(e) => setPackagePriceMin(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceMax">Max price (₹)</Label>
                <Input
                  id="priceMax"
                  type="number"
                  value={packagePriceMax}
                  onChange={(e) => setPackagePriceMax(e.target.value)}
                />
              </div>
            </div>
          </section>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && (
            <p className="text-sm text-accent">Profile updated! Redirecting...</p>
          )}

          <div className="flex gap-3 pt-4">
            <Link href="/dashboard/vendor">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
