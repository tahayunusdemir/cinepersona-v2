import type { Metadata, Viewport } from "next";
import { DM_Mono, Inter, Sora } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "./sw-register";
import { FlashToast } from "@/components/flash-toast";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/lib/site";

// Display / headings — Sora, modern geometric grotesque (SaaS display).
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

// Body / UI — Inter, neutral humanist sans.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Mono / numeric / credits — typewriter-leaning, film-credit feel.
const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: { default: siteConfig.name, template: `%s · ${siteConfig.name}` },
  description: siteConfig.description,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteConfig.name,
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: siteConfig.themeColor.light },
    { media: "(prefers-color-scheme: dark)", color: siteConfig.themeColor.dark },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sora.variable} ${inter.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <FlashToast />
        </ThemeProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
