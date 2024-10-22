import TrendingCoins from './components/TrendingCoins';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from '@vercel/speed-insights/next';
export default function Home() {
  return (
    <>
      <TrendingCoins />
      <Analytics />
      <SpeedInsights />
    </>
  );
}