import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { FiX, FiCheckCircle, FiInfo, FiAlertTriangle, FiBell } from 'react-icons/fi';
import { useDarkMode } from './DarkModeContext';

// -- Popup UI --
const AlertPopup = React.memo(({ alerts, onClose }) => {
  if (!alerts.length) return null;
  
  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex flex-col mt-13 items-center pointer-events-none">
      {alerts.map(a => (
        <AlertItem key={a.id} alert={a} onClose={onClose} />
      ))}
    </div>
  );
});

const AlertItem = React.memo(({ alert, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose(alert.id);
    }, alert.duration || 5000);

    return () => clearTimeout(timer);
  }, [alert.id, alert.duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`pointer-events-auto mb-2 flex items-center gap-3 rounded-full px-5 py-3 animate-fade-in`}
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        color: 'var(--color-text-primary)',
        boxShadow:
          alert.type === 'success'
            ? '0 0 20px rgba(52,211,153,0.6)'
            : alert.type === 'info'
            ? '0 0 20px rgba(59,130,246,0.6)'
            : alert.type === 'warning'
            ? '0 0 20px rgba(251,191,36,0.6)'
            : '0 0 20px rgba(239,68,68,0.6)'
      }}
    >
      {{
        success: <FiCheckCircle className="text-green-500" />,
        info: <FiInfo className="text-blue-500" />,
        warning: <FiBell className="text-amber-500" />,
        error: <FiAlertTriangle className="text-red-500" />
      }[alert.type]}
      <span className="text-sm flex-1" style={{ color: 'var(--color-text-primary)' }}>{alert.message}</span>
      <button 
        onClick={() => {
          setIsVisible(false);
          onClose(alert.id);
        }} 
        className="opacity-70 hover:opacity-100"
        style={{ color: 'var(--color-text-primary)' }}
      >
        <FiX />
      </button>
    </div>
  );
});

// -- Context & Provider --
const AlertContext = createContext();

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const removeAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter(a => a.id !== id));
  }, []);

  const addAlert = useCallback((type, message, duration) => {
    const id = Date.now().toString();
    setAlerts((prev) => [...prev, { id, type, message, duration }]);
    return id;
  }, []);

  const alertActions = useMemo(() => ({
    showSuccess: (msg, d = 5000) => addAlert('success', msg, d),
    showError: (msg, d = 8000) => addAlert('error', msg, d),
    showInfo: (msg, d = 7000) => addAlert('info', msg, d),
    showWarning: (msg, d = 10000) => addAlert('warning', msg, d)
  }), [addAlert]);

  // inject keyframes once
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in { animation: fadeIn 0.3s ease forwards; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <AlertContext.Provider value={alertActions}>
      {children}
      <AlertPopup alerts={alerts} onClose={removeAlert} />
    </AlertContext.Provider>
  );
};