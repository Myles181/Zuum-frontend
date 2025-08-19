import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import a from '../assets/image/Group 4.png';
import { Link } from 'react-router-dom';

const ZuumOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [direction, setDirection] = useState('next'); // Track animation direction

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const steps = [
    {
      title: "Share Your Sound Globally",
      description: "Get ready to unleash your musical talent and witness the power of global distribution as we embark on this extraordinary journey.",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&auto=format"
    },
    {
      title: "User-Friendly at its Core",
      description: "Discover the essence of user-friendliness as our interface empowers you with intuitive controls and effortless interactions.",
      image: "https://informareonline.com/wp-content/uploads/2023/03/230212_Il-fascino-del-vinile-3.webp"
    },
    {
      title: "Easy Music Publishing",
      description: "Quickly add tracks, set due dates, and add descriptions with ease using our music publishing app. Simplify your workflow and stay organized.",
      image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=600&fit=crop&auto=format"
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setDirection('next');
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 50); // Small delay to allow animation to start
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection('prev');
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
      }, 50);
    }
  };

  const skipToEnd = () => {
    setDirection('next');
    setTimeout(() => {
      setCurrentStep(steps.length - 1);
    }, 50);
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-sm h-screen max-h-screen bg-white shadow-xl overflow-hidden flex flex-col">
        {/* Header with Logo */}
        <div className="m-5 absolute z-10 transition-all duration-700 ease-in-out">
          <img src={a} className="w-25 transition-transform duration-500 hover:scale-105" alt="Zuum logo" />
        </div>

        {/* Image Section - Top Half */}
        <div className="relative h-1/2 overflow-hidden">
          <div 
            key={`image-${currentStep}`}
            className={`w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-700 ease-in-out ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            } ${
              direction === 'next' ? 'animate-fadeIn' : 'animate-fadeInReverse'
            }`}
            style={{ backgroundImage: `url(${currentStepData.image})` }}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-white/80"></div>
          </div>
        </div>

        {/* Content Section - Bottom Half */}
        <div className="h-1/2 px-6 py-6 flex flex-col justify-between">
          <div className="flex-grow flex flex-col justify-center">
            {/* Progress Dots */}
            <div className="flex justify-center space-x-2 mb-6">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full transition-all duration-500 ease-in-out ${
                    index === currentStep 
                      ? 'w-6 bg-gray-800' 
                      : 'w-1 bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Text Content */}
            <div 
              key={`text-${currentStep}`}
              className={`text-center mb-8 transition-all duration-700 ease-in-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              } ${
                direction === 'next' ? 'animate-slideInUp' : 'animate-slideInDown'
              }`}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight transition-all duration-500">
                {currentStepData.title}
              </h2>
              <p className="text-gray-600 text-base leading-relaxed px-2 transition-all duration-500 delay-100">
                {currentStepData.description}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            {currentStep < steps.length - 1 ? (
              <>
                <button
                  onClick={nextStep}
                  className="w-full py-3 bg-[#2D8C72] hover:bg-[#248066] text-white rounded-2xl font-semibold text-base transition-all duration-300 ease-out transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
                >
                  Next
                </button>
                <button
                  onClick={skipToEnd}
                  className="w-full py-2 text-gray-600 font-medium transition-colors duration-300 hover:text-gray-800 hover:underline"
                >
                  Skip
                </button>
              </>
            ) : (
              <>
                <Link 
                  to={'/login'} 
                  className="w-full py-3 bg-[#2D8C72] hover:bg-[#248066] text-white rounded-2xl font-semibold text-base transition-all duration-300 ease-out transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg block text-center"
                >
                  <span className='text-white'>
                    Sign in
                  </span>
                </Link>
                <Link 
                  to={'/start'} 
                  className="w-full py-3 bg-transparent border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold text-base transition-all duration-300 hover:bg-gray-50 transform hover:scale-[1.02] active:scale-[0.98] block text-center hover:border-gray-300"
                >
                  Sign up
                </Link>
              </> 
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(1.05); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeInReverse {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s ease-in-out forwards;
        }
        .animate-fadeInReverse {
          animation: fadeInReverse 0.7s ease-in-out forwards;
        }
        .animate-slideInUp {
          animation: slideInUp 0.7s ease-in-out forwards;
        }
        .animate-slideInDown {
          animation: slideInDown 0.7s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ZuumOnboarding;