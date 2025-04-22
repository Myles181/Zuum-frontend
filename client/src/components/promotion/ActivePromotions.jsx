import React from 'react';

const ActivePromotions = ({ activePromotions }) => {
  return (
    <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-xl font-semibold mb-6">Active Promotions</h2>

      {activePromotions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activePromotions.map(promo => (
            <div
              key={promo.id}
              className="flex flex-col md:flex-row items-start bg-gray-50 rounded-lg p-4"
            >
              <img
                src={promo.content.coverImage}
                alt={promo.content.title}
                className="w-full md:w-16 h-40 md:h-16 rounded object-cover flex-shrink-0"
              />
              <div className="mt-4 md:mt-0 md:ml-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900">{promo.content.title}</h3>
                    <span
                      className={`
                        px-2 py-1 text-xs rounded-full 
                        ${promo.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'}
                      `}
                    >
                      {promo.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(promo.startDate).toLocaleDateString()} –{' '}
                    {new Date(promo.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-4 flex justify-between items-center text-sm">
                  <span className="text-gray-600 font-medium">
                    ₦{promo.price.toLocaleString()}
                  </span>
                  <button className="text-[#2D8C72] hover:text-[#257a63] transition-colors">
                    View Stats
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No active promotions</p>
      )}
    </div>
  );
};

export default ActivePromotions;