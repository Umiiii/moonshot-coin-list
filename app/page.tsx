import TrendingCoins from './components/TrendingCoins';
import { Analytics } from "@vercel/analytics/react"
export default function Home() {
  return (
    <>
      <TrendingCoins />
      <Analytics />
    </>
  );
}