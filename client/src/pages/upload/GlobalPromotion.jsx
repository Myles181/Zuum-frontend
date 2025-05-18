import { useState } from 'react';
import { Newspaper, Tv, Radio, Music, Globe, TrendingUp, ListMusic, PlayCircle, Check, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../../components/profile/NavBar';
import BottomNav from '../../components/homepage/BottomNav';

const PromotionPlatforms = () => {
 const [activeTab, setActiveTab] = useState('print');
  const [expandedPlatform, setExpandedPlatform] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

    const tabs = [
    { id: 'print', icon: <Newspaper size={18} />, label: 'Print Media' },
    { id: 'tv', icon: <Tv size={18} />, label: 'TV Promotion' },
    { id: 'radio', icon: <Radio size={18} />, label: 'Radio' },
    { id: 'digital', icon: <Globe size={18} />, label: 'Digital' },
    { id: 'chart', icon: <TrendingUp size={18} />, label: 'Charts' },
    { id: 'playlist', icon: <ListMusic size={18} />, label: 'Playlists' },
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
  ]
}

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
    <div className="min-h-screen bg-gray-50 my-13">
      <Navbar name="Global Promotion" />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#1a5f4b] to-[#2a9d8f] text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <div className="h-16 w-16 bg-white/10 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm border border-white/20">
              <Globe size={28} className="text-white" />
            </div>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Amplify Your Reach</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Premium promotion packages across print, TV, digital and international media
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
                className={`flex items-center px-4 py-2.5 rounded-lg whitespace-nowrap transition-all text-sm font-medium ${activeTab === tab.id ? 'bg-[#1c6350] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
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

        {/* Platforms Grid */}
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