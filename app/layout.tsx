import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google';
import { GoogleTagManager } from '@next/third-parties/google'; 
import GoogleAdsense from './components/GoogleAdsense';

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
  title: "Moonshot Listing Tracker",
  description: "Track new listing cryptocurrencies, their prices, market caps, and more on Moonshot. Stay updated with the latest crypto market trends.",
  keywords: "listing, cryptocurrency, crypto tracker, blockchain, trending coins, market cap, crypto prices, moonshot, solana, memecoins, meme coins, solana memecoins, solana meme coins, solana memecoin tracker, solana meme coin tracker, solana memecoin prices, solana meme coin prices, solana memecoin market cap, solana meme coin market cap",
  openGraph: {
    title: "Moonshot - Cryptocurrency Listing Tracker",
    description: "Track trending cryptocurrencies, their prices, market caps, and more on Moonshot.",
    type: "website",
    url: "https://moonshot.umi.cat", // Replace with your actual URL
   // image: "/og-image.jpg", // Add an Open Graph image (create this image and place it in the public folder)
  },
  twitter: {
    card: "summary_large_image",
    title: "Moonshot - Cryptocurrency Listing Tracker",
    description: "Track trending cryptocurrencies, their prices, market caps, and more on Moonshot.",
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
      <GoogleTagManager gtmId="G-151Q41BT6K" />
      <GoogleAdsense pId="6345227285458042" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
      <GoogleAnalytics gaId="G-151Q41BT6K" />
      
    </html>
  );
}
