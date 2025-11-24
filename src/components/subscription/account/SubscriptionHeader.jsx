import { FiZap, FiClock, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export const SubscriptionHeader = ({ 
  title, 
  subtitle, 
  timeLeft, 
  onRefresh,
  showBackButton = false
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-gradient-to-r from-[#2D8C72] to-[#1A6B54] p-6 text-white relative">
        
          
       
        <div className="flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="opacity-90 mt-1">{subtitle}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-full ml-4">
            <FiZap className="h-6 w-6" />
          </div>
        </div>
      </div>

      {timeLeft && (
        <div className={`px-6 py-3 flex items-center justify-between border-b ${
          timeLeft === 'Expired' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
        }`}>
          <div className="flex items-center">
            <FiClock className="mr-2" />
            {timeLeft === 'Expired' ? 'Payment details expired' : `Expires in: ${timeLeft}`}
          </div>
          {timeLeft === 'Expired' && (
            <button 
              onClick={onRefresh} 
              className="text-sm text-[#2D8C72] hover:underline font-medium"
            >
              Refresh
            </button>
          )}
        </div>
      )}
    </>
  );
};