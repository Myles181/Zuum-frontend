import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const SubscriptionSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect to home after 5 seconds
    const timer = setTimeout(() => {
      navigate('/home');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-[#2D8C72] rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Successful!</h1>
          <p className="text-gray-600">
            Your subscription has been activated successfully. You now have access to all premium features.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/home')}
            className="w-full bg-gradient-to-r from-[#2D8C72] to-[#34A085] text-white py-3 px-6 rounded-xl font-bold hover:from-[#34A085] hover:to-[#2D8C72] transition-all shadow-lg"
          >
            Go to Home
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Redirecting to home in 5 seconds...
        </p>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;


