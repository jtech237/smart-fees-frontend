import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import clsx from "clsx";
import { AppProviders } from "@/providers/providers";
import { siteConfig } from "@/config/site";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`
  },
  description: siteConfig.description,
};

export const viewport: Viewport = {
  themeColor: [
    {media: "(prefers-color-scheme: light)", color: "white"},
    {media: "(prefers-color-scheme: dark)", color: "white"},
  ]
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={clsx(
          "min-h-screen bg-background",
          `${geistSans.variable} ${geistMono.variable} antialiased`,
        )}
        suppressHydrationWarning
      >
        <AppProviders themeProps={{attribute: "class", defaultTheme: "system"}}>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
