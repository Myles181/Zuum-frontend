import { FiX, FiCheck, FiZap } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const SubscriptionPopup = ({ onClose, details }) => {
  // Normalize incoming data: API response may be { message, paymentDetails }
  // so extract the actual plan object
  const plan = details?.paymentDetails || details;

  console.log(plan, 'subscription plan from popup component');

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-lg flex items-center justify-center z-50">
      <div className="bg-white p-8 max-w-md w-full border border-gray-100">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center mb-2">
              <FiZap className="h-5 w-5 text-[#2D8C72] mr-2" />
              <span className="text-sm font-semibold text-[#2D8C72] uppercase tracking-wide">
                {plan?.description || 'Premium Subscription'}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Upgrade Your Experience</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 -m-1">
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-8">
          <div className="bg-gray-50 p-6 rounded-xl mb-6 border border-gray-200">
            <div className="flex items-end mb-2">
              <span className="text-4xl font-bold text-gray-900">
                ₦{plan?.amount ? parseFloat(plan.amount).toLocaleString() : '--,--'}
              </span>
              <span className="text-lg text-gray-500 ml-1">
                {plan?.frequency === 'annual' ? '/year' : '/month'}
              </span>
            </div>
            <p className="text-gray-600">
              {plan?.frequency === 'annual' ? 'Billed annually' : 'Billed monthly'}, cancel anytime
            </p>
            <p className="text-sm text-[#2D8C72] mt-1">
              Special {plan?.name || 'member'} pricing
            </p>
          </div>

          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <FiCheck className="h-5 w-5 text-[#2D8C72] mt-0.5 mr-3 flex-shrink-0" />
              <span>Exclusive {plan?.name ? `${plan.name} ` : ''}content</span>
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
                {plan?.name === 'artist' && 'Early access to collaborations'}
                {plan?.name === 'producer' && 'Beat submission priority'}
                {plan?.name === 'label owner' && 'Artist analytics dashboard'}
                {!plan?.name && 'Early access to new features'}
              </span>
            </li>
          </ul>
        </div>

        <Link to="/subscribe">
          <button
            type="submit"
            className="w-full bg-[#2D8C72] text-white py-4 px-6 rounded-xl font-bold hover:bg-[#24735a] transition-colors shadow-lg"
          >
            Get {plan?.name ? `${plan.name} ` : ''}Premium
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
