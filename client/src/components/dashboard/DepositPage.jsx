import React, { useEffect, useState } from 'react';
import { ArrowDownToLine, Copy, CheckCircle, AlertCircle, Loader2, Clock } from 'lucide-react';
import useDepositAccount, { useAccountDetails } from '../../../Hooks/subscription/useCreateAccount';

export const DepositPage = () => {
  const [copied, setCopied] = useState(false);
  const [copiedField, setCopiedField] = useState('');
  const [timeRemaining, setTimeRemaining] = useState({
    expired: true,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [amount, setAmount] = useState('');
  const [showForm, setShowForm] = useState(true);

  const { getDepositAccount, paymentDetails, loading, error } = useDepositAccount();
  const { fetchAccountDetails, account, success } = useAccountDetails();

  // Dark mode styles matching the dashboard
  const darkModeStyles = {
    '--color-bg-primary': '#0f0f0f',
    '--color-bg-secondary': '#1a1a1a',
    '--color-bg-gradient': 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
    '--color-card-bg': 'rgba(255, 255, 255, 0.05)',
    '--color-text-primary': '#ffffff',
    '--color-text-secondary': '#a0a0a0',
    '--color-accent-primary': '#2D8C72',
    '--color-accent-secondary': '#34A085',
    '--color-gradient-primary': 'linear-gradient(135deg, #2D8C72 0%, #34A085 100%)',
    '--color-border': 'rgba(255, 255, 255, 0.1)',
    '--color-success': '#22c55e',
    '--color-warning': '#f59e0b',
    '--color-error': '#ef4444'
  };

  useEffect(() => {
    fetchAccountDetails();
  }, []);

  console.log(account);

  const depositData = paymentDetails
    ? {
        accountNumber: paymentDetails.accountNumber,
        bankName: paymentDetails.bankName,
        reference: paymentDetails.reference,
        expiresAt: paymentDetails.expiresAt || paymentDetails.account_expiration,
        amount: paymentDetails.amount
      }
    : null;

  useEffect(() => {
    if (!depositData?.expiresAt) return;

    const expiryDate = new Date(depositData.expiresAt);
    let timerInterval;

    const updateCountdown = () => {
      const now = new Date();
      const timeDiff = expiryDate - now;

      if (timeDiff <= 0) {
        setTimeRemaining({ expired: true, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timerInterval);
        return;
      }

      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      setTimeRemaining({ expired: false, hours, minutes, seconds });
    };

    updateCountdown();
    timerInterval = setInterval(updateCountdown, 1000);
    return () => clearInterval(timerInterval);
  }, [depositData?.expiresAt]);

  const handleGetAccount = async (e) => {
    e.preventDefault();
    
    if (!amount || isNaN(amount) || amount < 1) {
      return;
    }

    await getDepositAccount(parseFloat(amount));
    setShowForm(false);
  };

  const handleCreateNewAccount = () => {
    setShowForm(true);
    setAmount('');
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setCopiedField(field);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-NG', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return dateString || 'N/A';
    }
  };

  const formatCountdown = () => {
    if (timeRemaining.expired) {
      return 'Expired';
    }
    const { hours, minutes, seconds } = timeRemaining;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCountdownVariant = () => {
    if (timeRemaining.expired) return 'error';
    if (timeRemaining.hours < 1) return 'warning';
    return 'default';
  };

  return (
    <div style={darkModeStyles}>
      <div className="max-w-md mx-auto p-4 min-h-screen"
        style={{ 
          background: 'var(--color-bg-gradient)',
          backgroundColor: 'var(--color-bg-primary)'
        }}
      >
        {/* Modern Header */}
        <div className="p-6 rounded-2xl mb-6"
          style={{ 
            background: 'var(--color-gradient-primary)',
            border: '1px solid var(--color-border)'
          }}
        >
          <h2 className="text-2xl font-bold flex items-center gap-3 mb-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            <ArrowDownToLine size={22} />
            Deposit Funds
          </h2>
          <p className="text-sm opacity-90"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Transfer money to your account using the details below
          </p>
        </div>

        {/* Amount Input Form */}
        {showForm && !paymentDetails && (
          <div className="rounded-2xl p-6 mb-5"
            style={{ 
              backgroundColor: 'var(--color-card-bg)',
              border: '1px solid var(--color-border)'
            }}
          >
            <form onSubmit={handleGetAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Enter Deposit Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="1"
                    step="0.01"
                    className="w-full p-4 rounded-xl text-lg font-semibold pr-12 transition-all duration-300 focus:scale-[1.02]"
                    style={{ 
                      backgroundColor: 'var(--color-bg-secondary)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-primary)',
                      outline: 'none'
                    }}
                    required
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    NGN
                  </span>
                </div>
                {(!amount || isNaN(amount) || amount < 1) && amount !== '' && (
                  <p className="text-xs mt-2 flex items-center gap-1"
                    style={{ color: 'var(--color-error)' }}
                  >
                    <AlertCircle size={12} />
                    Please enter a valid amount (minimum ₦1)
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!amount || isNaN(amount) || amount < 1 || loading}
                className="w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
                style={{ 
                  background: 'var(--color-gradient-primary)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border)'
                }}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 size={20} className="animate-spin" />
                    Generating Account...
                  </div>
                ) : (
                  'Generate Deposit Account'
                )}
              </button>
            </form>

            {/* Important Notice */}
            <div className="mt-6 p-4 rounded-xl"
              style={{ 
                backgroundColor: 'rgba(45, 140, 114, 0.1)',
                border: '1px solid rgba(45, 140, 114, 0.2)'
              }}
            >
              <div className="flex gap-3">
                <div className="mt-0.5">
                  <AlertCircle size={18} style={{ color: 'var(--color-accent-primary)' }} />
                </div>
                <div>
                  <p className="text-sm font-medium mb-1" 
                    style={{ color: 'var(--color-accent-primary)' }}
                  >
                    How it works
                  </p>
                  <p className="text-xs opacity-90"
                    style={{ color: 'var(--color-accent-primary)' }}
                  >
                    Enter the amount you want to deposit. We'll generate a unique virtual account for this specific amount. Transfer the exact amount to the provided account details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="p-8 rounded-2xl flex flex-col items-center justify-center"
            style={{ 
              backgroundColor: 'var(--color-card-bg)',
              border: '1px solid var(--color-border)'
            }}
          >
            <Loader2 size={36} className="animate-spin mb-4"
              style={{ color: 'var(--color-accent-primary)' }}
            />
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Generating your account details...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-2xl flex items-start gap-3 mb-4"
            style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}
          >
            <AlertCircle size={20} className="mt-0.5 flex-shrink-0"
              style={{ color: 'var(--color-error)' }}
            />
            <div>
              <p className="font-medium mb-1" style={{ color: 'var(--color-error)' }}>
                Error
              </p>
              <p className="text-sm" style={{ color: 'var(--color-error)' }}>
                {error}
              </p>
              <button
                onClick={handleCreateNewAccount}
                className="mt-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                style={{ 
                  backgroundColor: 'var(--color-accent-primary)',
                  color: 'var(--color-text-primary)'
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Deposit Details */}
        {depositData && !loading && !error && (
          <div className="rounded-2xl p-6 mb-5"
            style={{ 
              backgroundColor: 'var(--color-card-bg)',
              border: '1px solid var(--color-border)'
            }}
          >
            {/* Header with Amount */}
            <div className="mb-6 p-4 rounded-xl text-center"
              style={{ 
                backgroundColor: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)'
              }}
            >
              <p className="text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                Deposit Amount
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-accent-primary)' }}>
                ₦{parseFloat(depositData.amount || amount).toLocaleString()}
              </p>
              <button
                onClick={handleCreateNewAccount}
                className="mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border)'
                }}
              >
                Create New Deposit
              </button>
            </div>

            {timeRemaining.expired && (
              <div className="mb-4 p-3 rounded-xl flex items-center gap-3"
                style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}
              >
                <AlertCircle size={18} style={{ color: 'var(--color-error)' }} />
                <p className="text-sm font-medium" style={{ color: 'var(--color-error)' }}>
                  This account has expired. Please generate a new one.
                </p>
              </div>
            )}

            <div className="space-y-6">
              {/* Bank Name */}
              <div className="flex justify-between items-center p-4 rounded-xl group hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                style={{ 
                  backgroundColor: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)'
                }}
                onClick={() => copyToClipboard(depositData.bankName, 'Bank Name')}
              >
                <div>
                  <p className="text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                    Bank Name
                  </p>
                  <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    {depositData.bankName}
                  </p>
                </div>
                <button
                  className="flex items-center justify-center h-8 w-8 rounded-full transition-all duration-300 hover:scale-110"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'var(--color-text-primary)'
                  }}
                  aria-label="Copy bank name"
                >
                  {copied && copiedField === 'Bank Name' ? (
                    <CheckCircle size={16} style={{ color: 'var(--color-success)' }} />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>

              {/* Account Number */}
              <div className="flex justify-between items-center p-4 rounded-xl group hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                style={{ 
                  backgroundColor: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)'
                }}
                onClick={() => copyToClipboard(depositData.accountNumber, 'Account Number')}
              >
                <div>
                  <p className="text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                    Account Number
                  </p>
                  <p className="font-semibold text-lg tracking-wider" 
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {depositData.accountNumber}
                  </p>
                </div>
                <button
                  className="flex items-center justify-center h-8 w-8 rounded-full transition-all duration-300 hover:scale-110"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'var(--color-text-primary)'
                  }}
                  aria-label="Copy account number"
                >
                  {copied && copiedField === 'Account Number' ? (
                    <CheckCircle size={16} style={{ color: 'var(--color-success)' }} />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>

              {/* Reference */}
              <div className="flex justify-between items-center p-4 rounded-xl group hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                style={{ 
                  backgroundColor: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)'
                }}
                onClick={() => copyToClipboard(depositData.reference, 'Reference')}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      Reference
                    </p>
                    <span style={{ color: 'var(--color-error)' }}>*</span>
                  </div>
                  <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    {depositData.reference}
                  </p>
                  <p className="text-xs mt-2" style={{ color: 'var(--color-error)' }}>
                    Always include this reference with your transfer
                  </p>
                </div>
                <button
                  className="flex items-center justify-center h-8 w-8 rounded-full transition-all duration-300 hover:scale-110"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'var(--color-text-primary)'
                  }}
                  aria-label="Copy reference"
                >
                  {copied && copiedField === 'Reference' ? (
                    <CheckCircle size={16} style={{ color: 'var(--color-success)' }} />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>

              {/* Countdown Timer */}
              <div className="p-4 rounded-xl"
                style={{ 
                  backgroundColor: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                  Account Expires In
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ 
                        backgroundColor: getCountdownVariant() === 'error' 
                          ? 'rgba(239, 68, 68, 0.2)' 
                          : getCountdownVariant() === 'warning'
                            ? 'rgba(245, 158, 11, 0.2)'
                            : 'rgba(45, 140, 114, 0.2)',
                        border: `1px solid ${
                          getCountdownVariant() === 'error' 
                            ? 'rgba(239, 68, 68, 0.3)' 
                            : getCountdownVariant() === 'warning'
                              ? 'rgba(245, 158, 11, 0.3)'
                              : 'rgba(45, 140, 114, 0.3)'
                        }`
                      }}
                    >
                      <Clock size={20} 
                        style={{ 
                          color: getCountdownVariant() === 'error' 
                            ? 'var(--color-error)' 
                            : getCountdownVariant() === 'warning'
                              ? 'var(--color-warning)'
                              : 'var(--color-accent-primary)'
                        }} 
                      />
                    </div>
                    <div>
                      <p className={`font-bold text-lg ${
                        getCountdownVariant() === 'error' 
                          ? 'text-red-400' 
                          : getCountdownVariant() === 'warning'
                            ? 'text-yellow-400'
                            : 'text-green-400'
                      }`}>
                        {formatCountdown()}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                        {formatDate(depositData.expiresAt)}
                      </p>
                    </div>
                  </div>
                  <div className={`text-xs px-3 py-1 rounded-full font-medium ${
                    getCountdownVariant() === 'error' 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                      : getCountdownVariant() === 'warning'
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-green-500/20 text-green-400 border border-green-500/30'
                  }`}>
                    {timeRemaining.expired 
                      ? 'Expired' 
                      : timeRemaining.hours < 1 
                        ? 'Expiring Soon' 
                        : 'Active'}
                  </div>
                </div>
              </div>
            </div>

            {/* Success Message */}
            {copied && (
              <div className="mt-4 p-3 rounded-xl text-sm flex items-center justify-center gap-2"
                style={{ 
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  color: 'var(--color-success)'
                }}
              >
                <CheckCircle size={16} />
                <span>{copiedField} copied to clipboard!</span>
              </div>
            )}
            
            {/* Important Notice */}
            <div className="mt-6 p-4 rounded-xl"
              style={{ 
                backgroundColor: 'rgba(45, 140, 114, 0.1)',
                border: '1px solid rgba(45, 140, 114, 0.2)'
              }}
            >
              <div className="flex gap-3">
                <div className="mt-0.5">
                  <AlertCircle size={18} style={{ color: 'var(--color-accent-primary)' }} />
                </div>
                <div>
                  <p className="text-sm font-medium mb-1" 
                    style={{ color: 'var(--color-accent-primary)' }}
                  >
                    Important
                  </p>
                  <p className="text-xs opacity-90"
                    style={{ color: 'var(--color-accent-primary)' }}
                  >
                    Transfer exactly ₦{parseFloat(depositData.amount || amount).toLocaleString()} to this bank account with the reference code provided. 
                    Your wallet will be credited automatically once payment is confirmed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Data State - Show when no form and no deposit data */}
        {!showForm && !depositData && !loading && !error && (
          <div className="p-5 rounded-2xl flex items-start gap-3"
            style={{ 
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.2)'
            }}
          >
            <AlertCircle size={20} className="mt-0.5 flex-shrink-0" 
              style={{ color: 'var(--color-warning)' }}
            />
            <div>
              <p className="font-medium mb-1" style={{ color: 'var(--color-warning)' }}>
                No Account Details
              </p>
              <p className="text-sm" style={{ color: 'var(--color-warning)' }}>
                No deposit account details are currently available.
              </p>
              <button
                onClick={handleCreateNewAccount}
                className="mt-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                style={{ 
                  backgroundColor: 'var(--color-accent-primary)',
                  color: 'var(--color-text-primary)'
                }}
              >
                Create Deposit Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositPage;