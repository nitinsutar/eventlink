import Link from "next/link";

export const metadata = {
  title: "Terms of Use | EventLink",
  description: "Terms and conditions for using the EventLink platform.",
};

export default function TermsPage() {
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

      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight">Terms of Use</h1>
        <p className="mt-1 text-muted-foreground">Last updated: August 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Acceptance</h2>
            <p>
              By creating an account or using EventLink, you agree to these Terms. If you do not agree, please do not use the platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">2. What EventLink is</h2>
            <p>
              EventLink is a discovery and connection marketplace. We help event managers find vendors and artists. We are not a party to any contract between users. Any booking, payment or service delivery happens directly between the manager and the vendor.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Accounts</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>You must provide accurate information when registering.</li>
              <li>You are responsible for keeping your login credentials secure.</li>
              <li>One person or business should maintain one primary account of each type (Vendor / Manager).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Vendor responsibilities</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Profiles and portfolio media must be truthful and owned by you (or used with permission).</li>
              <li>You must respond to inquiries in good faith.</li>
              <li>You may not post illegal, offensive or misleading content.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Manager responsibilities</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Inquiries should be genuine.</li>
              <li>Reviews must be based on real experience and should not be abusive.</li>
              <li>Contact details shared in inquiries are for communication about the event only.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Content & intellectual property</h2>
            <p>
              You retain ownership of content you upload. By uploading, you grant EventLink a non-exclusive licence to display that content on the platform so other users can discover you.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">7. Prohibited use</h2>
            <p>
              You may not use EventLink to spam, scrape data, harass users, or engage in any illegal activity. We reserve the right to suspend or remove accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">8. Disclaimer</h2>
            <p>
              EventLink is provided “as is”. We do not guarantee the quality, availability or conduct of any vendor or manager. Users deal with each other at their own risk.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">9. Changes</h2>
            <p>
              We may update these Terms from time to time. Continued use of the platform after changes means you accept the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">10. Contact</h2>
            <p>
              Questions about these Terms: <span className="text-foreground">hello@eventlink.in</span>
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
