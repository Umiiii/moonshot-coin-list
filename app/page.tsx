import TrendingCoins from './components/TrendingCoins';
import { Analytics } from "@vercel/analytics/react"
import { GoogleAnalytics } from '@next/third-parties/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
export default function Home() {
  return (
    <>
      <GoogleAnalytics gaId="G-151Q41BT6K" />
      <TrendingCoins />
      <Analytics />
      <SpeedInsights />
    </>
  );
}