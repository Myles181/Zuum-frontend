import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import a from '../assets/image/Group 4.png';
import { Link } from 'react-router-dom';

const ZuumOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

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
    if (currentStep < steps.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setTimeout(() => setIsTransitioning(false), 100);
      }, 300);
    }
  };

  const prevStep = () => {
    if (currentStep > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setTimeout(() => setIsTransitioning(false), 100);
      }, 300);
    }
  };

  const skipToEnd = () => {
    if (currentStep < steps.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(steps.length - 1);
        setTimeout(() => setIsTransitioning(false), 100);
      }, 300);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <>
      <style jsx>{`
        .slide-container {
          height: 110vh;
          min-height: 100vh;
          top: -5vh;
        }
        
        .content-wrapper {
          height: 105vh;
          min-height: 100vh;
          max-height: none;
        }
        
        .image-transition {
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .content-transition {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .progress-dot {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .button-hover {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .fade-slide-enter {
          opacity: 0;
          transform: translateX(30px) scale(0.95);
        }
        
        .fade-slide-enter-active {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
        
        .fade-slide-exit {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
        
        .fade-slide-exit-active {
          opacity: 0;
          transform: translateX(-30px) scale(1.05);
        }
      `}</style>
      
      <div className="fixed inset-0 bg-gray-100 flex items-center justify-center slide-container">
        <div className="w-full max-w-sm bg-white shadow-xl overflow-hidden flex flex-col content-wrapper">
          {/* Header with Logo */}
           <div className="m-5 absolute z-10 transition-all duration-700 ease-in-out">
          <img src={a} className="w-25 transition-transform duration-500 hover:scale-105" alt="Zuum logo" />
        </div>

          {/* Image Section */}
          <div className="relative flex-1 overflow-hidden">
            <div 
              className={`w-full h-full bg-cover bg-center bg-no-repeat image-transition ${
                isTransitioning 
                  ? 'opacity-0 scale-110 blur-sm' 
                  : 'opacity-100 scale-100 blur-none'
              }`}
              style={{ backgroundImage: `url(${currentStepData.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-white/80"></div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 px-6 py-8 flex flex-col justify-between">
            <div className="flex-grow flex flex-col justify-center">
              {/* Progress Dots */}
              <div className="flex justify-center space-x-2 mb-8">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full progress-dot ${
                      index === currentStep 
                        ? 'w-8 bg-gradient-to-r from-[#2D8C72] to-[#34A085]' 
                        : index < currentStep
                          ? 'w-2 bg-[#2D8C72]/60'
                          : 'w-2 bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Text Content */}
              <div 
                className={`text-center mb-8 content-transition ${
                  isTransitioning 
                    ? 'opacity-0 translate-y-4' 
                    : 'opacity-100 translate-y-0'
                }`}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                  {currentStepData.title}
                </h2>
                <p className="text-gray-600 text-base leading-relaxed px-2">
                  {currentStepData.description}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div 
              className={`space-y-4 content-transition ${
                isTransitioning 
                  ? 'opacity-70 translate-y-2' 
                  : 'opacity-100 translate-y-0'
              }`}
            >
              {currentStep < steps.length - 1 ? (
                <>
                  <button
                    onClick={nextStep}
                    disabled={isTransitioning}
                    className="w-full py-4 bg-gradient-to-r from-[#2D8C72] to-[#34A085] hover:from-[#248066] hover:to-[#2D8C72] text-white rounded-2xl font-semibold text-base button-hover transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                  <button
                    onClick={skipToEnd}
                    disabled={isTransitioning}
                    className="w-full py-2 text-gray-600 font-medium button-hover hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>
    </>
  );
};

export default ZuumOnboarding;