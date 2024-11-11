"use client";
import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import { ChevronDownIcon, TableCellsIcon, ListBulletIcon, InformationCircleIcon, ClipboardDocumentIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import { TwitterShareButton, TwitterFollowButton } from 'react-twitter-embed';
import { sendGAEvent } from '@next/third-parties/google';
import { FaTwitter } from 'react-icons/fa'; // Add this import for the Twitter icon
import toast, { Toaster } from 'react-hot-toast';
import { track } from '@vercel/analytics';

interface Coin {
  id: string;
  name: string;
  ticker: string;
  imageUrl: string;
  decimals: number;
  circulatingSupply: number;
  description: string;
  twitter: string;
  chain: string;
  contractAddress: string;
  day: {
    price: number;
    holders: number;
    change: number;
    volume: number;
  };
  priceAtListed: number;
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
  const csvHistoryData = [
    { mint_address: "qiaupfns561LJPudU2YL48S2mx1nbekrn8V4RrpyJG6", token_price_usd: "0.007705233186906990" },
    { mint_address: "BoAQaykj3LtkM2Brevc7cQcRAzpqcsP47nJ2rkyopump", token_price_usd: "0.014376705332664100" },
    { mint_address: "GmbC2HgWpHpq9SHnmEXZNT5e1zgcU9oASDqbAkGTpump", token_price_usd: "0.011742727480775800" },
    { mint_address: "66gsTs88mXJ5L4AtJnWqFW6H2L5YQDRy4W41y6zbpump", token_price_usd: "0.03797424020885380" },
    { mint_address: "39qibQxVzemuZTEvjSB7NePhw9WyyHdQCqP8xmBMpump", token_price_usd: "0.03501320740363040" },
    { mint_address: "Cy4DSbZW4CE6cG6HDqQFhXxpHTdm41SY9hBB1JG6pump", token_price_usd: "0.0039014835410562100" },
    { mint_address: "9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump", token_price_usd: "0.021594794562240200" },
    { mint_address: "HeJUFDxfJSzYFUuHLxkMqCgytU31G6mjP4wKviwqpump", token_price_usd: "0.035991546375265100" },
    { mint_address: "FqvtZ2UFR9we82Ni4LeacC1zyTiQ77usDo31DUokpump", token_price_usd: "0.03598629310710420" },
    { mint_address: "2KgAN8nLAU74wjiyKi85m4ZT6Z9MtqrUTGfse8Xapump", token_price_usd: "0.018790476236932200" },
    { mint_address: "CBdCxKo9QavR9hfShgpEBG3zekorAeD7W1jfq2o3pump", token_price_usd: "0.058874657864975400" },
    { mint_address: "BSqMUYb6ePwKsby85zrXaDa4SNf6AgZ9YfA2c4mZpump", token_price_usd: "0.004843852552071260" },
    { mint_address: "GVwpWU5PtJFHS1mH35sHmsRN1XWUwRV3Qo94h5Lepump", token_price_usd: "0.013029948483553000" },
    { mint_address: "2zrH2jE542mzB4HABgBjdWMQPtNC5H12pwo1iLpfpump", token_price_usd: "0.005621915501925180" },
    { mint_address: "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump", token_price_usd: "0.044531201094114500" },
    { mint_address: "6JGSHS9GrE9uG8ix63w3DPMYHrgrJ6J4QyHbBhAepump", token_price_usd: "0.00159349921249322" },
    { mint_address: "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump", token_price_usd: "0.013949596970321000" },
    { mint_address: "HUdqc5MR5h3FssESabPnQ1GTgTcPvnNudAuLj5J6a9sU", token_price_usd: "0.02316750332116570" },
    { mint_address: "GJAFwWjJ3vnTsrQVabjBVK2TYB1YtRCQXRDfDgUnpump", token_price_usd: "0.020066650880012900" },
    { mint_address: "H2c31USxu35MDkBrGph8pUDUnmzo2e4Rf4hnvL2Upump", token_price_usd: "0.020364699127351200" },
    { mint_address: "7KuFdcfzbc3LLoRHNRWfW1dhbPNzuCv41hyYbfSUpump", token_price_usd: "0.010398853359502600" },
    { mint_address: "8x5VqbHA8D7NkD52uNuS5nnt3PwA8pLD34ymskeSo2Wn", token_price_usd: "0.07000218748072700" },
    { mint_address: "CmpuL8k9KY3NrpfDRoJrVmuwd1zRMFRUxX55avyGpump", token_price_usd: "0.0033875115830854600" },
    { mint_address: "LoL1RDQiUfifC2BX28xaef6r2G8ES8SEzgrzThJemMv", token_price_usd: "0.01287642250661450" },
    { mint_address: "HAPPYwgFcjEJDzRtfWE6tiHE9zGdzpNky2FvjPHsvvGZ", token_price_usd: "0.006117542545298380" }
   ];
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
    setFoldedSections(prev => {
      const newState = { ...prev, [sectionId]: !prev[sectionId] };
      sendGAEvent({ event: 'toggleSection', sectionId, newState: newState[sectionId] ? 'expanded' : 'collapsed' });
      return newState;
    });
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

  // Modify the getTagsForCoin function
  const getTagsForCoin = (coin: Coin) => {
    const tags = trendingCoinsData
      .filter(section => section.coins.some(c => c.id === coin.id))
      .map(section => section.name);
    
    // Add "pump.fun" tag if the contract address ends with "pump"
    if (coin.contractAddress.toLowerCase().endsWith('pump')) {
      tags.push('pump.fun');
    }
    
    return tags;
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
    // init csv history data
    Array.from(coinMap.values()).forEach(coin => {
      const history = csvHistoryData.find(h => h.mint_address === coin.contractAddress);
      if (history) {
        coin.priceAtListed = parseFloat(history.token_price_usd);
      }
    });


    const output = [];
    for (const coin of Array.from(coinMap.values())) {
     // console.log(coin);
      // if (coin.ticker !== 'MARK' && coin.ticker !== 'CATGF') {
      //   continue;
      // }
      const listedAt = new Date(coin.listedAt);
      const tenMinutesAgo = new Date(listedAt.getTime() - 10 * 60 * 1000);
      const oneMinuteAgo = new Date(listedAt.getTime() - 1 * 60 * 1000);
      
      output.push("('"+
        coin.contractAddress+ "', TIMESTAMP '"+ 
        tenMinutesAgo.toISOString().replace('T', ' ').slice(0, 19) + "', TIMESTAMP '" +
        oneMinuteAgo.toISOString().replace('T', ' ').slice(0, 19) + "')"
      );
    }
    console.log(output.join(",\n"));

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

  // Add this function to calculate price change since listing
  const calculatePriceChangeSinceListed = (coin: Coin) => {
    if (!coin.priceAtListed || coin.priceAtListed === 0) {
      return { change: '-', percentage: '-' };
    }
    const change = coin.day.price - coin.priceAtListed;
    const percentage = ((change / coin.priceAtListed) * 100).toFixed(2);
    return {
      change: change.toFixed(8),
      percentage: `${percentage}%`
    };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Contract address copied to clipboard!', {
        duration: 2000,
        position: 'bottom-center',
        icon: '📋',
      });
      sendGAEvent({ event: 'copyContractAddress', contractAddress: text });
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      <Toaster /> {/* Add this line to render the toast container */}
      <div className="max-w-full mx-auto">
        <div className="flex flex-col space-y-6 sm:flex-row sm:justify-between sm:items-center mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Moonshot Listing Coins</h1>
            <p className="text-sm sm:text-lg text-gray-600">
              This website has no affiliation with{' '}
              <a
                href="https://moonshot.money?ref=CWq73Sx3vq"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
                onClick={() => {
                  track('moonshot_app_link_click', { location: 'header' });
                }}
              >
                Moonshot App
              </a>
            </p>
            <p className="text-sm sm:text-lg text-gray-600">Do not FOMO</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex space-x-2">
              <TwitterShareButton
                url={'https://moonshot.umi.cat/?ref=home'}
                options={{ text: 'Check out new listings on Moonshot' }}
              />
              <TwitterFollowButton screenName="Geniusumi9" />
            </div>
            <button
              onClick={() => {
                setDisplayMode(displayMode === 'table' ? 'sections' : 'table');
                sendGAEvent({ event: 'switchDisplayMode', newMode: displayMode === 'table' ? 'sections' : 'table' });
                track('switchDisplayMode', { newMode: displayMode === 'table' ? 'sections' : 'table' });
              }}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 text-sm sm:text-base"
            >
              {displayMode === 'table' ? (
                <>
                  <ListBulletIcon className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline">Switch to Sections</span>
                  <span className="sm:hidden">Sections</span>
                </>
              ) : (
                <>
                  <TableCellsIcon className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline">Switch to Table</span>
                  <span className="sm:hidden">Table</span>
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
            <Image
              src="/loading.png"
              alt="Loading..."
              width={512}
              height={512}
            />
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
                <div className="relative overflow-x-auto">
                  <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                    <table className="w-full table-auto">
                      <thead className="bg-gray-50 sticky top-0 z-20">
                        <tr>
                          <th className="sticky left-0 z-30 bg-gray-50 px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Coin</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Price /<br></br> Market Cap /<br></br> Holders</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center">
                              Price At Listed /<br></br> Price Since Listed
                              <div className="relative ml-1 group">
                                <InformationCircleIcon className="h-5 w-5 text-gray-400 cursor-help" />
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                  The average price 10 minutes before listing
                                </div>
                              </div>
                            </div>
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">24h Change</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Contract Address</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Listed At</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {allCoins.map((coin,index) => (
                          <tr 
                            key={coin.id} 
                            className={`transition-colors duration-200`}
                          >
                            
                            <td className={`sticky left-0 z-10 bg-white px-6 py-4 ${index === 0 && isWithinLast24Hours(coin.listedAt) ? 'highlight-row' : ''}`}>
                              <div className="flex items-start ">
                                <Image
                                  src={coin.imageUrl}
                                  alt={coin.name}
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                />
                                <div className="ml-4">
                                  <div className={`text-base font-medium text-gray-900`}>
                                    <strong>{coin.ticker}</strong>
                                    {isWithinLast24Hours(coin.listedAt) && (
                                      <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        Recent listing
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-800">{coin.name}</div>
                                  {coin.twitter && (
                                    <a
                                      href={`https://twitter.com/${coin.twitter}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-500 hover:text-blue-700 inline-flex items-center mt-1 hidden sm:inline-flex"
                                      onClick={() => sendGAEvent({ event: 'clickTwitterLink', coinId: coin.id, twitterHandle: coin.twitter })}
                                    >
                                      <FaTwitter className="mr-1" />
                                      @{coin.twitter}
                                    </a>
                                  )}
                                  <div className="text-xs text-gray-500 mt-1 max-w-xs whitespace-normal hidden sm:block">
                                    {coin.description}
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-1 hidden sm:flex">
                                    {getTagsForCoin(coin).map((tag, index) => (
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
                              <div className="text-base text-gray-800">${coin.day.price.toFixed(8)}</div>
                              <div className="text-sm text-gray-500">${formatMarketCap(coin)}</div>
                              <div className="text-sm text-gray-500">{coin.day.holders} holders</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-base text-gray-800">
                                ${coin.priceAtListed ? coin.priceAtListed.toFixed(8) : '-'}
                              </div>
                              <div className={`text-sm ${calculatePriceChangeSinceListed(coin).change !== null && parseFloat(calculatePriceChangeSinceListed(coin).change) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                ${calculatePriceChangeSinceListed(coin).change !== null ? `${calculatePriceChangeSinceListed(coin).change} / ${calculatePriceChangeSinceListed(coin).percentage}` : '-'}
                              </div>
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
                              <div className="text-sm text-gray-900 flex items-center">
                                {coin.chain === 'solana' ? (
                                  <>
                                    <a
                                      href={`https://solscan.io/token/${coin.contractAddress}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 mr-2"
                                      onClick={() => sendGAEvent({ event: 'clickContractAddress', coinId: coin.id, contractAddress: coin.contractAddress })}
                                    >
                                      {`${coin.contractAddress.slice(0, 6)}...${coin.contractAddress.slice(-4)}`}
                                    </a>
                                    <button
                                      onClick={() => copyToClipboard(coin.contractAddress)}
                                      className="text-gray-400 hover:text-gray-600"
                                      title="Copy contract address"
                                    >
                                      <ClipboardDocumentIcon className="h-5 w-5" />
                                    </button>
                                  </>
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
                          className="overflow-x-auto"
                        >
                          <table className="w-full table-auto">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coin</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price / Market Cap / Holders</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  <div className="flex items-center">
                                    Price At Listed / Price Since Listed
                                    <div className="relative ml-1 group">
                                      <InformationCircleIcon className="h-4 w-4 text-gray-400 cursor-help" />
                                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                        The average price 10 minutes before listing 
                                      </div>
                                    </div>
                                  </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">24h Change</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract Address</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listed At</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {section.coins.slice(0, 10).map((coin) => (
                                <tr 
                                  key={coin.id} 
                                  className={`hover:bg-gray-50 transition-colors duration-200`}
                                >
                                  <td className="px-6 py-4">
                                    <div className="flex items-start">
                                      <Image
                                        src={coin.imageUrl}
                                        alt={coin.name}
                                        width={32}
                                        height={32}
                                        className="rounded-full"
                                      />
                                      <div className="ml-4">
                                        <div className={`text-sm font-medium text-gray-900`}>
                                          <strong>{coin.ticker}</strong>
                                          {isWithinLast24Hours(coin.listedAt) && (
                                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                              Recent listing
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-sm text-gray-800">{coin.name}</div>
                                        {coin.twitter && (
                                          <a
                                            href={`https://twitter.com/${coin.twitter}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:text-blue-700 inline-flex items-center mt-1 hidden sm:inline-flex"
                                            onClick={() => sendGAEvent({ event: 'clickTwitterLink', coinId: coin.id, twitterHandle: coin.twitter })}
                                          >
                                            <FaTwitter className="mr-1" />
                                            @{coin.twitter}
                                          </a>
                                        )}
                                        <div className="text-xs text-gray-500 mt-1 max-w-xs whitespace-normal hidden sm:block">
                                          {coin.description}
                                        </div>
                                        <div className="flex flex-wrap gap-1 mt-1 hidden sm:flex">
                                          {getTagsForCoin(coin).map((tag, index) => (
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
                                    <div className="text-sm text-gray-500">${formatMarketCap(coin)}</div>
                                    <div className="text-sm text-gray-500">{coin.day.holders} holders</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                      ${coin.priceAtListed ? coin.priceAtListed.toFixed(8) : '-'}
                                    </div>
                                    <div className={`text-sm ${calculatePriceChangeSinceListed(coin).change !== null && parseFloat(calculatePriceChangeSinceListed(coin).change) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              ${calculatePriceChangeSinceListed(coin).change !== null ? `${calculatePriceChangeSinceListed(coin).change} / ${calculatePriceChangeSinceListed(coin).percentage}` : '-'}
                            </div>
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
                                    <div className="text-sm text-gray-900 flex items-center">
                                      {coin.chain === 'solana' ? (
                                        <>
                                          <a
                                            href={`https://solscan.io/token/${coin.contractAddress}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 mr-2"
                                            onClick={() => sendGAEvent({ event: 'clickContractAddress', coinId: coin.id, contractAddress: coin.contractAddress })}
                                          >
                                            {`${coin.contractAddress.slice(0, 6)}...${coin.contractAddress.slice(-4)}`}
                                          </a>
                                          <button
                                            onClick={() => copyToClipboard(coin.contractAddress)}
                                            className="text-gray-400 hover:text-gray-600"
                                            title="Copy contract address"
                                          >
                                            <ClipboardDocumentIcon className="h-5 w-5" />
                                          </button>
                                        </>
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
