import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Your Coffee Shop — Loyalty Card",
  description: "Digital loyalty stamp card. Proudly independent. North Carolina grown.",
  openGraph: {
    title: "Your Coffee Shop — Loyalty Card",
    description: "Digital loyalty stamp card. Proudly independent. North Carolina grown.",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Loyalty Card",
  },
};

export const viewport: Viewport = {
  themeColor: "#6B4F36",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="min-h-screen" style={{ background: "var(--background)" }}>
        {children}
      </body>
    </html>
  );
}
