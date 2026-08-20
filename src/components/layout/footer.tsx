import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground">
                E
              </div>
              <span className="font-semibold">
                Event<span className="text-accent">Link</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              India’s marketplace connecting event managers with vendors and artists.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Platform</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/explore" className="hover:text-foreground">
                  Explore Vendors
                </Link>
              </li>
              <li>
                <Link href="/signup?role=vendor" className="hover:text-foreground">
                  Join as Vendor
                </Link>
              </li>
              <li>
                <Link href="/signup?role=manager" className="hover:text-foreground">
                  Join as Manager
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Contact</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              hello@eventlink.in
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} EventLink. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
