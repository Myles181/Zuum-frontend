import React, { useState, useEffect } from 'react';
import { ArrowDownToLine, CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { usePayStackPayment } from '../../../Hooks/subscription/useCreateAccount';

export const DepositPage = () => {
  const [amount, setAmount] = useState('');
  const [showForm, setShowForm] = useState(true);

  const { initializePayment, paymentData, loading, error, success } = usePayStackPayment();

  

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

  const handleInitializePayment = async (e) => {
    e.preventDefault();
    
    if (!amount || isNaN(amount) || amount < 100) {
      return;
    }

    try {
      await initializePayment(parseFloat(amount));
      setShowForm(false);
    } catch (err) {
      // Error is handled by the hook
      console.error('Payment initialization failed:', err);
    }
  };

  console.log(paymentData);
  

  const handleCreateNewPayment = () => {
    setShowForm(true);
    setAmount('');
  };

  const handleRedirectToPayStack = () => {
    if (paymentData?.authorization_url) {
      window.location.href = paymentData.authorization_url;
    }
  };

  // Auto-redirect when payment data is available
  useEffect(() => {
    
    if (paymentData?.authorization_url && !loading && !error) {
      // Small delay to show success state before redirect
      const redirectTimer = setTimeout(() => {
        window.location.href = paymentData.authorization_url;
      }, 1500);

      return () => clearTimeout(redirectTimer);
    }
  }, [paymentData, loading, error]);

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
            Securely deposit funds using Paystack
          </p>
        </div>

        {/* Amount Input Form */}
        {showForm && !paymentData && (
          <div className="rounded-2xl p-6 mb-5"
            style={{ 
              backgroundColor: 'var(--color-card-bg)',
              border: '1px solid var(--color-border)'
            }}
          >
            <form onSubmit={handleInitializePayment} className="space-y-4">
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
                    min="100"
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
                {(!amount || isNaN(amount) || amount < 100) && amount !== '' && (
                  <p className="text-xs mt-2 flex items-center gap-1"
                    style={{ color: 'var(--color-error)' }}
                  >
                    <AlertCircle size={12} />
                    Minimum deposit amount is ₦100
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!amount || isNaN(amount) || amount < 100 || loading}
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
                    Initializing Payment...
                  </div>
                ) : (
                  'Proceed to Payment'
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
                    Secure Payment
                  </p>
                  <p className="text-xs opacity-90"
                    style={{ color: 'var(--color-accent-primary)' }}
                  >
                    You'll be redirected to Paystack's secure payment page to complete your deposit. Your payment information is protected with bank-level security.
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
              Initializing your payment...
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
                Payment Error
              </p>
              <p className="text-sm" style={{ color: 'var(--color-error)' }}>
                {error}
              </p>
              <button
                onClick={handleCreateNewPayment}
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

        {/* Payment Success - Redirecting */}
        {paymentData && !loading && !error && (
          <div className="rounded-2xl p-6 mb-5"
            style={{ 
              backgroundColor: 'var(--color-card-bg)',
              border: '1px solid var(--color-border)'
            }}
          >
            {/* Success Header */}
            <div className="mb-6 p-4 rounded-xl text-center"
              style={{ 
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)'
              }}
            >
              <CheckCircle size={48} className="mx-auto mb-3"
                style={{ color: 'var(--color-success)' }}
              />
              <p className="text-lg font-bold mb-2" style={{ color: 'var(--color-success)' }}>
                Payment Initialized Successfully!
              </p>
              <p className="text-sm" style={{ color: 'var(--color-success)' }}>
                Redirecting you to Paystack...
              </p>
            </div>

            {/* Payment Details */}
            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-xl"
                style={{ 
                  backgroundColor: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <p className="text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                  Deposit Amount
                </p>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-accent-primary)' }}>
                  ₦{parseFloat(amount).toLocaleString()}
                </p>
              </div>

              <div className="p-4 rounded-xl"
                style={{ 
                  backgroundColor: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <p className="text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                  Transaction Reference
                </p>
                <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  {paymentData.reference}
                </p>
              </div>
            </div>

            {/* Manual Redirect Button */}
            <div className="text-center">
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                If you are not redirected automatically, click the button below:
              </p>
              <button
                onClick={handleRedirectToPayStack}
                className="w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                style={{ 
                  background: 'var(--color-gradient-primary)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <ExternalLink size={20} />
                Proceed to Paystack
              </button>

              <button
                onClick={handleCreateNewPayment}
                className="w-full mt-3 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-[1.02]"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border)'
                }}
              >
                Create New Payment
              </button>
            </div>

            {/* Security Notice */}
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
                    Secure Payment Processing
                  </p>
                  <p className="text-xs opacity-90"
                    style={{ color: 'var(--color-accent-primary)' }}
                  >
                    Your payment is processed securely by Paystack. We never store your card or bank details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Data State - Show when no form and no payment data */}
        {!showForm && !paymentData && !loading && !error && (
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
                No Payment Initialized
              </p>
              <p className="text-sm" style={{ color: 'var(--color-warning)' }}>
                No payment has been initialized yet.
              </p>
              <button
                onClick={handleCreateNewPayment}
                className="mt-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                style={{ 
                  backgroundColor: 'var(--color-accent-primary)',
                  color: 'var(--color-text-primary)'
                }}
              >
                Initialize Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositPage;