import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Leo Rossetti — Full-stack Developer",
    template: "%s · Leo Rossetti",
  },
  description:
    "Full-stack developer. Ships products, not prototypes. TypeScript, React, Next.js, React Native, Node.js, Python, C#.",
  applicationName: "Leo Rossetti Portfolio",
  authors: [{ name: "Leo Rossetti" }],
  creator: "Leo Rossetti",
  keywords: [
    "Leo Rossetti",
    "full-stack developer",
    "TypeScript",
    "React",
    "Next.js",
    "React Native",
    "freelance developer",
  ],
  openGraph: {
    title: "Leo Rossetti — Full-stack Developer",
    description:
      "Full-stack developer. Ships products, not prototypes. Available for freelance.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Leo Rossetti — Full-stack Developer",
    description:
      "Full-stack developer. Ships products, not prototypes. Available for freelance.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#07070a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-bg-base text-fg-primary">
        {children}
      </body>
    </html>
  );
}
