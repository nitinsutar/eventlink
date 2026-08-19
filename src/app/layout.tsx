import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "EventLink — India's Event Vendor Marketplace",
    template: "%s | EventLink",
  },
  description:
    "Discover top event vendors, artists & production teams across India. Weddings, corporate, concerts & more. Book trusted talent with reviews.",
  keywords: [
    "event vendors India",
    "wedding vendors",
    "event management",
    "sound lights AV",
    "photo video anchors",
    "EventLink",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "EventLink",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased font-sans`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
