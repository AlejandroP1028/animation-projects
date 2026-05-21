import type { Metadata } from "next";
import { Geist, Geist_Mono, Ubuntu_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "./_components/sidebar";
import { ThemeProvider } from "./_components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ubuntuMono = Ubuntu_Mono({
  variable: "--font-ubuntu-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Animation Sandbox",
  description: "Isolated animation library demos",
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
      className={`${geistSans.variable} ${geistMono.variable} ${ubuntuMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex items-stretch">
        <ThemeProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col min-h-screen">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
