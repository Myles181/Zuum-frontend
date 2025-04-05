export const SubscriptionProgress = ({ activeStep }) => (
    <div className="px-6 pt-6">
      <div className="flex justify-between relative mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className={`flex flex-col items-center ${activeStep >= step ? 'text-[#2D8C72]' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              activeStep >= step ? 'bg-[#2D8C72] text-white' : 'bg-gray-100'
            }`}>
              {step}
            </div>
            <span className="text-xs mt-2 font-medium">
              {step === 1 ? 'Details' : step === 2 ? 'Confirm' : 'Complete'}
            </span>
          </div>
        ))}
        <div className="absolute top-5 left-5 right-5 h-1 bg-gray-100 -z-10">
          <div 
            className="h-1 bg-[#2D8C72] transition-all duration-500" 
            style={{ width: `${(activeStep - 1) * 50}%` }}
          ></div>
        </div>
      </div>
    </div>
  );