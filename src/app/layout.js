import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";

export const metadata = {
  title: 'Mahaveer Sitara',
  description: 'Manage apartment tasks and residents',
  icons: {
    icon: [
      { url: '/favicon.png', sizes: 'any' },
      { url: '/logo.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
