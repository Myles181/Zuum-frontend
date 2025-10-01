import React, { useState, useEffect } from 'react';
import { ArrowDownToLine, CheckCircle, AlertCircle, Loader2, ExternalLink, Copy, QrCode, Shield, CreditCard, Wallet, Clock, Info, Check, TrendingUp, Lock, Zap } from 'lucide-react';
import { usePayStackPayment, useWalletAddress } from '../../../Hooks/subscription/useCreateAccount';

export const DepositPage = () => {
  const [amount, setAmount] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [activeTab, setActiveTab] = useState('ngn');
  const [copiedAddress, setCopiedAddress] = useState(null);

  const { initializePayment, paymentData, loading, error, success } = usePayStackPayment();
  const { getWalletAddress, walletData, loading: walletLoading, error: walletError, success: walletSuccess } = useWalletAddress();

  // Generate QR code from wallet address
  const generateQRCode = (address) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(address)}`;
  };

  const cryptoAddresses = {
    usdt: {
      address: walletData?.walletAddress || 'Click to generate wallet address',
      network: 'TRC20 (Tron)',
      qrCode: walletData?.walletAddress ? generateQRCode(walletData.walletAddress) : '',
      icon: '🪙',
      minDeposit: '10 USDT',
      processingTime: '5-15 minutes',
      isLoading: walletLoading,
      isGenerated: !!walletData?.walletAddress
    }
  };

  const darkModeStyles = {
    '--color-bg-primary': '#0f0f0f',
    '--color-bg-secondary': '#1a1a1a',
    '--color-bg-tertiary': '#141414',
    '--color-card-bg': 'rgba(255, 255, 255, 0.05)',
    '--color-card-hover': 'rgba(255, 255, 255, 0.08)',
    '--color-text-primary': '#ffffff',
    '--color-text-secondary': '#a0a0a0',
    '--color-accent-primary': '#2D8C72',
    '--color-accent-secondary': '#34A085',
    '--color-accent-hover': '#25715E',
    '--color-gradient-primary': 'linear-gradient(135deg, #2D8C72 0%, #34A085 100%)',
    '--color-gradient-secondary': 'linear-gradient(135deg, #1a1a1a 0%, #2D8C72 100%)',
    '--color-border': 'rgba(255, 255, 255, 0.1)',
    '--color-border-focus': 'rgba(45, 140, 114, 0.5)',
    '--color-success': '#22c55e',
    '--color-warning': '#f59e0b',
    '--color-error': '#ef4444',
    '--shadow-sm': '0 2px 8px rgba(0, 0, 0, 0.3)',
    '--shadow-md': '0 4px 16px rgba(0, 0, 0, 0.4)',
    '--shadow-lg': '0 8px 32px rgba(0, 0, 0, 0.5)',
    '--shadow-glow': '0 0 20px rgba(45, 140, 114, 0.3)'
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
      console.error('Payment initialization failed:', err);
    }
  };

  const handleCreateNewPayment = () => {
    setShowForm(true);
    setAmount('');
  };

  const handleRedirectToPayStack = () => {
    if (paymentData?.authorization_url) {
      window.location.href = paymentData.authorization_url;
    }
  };

  const copyToClipboard = (text, type) => {
    if (!text || text === 'Click to generate wallet address') return;
    
    navigator.clipboard.writeText(text).then(() => {
      setCopiedAddress(type);
      setTimeout(() => setCopiedAddress(null), 2000);
    });
  };

  // Handle tab change - fetch wallet when USDT tab is selected
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'usdt' && !walletData && !walletLoading) {
      getWalletAddress();
    }
  };

  // Auto-fetch wallet when USDT tab is active and no wallet data
  useEffect(() => {
    if (activeTab === 'usdt' && !walletData && !walletLoading && !walletError) {
      getWalletAddress();
    }
  }, [activeTab, walletData, walletLoading, walletError]);

  useEffect(() => {
    if (paymentData?.authorization_url && !loading && !error) {
      const redirectTimer = setTimeout(() => {
        window.location.href = paymentData.authorization_url;
      }, 1500);

      return () => clearTimeout(redirectTimer);
    }
  }, [paymentData, loading, error]);

  useEffect(() => {
    setShowForm(true);
    setAmount('');
  }, [activeTab]);

  const quickAmounts = [500, 1000, 5000, 10000];

  return (
    <div style={darkModeStyles}>
      <div className="max-w-2xl mx-auto p-4 min-h-screen"
        style={{ 
          background: 'radial-gradient(circle at top, #1a1a1a 0%, #0f0f0f 100%)',
          backgroundColor: 'var(--color-bg-primary)'
        }}
      >
        {/* Professional Header with Gradient */}
        <div className="relative overflow-hidden p-8 rounded-3xl mb-6"
          style={{ 
            background: 'var(--color-gradient-secondary)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-glow)'
          }}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Wallet size={28} style={{ color: '#fff' }} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-1"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    Deposit Funds
                  </h1>
                  <p className="text-sm opacity-90"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    Secure and instant deposits
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ 
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  border: '1px solid rgba(34, 197, 94, 0.3)'
                }}
              >
                <Shield size={16} style={{ color: 'var(--color-success)' }} />
                <span className="text-sm font-semibold" style={{ color: 'var(--color-success)' }}>
                  SSL Secured
                </span>
              </div>
            </div>
          </div>
          
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10"
            style={{
              background: 'radial-gradient(circle, rgba(45, 140, 114, 0.4) 0%, transparent 70%)',
              filter: 'blur(40px)'
            }}
          />
        </div>

        {/* Enhanced Deposit Method Tabs */}
        <div className="p-2 rounded-2xl mb-6"
          style={{ 
            backgroundColor: 'var(--color-card-bg)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'ngn', label: 'Naira', sublabel: 'Card/Bank',  color: '#2D8C72' },
              { id: 'usdt', label: 'USDT', sublabel: 'Tether',  color: '#26A17B' }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`relative p-4 rounded-xl text-center transition-all duration-300 ${
                    activeTab === tab.id 
                      ? 'transform scale-105' 
                      : 'opacity-70 hover:opacity-100 hover:scale-102'
                  }`}
                  style={{
                    backgroundColor: activeTab === tab.id 
                      ? 'var(--color-accent-primary)' 
                      : 'var(--color-bg-secondary)',
                    border: activeTab === tab.id 
                      ? '2px solid var(--color-accent-secondary)' 
                      : '1px solid var(--color-border)',
                    boxShadow: activeTab === tab.id ? 'var(--shadow-glow)' : 'none'
                  }}
                >
                  
                  <div className="font-semibold text-sm mb-0.5"
                    style={{ color: activeTab === tab.id ? '#fff' : 'var(--color-text-primary)' }}
                  >
                    {tab.label}
                  </div>
                  <div className="text-xs"
                    style={{ 
                      color: activeTab === tab.id 
                        ? 'rgba(255, 255, 255, 0.8)' 
                        : 'var(--color-text-secondary)' 
                    }}
                  >
                    {tab.sublabel}
                  </div>
                  {activeTab === tab.id && (
                    <div className="absolute -top-1 -right-1 p-1 rounded-full"
                      style={{ backgroundColor: 'var(--color-success)' }}
                    >
                      <Check size={12} style={{ color: '#fff' }} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* NGN Deposit Form */}
        {activeTab === 'ngn' && (
          <>
            {showForm && !paymentData && (
              <div className="rounded-2xl p-6 mb-5"
                style={{ 
                  backgroundColor: 'var(--color-card-bg)',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <form onSubmit={handleInitializePayment} className="space-y-6">
                  {/* Amount Input */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold mb-3"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      <CreditCard size={16} />
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
                        className="w-full p-3 rounded-xl text-2xl font-bold pr-16 transition-all duration-300"
                        style={{ 
                          backgroundColor: 'var(--color-bg-secondary)',
                          border: `2px solid ${amount ? 'var(--color-border-focus)' : 'var(--color-border)'}`,
                          color: 'var(--color-text-primary)',
                          outline: 'none',
                          boxShadow: amount ? 'var(--shadow-glow)' : 'none'
                        }}
                        required
                      />
                      <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
                        <span className="text-lg font-bold"
                          style={{ color: 'var(--color-accent-primary)' }}
                        >
                          NGN
                        </span>
                      </div>
                    </div>
                    {(!amount || isNaN(amount) || amount < 100) && amount !== '' && (
                      <div className="flex items-center gap-2 mt-2 p-2 rounded-lg"
                        style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                      >
                        <AlertCircle size={14} style={{ color: 'var(--color-error)' }} />
                        <p className="text-xs" style={{ color: 'var(--color-error)' }}>
                          Minimum deposit amount is ₦100
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Quick Amount Selection */}
                  <div>
                    <p className="text-xs font-medium mb-3"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      Quick Select
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {quickAmounts.map((quickAmount) => (
                        <button
                          key={quickAmount}
                          type="button"
                          onClick={() => setAmount(quickAmount.toString())}
                          className="p-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105"
                          style={{ 
                            backgroundColor: amount === quickAmount.toString() 
                              ? 'var(--color-accent-primary)' 
                              : 'var(--color-bg-secondary)',
                            border: `1px solid ${amount === quickAmount.toString() 
                              ? 'var(--color-accent-secondary)' 
                              : 'var(--color-border)'}`,
                            color: amount === quickAmount.toString() 
                              ? '#fff' 
                              : 'var(--color-text-primary)'
                          }}
                        >
                          ₦{quickAmount.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!amount || isNaN(amount) || amount < 100 || loading}
                    className="w-full py-3 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] flex items-center justify-center gap-3"
                    style={{ 
                      background: 'var(--color-gradient-primary)',
                      color: '#fff',
                      border: '2px solid var(--color-accent-secondary)',
                      boxShadow: 'var(--shadow-glow)'
                    }}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={22} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Shield size={22} />
                        Proceed to Secure Payment
                      </>
                    )}
                  </button>
                </form>

                {/* Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                  <div className="p-4 rounded-xl"
                    style={{ 
                      backgroundColor: 'var(--color-bg-secondary)',
                      border: '1px solid var(--color-border)'
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <Zap size={18} style={{ color: 'var(--color-accent-primary)' }} className="mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold mb-1" 
                          style={{ color: 'var(--color-text-primary)' }}
                        >
                          Instant Processing
                        </p>
                        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                          Funds reflect immediately after payment
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="mt-6 p-4 rounded-xl"
                  style={{ 
                    backgroundColor: 'rgba(45, 140, 114, 0.1)',
                    border: '1px solid rgba(45, 140, 114, 0.3)'
                  }}
                >
                  <div className="flex gap-3">
                    <Shield size={20} style={{ color: 'var(--color-accent-primary)' }} className="flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold mb-1" 
                        style={{ color: 'var(--color-accent-primary)' }}
                      >
                        Protected by Paystack
                      </p>
                      <p className="text-xs opacity-90"
                        style={{ color: 'var(--color-accent-primary)' }}
                      >
                        Your payment information is encrypted and processed securely through Paystack's bank-level security infrastructure.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="p-12 rounded-2xl flex flex-col items-center justify-center"
                style={{ 
                  backgroundColor: 'var(--color-card-bg)',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <div className="relative mb-6">
                  <Loader2 size={48} className="animate-spin"
                    style={{ color: 'var(--color-accent-primary)' }}
                  />
                  <div className="absolute inset-0 animate-ping opacity-20">
                    <Loader2 size={48} style={{ color: 'var(--color-accent-primary)' }} />
                  </div>
                </div>
                <p className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                  Initializing Payment
                </p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Please wait while we set up your secure payment...
                </p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="p-6 rounded-2xl"
                style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl"
                    style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                  >
                    <AlertCircle size={24} style={{ color: 'var(--color-error)' }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-bold mb-2" style={{ color: 'var(--color-error)' }}>
                      Payment Error
                    </p>
                    <p className="text-sm mb-4" style={{ color: 'var(--color-error)' }}>
                      {error}
                    </p>
                    <button
                      onClick={handleCreateNewPayment}
                      className="px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2"
                      style={{ 
                        backgroundColor: 'var(--color-accent-primary)',
                        color: '#fff',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      <ArrowDownToLine size={16} />
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Success */}
            {paymentData && !loading && !error && (
              <div className="rounded-2xl p-6 mb-5"
                style={{ 
                  backgroundColor: 'var(--color-card-bg)',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-lg)'
                }}
              >
                {/* Success Animation */}
                <div className="mb-6 p-6 rounded-2xl text-center relative overflow-hidden"
                  style={{ 
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    border: '2px solid rgba(34, 197, 94, 0.3)'
                  }}
                >
                  <div className="relative z-10">
                    <div className="inline-block p-4 rounded-full mb-4"
                      style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)' }}
                    >
                      <CheckCircle size={56} style={{ color: 'var(--color-success)' }} />
                    </div>
                    <p className="text-2xl font-bold mb-2" style={{ color: 'var(--color-success)' }}>
                      Payment Ready!
                    </p>
                    <p className="text-sm" style={{ color: 'var(--color-success)' }}>
                      Redirecting to secure payment gateway...
                    </p>
                  </div>
                  <div className="absolute inset-0 opacity-10"
                    style={{
                      background: 'radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, transparent 70%)',
                      animation: 'pulse 2s infinite'
                    }}
                  />
                </div>

                {/* Payment Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="p-5 rounded-xl"
                    style={{ 
                      backgroundColor: 'var(--color-bg-secondary)',
                      border: '1px solid var(--color-border)'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard size={16} style={{ color: 'var(--color-text-secondary)' }} />
                      <p className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                        Deposit Amount
                      </p>
                    </div>
                    <p className="text-3xl font-bold" style={{ color: 'var(--color-accent-primary)' }}>
                      ₦{parseFloat(amount).toLocaleString()}
                    </p>
                  </div>

                  <div className="p-5 rounded-xl"
                    style={{ 
                      backgroundColor: 'var(--color-bg-secondary)',
                      border: '1px solid var(--color-border)'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Info size={16} style={{ color: 'var(--color-text-secondary)' }} />
                      <p className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                        Reference
                      </p>
                    </div>
                    <p className="text-sm font-mono font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                      {paymentData.reference}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleRedirectToPayStack}
                    className="w-full py-5 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3"
                    style={{ 
                      background: 'var(--color-gradient-primary)',
                      color: '#fff',
                      border: '2px solid var(--color-accent-secondary)',
                      boxShadow: 'var(--shadow-glow)'
                    }}
                  >
                    <ExternalLink size={22} />
                    Continue to Paystack
                  </button>

                  <button
                    onClick={handleCreateNewPayment}
                    className="w-full py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
                    style={{ 
                      backgroundColor: 'var(--color-bg-secondary)',
                      color: 'var(--color-text-primary)',
                      border: '1px solid var(--color-border)'
                    }}
                  >
                    Create New Payment
                  </button>
                </div>

                {/* Security Badge */}
                <div className="mt-6 flex items-center justify-center gap-4 p-4 rounded-xl"
                  style={{ 
                    backgroundColor: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  <Shield size={20} style={{ color: 'var(--color-success)' }} />
                  <div className="text-center">
                    <p className="text-xs font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                      Secured by Paystack • SSL Encrypted • PCI Compliant
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* USDT Deposit Form */}
        {activeTab === 'usdt' && (
          <div className="rounded-2xl p-6 mb-5"
            style={{ 
              backgroundColor: 'var(--color-card-bg)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            {/* Crypto Header */}
            <div className="text-center mb-6">
              {/* <div className="inline-block p-4 rounded-2xl mb-4"
                style={{ 
                  background: 'var(--color-gradient-primary)',
                  boxShadow: 'var(--shadow-glow)'
                }}
              >
                <Wallet size={32} style={{ color: '#fff' }} />
              </div> */}
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                Deposit USDT
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Send USDT via TRC20 to your personal wallet address
              </p>
            </div>

            {/* Loading State for Wallet Generation */}
            {walletLoading && (
              <div className="p-8 rounded-2xl flex flex-col items-center justify-center mb-6"
                style={{ 
                  backgroundColor: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div className="relative mb-4">
                  <Loader2 size={40} className="animate-spin"
                    style={{ color: 'var(--color-accent-primary)' }}
                  />
                </div>
                <p className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                  Generating Your TRON Wallet
                </p>
                <p className="text-sm text-center" style={{ color: 'var(--color-text-secondary)' }}>
                  Creating your secure TRON wallet address...
                </p>
              </div>
            )}

            {/* Error State for Wallet Generation */}
            {walletError && (
              <div className="p-6 rounded-2xl mb-6"
                style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl"
                    style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                  >
                    <AlertCircle size={24} style={{ color: 'var(--color-error)' }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-bold mb-2" style={{ color: 'var(--color-error)' }}>
                      Wallet Generation Failed
                    </p>
                    <p className="text-sm mb-4" style={{ color: 'var(--color-error)' }}>
                      {walletError}
                    </p>
                    <button
                      onClick={getWalletAddress}
                      className="px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2"
                      style={{ 
                        backgroundColor: 'var(--color-accent-primary)',
                        color: '#fff',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      <Wallet size={16} />
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Success State - Show QR Code and Address */}
            {walletSuccess && cryptoAddresses.usdt.isGenerated && (
              <>
                {/* QR Code with Border */}
                <div className="flex justify-center mb-6">
                  <div className="p-6 rounded-2xl relative"
                    style={{ 
                      backgroundColor: '#fff',
                      border: '4px solid var(--color-accent-primary)',
                      boxShadow: 'var(--shadow-glow)'
                    }}
                  >
                    <img 
                      src={cryptoAddresses.usdt.qrCode} 
                      alt="USDT QR Code"
                      className="w-48 h-48"
                    />
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                      style={{ 
                        backgroundColor: 'var(--color-accent-primary)',
                        color: '#fff'
                      }}
                    >
                      <QrCode size={12} className="inline mr-1" />
                      SCAN ME
                    </div>
                  </div>
                </div>

                {/* Success Message */}
                {/* <div className="mb-6 p-4 rounded-xl text-center"
                  style={{ 
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)'
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle size={20} style={{ color: 'var(--color-success)' }} />
                    <p className="text-sm font-semibold" style={{ color: 'var(--color-success)' }}>
                      Your TRON wallet has been generated successfully!
                    </p>
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-success)' }}>
                    Private key has been securely stored and sent via Telegram
                  </p>
                </div> */}
              </>
            )}

            {/* Wallet Address Section */}
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  <Wallet size={16} />
                  USDT Wallet Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cryptoAddresses.usdt.address}
                    readOnly
                    className="w-full p-4 rounded-xl text-sm font-mono pr-28"
                    style={{ 
                      backgroundColor: 'var(--color-bg-secondary)',
                      border: `2px solid ${
                        cryptoAddresses.usdt.isGenerated 
                          ? 'var(--color-success)' 
                          : 'var(--color-border)'
                      }`,
                      color: cryptoAddresses.usdt.isGenerated 
                        ? 'var(--color-text-primary)' 
                        : 'var(--color-text-secondary)',
                      outline: 'none',
                      cursor: cryptoAddresses.usdt.isGenerated ? 'text' : 'default'
                    }}
                    onClick={!cryptoAddresses.usdt.isGenerated ? getWalletAddress : undefined}
                  />
                  {cryptoAddresses.usdt.isGenerated ? (
                    <button
                      onClick={() => copyToClipboard(cryptoAddresses.usdt.address, 'usdt')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2"
                      style={{ 
                        background: copiedAddress === 'usdt' 
                          ? 'var(--color-success)' 
                          : 'var(--color-gradient-primary)',
                        color: '#fff',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      {copiedAddress === 'usdt' ? (
                        <>
                          <Check size={16} />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          Copy
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={getWalletAddress}
                      disabled={walletLoading}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2 disabled:opacity-50"
                      style={{ 
                        background: 'var(--color-gradient-primary)',
                        color: '#fff',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      {walletLoading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Wallet size={16} />
                      )}
                      Generate
                    </button>
                  )}
                </div>
                {!cryptoAddresses.usdt.isGenerated && !walletLoading && (
                  <p className="text-xs mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                    Click the input field or Generate button to create your TRON wallet
                  </p>
                )}
              </div>

              {/* Info Grid */}
              {cryptoAddresses.usdt.isGenerated && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl"
                    style={{ 
                      backgroundColor: 'var(--color-bg-secondary)',
                      border: '1px solid var(--color-border)'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Info size={14} style={{ color: 'var(--color-text-secondary)' }} />
                      <p className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                        Network
                      </p>
                    </div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                      {cryptoAddresses.usdt.network}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl"
                    style={{ 
                      backgroundColor: 'var(--color-bg-secondary)',
                      border: '1px solid var(--color-border)'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowDownToLine size={14} style={{ color: 'var(--color-text-secondary)' }} />
                      <p className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                        Min. Deposit
                      </p>
                    </div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                      {cryptoAddresses.usdt.minDeposit}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl"
                    style={{ 
                      backgroundColor: 'var(--color-bg-secondary)',
                      border: '1px solid var(--color-border)'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Clock size={14} style={{ color: 'var(--color-text-secondary)' }} />
                      <p className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                        Confirmations
                      </p>
                    </div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                      {cryptoAddresses.usdt.processingTime}
                    </p>
                  </div>
                </div>
              )}

              {/* Important Notices */}
              {cryptoAddresses.usdt.isGenerated && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl"
                    style={{ 
                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.3)'
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle size={16} style={{ color: 'var(--color-warning)' }} className="mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-warning)' }}>
                          Important Notice
                        </p>
                        <p className="text-xs" style={{ color: 'var(--color-warning)' }}>
                          Only send USDT (TRC20) to this address. Sending other cryptocurrencies may result in permanent loss.
                        </p>
                      </div>
                    </div>
                  </div>

                
                  </div>
              )}
            </div>

            {/* Need Help Section */}
            <div className="mt-6 p-5 rounded-xl text-center"
              style={{ 
                backgroundColor: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)'
              }}
            >
              <Info size={20} className="mx-auto mb-2" style={{ color: 'var(--color-text-secondary)' }} />
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
                Need Help?
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                Contact our 24/7 support team if you need assistance with your deposit
              </p>
            </div>
          </div>
        )}

        {/* No Data State */}
        {!showForm && !paymentData && !loading && !error && activeTab === 'ngn' && (
          <div className="p-6 rounded-2xl flex items-start gap-4"
            style={{ 
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div className="p-3 rounded-xl"
              style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)' }}
            >
              <AlertCircle size={24} style={{ color: 'var(--color-warning)' }} />
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold mb-2" style={{ color: 'var(--color-warning)' }}>
                No Payment Initialized
              </p>
              <p className="text-sm mb-4" style={{ color: 'var(--color-warning)' }}>
                No payment has been initialized yet.
              </p>
              <button
                onClick={handleCreateNewPayment}
                className="px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2"
                style={{ 
                  backgroundColor: 'var(--color-accent-primary)',
                  color: '#fff',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <ArrowDownToLine size={16} />
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