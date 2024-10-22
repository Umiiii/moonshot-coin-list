"use client";
import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import { ChevronDownIcon, TableCellsIcon, ListBulletIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import { TwitterShareButton, TwitterFollowButton } from 'react-twitter-embed';

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
  const [displayMode, setDisplayMode] = useState<'table' | 'sections'>('table');

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

  // Add this new function to get tags for a coin
  const getTagsForCoin = (coinId: string) => {
    return trendingCoinsData
      .filter(section => section.coins.some(coin => coin.id === coinId))
      .map(section => section.name);
  };

  // Function to generate a consistent color based on the tag name
  const getColorForTag = useMemo(() => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500',
      'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-teal-500'
    ];
    const tagColors = new Map();

    return (tag: string) => {
      if (!tagColors.has(tag)) {
        tagColors.set(tag, colors[tagColors.size % colors.length]);
      }
      return tagColors.get(tag);
    };
  }, []);

  const allCoins = useMemo(() => {
    const coinMap = new Map<string, Coin>();
    trendingCoinsData.forEach(section => {
      section.coins.forEach(coin => {
        if (!coinMap.has(coin.id) || new Date(coin.listedAt) > new Date(coinMap.get(coin.id)!.listedAt)) {
          coinMap.set(coin.id, coin);
        }
      });
    });
    return Array.from(coinMap.values())
      .sort((a, b) => new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime());
  }, [trendingCoinsData]);


  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5 } }
  };

  // Add this function to check if a date is within the last 24 hours
  const isWithinLast24Hours = (date: string) => {
    const now = new Date();
    const listedDate = new Date(date);
    const diffInHours = (now.getTime() - listedDate.getTime()) / (1000 * 60 * 60);
    return diffInHours <= 24;
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Moonshot Listing Coins</h1>
            <p className="text-lg text-gray-600">This website has no affiliation with Moonshot. It is a simple listing tracker for the Moonshot API.</p>
          </div>
          <div className="flex items-center space-x-4">
            <TwitterShareButton
              url={window.location.href}
              options={{ text: 'Check out new listings on Moonshot!' }}
            />
            <TwitterFollowButton screenName="Geniusumi9" />
            <button
              onClick={() => setDisplayMode(displayMode === 'table' ? 'sections' : 'table')}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
            >
              {displayMode === 'table' ? (
                <>
                  <ListBulletIcon className="h-5 w-5 mr-2" />
                  Switch to Sections
                </>
              ) : (
                <>
                  <TableCellsIcon className="h-5 w-5 mr-2" />
                  Switch to Table
                </>
              )}
            </button>
          </div>
        </div>
        
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
          <AnimatePresence mode="wait">
            {displayMode === 'table' ? (
              <motion.div
                key="table"
                variants={tableVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Coin</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">24h Change</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Market Cap</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Contract Address</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Listed At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {allCoins.map((coin) => (
                        <tr 
                          key={coin.id} 
                          className={`hover:bg-gray-50 transition-colors duration-200 ${
                            isWithinLast24Hours(coin.listedAt) ? 'bg-yellow-50' : ''
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Image
                                src={coin.imageUrl}
                                alt={coin.name}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                              <div className="ml-4">
                                <div className="text-base font-medium text-gray-900">
                                  {coin.ticker}
                                  {isWithinLast24Hours(coin.listedAt) && (
                                    <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                      Listed in recent 24 hours
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-500">{coin.name}</div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {getTagsForCoin(coin.id).map((tag, index) => (
                                    <span 
                                      key={index} 
                                      className={`inline-block px-2 py-1 text-xs font-semibold text-white ${getColorForTag(tag)} rounded-full`}
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-base text-gray-900">${coin.day.price.toFixed(8)}</div>
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
                            <div className="text-sm text-gray-500">
                              {new Date(coin.createdAt).toLocaleString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {new Date(coin.listedAt).toLocaleString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="sections"
                variants={tableVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
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
                                  <tr 
                                    key={coin.id} 
                                    className={`hover:bg-gray-50 transition-colors duration-200 ${
                                      isWithinLast24Hours(coin.listedAt) ? 'bg-yellow-50' : ''
                                    }`}
                                  >
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
                                          <div className="text-sm font-medium text-gray-900">
                                            {coin.ticker}
                                            {isWithinLast24Hours(coin.listedAt) && (
                                              <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                New
                                              </span>
                                            )}
                                          </div>
                                          <div className="text-sm text-gray-500">{coin.name}</div>
                                          <div className="flex flex-wrap gap-1 mt-1">
                                            {getTagsForCoin(coin.id).map((tag, index) => (
                                              <span 
                                                key={index} 
                                                className={`inline-block px-2 py-1 text-xs font-semibold text-white ${getColorForTag(tag)} rounded-full`}
                                              >
                                                {tag}
                                              </span>
                                            ))}
                                          </div>
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
                                      <div className="text-sm text-gray-500">
                                        {new Date(coin.createdAt).toLocaleString(undefined, {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit',
                                          hour12: true
                                        })}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-500">
                                        {new Date(coin.listedAt).toLocaleString(undefined, {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit',
                                          hour12: true
                                        })}
                                      </div>
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
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default TrendingCoins;
