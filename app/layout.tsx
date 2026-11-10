import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://AlankritawedsHemant.com"),
  title: "Alankrita & Hemant — Wedding Celebration | 2 December 2026",
  description:
    "We request the honour of your presence at the wedding celebration of Alankrita & Hemant on 2 December 2026 at Indralok Marriage Garden, Terminal 2, Jagatpura Road, Near Airport, Jaipur.",
  authors: [{ name: "Alankrita & Hemant" }],
  openGraph: {
    title: "Alankrita & Hemant — Wedding Invitation",
    description:
      "Join us in celebrating the wedding of Alankrita & Hemant on 2 December 2026 at Indralok Marriage Garden, Terminal 2, Jagatpura Road, Near Airport, Jaipur.",
    images: ["/images/template-2/hero-palace.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#fdf8ef",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Karla:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Marcellus&family=Tangerine:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
