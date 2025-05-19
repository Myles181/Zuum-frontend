import { useState } from 'react';
import { Newspaper, Tv, Radio, Music, Globe, TrendingUp, ListMusic, PlayCircle, Check, X, Music2, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../../components/profile/NavBar';
import BottomNav from '../../components/homepage/BottomNav';

const PromotionPlatforms = () => {
  const [activeTab, setActiveTab] = useState('tiktok'); // Default to TikTok tab
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const tabs = [
    { id: 'tiktok', icon: <Music2 size={18} />, label: 'TikTok' },
    { id: 'print', icon: <Newspaper size={18} />, label: 'Print Media' },
    { id: 'tv', icon: <Tv size={18} />, label: 'TV Promotion' },
    { id: 'radio', icon: <Radio size={18} />, label: 'Radio' },
    { id: 'digital', icon: <Globe size={18} />, label: 'Digital' },
    { id: 'chart', icon: <TrendingUp size={18} />, label: 'Charts' },
    { id: 'playlist', icon: <ListMusic size={18} />, label: 'Playlist' },
    { id: 'international', icon: <PlayCircle size={18} />, label: 'International' }
  ];

 const platformData = {
   print: [
    { id: 1, name: 'Thisday', price: 45000, total: 49050 },
    { id: 2, name: 'Sunnews', price: 45000, total: 49050 },
    { id: 3, name: 'Thenation', price: 45000, total: 49050 },
    { id: 4, name: 'Guardian', price: 45000, total: 49050 },
    { id: 5, name: 'Tribune', price: 45000, total: 49050 },
    { id: 6, name: 'Vanguard', price: 45000, total: 49050 },
    { id: 7, name: 'Businessday', price: 85000, total: 92650 },
    { id: 8, name: 'Leadership', price: 45000, total: 49050 },
    { id: 9, name: 'Dailytrust', price: 70000, total: 76300 },
    { id: 10, name: 'Independent', price: 50000, total: 54500 },
    { id: 11, name: 'News Digest', price: 90000, total: 98100 },
    { id: 12, name: 'Withinnigeria', price: 50000, total: 54500 },
    { id: 13, name: 'Pmnewsnigeria', price: 50000, total: 54500 },
    { id: 14, name: 'Telegraph', price: 50000, total: 54500 },
    { id: 15, name: 'Premium Times', price: 170000, total: 185300 },
    { id: 16, name: 'Punch', price: 100000, total: 109000 },
    { id: 17, name: 'Legit.ng', price: 200000, total: 218000 },
    { id: 18, name: 'Yabaleft', price: 350000, total: 381500 },
    { id: 19, name: 'Pulse', price: 210000, total: 228900 }
  ],

   tv: [
    { id: 1, name: 'Trace TV (New)', price: 1500000, total: 1635000 },
    { id: 2, name: 'Trace TV (B2B)', price: 780000, total: 850200 },
    { id: 3, name: 'MTV Base (3 times weekly)', price: 850000, total: 926500 },
    { id: 4, name: 'MTV Base (5 times weekly)', price: 1200000, total: 1308000 },
    { id: 5, name: 'SoundCity (5 times weekly)', price: 950000, total: 1035500 },
    { id: 6, name: 'SoundCity (2 times daily)', price: 1100000, total: 1199000 },
    { id: 7, name: 'Hip TV (3 times weekly)', price: 750000, total: 817500 },
    { id: 8, name: 'Hip TV (Nextrated Interview)', price: 600000, total: 654000 },
    { id: 9, name: 'Afropop TV (2 times daily)', price: 600000, total: 654000 },
    { id: 10, name: 'Afropop TV (5 times daily)', price: 1200000, total: 1308000 },
    { id: 11, name: 'On TV', price: 550000, total: 599500 },
    { id: 12, name: 'Terrestrial TV Stations Plug', price: 600000, total: 654000 },
    { id: 13, name: 'BRT TV (Established Artist)', price: 600000, total: 654000 },
    { id: 14, name: 'BRT TV (Up & Coming)', price: 500000, total: 545000 }
  ],

   radio: [
    { id: 1, name: 'Beat FM', price: 150000, total: 163500 },
    { id: 2, name: 'Tincity', price: 150000, total: 163500 },
    { id: 3, name: 'Lagos Talks FM', price: 150000, total: 163500 },
    { id: 4, name: 'Solid FM', price: 150000, total: 163500 },
    { id: 5, name: 'Nigeria Info FM', price: 150000, total: 163500 },
    { id: 6, name: 'Cool FM', price: 150000, total: 163500 },
    { id: 7, name: 'Ray Power FM', price: 150000, total: 163500 },
    { id: 8, name: 'Brila FM', price: 150000, total: 163500 },
    { id: 9, name: 'Max FM', price: 150000, total: 163500 },
    { id: 10, name: 'Wazobia FM', price: 150000, total: 163500 },
    { id: 11, name: 'Naija FM', price: 150000, total: 163500 }
    ],

   digital: [
    { id: 1, name: 'Audiomack front page Trending', price: 200000, total: 218000 },
    { id: 2, name: 'Boomplay front page Trending', price: 300000, total: 327000 },
    { id: 3, name: 'EPK (Electronic Press Kit)', price: 80000, total: 87200 },
    { id: 4, name: 'Instablog9ja', price: 400000, total: 436450 },
    { id: 5, name: 'Gossipmill', price: 370000, total: 403716 },
    { id: 6, name: 'Legit', price: 250000, total: 272781 },
    { id: 7, name: 'Tunde Ednut', price: 650000, total: 709231 },
    { id: 8, name: 'Yabaleft', price: 380000, total: 414628 },
    { id: 9, name: 'Pulse', price: 380000, total: 414628 },
    { id: 10, name: 'GoldMyne TV', price: 300000, total: 327338 },
    { id: 11, name: 'Gistreel', price: 380000, total: 414628 },
    { id: 12, name: 'Kraks TV', price: 250000, total: 272781 }
  ],

   chart: [
    { id: 1, name: 'Deezer Top 50', price: 1100000, total: 1199000, duration: '1 month' },
    { id: 2, name: 'Audiomack chart (afro sound)', price: 3500000, total: 3815000, duration: '3 weeks' },
    { id: 3, name: 'Audiomack Hiphop Chart', price: 2800000, total: 3052000, duration: '3 weeks' }
  ],

   playlist: [
    { id: 1, name: 'Spotify Curated Playlist', price: 25000, total: 27344, duration: '1 month' },
    { id: 2, name: 'Apple Music Curated Playlist', price: 25000, total: 27344, duration: '1 month' },
    { id: 3, name: 'Audiomack Curated Playlist', price: 25000, total: 27344, duration: '1 month' },
    { id: 4, name: 'Boomplay Editorials Playlist', price: 80000, total: 87660, duration: '1 month' },
    { id: 5, name: 'Audiomack Editorials Playlist', price: 120000, total: 131490, duration: '1 month' }
  ],

   international:  [
    { id: 1, name: '$700 Package (100+ intl sites)', price: 700, currency: '$', total: 763 },
    { id: 2, name: 'Forbes', price: 5000, currency: '$', total: 5450 },
    { id: 3, name: 'AP News', price: 500000, total: 545000 },
    { id: 4, name: 'New York Times', price: 550000, total: 599500 },
    { id: 5, name: 'Business Insider', price: 550000, total: 599500 }
  ],

 tiktok: [
      {
        id: 1,
        name: 'Mid TikTok Promotion',
        price: 1000000,
        total: 1090000,
        features: [
          '1 Personal CapCut Template',
          'Intensive Push on TikTok',
          'Activation from Micro & Top Influencers',
          'Sound Activation Strategy',
          'Audience Retention Strategy',
          'Organic growth and curated attention'
        ],
        tag: 'Perfect for artists who want a strong start'
      },
      {
        id: 2,
        name: 'Wild TikTok Promotion',
        price: 3000000,
        total: 3270000,
        features: [
          '1 Personal CapCut Template',
          'Intensive Push on TikTok',
          'Activation from Top Influencers',
          'Sound Placement on TikTok Lyrics Pages',
          'Full TikTok Promotion Strategy & Execution',
          'Strategic targeting to help your sound trend'
        ],
        tag: 'Go wild and viral with aggressive backing'
      },
      {
        id: 3,
        name: 'Mass TikTok Promotion',
        price: 7000000,
        total: 7630000,
        features: [
          '3 Custom CapCut Templates',
          'Extreme Hard Push on TikTok',
          'Activation by High-Profile & Famous Influencers',
          'TikTok Challenge to push virality',
          'Song Placement on 3 TikTok Lyrics Pages',
          'Full Strategic Promotion Campaign Plan',
          'Dedicated Team to Monitor & Push Your Sound',
          'Guaranteed Trend Activation'
        ],
        tag: 'Maximum exposure and high-level activation'
      }
    ]
  };

  const formatCurrency = (value, currency = '₦') => {
    return `${currency}${value.toLocaleString()}`;
  };

  const handleSelectPlatform = (platform) => {
    setSelectedPlatform(platform);
    setShowConfirmation(true);
  };

  const confirmPurchase = () => {
    // Handle purchase logic here
    console.log('Purchased:', selectedPlatform);
    setShowConfirmation(false);
    // Add success notification/modal here if needed
  };

  return (
    <div className={`min-h-screen  my-13 ${
        activeTab === 'tiktok' 
          ? 'bg-gradient-to-r from-black to-gray-900' 
          : 'bg-gray-50'
      }`}>
      <Navbar name="Global Promotion" />
      
      {/* Hero Section with dynamic background */}
      <div className={`py-12 px-4 text-white ${
        activeTab === 'tiktok' 
          ? 'bg-gradient-to-r from-black to-gray-900' 
          : 'bg-gradient-to-r from-[#1a5f4b] to-[#2a9d8f]'
      }`}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <div className={`h-16 w-16 rounded-full flex items-center justify-center mx-auto ${
              activeTab === 'tiktok'
                ? 'bg-gradient-to-br from-[#FE2C55] to-[#25F4EE]'
                : 'bg-white/10 backdrop-blur-sm border border-white/20'
            }`}>
              {activeTab === 'tiktok' ? (
                <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              ) : (
                <Globe size={28} className="text-white" />
              )}
            </div>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {activeTab === 'tiktok' ? 'TikTok Viral Packages' : 'Amplify Your Reach'}
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            {activeTab === 'tiktok' 
              ? 'Make your music trend on TikTok with our powerful promotion packages' 
              : 'Premium promotion packages across print, TV, digital and international media'}
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Tab Navigation */}
        <div className="mb-8 bg-white rounded-xl shadow-sm p-1">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2.5 rounded-lg whitespace-nowrap transition-all text-sm font-medium ${
                  activeTab === tab.id 
                    ? tab.id === 'tiktok'
                      ? 'bg-black text-white'
                      : 'bg-[#1c6350] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Note Box */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Your content may be adjusted to meet platform standards. You'll have the opportunity to review before publishing.
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {activeTab === 'tiktok' ? (
  <div className="space-y-6">
    {platformData.tiktok.map((pkg) => (
      <motion.div
        key={pkg.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-br from-black to-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100"
      >
        {/* Inner container with slightly transparent background */}
        <div className="p-6 bg-black/30 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold text-white">{pkg.name}</h3>
              <p className="text-white/80 italic">{pkg.tag}</p>
            </div>
            <div className="bg-white text-black text-xl font-bold px-4 py-2 rounded-full">
              {formatCurrency(pkg.total)}
            </div>
          </div>

          <div className="my-6">
            <h4 className="text-lg font-semibold mb-3 text-white">What You Get:</h4>
            <ul className="space-y-3">
              {pkg.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-5 w-5 rounded-full bg-white flex items-center justify-center">
                      <Check className="h-3 w-3 text-black" />
                    </div>
                  </div>
                  <span className="ml-3 text-white">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => handleSelectPlatform(pkg)}
            className="w-full py-3 px-4 bg-white hover:bg-gray-100 text-black rounded-lg font-bold text-lg transition-colors flex items-center justify-center"
          >
            <span>Select Package</span>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="black" className="ml-2">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
            </svg>
          </button>
        </div>
      </motion.div>
    ))}
  </div>
) : (
  <div className="grid md:grid-cols-2 gap-6">
    {platformData[activeTab]?.map((platform) => (
      <motion.div 
        key={platform.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
      >
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-lg text-gray-800">{platform.name}</h3>
            <div className="bg-[#1c6350]/10 text-[#1c6350] text-xs font-medium px-2 py-1 rounded">
              {platform.duration || (activeTab === 'tv' ? '4-6 weeks' : '1 month')}
            </div>
          </div>
          
          <div className="flex items-end justify-between mb-4">
            <div>
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(platform.price, platform.currency)}
              </span>
              <div className="text-2xl font-bold text-[#1c6350]">
                {formatCurrency(platform.total, platform.currency)}
              </div>
            </div>
            <button 
              onClick={() => handleSelectPlatform(platform)}
              className="px-4 py-2 bg-[#1c6350] hover:bg-[#15503f] text-white rounded-lg text-sm font-medium transition-colors"
            >
              Select
            </button>
          </div>

          <div className="pt-3 border-t border-gray-100">
            <div className="text-sm text-gray-600 mb-2">Includes:</div>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <span>Platform fee</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <span>VAT 7.5%</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <span>Payment fee</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <span>Support</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
)}
        {/* Empty State */}
        {platformData[activeTab]?.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Newspaper className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No platforms available</h3>
            <p className="mt-1 text-sm text-gray-500">There are currently no platforms in this category.</p>
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && selectedPlatform && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Confirm Selection</h3>
                  <button 
                    onClick={() => setShowConfirmation(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{selectedPlatform.name}</span>
                      <span className="font-bold text-[#1c6350]">
                        {formatCurrency(selectedPlatform.total, selectedPlatform.currency)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Includes all fees and taxes
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>1 featured image (no links)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Content may be adjusted for platform</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>You'll review before publishing</span>
                    </li>
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmPurchase}
                    className="flex-1 py-2.5 px-4 bg-[#1c6350] hover:bg-[#15503f] text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <Check className="h-5 w-5 mr-1.5" />
                    Confirm Purchase
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <BottomNav activeTab="home" />
    </div>
  );
};

export default PromotionPlatforms;