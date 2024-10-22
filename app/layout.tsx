import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google';
import { GoogleTagManager } from '@next/third-parties/google'; 

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
  title: "Moonshot - Cryptocurrency Listing Tracker",
  description: "Track trending cryptocurrencies, their prices, market caps, and more with Moonshot. Stay updated with the latest crypto market trends.",
  keywords: "cryptocurrency, crypto tracker, blockchain, trending coins, market cap, crypto prices",
  openGraph: {
    title: "Moonshot - Cryptocurrency Listing Tracker",
    description: "Track trending cryptocurrencies, their prices, market caps, and more with Moonshot.",
    type: "website",
    url: "https://moonshot.umi.cat", // Replace with your actual URL
   // image: "/og-image.jpg", // Add an Open Graph image (create this image and place it in the public folder)
  },
  twitter: {
    card: "summary_large_image",
    title: "Moonshot - Cryptocurrency Listing Tracker",
    description: "Track trending cryptocurrencies, their prices, market caps, and more with Moonshot.",
   // image: "/twitter-image.jpg", // Add a Twitter card image (create this image and place it in the public folder)
  },
  robots: "index, follow"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
      <GoogleAnalytics gaId="G-151Q41BT6K" />
      <GoogleTagManager gtmId="GTM-55RXN8PQ" />
    </html>
  );
}
