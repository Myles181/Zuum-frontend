import React, { useState, useEffect, createContext, useContext } from 'react';
import { FiX, FiCheckCircle, FiInfo, FiAlertTriangle, FiBell } from 'react-icons/fi';

// Create Alert Context
const AlertContext = createContext();

// Alert Popup Component
const AlertPopup = ({ alerts, onClose }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex flex-col items-center w-full">
      {alerts.map((alert) => (
        <Alert key={alert.id} alert={alert} onClose={onClose} />
      ))}
    </div>
  );
};

// Individual Alert Component
const Alert = ({ alert, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [exitAnimation, setExitAnimation] = useState(false);

  useEffect(() => {
    // Auto-close after duration if specified in the alert
    if (alert.duration) {
      const timer = setTimeout(() => {
        handleClose();
      }, alert.duration);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleClose = () => {
    setExitAnimation(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose(alert.id);
    }, 300); // Animation duration
  };

  // Don't render if not visible
  if (!isVisible) return null;

  // Get styles based on alert type
  const getAlertStyles = () => {
    switch (alert.type) {
      case 'success':
        return {
          bgColor: 'bg-white',
          textColor: 'text-green-600',
          iconColor: 'text-green-500',
          shadowColor: '0 0 20px rgba(52, 211, 153, 0.6), 0 0 0 1px rgba(52, 211, 153, 0.1), 0 8px 16px -4px rgba(52, 211, 153, 0.15)',
          icon: <FiCheckCircle className="text-lg" />
        };
      case 'info':
        return {
          bgColor: 'bg-white',
          textColor: 'text-blue-600',
          iconColor: 'text-blue-500',
          shadowColor: '0 0 20px rgba(59, 130, 246, 0.6), 0 0 0 1px rgba(59, 130, 246, 0.1), 0 8px 16px -4px rgba(59, 130, 246, 0.15)',
          icon: <FiInfo className="text-lg" />
        };
      case 'warning':
        return {
          bgColor: 'bg-white',
          textColor: 'text-amber-600',
          iconColor: 'text-amber-500',
          shadowColor: '0 0 20px rgba(251, 191, 36, 0.6), 0 0 0 1px rgba(251, 191, 36, 0.1), 0 8px 16px -4px rgba(251, 191, 36, 0.15)',
          icon: <FiBell className="text-lg" />
        };
      case 'error':
        return {
          bgColor: 'bg-white',
          textColor: 'text-red-600',
          iconColor: 'text-red-500',
          shadowColor: '0 0 20px rgba(239, 68, 68, 0.6), 0 0 0 1px rgba(239, 68, 68, 0.1), 0 8px 16px -4px rgba(239, 68, 68, 0.15)',
          icon: <FiAlertTriangle className="text-lg" />
        };
      default:
        return {
          bgColor: 'bg-white',
          textColor: 'text-gray-600',
          iconColor: 'text-gray-500',
          shadowColor: '0 0 20px rgba(156, 163, 175, 0.6), 0 0 0 1px rgba(156, 163, 175, 0.1), 0 8px 16px -4px rgba(156, 163, 175, 0.15)',
          icon: <FiInfo className="text-lg" />
        };
    }
  };

  const styles = getAlertStyles();

  return (
    <div 
      className={`${styles.bgColor} rounded-full my-2 py-3 px-5 w-11/12 max-w-md ${
        exitAnimation ? 'animate-fade-out' : 'animate-fade-in'
      }`}
      style={{
        boxShadow: styles.shadowColor
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={styles.iconColor}>
            {styles.icon}
          </div>
          <span className={`${styles.textColor} text-sm font-medium`}>
            {alert.message}
          </span>
        </div>
        
        <button 
          onClick={handleClose}
          className={`${styles.textColor} opacity-70 hover:opacity-100 transition-opacity`}
          aria-label="Close alert"
        >
          <FiX />
        </button>
      </div>
    </div>
  );
};

// Alert Provider Component
export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  
  // Function to add an alert
  const addAlert = (alert) => {
    const id = Date.now().toString();
    setAlerts(prev => [...prev, { ...alert, id }]);
    return id;
  };

  // Function to remove an alert
  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };
  
  // Convenience methods for different alert types
  const showSuccess = (message, duration = 5000) => 
    addAlert({ type: 'success', message, duration });
    
  const showInfo = (message, duration = 7000) => 
    addAlert({ type: 'info', message, duration });
    
  const showWarning = (message, duration = 10000) => 
    addAlert({ type: 'warning', message, duration });
    
  const showError = (message, duration = 8000) => 
    addAlert({ type: 'error', message, duration });

  // Add CSS for animations
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-8px); }
      }
      
      .animate-fade-in {
        animation: fadeIn 0.3s ease forwards;
      }
      
      .animate-fade-out {
        animation: fadeOut 0.3s ease forwards;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <AlertContext.Provider value={{ 
      alerts, 
      addAlert, 
      removeAlert,
      showSuccess,
      showInfo,
      showWarning,
      showError
    }}>
      {children}
      <AlertPopup alerts={alerts} onClose={removeAlert} />
    </AlertContext.Provider>
  );
};

// Custom hook to use the alert context
export const useAlerts = () => useContext(AlertContext);

// Export individual components for flexibility
export { AlertPopup };

// Default export is the hook for easier imports
export default useAlerts;