import { useEffect, useState } from 'react';
import { FiX, FiCheck, FiZap } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { usePaymentAccount } from '../../../Hooks/subscription/useCreateAccount';

const SubscriptionPopup = ({ onClose, details }) => {
  // const { 
  //   paymentDetails: details, 
  //   loading: testLoading, 
  //   error: testError, 
  //   fetchPaymentDetails,
  //   resetError 
  // } = usePaymentAccount();

  // useEffect(() => {
  //   fetchPaymentDetails();
  // }, []);

  // // Skeleton loading component
  // const SkeletonLoader = () => (
  //   <div className="animate-pulse">
  //     <div className="flex justify-between items-start mb-6">
  //       <div>
  //         <div className="flex items-center mb-2">
  //           <div className="h-5 w-5 bg-gray-200 rounded-full mr-2"></div>
  //           <div className="h-4 w-24 bg-gray-200 rounded"></div>
  //         </div>
  //         <div className="h-8 w-48 bg-gray-200 rounded"></div>
  //       </div>
  //       <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
  //     </div>

  //     <div className="mb-8">
  //       <div className="bg-gray-50 p-6 rounded-xl mb-6 border border-gray-200">
  //         <div className="flex items-end mb-2">
  //           <div className="h-10 w-32 bg-gray-200 rounded"></div>
  //           <div className="h-6 w-16 bg-gray-200 rounded ml-1"></div>
  //         </div>
  //         <div className="h-4 w-40 bg-gray-200 rounded"></div>
  //         <div className="h-4 w-24 bg-gray-200 rounded mt-1"></div>
  //       </div>

  //       <ul className="space-y-3">
  //         {[...Array(4)].map((_, i) => (
  //           <li key={i} className="flex items-start">
  //             <div className="h-5 w-5 bg-gray-200 rounded-full mt-0.5 mr-3"></div>
  //             <div className="h-4 w-48 bg-gray-200 rounded"></div>
  //           </li>
  //         ))}
  //       </ul>
  //     </div>

  //     <div className="h-12 w-full bg-gray-200 rounded-xl"></div>
  //     <div className="h-3 w-40 bg-gray-200 rounded mx-auto mt-4"></div>
  //   </div>
  // );

  // if (testLoading) {
  //   return (
  //     <div className="fixed inset-0 bg-white/80 backdrop-blur-lg flex items-center justify-center z-50">
  //       <div className="bg-white p-8 max-w-md w-full border border-gray-100">
  //         <SkeletonLoader />
  //       </div>
  //     </div>
  //   );
  // }

  // if (testError) {
  //   return (
  //     <div className="fixed inset-0 bg-white/80 backdrop-blur-lg flex items-center justify-center z-50">
  //       <div className="bg-white p-8 max-w-md w-full border border-gray-100">
  //         <div className="text-red-500 mb-4 flex items-center">
  //           <FiX className="h-5 w-5 mr-2" />
  //           <span>Error loading subscription details</span>
  //         </div>
  //         <p className="text-gray-600 mb-6">{testError}</p>
  //         <button
  //           onClick={() => {
  //             resetError();
  //             fetchPaymentDetails();
  //           }}
  //           className="w-full bg-[#2D8C72] text-white py-2 px-4 rounded-lg"
  //         >
  //           Retry
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-lg flex items-center justify-center z-50">
      <div className="bg-white p-8 max-w-md w-full border border-gray-100">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center mb-2">
              <FiZap className="h-5 w-5 text-[#2D8C72] mr-2" />
              <span className="text-sm font-semibold text-[#2D8C72] uppercase tracking-wide">
                {details?.description || 'Premium Subscription'}
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
              <span className="text-4xl font-bold text-gray-900">
                ₦{details?.amount ? parseFloat(details.amount).toLocaleString() : '--,--'}
              </span>
              <span className="text-lg text-gray-500 ml-1">
                {details?.frequency === 'annual' ? '/year' : '/month'}
              </span>
            </div>
            <p className="text-gray-600">
              {details?.frequency === 'annual' ? 'Billed annually' : 'Billed monthly'}, cancel anytime
            </p>
            <p className="text-sm text-[#2D8C72] mt-1">
              Special {details?.name || 'member'} pricing
            </p>
          </div>

          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <FiCheck className="h-5 w-5 text-[#2D8C72] mt-0.5 mr-3 flex-shrink-0" />
              <span>Exclusive {details?.name ? `${details.name} ` : ''}content</span>
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
                {details?.name === 'artist' && 'Early access to collaborations'}
                {details?.name === 'producer' && 'Beat submission priority'}
                {details?.name === 'label owner' && 'Artist analytics dashboard'}
                {!details?.name && 'Early access to new features'}
              </span>
            </li>
          </ul>
        </div>

        <Link to='/subscribe'>
          <button
            type="submit"
            className="w-full bg-[#2D8C72] text-white py-4 px-6 rounded-xl font-bold hover:bg-[#24735a] transition-colors shadow-lg"
          >
            Get {details?.name ? `${details.name} ` : ''}Premium
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