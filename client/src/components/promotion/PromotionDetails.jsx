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
  // Dark mode styles - consistent with other components
  const darkModeStyles = {
    '--color-bg-primary': '#1a1a1a',
    '--color-bg-secondary': '#2d2d2d',
    '--color-text-primary': '#ffffff',
    '--color-text-secondary': '#9ca3af',
    '--color-primary': '#2D8C72',
    '--color-primary-light': '#34A085',
    '--color-text-on-primary': '#ffffff',
    '--color-border': '#374151',
    '--color-error': '#EF4444'
  };

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
    <div 
      className="rounded-xl shadow-sm p-6 border"
      style={{ 
        ...darkModeStyles,
        backgroundColor: 'var(--color-bg-secondary)',
        borderColor: 'var(--color-border)'
      }}
    >
      <h2 
        className="text-xl font-semibold mb-4 flex items-center gap-2"
        style={{ color: 'var(--color-text-primary)' }}
      >
        <FaBullhorn style={{ color: 'var(--color-primary)' }} /> 
        Promotion Details
      </h2>
      
      {/* Selected Content */}
      <div className="mb-6">
        <h3 
          className="font-medium mb-2"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Selected ({selectedContent ? 1 : 0})
        </h3>
        {selectedContent ? (
          <div className="space-y-2">
            <div 
              className="flex items-center gap-2 text-sm p-2 rounded"
              style={{ 
                backgroundColor: 'var(--color-bg-primary)',
                color: 'var(--color-text-primary)'
              }}
            >
              <img 
                src={selectedContent.cover_photo || 'https://source.unsplash.com/random/300x300/?music'} 
                alt={selectedContent.title}
                className="w-8 h-8 rounded object-cover"
              />
              <span className="truncate flex-1">{selectedContent.title}</span>
            </div>
          </div>
        ) : (
          <p 
            className="text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Select an item to promote
          </p>
        )}
      </div>
      
      {/* Duration */}
      <div className="mb-6">
        <h3 
          className="font-medium mb-2 flex items-center gap-2"
          style={{ color: 'var(--color-text-primary)' }}
        >
          <FaCalendarAlt style={{ color: 'var(--color-primary)' }} /> 
          Duration
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {pricingTiers.map(tier => (
            <button
              key={tier.days}
              onClick={() => setDuration(tier.days)}
              className={`py-2 rounded text-sm transition-colors ${
                duration === tier.days
                  ? 'text-white border'
                  : 'hover:bg-[var(--color-bg-primary)]'
              }`}
              style={{
                backgroundColor: duration === tier.days 
                  ? 'var(--color-primary)' 
                  : 'var(--color-bg-primary)',
                borderColor: duration === tier.days 
                  ? 'var(--color-primary)' 
                  : 'var(--color-border)',
                color: duration === tier.days 
                  ? 'var(--color-text-on-primary)' 
                  : 'var(--color-text-primary)'
              }}
              disabled={promotionLoading}
            >
              {tier.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Price Summary */}
      <div 
        className="rounded-lg p-4 mb-6"
        style={{ 
          backgroundColor: 'var(--color-bg-primary)'
        }}
      >
        <h3 
          className="font-medium mb-2 flex items-center gap-2"
          style={{ color: 'var(--color-text-primary)' }}
        >
          <FaDollarSign style={{ color: 'var(--color-primary)' }} /> 
          Summary
        </h3>
        <div className="space-y-2 text-sm">
          <div 
            className="flex justify-between"
            style={{ color: 'var(--color-text-primary)' }}
          >
            <span>Item:</span>
            <span>{selectedContent ? '₦5,000' : '₦0'}</span>
          </div>
          <div 
            className="flex justify-between"
            style={{ color: 'var(--color-text-primary)' }}
          >
            <span>Duration:</span>
            <span>{duration} days</span>
          </div>
          <div 
            className="my-2"
            style={{ borderTop: '1px solid var(--color-border)' }}
          ></div>
          <div 
            className="flex justify-between font-semibold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            <span>Total:</span>
            <span>{promoPrice}</span>
          </div>
        </div>
      </div>
      
      {/* Submit Button */}
      <button
        disabled={!selectedContent || promotionLoading}
        onClick={onPromote}
        className={`w-full py-3 rounded-lg font-medium transition-colors ${
          selectedContent && !promotionLoading
            ? 'text-white hover:scale-105'
            : 'cursor-not-allowed'
        }`}
        style={{
          backgroundColor: selectedContent && !promotionLoading
            ? 'var(--color-primary)'
            : 'var(--color-bg-primary)',
          color: selectedContent && !promotionLoading
            ? 'var(--color-text-on-primary)'
            : 'var(--color-text-secondary)',
          border: selectedContent && !promotionLoading
            ? 'none'
            : '1px solid var(--color-border)'
        }}
        onMouseEnter={(e) => {
          if (selectedContent && !promotionLoading) {
            e.target.style.backgroundColor = 'var(--color-primary-light)';
          }
        }}
        onMouseLeave={(e) => {
          if (selectedContent && !promotionLoading) {
            e.target.style.backgroundColor = 'var(--color-primary)';
          }
        }}
      >
        {promotionLoading ? 'Processing...' : 'Request Promotion'}
      </button>
      
      {promotionError && (
        <p 
          className="text-xs mt-2"
          style={{ color: 'var(--color-error)' }}
        >
          {promotionError}
        </p>
      )}
      
      <p 
        className="text-xs mt-3"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        Admin approval required. Processing time: 24-48 hours.
      </p>
    </div>
  );
};

export default PromotionDetails;