"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CITIES, CATEGORIES } from "@/types/database";
import { slugify, calculateProfileCompletion } from "@/lib/utils";
import { Loader2, Check, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Basic Info", "Categories", "About", "Packages", "Review"];

export default function VendorOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in");
      setLoading(false);
      return;
    }

    const slug = slugify(businessName) + "-" + Math.random().toString(36).slice(2, 6);

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

    const { error: insertError } = await supabase.from("vendor_profiles").insert({
      user_id: user.id,
      business_name: businessName,
      slug,
      primary_city: primaryCity,
      serviceable_cities: serviceableCities.length ? serviceableCities : [primaryCity],
      categories,
      bio: bio || null,
      years_experience: yearsExperience ? Number(yearsExperience) : null,
      team_size: teamSize ? Number(teamSize) : null,
      packages,
      profile_completion_score: completion,
      verification_status: "self_claimed",
      is_active: true,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard/vendor");
    router.refresh();
  };

  const canNext = () => {
    if (step === 0) return businessName.trim().length > 2 && primaryCity;
    if (step === 1) return categories.length > 0;
    return true;
  };

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
          <span className="text-sm text-muted-foreground">
            Step {step + 1} of {STEPS.length}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-10 flex gap-2">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={cn(
                "h-1.5 flex-1 rounded-full transition",
                i <= step ? "bg-accent" : "bg-border"
              )}
            />
          ))}
        </div>

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {STEPS[step]}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {step === 0 && "Tell us about your business"}
          {step === 1 && "What services do you offer?"}
          {step === 2 && "Share a bit about yourself"}
          {step === 3 && "Add a starting package (optional)"}
          {step === 4 && "Review and publish your profile"}
        </p>

        <div className="mt-8 space-y-6">
          {step === 0 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="businessName">Business / Brand Name *</Label>
                <Input
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Apex Sound & Lights"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="primaryCity">Primary City *</Label>
                <select
                  id="primaryCity"
                  value={primaryCity}
                  onChange={(e) => setPrimaryCity(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-border bg-card px-4 text-sm"
                >
                  <option value="">Select city</option>
                  {CITIES.filter((c) => c !== "All India").map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Also serviceable in (optional)</Label>
                <div className="flex flex-wrap gap-2">
                  {CITIES.filter((c) => c !== "All India" && c !== primaryCity).map((city) => (
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
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={cn(
                    "flex items-center justify-center rounded-xl border p-4 text-sm font-medium transition",
                    categories.includes(cat)
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border hover:border-accent/40"
                  )}
                >
                  {categories.includes(cat) && <Check className="mr-2 h-4 w-4" />}
                  {cat}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio / About</Label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={5}
                  placeholder="Tell event managers about your experience..."
                  className="flex w-full rounded-xl border border-border bg-card px-4 py-3 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="years">Years of experience</Label>
                  <Input id="years" type="number" min="0" value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)} placeholder="e.g. 8" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team">Team size</Label>
                  <Input id="team" type="number" min="1" value={teamSize} onChange={(e) => setTeamSize(e.target.value)} placeholder="e.g. 12" />
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="pkgTitle">Package name</Label>
                <Input id="pkgTitle" value={packageTitle} onChange={(e) => setPackageTitle(e.target.value)} placeholder="e.g. Full Day Wedding Package" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priceMin">Starting price (₹)</Label>
                  <Input id="priceMin" type="number" value={packagePriceMin} onChange={(e) => setPackagePriceMin(e.target.value)} placeholder="25000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priceMax">Max price (₹) optional</Label>
                  <Input id="priceMax" type="number" value={packagePriceMax} onChange={(e) => setPackagePriceMax(e.target.value)} placeholder="75000" />
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <div><p className="text-sm text-muted-foreground">Business name</p><p className="font-medium">{businessName}</p></div>
              <div><p className="text-sm text-muted-foreground">Primary city</p><p className="font-medium">{primaryCity}</p></div>
              <div><p className="text-sm text-muted-foreground">Categories</p><p className="font-medium">{categories.join(", ")}</p></div>
              {bio && <div><p className="text-sm text-muted-foreground">Bio</p><p className="text-sm">{bio}</p></div>}
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex items-center justify-between pt-6">
            <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={step === 0 || loading}>
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext()}>
                Continue <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Publishing...</> : "Publish Profile"}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
