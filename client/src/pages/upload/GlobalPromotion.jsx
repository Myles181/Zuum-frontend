import { useState } from 'react';
import { Newspaper, Tv, Radio, Music, Globe, TrendingUp, ListMusic, PlayCircle, Check, X, Music2, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../../components/profile/NavBar';
import BottomNav from '../../components/homepage/BottomNav';
import { usePackages } from '../../../Hooks/search/useAllPost';
import {AllPromotionForms} from '../PromotionForm'; // Import the new component

const PromotionPlatforms = () => {
  const [activeTab, setActiveTab] = useState('tiktok');
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false); // New state for form modal
  const { packages, loading, error } = usePackages();

  const tabs = [
    { id: 'youtube', icon: <PlayCircle size={18} />, label: 'YouTube' },
    { id: 'tiktok', icon: <Music2 size={18} />, label: 'TikTok' },
    { id: 'national', icon: <Newspaper size={18} />, label: 'Print Media' },
    { id: 'tv', icon: <Tv size={18} />, label: 'TV Promotion' },
    { id: 'radio', icon: <Radio size={18} />, label: 'Radio' },
    { id: 'digital', icon: <Globe size={18} />, label: 'Digital' },
    { id: 'chart', icon: <TrendingUp size={18} />, label: 'Charts' },
    { id: 'playlist', icon: <ListMusic size={18} />, label: 'Playlist' },
    { id: 'international', icon: <PlayCircle size={18} />, label: 'International' }
  ];

  const getPackagesByCategory = (category) => {
    if (!packages) return [];
    return packages.filter(pkg => pkg.category === category);
  };

  const formatCurrency = (value, currency = '₦') => {
    return `${currency}${value?.toLocaleString()}`;
  };

  const handleSelectPlatform = (platform) => {
    setSelectedPlatform(platform);
    setShowConfirmation(true);
  };

  const confirmPurchase = () => {
    setShowConfirmation(false);
    setShowFormModal(true); // Show the form modal instead of navigating
  };

  if (loading) return <div>Loading packages...</div>;
  if (error) return <div>Error loading packages</div>

  return (
    <div className={`min-h-screen my-13 ${
      activeTab === 'youtube' ? 'bg-red-700 text-white' :
      activeTab === 'tiktok' ? 'bg-black text-white' :
      'bg-gray-50'
    }`}>
      <Navbar name="Global Promotion" />
      
      {/* Hero Section with dynamic background */}
      <div className={`py-12 px-4 text-white ${
        activeTab === 'youtube' ? 'bg-gradient-to-r from-red-900 to-red-700' :
        activeTab === 'tiktok' ? 'bg-gradient-to-r from-black to-gray-900' :
        'bg-gradient-to-r from-[#1a5f4b] to-[#2a9d8f]'
      }`}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <div className={`h-16 w-16 rounded-full flex items-center justify-center mx-auto ${
              activeTab === 'youtube' ? 'bg-red-700' :
              'bg-white/10 backdrop-blur-sm border border-white/20'
            }`}>
              {activeTab === 'tiktok' ? (
                <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              ) : activeTab === 'youtube' ? (
                <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              ) : (
                <Globe size={28} className="text-white" />
              )}
            </div>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {activeTab === 'tiktok' ? 'TikTok Viral Packages' : 
             activeTab === 'youtube' ? 'YouTube Promotion Packages' : 
             `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Promotion`}
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            {activeTab === 'tiktok' 
              ? 'Make your music trend on TikTok with our powerful promotion packages' 
              : activeTab === 'youtube'
              ? 'Boost your YouTube presence with our targeted promotion packages'
              : 'Premium promotion packages across various media platforms'}
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
                      : tab.id === 'youtube'
                      ? 'bg-red-700 text-white'
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
        {activeTab === 'youtube' || activeTab === 'tiktok' ? (
          <div className="space-y-6">
            {getPackagesByCategory(activeTab).map((pkg) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`bg-gradient-to-br rounded-xl shadow-lg overflow-hidden border ${
                  activeTab === 'youtube' 
                    ? 'from-red-900 to-red-800 border-red-100' 
                    : 'from-black to-gray-800 border-gray-100'
                }`}
              >
                <div className={`p-6 backdrop-blur-sm ${
                  activeTab === 'youtube' ? 'bg-red-900/30' : 'bg-black/30'
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{pkg.name}</h3>
                      {pkg.description && (
                        <p className="text-white/80 italic">{pkg.description}</p>
                      )}
                    </div>
                    <div className={`text-xl font-bold px-4 py-2 rounded-full ${
                      activeTab === 'youtube' ? 'bg-white text-red-600' : 'bg-white text-black'
                    }`}>
                      {formatCurrency(pkg.total, pkg.currency)}
                    </div>
                  </div>

                  {pkg.features?.length > 0 && (
                    <div className="my-6">
                      <h4 className="text-lg font-semibold mb-3 text-white">What You Get:</h4>
                      <ul className="space-y-3">
                        {pkg.features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <div className="flex-shrink-0 mt-1">
                              <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                                activeTab === 'youtube' ? 'bg-white text-red-600' : 'bg-white text-black'
                              }`}>
                                <Check className="h-3 w-3" />
                              </div>
                            </div>
                            <span className="ml-3 text-white">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    onClick={() => handleSelectPlatform(pkg)}
                    className={`w-full py-3 px-4 rounded-lg font-bold text-lg transition-colors flex items-center justify-center ${
                      activeTab === 'youtube' 
                        ? 'bg-white hover:bg-gray-100 text-red-600' 
                        : 'bg-white hover:bg-gray-100 text-black'
                    }`}
                  >
                    <span>Select Package</span>
                    <ChevronRight className="ml-2" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {getPackagesByCategory(activeTab).map((platform) => (
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
                      {platform.duration || '1 month'}
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

                  {platform.features?.length > 0 && (
                    <div className="pt-3 border-t border-gray-100">
                      <div className="text-sm text-gray-600 mb-2">Includes:</div>
                      <ul className="grid grid-cols-2 gap-2 text-sm">
                        {platform.features.slice(0, 4).map((feature, i) => (
                          <li key={i} className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            <span className="truncate">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {getPackagesByCategory(activeTab)?.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Newspaper className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No packages available</h3>
            <p className="mt-1 text-sm text-gray-500">There are currently no packages in this category.</p>
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


      {/* New Form Modal (Bottom Sheet) */}
      <AnimatePresence>
        {showFormModal && selectedPlatform && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowFormModal(false)}
            />
            
            {/* Bottom Sheet */}
            
                      {/* Modal container */}
                      <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{
                          type: "spring",
                          damping: 25,
                          stiffness: 300
                        }}
                        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white shadow-2xl max-h-[85vh] overflow-hidden"
                        onClick={e => e.stopPropagation()} // prevent backdrop click
                      >
              {/* Grab Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>
              
              {/* Form Container */}
              <div className="max-h-[80vh] overflow-y-auto p-6">
                <AllPromotionForms 
                  selectedPlatform={selectedPlatform}
                  onClose={() => setShowFormModal(false)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <BottomNav activeTab="home" />
    </div>
  );
};

export default PromotionPlatforms;