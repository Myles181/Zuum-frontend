import React from 'react';

const ActivePromotions = ({ activePromotions }) => {
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
    '--color-success': '#10B981',
    '--color-success-light': '#064E3B',
    '--color-warning': '#F59E0B',
    '--color-warning-light': '#78350F'
  };

  return (
    <div 
      className="mt-12 rounded-xl shadow-sm border max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
      style={{ 
        ...darkModeStyles,
        backgroundColor: 'var(--color-bg-secondary)',
        borderColor: 'var(--color-border)'
      }}
    >
      <h2 
        className="text-xl font-semibold mb-6"
        style={{ color: 'var(--color-text-primary)' }}
      >
        Active Promotions
      </h2>

      {activePromotions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activePromotions.map(promo => (
            <div
              key={promo.id}
              className="flex flex-col md:flex-row items-start rounded-lg p-4 transition-colors hover:bg-[var(--color-bg-primary)]"
              style={{ 
                backgroundColor: 'var(--color-bg-primary)',
                border: '1px solid var(--color-border)'
              }}
            >
              <img
                src={promo.content?.coverImage || 'https://source.unsplash.com/random/300x300/?music'}
                alt={promo.content?.title}
                className="w-full md:w-16 h-40 md:h-16 rounded object-cover flex-shrink-0"
              />
              <div className="mt-4 md:mt-0 md:ml-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 
                      className="font-medium"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {promo.content?.title || 'Untitled Promotion'}
                    </h3>
                    <span
                      className="px-2 py-1 text-xs rounded-full font-medium capitalize"
                      style={{
                        backgroundColor: promo.status === 'approved' 
                          ? 'var(--color-success-light)' 
                          : 'var(--color-warning-light)',
                        color: promo.status === 'approved' 
                          ? 'var(--color-success)' 
                          : 'var(--color-warning)'
                      }}
                    >
                      {promo.status || 'pending'}
                    </span>
                  </div>
                  <p 
                    className="text-sm mt-1"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {promo.startDate ? new Date(promo.startDate).toLocaleDateString() : 'N/A'} –{' '}
                    {promo.endDate ? new Date(promo.endDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className="mt-4 flex justify-between items-center text-sm">
                  <span 
                    className="font-medium"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    ₦{(promo.price || 0).toLocaleString()}
                  </span>
                  <button 
                    className="transition-colors font-medium"
                    style={{ color: 'var(--color-primary)' }}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'var(--color-primary-light)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'var(--color-primary)';
                    }}
                  >
                    View Stats
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ 
              backgroundColor: 'var(--color-bg-primary)',
              border: '2px solid var(--color-border)'
            }}
          >
            <svg 
              className="w-8 h-8" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          </div>
          <p 
            className="font-medium mb-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            No active promotions
          </p>
          <p 
            className="text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Your active promotions will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivePromotions;