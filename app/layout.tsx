import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "../contexts/ThemeContext";
import {
  PWAInstallBanner,
  PWAStatusIndicator,
} from "../components/PWAInstallBanner";

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
const dankMono = localFont({
  src: [
    {
      path: "./fonts/DankMono/Web-PS/DankMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/DankMono/Web-PS/DankMono-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/DankMono/Web-PS/DankMono-Italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-dank-mono",
});

export const metadata: Metadata = {
  title: "Noobs Today",
  description: "Your Health Hub - Chat with AI and Track Your Diet",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Noobs Today",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Noobs Today",
    title: "Noobs Today - Health Hub",
    description: "Your Health Hub - Chat with AI and Track Your Diet",
  },
  twitter: {
    card: "summary",
    title: "Noobs Today - Health Hub",
    description: "Your Health Hub - Chat with AI and Track Your Diet",
  },
  icons: {
    icon: "/icons/icon.svg",
    shortcut: "/favicon.ico",
    apple: "/icons/icon.svg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#10b981",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="Noobs Today" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Noobs Today" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#10b981" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/icons/icon.svg" color="#10b981" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dankMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
          <PWAInstallBanner />
          <PWAStatusIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
