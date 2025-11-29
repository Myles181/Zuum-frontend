import { FiX, FiCheck, FiZap } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const SubscriptionPopup = ({ onClose, details }) => {
  const navigate = useNavigate();
  // Normalize incoming data: API response may be { message, paymentDetails }
  // so extract the actual plan object
  const plan = details?.paymentDetails || details;

  console.log(plan, 'subscription plan from popup component');

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      data-subscription-popup
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700/50 overflow-hidden"
        data-subscription-popup
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-[#2D8C72] to-[#34A085] p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <FiZap className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-white uppercase tracking-wide">
                  {plan?.description || 'Premium Subscription'}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white">Upgrade Your Experience</h2>
            </div>
            <button 
              onClick={onClose} 
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              data-close-popup
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50">
          {/* Price Section */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-700/50 p-6 rounded-xl mb-6 border border-gray-700/50">
            <div className="flex items-end mb-2">
              <span className="text-4xl font-bold text-white">
                ₦{plan?.amount ? new Intl.NumberFormat('en-NG', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(parseFloat(plan.amount)) : '--,--'}
              </span>
              <span className="text-lg text-gray-400 ml-2">
                /{plan?.frequency === 'annual' ? 'year' : 'month'}
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              {plan?.frequency === 'annual' ? 'Billed annually' : 'Billed monthly'}, cancel anytime
            </p>
            <p className="text-sm font-medium text-[#34A085] mt-2">
              Special {plan?.name || 'member'} pricing
            </p>
          </div>

          {/* Features List */}
          <ul className="space-y-3 mb-6">
            <li className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-[#2D8C72]/20 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                <FiCheck className="h-4 w-4 text-[#34A085]" />
              </div>
              <span className="text-gray-300">Exclusive {plan?.name ? `${plan.name} ` : ''}content</span>
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-[#2D8C72]/20 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                <FiCheck className="h-4 w-4 text-[#34A085]" />
              </div>
              <span className="text-gray-300">Premium verification badge</span>
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-[#2D8C72]/20 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                <FiCheck className="h-4 w-4 text-[#34A085]" />
              </div>
              <span className="text-gray-300">Completely ad-free experience</span>
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-[#2D8C72]/20 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                <FiCheck className="h-4 w-4 text-[#34A085]" />
              </div>
              <span className="text-gray-300">
                {plan?.name === 'artist' && 'Early access to collaborations'}
                {plan?.name === 'producer' && 'Beat submission priority'}
                {plan?.name === 'label owner' && 'Artist analytics dashboard'}
                {!plan?.name && 'Early access to new features'}
              </span>
            </li>
          </ul>

          {/* CTA Button */}
          <button
            type="button"
            onClick={() => {
              navigate('/subscribe');
              onClose();
            }}
            className="w-full bg-gradient-to-r from-[#2D8C72] to-[#34A085] text-white py-4 px-6 rounded-xl font-bold hover:from-[#34A085] hover:to-[#2D8C72] transition-all shadow-lg hover:shadow-xl shadow-[#2D8C72]/20 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Get {plan?.name ? `${plan.name} ` : ''}Premium
          </button>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Secure payment processing. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPopup;
