"use client";
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface Coin {
  id: string;
  name: string;
  ticker: string;
  imageUrl: string;
  decimals: number;
  circulatingSupply: number;
  chain: string;
  contractAddress: string;
  day: {
    price: number;
    holders: number;
    change: number;
    volume: number;
  };
  createdAt: string;
  listedAt: string;
}

interface TrendingCoinsData {
  id: string;
  name: string;
  coins: Coin[];
}

const TrendingCoins = () => {
  const [trendingCoinsData, setTrendingCoinsData] = useState<TrendingCoinsData[]>([]);

  useEffect(() => {
    const fetchTrendingCoins = async () => {
      try {
        const response = await fetch('/api/categories?limit=10',{method: 'GET'});
     
        
        const data = await response.json();
        // Check if the data is an array or a single object
        const formattedData = Array.isArray(data) ? data : [data];
        
        // Sort coins by listedAt date
        formattedData.forEach(section => {
          section.coins.sort((a: Coin, b: Coin) => new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime());
        });
        
        setTrendingCoinsData(formattedData);
      } catch (error) {
        console.error('Error fetching trending coins:', error);
      }
    };

    fetchTrendingCoins();
  }, []);

  const formatMarketCap = (coin: Coin) => {
    const marketCap = (coin.circulatingSupply / Math.pow(10, coin.decimals)) * coin.day.price;
    const millions = marketCap / 1000000;
    return `${millions.toFixed(2)} million`;
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Moonshot Trending Coins</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">This website has no affiliation with Moonshot. It is a simple listing tracker for the Moonshot API.</h2>
        {trendingCoinsData.map((section) => (
          <div key={section.id} className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">{section.name}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">24h Change</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Cap</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listed At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {section.coins.slice(0, 10).map((coin) => (
                    <tr key={coin.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Image
                            src={coin.imageUrl}
                            alt={coin.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{coin.name}</div>
                            <div className="text-sm text-gray-500">{coin.ticker}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${coin.day.price.toFixed(8)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${coin.day.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {coin.day.change >= 0 ? '▲' : '▼'} {Math.abs(coin.day.change).toFixed(2)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${coin.day.volume.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${formatMarketCap(coin)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {coin.chain === 'solana' ? (
                            <a
                              href={`https://solscan.io/token/${coin.contractAddress}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {`${coin.contractAddress.slice(0, 6)}...${coin.contractAddress.slice(-4)}`}
                            </a>
                          ) : (
                            'N/A'
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{new Date(coin.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{new Date(coin.listedAt).toLocaleDateString()}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingCoins;
