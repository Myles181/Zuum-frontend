import { FiCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export const SubscriptionStatus = ({ subscribed, webhookLoading, webhookError, handleSubscribe }) => (
  <div className="px-6 pb-8 h-[60%] text-center">
    <div className="py-8">
      {subscribed ? (
        <>
          <div className="mx-auto flex items-center justify-center rounded-full bg-[#2D8C72] mb-6 shadow-lg">
            <FiCheck className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Welcome to Premium!</h2>
          <p className="text-gray-600 mb-6">Your subscription is now active.</p>
          <Link to='/home'>
            <button className="w-full max-w-xs mx-auto bg-[#2D8C72] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#24735a]">
              Go to Dashboard
            </button>
          </Link>
        </>
      ) : (
        <>
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gray-100 mb-6">
            {webhookLoading ? (
              <div className="animate-spin h-10 w-10 border-4 border-[#2D8C72] rounded-full border-t-transparent"></div>
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200"></div>
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {webhookError ? 'Verification Failed' : 'Verifying Payment'}
          </h2>
          {webhookError && (
            <button onClick={handleSubscribe} className="mt-4 text-[#2D8C72] hover:underline">
              Try Again
            </button>
          )}
        </>
      )}
    </div>
  </div>
);