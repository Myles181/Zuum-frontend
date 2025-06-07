import { useState } from 'react';
import { Music, Share2, ChevronRight, CheckCircle, Globe, Rocket, List } from 'lucide-react';
import Navbar from '../components/profile/NavBar';
import BottomNav from '../components/homepage/BottomNav';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Jet = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();

  const handleOptionSelect = (option) => {
    if (option === 'promotion') {
      navigate('/promotion');
    } else if (option === 'distribution') {
      navigate('/distribution');
    } else {
      navigate('/global');
    }
    setSelectedOption(option);
  };

  // Animation variants
  const bounceVariants = {
    initial: { y: 0 },
    animate: { 
      y: [-5, 5, -5, 5, 0],
      transition: { 
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-white my-13">
      <Navbar name="Creator Hub" />
      <header className="pt-12 pb-6 px-4 text-center">
        <div className="inline-block mb-4">
          <div className="h-16 w-16 bg-[#1c6350] rounded-full flex items-center justify-center mx-auto">
            <Music size={32} className="text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-3 text-[#1c6350]">
          Music Creator Hub
        </h1>
        <p className="text-lg text-gray-600 max-w-lg mx-auto">
          Take your music to the next level - choose how you want to share your sound with the world
        </p>
      </header>

          <div className="fixed bottom-20 right-6 z-50">
        <Link
          to="/user/promotions"
          className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#1a5f4b] to-[#2d7a63] text-white border-2 border-[#1a5f4b] font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" 
        >
          <List className="w-5 h-5" />
          <span>My Promotions</span>
        
        </Link>
      </div>

      <main className="container mx-auto px-4 pt-4 pb-16 max-w-5xl">
        {/* Global Promotion Option - NEW STARRED SECTION */}
        <motion.div 
          className="relative mb-12 rounded-2xl p-8 bg-gradient-to-r from-[#1c6350] to-[#2a9d8f] shadow-2xl cursor-pointer overflow-hidden group"
          onClick={() => handleOptionSelect('global-promotion')}
          initial="initial"
          animate="animate"
          variants={pulseVariants}
        >
          {/* Floating elements for decoration */}
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10"></div>
          <div className="absolute -bottom-5 -left-5 w-20 h-20 rounded-full bg-white/10"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                <motion.div 
                  className="p-4 bg-white rounded-xl text-[#1c6350]"
                  variants={bounceVariants}
                >
                  <Rocket size={32} />
                </motion.div>
                <div className="text-white">
                  <span className="block text-sm font-medium opacity-80">PREMIUM</span>
                  <h2 className="text-3xl font-bold">Global Promotion</h2>
                </div>
              </div>
              <ChevronRight className="text-white" size={28} />
            </div>
            
            <p className="text-white/90 mb-6 text-lg max-w-2xl">
              <span className="font-semibold">Supercharge your reach</span> with our ultimate promotion package that combines platform distribution, social media campaigns, and influencer marketing for maximum exposure.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-white">
                <CheckCircle size={18} className="text-white mr-3" />
                <span className="text-base">Cross-platform promotion</span>
              </div>
              <div className="flex items-center text-white">
                <CheckCircle size={18} className="text-white mr-3" />
                <span className="text-base">Influencer partnerships</span>
              </div>
              <div className="flex items-center text-white">
                <CheckCircle size={18} className="text-white mr-3" />
                <span className="text-base">Social media campaigns</span>
              </div>
              <div className="flex items-center text-white">
                <CheckCircle size={18} className="text-white mr-3" />
                <span className="text-base">Press coverage</span>
              </div>
            </div>
            
            <motion.button 
              className="mt-4 py-3 px-6 bg-white text-[#1c6350] rounded-lg font-bold text-lg flex items-center justify-center space-x-2 group-hover:bg-[#f0f0f0] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Launch Global Campaign</span>
              <Rocket size={20} />
            </motion.button>
          </div>
        </motion.div>

        {/* Original Options */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Promotion Option */}
          <motion.div 
            className="bg-white rounded-xl p-8 border-2 border-[#1c6350] shadow-lg shadow-[#1c6350]/10 hover:shadow-xl hover:shadow-[#1c6350]/20 transition-all cursor-pointer"
            onClick={() => handleOptionSelect('promotion')}
            whileHover={{ y: -5 }}
          >
            <div className="flex justify-between items-start mb-8">
              <div className="p-4 bg-[#1c6350] rounded-xl text-white">
                <Music size={32} />
              </div>
              <ChevronRight className="text-[#1c6350]" size={28} />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-[#1c6350]">In-App Promotion</h2>
            <p className="text-gray-600 mb-6 text-lg">
              Amplify your music within our platform. Get featured in playlists, gain exposure to our community of listeners, and build your audience.
            </p>
            <div className="space-y-4">
              <div className="flex items-center text-gray-700">
                <CheckCircle size={18} className="text-[#1c6350] mr-3" />
                <span className="text-base">Featured in app playlists</span>
              </div>
              <div className="flex items-center text-gray-700">
                <CheckCircle size={18} className="text-[#1c6350] mr-3" />
                <span className="text-base">Spotlight on discover page</span>
              </div>
              <div className="flex items-center text-gray-700">
                <CheckCircle size={18} className="text-[#1c6350] mr-3" />
                <span className="text-base">Targeted user recommendations</span>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button className="w-full py-3 px-4 bg-[#1c6350] text-white rounded-lg font-medium text-lg flex items-center justify-center hover:bg-[#15503f] transition-colors">
                <span>Promote Your Music</span>
                <ChevronRight size={20} className="ml-2" />
              </button>
            </div>
          </motion.div>

          {/* Distribution Option */}
          <motion.div 
            className="bg-white rounded-xl p-8 border-2 border-[#1c6350] shadow-lg shadow-[#1c6350]/10 hover:shadow-xl hover:shadow-[#1c6350]/20 transition-all cursor-pointer"
            onClick={() => handleOptionSelect('distribution')}
            whileHover={{ y: -5 }}
          >
            <div className="flex justify-between items-start mb-8">
              <div className="p-4 bg-[#1c6350] rounded-xl text-white">
                <Share2 size={32} />
              </div>
              <ChevronRight className="text-[#1c6350]" size={28} />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-[#1c6350]">Global Distribution</h2>
            <p className="text-gray-600 mb-6 text-lg">
              Share your music across all major streaming platforms. Reach millions of potential listeners worldwide and maximize your revenue.
            </p>
            <div className="space-y-4">
              <div className="flex items-center text-gray-700">
                <CheckCircle size={18} className="text-[#1c6350] mr-3" />
                <span className="text-base">Release to 150+ platforms</span>
              </div>
              <div className="flex items-center text-gray-700">
                <CheckCircle size={18} className="text-[#1c6350] mr-3" />
                <span className="text-base">Royalty collection</span>
              </div>
              <div className="flex items-center text-gray-700">
                <CheckCircle size={18} className="text-[#1c6350] mr-3" />
                <span className="text-base">Release scheduling</span>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button className="w-full py-3 px-4 bg-[#1c6350] text-white rounded-lg font-medium text-lg flex items-center justify-center hover:bg-[#15503f] transition-colors">
                <span>Distribute Your Music</span>
                <ChevronRight size={20} className="ml-2" />
              </button>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 text-center text-gray-500">
          <p>Need help deciding? <a href="#" className="text-[#1c6350] font-medium hover:underline">Contact our support team</a></p>
        </div>
      </main>
      <BottomNav activeTab="home" />
    </div>
  );
}