import type { Metadata } from "next";
import { Source_Serif_4, Inter_Tight, Geist_Mono } from "next/font/google";
import { Providers } from "./Providers";
import "./globals.css";

// Warm palette type pairing. The CSS-var names are kept stable
// (--font-playfair = display serif, --font-sans = UI, --font-mono = figures)
// so existing call-sites re-skin without edits. All three are variable fonts,
// so no `weight` is needed (full axis range loads).
const serif = Source_Serif_4({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const sans = Inter_Tight({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prevista — your future, foreseen",
  description: "Track, optimize, and protect your retirement income across multiple countries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
