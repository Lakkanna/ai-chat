import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "../contexts/ThemeContext";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dankMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
