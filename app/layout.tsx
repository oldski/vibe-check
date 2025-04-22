import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import {Geist, Overpass, Overpass_Mono} from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import {clsx} from "clsx";
import {cn} from "@/lib/utils";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const overpass = Overpass({
  display: "swap",
  subsets: ["latin"],
})

const overpassMono = Overpass_Mono({
  display: "swap",
  subsets: ["latin"]
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" className={clsx(overpass.className)} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="min-h-screen flex flex-col items-center relative">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
        <div className={cn(
          "bg-neutral-50",
          "dark:bg-neutral-800",
          "fixed z-[-1] inset-0"
        )}/>
      </body>
    </html>
  );
}
