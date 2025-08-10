import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import {Outfit, Urbanist} from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  title: {
    default: "Flexora Platform",
    template: "%s | Flexora Platform"
  },
  description: "Transform your fitness journey with AI-powered training",
};

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: "700"
})

const urbanist = Urbanist({
  subsets: ['latin'],
  variable: '--font-urbanist',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} ${urbanist.variable} dark`}>
      <body
        className={``}
      >
        <ThemeProvider
            attribute={"class"} enableSystem
          >
              {children}
              <Analytics/>
              <SpeedInsights />
          </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
