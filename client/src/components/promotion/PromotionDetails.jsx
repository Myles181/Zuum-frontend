import React from 'react';
import { FaBullhorn, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';

const PromotionDetails = ({ 
  selectedContent, 
  duration, 
  setDuration,
  onPromote,
  promotionLoading,
  promotionError 
}) => {
  // Calculate price in Naira (₦5000 per item per week)
  const promoPrice = (selectedContent ? 5000 * (duration / 7) : 0).toLocaleString('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  });

  const pricingTiers = [
    { days: 7, label: "1 Week" },
    { days: 14, label: "2 Weeks" },
    { days: 30, label: "1 Month" }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FaBullhorn /> Promotion Details
      </h2>
      
      {/* Selected Content */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Selected ({selectedContent ? 1 : 0})</h3>
        {selectedContent ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded">
              <img 
                src={selectedContent.cover_photo || 'https://source.unsplash.com/random/300x300/?music'} 
                alt={selectedContent.title}
                className="w-8 h-8 rounded object-cover"
              />
              <span className="truncate flex-1">{selectedContent.title}</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Select an item to promote</p>
        )}
      </div>
      
      {/* Duration */}
      <div className="mb-6">
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <FaCalendarAlt /> Duration
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {pricingTiers.map(tier => (
            <button
              key={tier.days}
              onClick={() => setDuration(tier.days)}
              className={`py-2 rounded text-sm ${
                duration === tier.days
                  ? 'bg-[#2D8C72] text-white border border-[#2D8C72]'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              disabled={promotionLoading}
            >
              {tier.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Price Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <FaDollarSign /> Summary
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Item:</span>
            <span>{selectedContent ? '₦5,000' : '₦0'}</span>
          </div>
          <div className="flex justify-between">
            <span>Duration:</span>
            <span>{duration} days</span>
          </div>
          <div className="border-t border-gray-200 my-2"></div>
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>{promoPrice}</span>
          </div>
        </div>
      </div>
      
      {/* Submit Button */}
      <button
        disabled={!selectedContent || promotionLoading}
        onClick={onPromote}
        className={`w-full py-3 rounded-lg font-medium ${
          selectedContent && !promotionLoading
            ? 'bg-[#2D8C72] hover:bg-[#257a63] text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {promotionLoading ? 'Processing...' : 'Request Promotion'}
      </button>
      
      {promotionError && (
        <p className="text-xs text-red-500 mt-2">
          {promotionError}
        </p>
      )}
      
      <p className="text-xs text-gray-500 mt-3">
        Admin approval required. Processing time: 24-48 hours.
      </p>
    </div>
  );
};

export default PromotionDetails;