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
    "Discover top event vendors, artists & production teams across India. Weddings, corporate, concerts & more. Connect with trusted talent through reviews and inquiries.",
  keywords: [
    "event vendors India",
    "wedding vendors",
    "event management",
    "sound lights AV",
    "photo video anchors",
    "fabrication decor",
    "EventLink",
  ],
  authors: [{ name: "EventLink" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "EventLink",
    title: "EventLink — India's Event Vendor Marketplace",
    description:
      "Discover top event vendors, artists & production teams across India. Weddings, corporate, concerts & more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "EventLink — India's Event Vendor Marketplace",
    description:
      "Discover top event vendors, artists & production teams across India.",
  },
  robots: {
    index: true,
    follow: true,
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
