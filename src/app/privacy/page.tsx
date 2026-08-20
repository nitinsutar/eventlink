import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | EventLink",
  description: "How EventLink collects, uses and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-4">
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

      <main className="mx-auto max-w-3xl px-4 py-12 prose prose-neutral dark:prose-invert">
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: August 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Who we are</h2>
            <p>
              EventLink is a marketplace that connects event managers with vendors and artists across India. When you use our platform, you trust us with certain information. This policy explains what we collect and how we use it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Information we collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Account details: name, email, phone, company/agency name, designation</li>
              <li>Vendor profile data: business name, cities, categories, bio, packages, portfolio media</li>
              <li>Inquiry and review content you submit</li>
              <li>Usage data such as pages viewed and profile views (for vendors)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">3. How we use your information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To create and manage your account</li>
              <li>To show vendor profiles to event managers and vice versa</li>
              <li>To deliver inquiries and reviews</li>
              <li>To improve the platform and prevent abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Sharing of information</h2>
            <p>
              When an event manager sends an inquiry, the contact details they provide are shared with the relevant vendor so they can respond. We do not sell personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Data storage & security</h2>
            <p>
              Data is stored securely using Supabase (hosted infrastructure). We use industry-standard practices to protect your information. No method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Your choices</h2>
            <p>
              You can update your profile information at any time from your dashboard. To delete your account or request data removal, contact us at the email below.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">7. Contact</h2>
            <p>
              For privacy-related questions: <span className="text-foreground">hello@eventlink.in</span>
            </p>
          </section>
        </div>

        <div className="mt-12">
          <Link href="/" className="text-sm text-accent hover:underline">
            ← Back to EventLink
          </Link>
        </div>
      </main>
    </div>
  );
}
