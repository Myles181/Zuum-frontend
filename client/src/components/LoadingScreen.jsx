import React, { useState, useEffect } from 'react';
import { FaMusic, FaUser, FaCreditCard, FaCheck } from 'react-icons/fa';

const LoadingScreen = ({ 
  currentStep = 1, 
  totalSteps = 4, 
  stepMessages = [], 
  isError = false, 
  errorMessage = '', 
  onRetry = null 
}) => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % stepMessages.length);
    }, 2000);

    return () => clearInterval(messageInterval);
  }, [stepMessages.length]);

  const getStepIcon = (step) => {
    switch (step) {
      case 1: return <FaMusic className="text-green-500" />;
      case 2: return <FaUser className="text-blue-500" />;
      case 3: return <FaCreditCard className="text-purple-500" />;
      case 4: return <FaCheck className="text-green-500" />;
      default: return <FaMusic className="text-green-500" />;
    }
  };

  const getStepStatus = (step) => {
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'active';
    return 'pending';
  };

  if (isError) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center z-50">
        <div className="text-center max-w-md mx-4">
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaMusic className="text-white text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-300 mb-6">{errorMessage}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-green-900 to-black flex items-center justify-center z-50">
      <div className="text-center max-w-md mx-4">
        {/* Logo and Brand */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <FaMusic className="text-white text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Zuum</h1>
          <p className="text-gray-300">Where artists and industry meet</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300
                  ${getStepStatus(step) === 'completed' ? 'bg-green-500' : 
                    getStepStatus(step) === 'active' ? 'bg-blue-500 animate-pulse' : 
                    'bg-gray-600'}
                `}>
                  {getStepStatus(step) === 'completed' ? 
                    <FaCheck className="text-white text-sm" /> : 
                    getStepIcon(step)
                  }
                </div>
                <div className={`
                  w-1 h-8 transition-all duration-300
                  ${getStepStatus(step) === 'completed' ? 'bg-green-500' : 'bg-gray-600'}
                `}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-gray-400 text-sm mt-2">{progress}% Complete</p>
        </div>

        {/* Current Step Message */}
        {stepMessages.length > 0 && (
          <div className="mb-6">
            <p className="text-white text-lg font-medium">
              {stepMessages[currentMessage]}
            </p>
            <div className="flex justify-center mt-2">
              {stepMessages.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 transition-all duration-300 ${
                    index === currentMessage ? 'bg-white' : 'bg-gray-600'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        )}

        {/* Loading Animation */}
        <div className="flex justify-center">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 