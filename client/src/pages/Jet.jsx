import { useState } from 'react';
import { Music, Share2, ChevronRight, CheckCircle, Globe, Rocket, List, Wallet, DollarSign, TrendingUp, CreditCard } from 'lucide-react';
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
    } else if (option === 'wallet') {
      navigate('/wallet');
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
    <div 
      className="min-h-screen my-13"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <Navbar name="Creator Hub" />
      <header className="pt-12 pb-6 px-4 text-center">
        <div className="inline-block mb-4">
          <div className="h-16 w-16 bg-[#1c6350] rounded-full flex items-center justify-center mx-auto">
            <Music size={32} className="text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-3 text-[#1c6350] dark:text-[#2d8c72]">
          Music Creator Hub
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
          Manage your music career in one place - promote, distribute, and track your earnings
        </p>
      </header>

      <div className="fixed bottom-20 right-6 z-50">
        <Link
          to="/user/promotions"
          className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#1a5f4b] to-[#2d7a63] text-blue-200 border-2 border-[#1a5f4b] font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" 
        >
          <List className="w-5 h-5 text-white" />
          <span className='text-white'>My Promotions</span>
        </Link>
      </div>

      <main className="container mx-auto px-4 pt-4 pb-16 max-w-6xl">
        {/* 2x2 Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Global Promotion - Top Left */}
          <motion.div 
            className="rounded-2xl p-6 bg-gradient-to-r from-[#1c6350] to-[#2a9d8f] shadow-xl cursor-pointer overflow-hidden group h-full"
            onClick={() => handleOptionSelect('global-promotion')}
            initial="initial"
            animate="animate"
            variants={pulseVariants}
          >
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <motion.div 
                    className="p-3 rounded-xl text-[#1c6350]"
                    style={{ backgroundColor: 'var(--color-bg-primary)' }}
                    variants={bounceVariants}
                  >
                    <Rocket size={24} />
                  </motion.div>
                  <div className="text-white">
                    <span className="block text-xs font-medium opacity-80">PREMIUM</span>
                    <h2 className="text-xl font-bold">Global Promotion</h2>
                  </div>
                </div>
                <ChevronRight className="text-white" size={20} />
              </div>
              
              <p className="text-white/90 mb-4 text-sm flex-grow">
                Supercharge your reach with our ultimate promotion package for maximum exposure.
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-white">
                  <CheckCircle size={14} className="text-white mr-2" />
                  <span className="text-xs">Cross-platform promotion</span>
                </div>
                <div className="flex items-center text-white">
                  <CheckCircle size={14} className="text-white mr-2" />
                  <span className="text-xs">Influencer partnerships</span>
                </div>
                <div className="flex items-center text-white">
                  <CheckCircle size={14} className="text-white mr-2" />
                  <span className="text-xs">Social media campaigns</span>
                </div>
              </div>
              
              <motion.button 
                className="mt-auto py-2 px-4 text-[#1c6350] rounded-lg font-semibold text-sm flex items-center justify-center space-x-1 transition-colors"
                style={{ 
                  backgroundColor: 'var(--color-bg-primary)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--color-bg-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--color-bg-primary)';
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Launch Campaign</span>
                <Rocket size={16} />
              </motion.button>
            </div>
          </motion.div>

          {/* Promotion Option - Top Right */}
          <motion.div 
            className="rounded-xl p-6 border-2 border-[#1c6350] shadow-lg h-full flex flex-col"
            style={{ backgroundColor: 'var(--color-bg-primary)' }}
            onClick={() => handleOptionSelect('promotion')}
            whileHover={{ y: -5 }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-[#1c6350] rounded-xl text-white">
                <Music size={24} />
              </div>
              <ChevronRight className="text-[#1c6350]" size={20} />
            </div>
            <h2 className="text-xl font-bold mb-3 text-[#1c6350]">In-App Promotion</h2>
            <p 
              className="mb-4 text-sm flex-grow"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Amplify your music within our platform. Get featured in playlists and build your audience.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center">
                <CheckCircle size={14} className="text-[#1c6350] mr-2" />
                <span className="text-xs" style={{ color: 'var(--color-text-primary)' }}>Featured in playlists</span>
              </div>
              <div className="flex items-center">
                <CheckCircle size={14} className="text-[#1c6350] mr-2" />
                <span className="text-xs" style={{ color: 'var(--color-text-primary)' }}>Discover page spotlight</span>
              </div>
              <div className="flex items-center">
                <CheckCircle size={14} className="text-[#1c6350] mr-2" />
                <span className="text-xs" style={{ color: 'var(--color-text-primary)' }}>Targeted recommendations</span>
              </div>
            </div>
            <button className="mt-auto w-full py-2 px-4 bg-[#1c6350] text-white rounded-lg font-semibold text-sm flex items-center justify-center hover:bg-[#15503f] transition-colors">
              <span>Promote Your Music</span>
              <ChevronRight size={16} className="ml-1" />
            </button>
          </motion.div>

          {/* Distribution Option - Bottom Left */}
          <motion.div 
            className="rounded-xl p-6 border-2 border-[#1c6350] shadow-lg h-full flex flex-col"
            style={{ backgroundColor: 'var(--color-bg-primary)' }}
            onClick={() => handleOptionSelect('distribution')}
            whileHover={{ y: -5 }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-[#1c6350] rounded-xl text-white">
                <Share2 size={24} />
              </div>
              <ChevronRight className="text-[#1c6350]" size={20} />
            </div>
            <h2 className="text-xl font-bold mb-3 text-[#1c6350]">Global Distribution</h2>
            <p 
              className="mb-4 text-sm flex-grow"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Share your music across all major streaming platforms worldwide.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center">
                <CheckCircle size={14} className="text-[#1c6350] mr-2" />
                <span className="text-xs" style={{ color: 'var(--color-text-primary)' }}>150+ platforms</span>
              </div>
              <div className="flex items-center">
                <CheckCircle size={14} className="text-[#1c6350] mr-2" />
                <span className="text-xs" style={{ color: 'var(--color-text-primary)' }}>Royalty collection</span>
              </div>
              <div className="flex items-center">
                <CheckCircle size={14} className="text-[#1c6350] mr-2" />
                <span className="text-xs" style={{ color: 'var(--color-text-primary)' }}>Release scheduling</span>
              </div>
            </div>
            <button className="mt-auto w-full py-2 px-4 bg-[#1c6350] text-white rounded-lg font-semibold text-sm flex items-center justify-center hover:bg-[#15503f] transition-colors">
              <span>Distribute Your Music</span>
              <ChevronRight size={16} className="ml-1" />
            </button>
          </motion.div>

          {/* Wallet Section - Bottom Right */}
          <motion.div 
            className="rounded-xl p-6 border-2 border-[#1c6350] shadow-lg h-full flex flex-col"
            style={{ backgroundColor: 'var(--color-bg-primary)' }}
            onClick={() => handleOptionSelect('wallet')}
            whileHover={{ y: -5 }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-[#1c6350] rounded-xl text-white">
                <Wallet size={24} />
              </div>
              <ChevronRight className="text-[#1c6350]" size={20} />
            </div>
            <h2 className="text-xl font-bold mb-3 text-[#1c6350]">Wallet & Earnings</h2>
            <p 
              className="mb-4 text-sm flex-grow"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Track your earnings, withdraw funds, and manage your revenue from promotions and distributions.
            </p>
            
            {/* Earnings Summary */}
            <div className="bg-gray-700 rounded-lg p-3 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Available Balance</span>
                <span className="text-lg font-bold text-[#1c6350]">$1,250.00</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span style={{ color: 'var(--color-text-secondary)' }}>Pending: $350.00</span>
                <span style={{ color: 'var(--color-text-secondary)' }}>Total Earned: $4,820.00</span>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center">
                <DollarSign size={14} className="text-[#1c6350] mr-2" />
                <span className="text-xs" style={{ color: 'var(--color-text-primary)' }}>Withdraw earnings</span>
              </div>
              <div className="flex items-center">
                <TrendingUp size={14} className="text-[#1c6350] mr-2" />
                <span className="text-xs" style={{ color: 'var(--color-text-primary)' }}>Revenue tracking</span>
              </div>
              <div className="flex items-center">
                <CreditCard size={14} className="text-[#1c6350] mr-2" />
                <span className="text-xs" style={{ color: 'var(--color-text-primary)' }}>Transaction history</span>
              </div>
            </div>
            <button className="mt-auto w-full py-2 px-4 bg-[#1c6350] text-white rounded-lg font-semibold text-sm flex items-center justify-center hover:bg-[#15503f] transition-colors">
              <span>View Wallet</span>
              <ChevronRight size={16} className="ml-1" />
            </button>
          </motion.div>
        </div>

        <div 
          className="mt-12 text-center"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <p>Need help deciding? <a href="#" className="text-[#1c6350] font-medium hover:underline">Contact our support team</a></p>
        </div>
      </main>
      <BottomNav activeTab="home" />
    </div>
  );
}