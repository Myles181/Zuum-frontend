import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

const SubscriptionPage = ({ onSuccess, onError, profile, details }) => {
  const navigate = useNavigate();
  const [isFadingIn, setIsFadingIn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Initialize component
  useEffect(() => {
    setIsFadingIn(true);
  }, []);

  // Get price data based on user identity
  const getPriceData = () => {
    if (!profile) return { amount: '₦--,---', amountValue: 0, description: '/month' }; // Default
    
    switch(profile?.identity) {
      case 'artist':
        return { amount: '₦15,000', amountValue: 15000, description: '/month' };
      case 'producer':
        return { amount: '₦20,000', amountValue: 20000, description: '/month' };
      case 'label owner':
        return { amount: '₦30,000', amountValue: 30000, description: '/month' };
      case 'dev':
        return { amount: '₦200', amountValue: 200, description: '/month' };
      default:
        return { amount: '₦--,---', amountValue: 0, description: '/month' };
    }
  };

  const priceData = getPriceData();

  // Get feature list based on user identity
  const getFeatureList = () => {
    const baseFeatures = ["Unlimited searches", "Priority support"];
    
    if (!profile) return [...baseFeatures, "Unlimited Access"];
    
    switch(profile.identity) {
      case 'artist':
        return [
          ...baseFeatures, 
          "Unlimited Track Uploads", 
          "Artist Profile Analytics"
        ];
      case 'producer':
        return [
          ...baseFeatures, 
          "Unlimited Beat Uploads", 
          "Producer Profile Analytics",
          "Direct Licensing Management"
        ];
      case 'label owner':
        return [
          ...baseFeatures, 
          "Manage Multiple Artists", 
          "Comprehensive Analytics Dashboard",
          "Royalty Distribution Tools",
          "Priority Release Processing"
        ];
      default:
        return [...baseFeatures, "Unlimited Access"];
    }
  };

  const features = getFeatureList();

  const handleConfirmPayment = () => {
    if (!profile) {
      setError('User profile not found');
      return;
    }

    setIsProcessing(true);
    setError(null);

    // Get user balance (default to 0 if not available)
    const userBalance = profile.balance || 0;
    const subscriptionAmount = priceData.amountValue;

    // Check if user has sufficient balance
    if (userBalance >= subscriptionAmount) {
      // Navigate to success page
      navigate('/subscription-success');
    } else {
      // Navigate to dashboard page
      navigate('/dashboard');
    }
  };

  const getUserTypeTitle = () => {
    if (!profile) return "Premium";
    
    switch(profile.identity) {
      case 'artist':
        return "Artist Premium";
      case 'producer':
        return "Producer Premium";
      case 'label owner':
        return "Label Premium";
      default:
        return "Premium";
    }
  };

  return (
    <div className={`bg-white rounded-lg overflow-hidden shadow-lg w-full max-w-md transition-opacity duration-500 ${isFadingIn ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header */}
      <div className="bg-[#2D8C72] text-white p-6 relative">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Zuum {getUserTypeTitle()}</h2>
            <p className="text-sm opacity-90">Unlock exclusive features</p>
          </div>
        </div>
      </div>

      {/* Progress Indicator - FIXED ALIGNMENT */}
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center justify-between">
          {/* Step 1 */}
          <div className="flex flex-col items-center z-10">
            <div className="w-8 h-8 rounded-full bg-[#2D8C72] text-white flex items-center justify-center">
              <CheckCircle size={16} />
            </div>
            <span className="text-xs mt-1 text-[#2D8C72] font-medium text-center">Details</span>
          </div>
          
          {/* Line 1-2 */}
          <div className="flex-1 h-1 bg-[#2D8C72] mx-2"></div>
          
          {/* Step 2 */}
          <div className="flex flex-col items-center z-10">
            <div className="w-8 h-8 rounded-full bg-[#2D8C72] text-white flex items-center justify-center">
              2
            </div>
            <span className="text-xs mt-1 text-[#2D8C72] font-medium text-center">Confirm</span>
          </div>
          
          {/* Line 2-3 */}
          <div className="flex-1 h-1 bg-gray-200 mx-2"></div>
          
          {/* Step 3 */}
          <div className="flex flex-col items-center z-10">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">
              3
            </div>
            <span className="text-xs mt-1 text-gray-500 text-center">Complete</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-100 rounded-md">
          <div className="flex items-start">
            <AlertCircle size={18} className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Details */}
      <div className="px-6 py-6">
        <div className="mb-6">
          <h3 className="text-gray-700 font-medium mb-3">Confirm Your Subscription</h3>
          <p className="text-sm text-gray-500 mb-4">
            Please review your subscription details before proceeding to payment
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">Plan:</span>
            <span className="font-medium text-gray-800">Zuum {getUserTypeTitle()}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">Duration:</span>
            <span className="font-medium text-gray-800">1 Month</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">Billing Cycle:</span>
            <span className="font-medium text-gray-800">Monthly</span>
          </div>
          {profile && (
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">Account Type:</span>
              <span className="font-medium text-gray-800 capitalize">{profile.identity || "Standard"}</span>
            </div>
          )}
          {profile && (
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">Current Balance:</span>
              <span className="font-medium text-gray-800">
                ₦{(profile.balance || 0).toLocaleString()}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-700">Total:</span>
            <span className="font-bold text-[#2D8C72]">
              {priceData.amount}
              <span className="text-sm font-normal text-gray-500 ml-1">{priceData.description}</span>
            </span>
          </div>
        </div>

        {/* Feature List */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Included Features:</h4>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-gray-700">
                <CheckCircle size={16} className="text-[#2D8C72] mr-2" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Button */}
        <div className="mt-6">
          <button
            onClick={handleConfirmPayment}
            disabled={isProcessing || !profile}
            className="w-full py-3 px-4 bg-[#2D8C72] hover:bg-[#236a56] text-white rounded-md font-medium flex items-center justify-center transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              <div className="flex items-center">
                Confirm Payment 
                <ArrowRight size={18} className="ml-2" />
              </div>
            )}
          </button>
        </div>

        {/* Fine Print */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          By proceeding, you agree to our <a href="#" className="text-[#2D8C72] hover:underline">Terms of Service</a> and <a href="#" className="text-[#2D8C72] hover:underline">Privacy Policy</a>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">
            Need help? <a href="#" className="text-[#2D8C72] hover:underline">Contact support</a>
          </p>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gray-200 rounded-full mr-1"></div>
            <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;