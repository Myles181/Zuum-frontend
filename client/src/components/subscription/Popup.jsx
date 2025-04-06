import { useState } from 'react';
import { FiX, FiCheck, FiZap } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import useProfile from '../../../Hooks/useProfile';

const SubscriptionPopup = ({ onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const { profile: authProfile, loading: authLoading } = useProfile();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Subscribing to premium');
    setSubmitted(true);
  };

  // Determine price based on identity
  const getPriceData = () => {
    if (!authProfile) return { amount: '₦--,---', description: '/month' }; // Default
    
    switch(authProfile.identity) {
      case 'artist':
        return { amount: '₦15,000', description: '/month' };
      case 'producer':
        return { amount: '₦20,000', description: '/month' };
      case 'label owner':
        return { amount: '₦30,000', description: '/month' };
      default:
        return { amount: '₦--,---', description: '/month' };
    }
  };

  const priceData = getPriceData();

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-lg flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl border border-gray-100">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#2D8C72] mb-4">
              <FiCheck className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Zuum Premium!</h3>
            <p className="text-gray-600 mb-6">
              You now have access to all exclusive {authProfile?.identity} features.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-[#2D8C72] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#24735a] transition-colors shadow-md"
            >
              Start Exploring
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-lg flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl border border-gray-100">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center mb-2">
              <FiZap className="h-5 w-5 text-[#2D8C72] mr-2" />
              <span className="text-sm font-semibold text-[#2D8C72] uppercase tracking-wide">
                {authProfile?.identity ? `${authProfile.identity} Premium` : 'Premium'}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Upgrade Your Experience</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-1 -m-1"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-8">
          <div className="bg-gray-50 p-6 rounded-xl mb-6 border border-gray-200">
            <div className="flex items-end mb-2">
              <span className="text-4xl font-bold text-gray-900">{priceData.amount}</span>
              <span className="text-lg text-gray-500 ml-1">{priceData.description}</span>
            </div>
            <p className="text-gray-600">Billed monthly, cancel anytime</p>
            {authProfile?.identity && (
              <p className="text-sm text-[#2D8C72] mt-1">
                Special {authProfile.identity} pricing
              </p>
            )}
          </div>

          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <FiCheck className="h-5 w-5 text-[#2D8C72] mt-0.5 mr-3 flex-shrink-0" />
              <span>Exclusive {authProfile?.identity ? `${authProfile.identity} ` : ''}content</span>
            </li>
            <li className="flex items-start">
              <FiCheck className="h-5 w-5 text-[#2D8C72] mt-0.5 mr-3 flex-shrink-0" />
              <span>Premium verification badge</span>
            </li>
            <li className="flex items-start">
              <FiCheck className="h-5 w-5 text-[#2D8C72] mt-0.5 mr-3 flex-shrink-0" />
              <span>Completely ad-free experience</span>
            </li>
            <li className="flex items-start">
              <FiCheck className="h-5 w-5 text-[#2D8C72] mt-0.5 mr-3 flex-shrink-0" />
              <span>
                {authProfile?.identity === 'artist' && 'Early access to collaborations'}
                {authProfile?.identity === 'producer' && 'Beat submission priority'}
                {authProfile?.identity === 'label owner' && 'Artist analytics dashboard'}
                {!authProfile?.identity && 'Early access to new features'}
              </span>
            </li>
          </ul>
        </div>

        <Link to='/subscribe'>
          <button
            type="submit"
            className="w-full bg-[#2D8C72] text-white py-4 px-6 rounded-xl font-bold hover:bg-[#24735a] transition-colors shadow-lg"
          >
            Get {authProfile?.identity ? `${authProfile.identity} ` : ''}Premium
          </button>
        </Link>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Secure payment processing. Cancel anytime.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPopup;