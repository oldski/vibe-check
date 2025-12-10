import { ThemeProvider } from "next-themes";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { clsx } from "clsx";
import { cn } from "@/lib/utils";
import { VibeHeaderProvider } from "@/contexts/vibeHeaderContext";
import { ToastProvider } from "@/contexts/toastContext";
import ToastContainer from "@/components/ui/toastContainer";
import localFont from "next/font/local";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Vibe Check",
  description: "Track your daily vibes and share your emotional journey",
  openGraph: {
    title: "Vibe Check",
    description: "Track your daily vibes and share your emotional journey",
    siteName: "Vibe Check",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Vibe Check",
    description: "Track your daily vibes and share your emotional journey",
  },
};

const clashDisplay = localFont({
	src: [
		{
			path: "../public/fonts/ClashDisplay/ClashDisplay-Light.woff2",
			weight: "300",
			style: "normal",
		},
		{
			path: "../public/fonts/ClashDisplay/ClashDisplay-Regular.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "../public/fonts/ClashDisplay/ClashDisplay-Semibold.woff2",
			weight: "600",
			style: "normal",
		},
		{
			path: "../public/fonts/ClashDisplay/ClashDisplay-Bold.woff2",
			weight: "700",
			style: "normal",
		},
	],
	variable: "--font-clash-display",
	display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" className={clsx(clashDisplay.className)} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <VibeHeaderProvider>
              <Header />
              <main className="min-h-screen flex flex-col items-center relative">
                {children}
              </main>
              <Footer />
            </VibeHeaderProvider>
            <ToastContainer />
          </ToastProvider>
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
