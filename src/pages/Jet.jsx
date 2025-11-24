import { useState } from 'react';
import { Music, Share2, ChevronRight, CheckCircle, Globe, Rocket, List, Wallet, DollarSign, TrendingUp, CreditCard, BarChart3 } from 'lucide-react';
import Navbar from '../components/profile/NavBar';
import BottomNav from '../components/homepage/BottomNav';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Jet = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();

  // Dark mode styles - consistent with other components
  const darkModeStyles = {
    '--color-bg-primary': '#1a1a1a',
    '--color-bg-secondary': '#2d2d2d',
    '--color-text-primary': '#ffffff',
    '--color-text-secondary': '#9ca3af',
    '--color-primary': '#2D8C72',
    '--color-primary-light': '#34A085',
    '--color-text-on-primary': '#ffffff',
    '--color-border': '#374151'
  };

  const handleOptionSelect = (option) => {
    if (option === 'promotion') {
      navigate('/promotion');
    } else if (option === 'distribution') {
      navigate('/distribution');
    } else if (option === 'wallet') {
      navigate('/dashboard');
    } else if (option === 'analytics') {
      navigate('/analytics');
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
      style={{ 
        ...darkModeStyles,
        backgroundColor: 'var(--color-bg-primary)'
      }}
    >
      <Navbar name="Creator Hub" />
      <header className="pt-12 pb-6 px-4 text-center">
        <div className="inline-block mb-4">
          <div 
            className="h-16 w-16 rounded-full flex items-center justify-center mx-auto"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Music size={32} style={{ color: 'var(--color-text-on-primary)' }} />
          </div>
        </div>
        <h1 
          className="text-4xl font-bold mb-3"
          style={{ color: 'var(--color-primary)' }}
        >
          Music Creator Hub
        </h1>
        <p 
          className="text-lg max-w-lg mx-auto"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Manage your music career in one place - promote, distribute, and track your earnings
        </p>
      </header>

      <div className="fixed bottom-20 right-6 z-50">
        <Link
          to="/user/promotions"
          className="flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          style={{ 
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-text-on-primary)',
            border: `2px solid var(--color-primary)`
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'var(--color-primary-light)';
            e.target.style.borderColor = 'var(--color-primary-light)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'var(--color-primary)';
            e.target.style.borderColor = 'var(--color-primary)';
          }}
        >
          <List className="w-5 h-5" />
          <span>My Promotions</span>
        </Link>
      </div>

      <main className="container mx-auto px-4 pt-4 pb-16 max-w-6xl">
        {/* 2x2 Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Global Promotion - Top Left */}
          <motion.div 
            className="rounded-2xl p-6 shadow-xl cursor-pointer overflow-hidden group h-full"
            style={{ 
              background: 'linear-gradient(to right, var(--color-primary), var(--color-primary-light))'
            }}
            onClick={() => handleOptionSelect('global-promotion')}
            initial="initial"
            animate="animate"
            variants={pulseVariants}
          >
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <motion.div 
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: 'var(--color-bg-primary)' }}
                    variants={bounceVariants}
                  >
                    <Rocket size={24} style={{ color: 'var(--color-primary)' }} />
                  </motion.div>
                  <div style={{ color: 'var(--color-text-on-primary)' }}>
                    <span className="block text-xs font-medium opacity-80">PREMIUM</span>
                    <h2 className="text-xl font-bold">Global Promotion</h2>
                  </div>
                </div>
                <ChevronRight style={{ color: 'var(--color-text-on-primary)' }} size={20} />
              </div>
              
              <p className="mb-4 text-sm flex-grow" style={{ color: 'var(--color-text-on-primary)', opacity: 0.9 }}>
                Supercharge your reach with our ultimate promotion package for maximum exposure.
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center" style={{ color: 'var(--color-text-on-primary)' }}>
                  <CheckCircle size={14} className="mr-2" />
                  <span className="text-xs">Cross-platform promotion</span>
                </div>
                <div className="flex items-center" style={{ color: 'var(--color-text-on-primary)' }}>
                  <CheckCircle size={14} className="mr-2" />
                  <span className="text-xs">Influencer partnerships</span>
                </div>
                <div className="flex items-center" style={{ color: 'var(--color-text-on-primary)' }}>
                  <CheckCircle size={14} className="mr-2" />
                  <span className="text-xs">Social media campaigns</span>
                </div>
              </div>
              
              <motion.button 
                className="mt-auto py-2 px-4 rounded-lg font-semibold text-sm flex items-center justify-center space-x-1 transition-colors"
                style={{ 
                  backgroundColor: 'var(--color-bg-primary)',
                  color: 'var(--color-primary)'
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
            className="rounded-xl p-6 shadow-lg h-full flex flex-col"
            style={{ 
              backgroundColor: 'var(--color-bg-secondary)',
              border: '2px solid var(--color-primary)'
            }}
            onClick={() => handleOptionSelect('promotion')}
            whileHover={{ y: -5 }}
          >
            <div className="flex justify-between items-start mb-4">
              <div 
                className="p-3 rounded-xl"
                style={{ 
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-text-on-primary)'
                }}
              >
                <Music size={24} />
              </div>
              <ChevronRight style={{ color: 'var(--color-primary)' }} size={20} />
            </div>
            <h2 
              className="text-xl font-bold mb-3"
              style={{ color: 'var(--color-primary)' }}
            >
              In-App Promotion
            </h2>
            <p 
              className="mb-4 text-sm flex-grow"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Amplify your music within our platform. Get featured in playlists and build your audience.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center">
                <CheckCircle size={14} style={{ color: 'var(--color-primary)' }} className="mr-2" />
                <span className="text-xs" style={{ color: 'var(--color-text-primary)' }}>Featured in playlists</span>
              </div>
              <div className="flex items-center">
                <CheckCircle size={14} style={{ color: 'var(--color-primary)' }} className="mr-2" />
                <span className="text-xs" style={{ color: 'var(--color-text-primary)' }}>Discover page spotlight</span>
              </div>
              <div className="flex items-center">
                <CheckCircle size={14} style={{ color: 'var(--color-primary)' }} className="mr-2" />
                <span className="text-xs" style={{ color: 'var(--color-text-primary)' }}>Targeted recommendations</span>
              </div>
            </div>
            <button 
              className="mt-auto w-full py-2 px-4 rounded-lg font-semibold text-sm flex items-center justify-center transition-colors"
              style={{ 
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-text-on-primary)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--color-primary-light)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--color-primary)';
              }}
            >
              <span>Promote Your Music</span>
              <ChevronRight size={16} className="ml-1" />
            </button>
          </motion.div>

          {/* Distribution Option - Bottom Left */}
          <motion.div 
            className="rounded-xl p-6 shadow-lg h-full flex flex-col"
            style={{ 
              backgroundColor: 'var(--color-bg-secondary)',
              border: '2px solid var(--color-primary)'
            }}
            onClick={() => handleOptionSelect('distribution')}
            whileHover={{ y: -5 }}
          >
            <div className="flex justify-between items-start mb-4">
              <div 
                className="p-3 rounded-xl"
                style={{ 
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-text-on-primary)'
                }}
              >
                <Share2 size={24} />
              </div>
              <ChevronRight style={{ color: 'var(--color-primary)' }} size={20} />
            </div>
            <h2 
              className="text-xl font-bold mb-3"
              style={{ color: 'var(--color-primary)' }}
            >
              Global Distribution
            </h2>
            <p 
              className="mb-4 text-sm flex-grow"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Share your music across all major streaming platforms worldwide.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center">
                <CheckCircle size={14} style={{ color: 'var(--color-primary)' }} className="mr-2" />
                <span className="text-xs" style={{ color: 'var(--color-text-primary)' }}>150+ platforms</span>
              </div>
              <div className="flex items-center">
                <CheckCircle size={14} style={{ color: 'var(--color-primary)' }} className="mr-2" />
                <span className="text-xs" style={{ color: 'var(--color-text-primary)' }}>Royalty collection</span>
              </div>
              <div className="flex items-center">
                <CheckCircle size={14} style={{ color: 'var(--color-primary)' }} className="mr-2" />
                <span className="text-xs" style={{ color: 'var(--color-text-primary)' }}>Release scheduling</span>
              </div>
            </div>
            <button 
              className="mt-auto w-full py-2 px-4 rounded-lg font-semibold text-sm flex items-center justify-center transition-colors"
              style={{ 
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-text-on-primary)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--color-primary-light)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--color-primary)';
              }}
            >
              <span>Distribute Your Music</span>
              <ChevronRight size={16} className="ml-1" />
            </button>
          </motion.div>

          {/* NEW: Analytics Section - Before Wallet */}
          <motion.div 
            className="rounded-xl p-6 shadow-lg h-full flex flex-col"
            style={{ 
              backgroundColor: 'var(--color-bg-secondary)',
              border: '2px solid var(--color-primary)'
            }}
            onClick={() => handleOptionSelect('analytics')}
            whileHover={{ y: -5 }}
          >
            <div className="flex justify-between items-start mb-4">
              <div 
                className="p-3 rounded-xl"
                style={{ 
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-text-on-primary)'
                }}
              >
                <BarChart3 size={24} />
              </div>
              <ChevronRight style={{ color: 'var(--color-primary)' }} size={20} />
            </div>
            <h2 
              className="text-xl font-bold mb-3"
              style={{ color: 'var(--color-primary)' }}
            >
              Analytics Dashboard
            </h2>
            <p 
              className="mb-4 text-sm flex-grow"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Track streams, engagement, and audience insights across all platforms in real-time.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center">
                <CheckCircle size={14} style={{ color: 'var(--color-primary)' }} className="mr-2" />
                <span className="text-xs" style={{ color: 'var(--color-text-primary)' }}>Real-time streaming data</span>
              </div>
              <div className="flex items-center">
                <CheckCircle size={14} style={{ color: 'var(--color-primary)' }} className="mr-2" />
                <span className="text-xs" style={{ color: 'var(--color-text-primary)' }}>Audience demographics</span>
              </div>
              <div className="flex items-center">
                <CheckCircle size={14} style={{ color: 'var(--color-primary)' }} className="mr-2" />
                <span className="text-xs" style={{ color: 'var(--color-text-primary)' }}>Performance reports</span>
              </div>
            </div>
            <button 
              className="mt-auto w-full py-2 px-4 rounded-lg font-semibold text-sm flex items-center justify-center transition-colors"
              style={{ 
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-text-on-primary)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--color-primary-light)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--color-primary)';
              }}
            >
              <span>View Analytics</span>
              <ChevronRight size={16} className="ml-1" />
            </button>
          </motion.div>

          {/* Wallet Section - Now Bottom Right */}
          <motion.div 
            className="rounded-xl p-6 shadow-lg h-full flex flex-col"
            style={{ 
              backgroundColor: 'var(--color-bg-secondary)',
              border: '2px solid var(--color-primary)'
            }}
            onClick={() => handleOptionSelect('wallet')}
            whileHover={{ y: -5 }}
          >
            <div className="flex justify-between items-start mb-4">
              <div 
                className="p-3 rounded-xl"
                style={{ 
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-text-on-primary)'
                }}
              >
                <Wallet size={24} />
              </div>
              <ChevronRight style={{ color: 'var(--color-primary)' }} size={20} />
            </div>
            <h2 
              className="text-xl font-bold mb-3"
              style={{ color: 'var(--color-primary)' }}
            >
              Wallet & Earnings
            </h2>
            <p 
              className="mb-4 text-sm flex-grow"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Track your earnings, withdraw funds, and manage your revenue from promotions and distributions.
            </p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center">
                <DollarSign size={14} style={{ color: 'var(--color-primary)' }} className="mr-2" />
                <span className="text-xs" style={{ color: 'var(--color-text-primary)' }}>Withdraw earnings</span>
              </div>
              <div className="flex items-center">
                <TrendingUp size={14} style={{ color: 'var(--color-primary)' }} className="mr-2" />
                <span className="text-xs" style={{ color: 'var(--color-text-primary)' }}>Revenue tracking</span>
              </div>
              <div className="flex items-center">
                <CreditCard size={14} style={{ color: 'var(--color-primary)' }} className="mr-2" />
                <span className="text-xs" style={{ color: 'var(--color-text-primary)' }}>Transaction history</span>
              </div>
            </div>
            <button 
              className="mt-auto w-full py-2 px-4 rounded-lg font-semibold text-sm flex items-center justify-center transition-colors"
              style={{ 
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-text-on-primary)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--color-primary-light)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--color-primary)';
              }}
            >
              <span>View Wallet</span>
              <ChevronRight size={16} className="ml-1" />
            </button>
          </motion.div>
        </div>

        <div 
          className="mt-12 text-center"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <p>
            Need help deciding?{' '}
            <a 
              href="#" 
              className="font-medium hover:underline"
              style={{ color: 'var(--color-primary)' }}
              onMouseEnter={(e) => {
                e.target.style.color = 'var(--color-primary-light)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'var(--color-primary)';
              }}
            >
              Contact our support team
            </a>
          </p>
        </div>
      </main>
      <BottomNav activeTab="home" />
    </div>
  );
};