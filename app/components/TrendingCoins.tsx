"use client";
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [foldedSections, setFoldedSections] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingCoins = async () => {
      setIsLoading(true);
      try {
        let baseUrl = "https://srv.moonshot.money/categories?limit=10"
        // if localhost
        if (window.location.hostname === 'localhost') {
        } else {
          baseUrl = "/api/categories?limit=10"
        }
        const response = await fetch(baseUrl,{method: 'GET'});
     
        
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingCoins();
  }, []);

  const formatMarketCap = (coin: Coin) => {
    const marketCap = (coin.circulatingSupply / Math.pow(10, coin.decimals)) * coin.day.price;
    const millions = marketCap / 1000000;
    return `${millions.toFixed(2)} million`;
  };

  const toggleSection = (sectionId: string) => {
    setFoldedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.5 } }
  };

  const contentVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.5 } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Moonshot Listing Coins</h1>
        <p className="text-lg text-gray-600 mb-8">This website has no affiliation with Moonshot. It is a simple listing tracker for the Moonshot API.</p>
        
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center h-64"
          >
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          </motion.div>
        ) : (
          <AnimatePresence>
            {trendingCoinsData.map((section, index) => (
              <motion.div
                key={section.id}
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ delay: index * 0.1 }}
                className="mb-12 bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div 
                  className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-500 to-purple-600 cursor-pointer"
                  onClick={() => toggleSection(section.id)}
                >
                  <h2 className="text-2xl font-semibold text-white">{section.name}</h2>
                  <motion.div
                    animate={{ rotate: foldedSections[section.id] ? 0 : 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDownIcon className="h-6 w-6 text-white" />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {!foldedSections[section.id] && (
                    <motion.div
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="overflow-hidden"
                    >
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
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
                              <tr key={coin.id} className="hover:bg-gray-50 transition-colors duration-200">
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default TrendingCoins;
