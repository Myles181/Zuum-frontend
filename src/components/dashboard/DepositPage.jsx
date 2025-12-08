import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDownToLine, CheckCircle, AlertCircle, Loader2, Copy, QrCode, Shield, CreditCard, Wallet, Clock, Info, Check, TrendingUp, Zap, ChevronDown } from 'lucide-react';
import { useCreateTronWallet, useCreateVirtualAccount } from '../../../Hooks/subscription/useCreateAccount';
import { useWalletDeposit } from '../../hooks/useWalletDeposit';
import Navbar from '../profile/NavBar';
import BottomNav from '../homepage/BottomNav';

const DepositPage = () => {
  const [amount, setAmount] = useState('');
  const [activeTab, setActiveTab] = useState('virtual');
  const [copiedInfo, setCopiedInfo] = useState(null);
  const [countdown, setCountdown] = useState(30);
  
  // Crypto deposit states
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [sourceWalletAddress, setSourceWalletAddress] = useState('');
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);

  const navigate = useNavigate();
  const { createVirtualAccount, account, loading, error, reset } = useCreateVirtualAccount();
  const { createTronWallet, walletData, loading: walletLoading, error: walletError, reset: resetTronWallet } = useCreateTronWallet();
  
  // Wallet deposit hook for crypto
  const {
    depositAddresses,
    currentDeposit,
    isLoading: cryptoLoading,
    error: cryptoError,
    success: cryptoSuccess,
    fetchDepositAddresses,
    createDepositRequest,
    getActiveAddresses,
    resetError: resetCryptoError,
    resetSuccess: resetCryptoSuccess,
    clearCurrentDeposit
  } = useWalletDeposit();

  const isCountdownActive = useMemo(() => 
    countdown > 0 && ((account && activeTab === 'virtual') || (currentDeposit && activeTab === 'crypto')),
    [countdown, account, currentDeposit, activeTab]
  );

  // Countdown timer
  useEffect(() => {
    if (!isCountdownActive) return;
    const timer = setTimeout(() => setCountdown(prev => Math.max(0, prev - 1)), 1000);
    return () => clearTimeout(timer);
  }, [isCountdownActive, countdown]);

  // Reset countdown on account/deposit creation
  useEffect(() => {
    if ((account && activeTab === 'virtual') || (currentDeposit && activeTab === 'crypto')) {
      setCountdown(30);
    }
  }, [account, currentDeposit, activeTab]);

  // Fetch deposit addresses when switching to crypto tab
  useEffect(() => {
    if (activeTab === 'crypto') {
      fetchDepositAddresses();
    }
  }, [activeTab]);

  // Auto-select first active wallet
  useEffect(() => {
    const activeAddresses = getActiveAddresses();
    if (activeAddresses.length > 0 && !selectedWallet) {
      setSelectedWallet(activeAddresses[0]);
    }
  }, [depositAddresses, getActiveAddresses, selectedWallet]);

  // Auto-clear crypto success/error messages
  useEffect(() => {
    if (cryptoSuccess) {
      const timer = setTimeout(() => resetCryptoSuccess(), 5000);
      return () => clearTimeout(timer);
    }
  }, [cryptoSuccess, resetCryptoSuccess]);

  useEffect(() => {
    if (cryptoError) {
      const timer = setTimeout(() => resetCryptoError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [cryptoError, resetCryptoError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) < 100) return;
    await createVirtualAccount(parseFloat(amount));
  };

  const handleReset = () => {
    reset();
    setAmount('');
    setCountdown(20);
  };

  const handleTronReset = () => {
    resetTronWallet();
    setCountdown(30);
  };

  const handleComplete = () => {
    setTimeout(() => navigate('/dashboard'), 1000);
  };

  const copyText = (text, type) => {
    if (!text || text === 'Click to generate wallet address') return;
    navigator.clipboard.writeText(text);
    setCopiedInfo(type);
    setTimeout(() => setCopiedInfo(null), 2000);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleCreateTronWallet = async () => {
    try {
      await createTronWallet();
    } catch (err) {
      // Error is handled in the hook
      console.error('Failed to create TRON wallet:', err);
    }
  };

  // Handle crypto deposit request submission
  const handleCryptoDeposit = async (e) => {
    e.preventDefault();
    if (!cryptoAmount || parseFloat(cryptoAmount) <= 0) return;
    if (!selectedWallet) return;
    if (!sourceWalletAddress.trim()) return;

    await createDepositRequest(
      parseFloat(cryptoAmount),
      selectedWallet.id,
      sourceWalletAddress.trim()
    );
  };

  // Reset crypto deposit form
  const handleCryptoReset = () => {
    setCryptoAmount('');
    setSourceWalletAddress('');
    clearCurrentDeposit();
    resetCryptoError();
    resetCryptoSuccess();
    setCountdown(30);
  };

  // Get chain label for display
  const getChainLabel = (chain) => {
    const labels = {
      'TRON': 'TRON (TRC20)',
      'ETH': 'Ethereum (ERC20)',
      'BSC': 'BSC (BEP20)',
      'BTC': 'Bitcoin'
    };
    return labels[chain] || chain;
  };

  const quickAmounts = [1000, 5000, 10000, 50000];
  const hasWallet = !!walletData?.walletAddress;
  const qrCode = hasWallet ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(walletData.walletAddress)}` : '';

  return (
    <div className="min-h-screen" style={{ background: '#0f0f0f' }}>
      <Navbar name="Deposit" />
      
      <div className="max-w-2xl mx-auto p-4 pb-24">
        {/* Header */}
        <div className="relative overflow-hidden p-6 rounded-2xl mb-4" style={{ 
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2D8C72 100%)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <Wallet size={24} color="#fff" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Deposit Funds</h1>
              <p className="text-xs text-white/80">Fast & Secure Deposits</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 gap-2 p-2 rounded-xl mb-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {[
            { id: 'virtual', label: 'Bank Transfer', sub: 'Instant' },
            { id: 'crypto', label: 'Crypto', sub: 'USDT TRC20' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className="relative p-3 rounded-lg transition-all"
              style={{
                background: activeTab === tab.id ? '#2D8C72' : '#1a1a1a',
                border: activeTab === tab.id ? '2px solid #34A085' : '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <div className="font-semibold text-sm text-white">{tab.label}</div>
              <div className="text-xs" style={{ color: activeTab === tab.id ? 'rgba(255,255,255,0.8)' : '#a0a0a0' }}>
                {tab.sub}
              </div>
              {activeTab === tab.id && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                  <Check size={10} color="#fff" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Virtual Account Tab */}
        {activeTab === 'virtual' && (
          <>
            {!account && !loading && (
              <form onSubmit={handleSubmit} className="rounded-xl p-5 mb-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                  <CreditCard size={14} />
                  Amount
                </label>
                <div className="relative mb-4">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="100"
                    className="w-full p-3 rounded-lg text-xl font-bold pr-16 text-white"
                    style={{ 
                      background: '#1a1a1a',
                      border: `2px solid ${amount ? 'rgba(45,140,114,0.5)' : 'rgba(255,255,255,0.1)'}`,
                      outline: 'none'
                    }}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-bold" style={{ color: '#2D8C72' }}>
                    NGN
                  </span>
                </div>

                {amount && parseFloat(amount) < 100 && (
                  <div className="flex items-center gap-2 p-2 rounded-lg mb-4" style={{ background: 'rgba(239,68,68,0.1)' }}>
                    <AlertCircle size={14} color="#ef4444" />
                    <p className="text-xs text-red-400">Minimum ₦100</p>
                  </div>
                )}

                <div className="grid grid-cols-4 gap-2 mb-4">
                  {quickAmounts.map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(amt.toString())}
                      className="p-2.5 rounded-lg text-sm font-semibold transition-all"
                      style={{ 
                        background: amount === amt.toString() ? '#2D8C72' : '#1a1a1a',
                        border: `1px solid ${amount === amt.toString() ? '#34A085' : 'rgba(255,255,255,0.1)'}`,
                        color: '#fff'
                      }}
                    >
                      ₦{(amt/1000).toFixed(0)}k
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={!amount || parseFloat(amount) < 100 || loading}
                  className="w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #2D8C72 0%, #34A085 100%)' }}
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <Shield size={20} />}
                  {loading ? 'Creating...' : 'Generate Account'}
                </button>
              </form>
            )}

            {loading && (
              <div className="p-8 rounded-xl flex flex-col items-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <Loader2 size={40} className="animate-spin mb-3" color="#2D8C72" />
                <p className="text-white font-semibold">Creating Account...</p>
              </div>
            )}

            {error && (
              <div className="p-5 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                <div className="flex items-start gap-3">
                  <AlertCircle size={24} color="#ef4444" />
                  <div className="flex-1">
                    <p className="text-red-400 font-bold mb-2">Failed</p>
                    <p className="text-sm text-red-400 mb-3">{error}</p>
                    <button onClick={handleReset} className="px-4 py-2 rounded-lg font-semibold text-white" style={{ background: '#2D8C72' }}>
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {account && (
              <div className="rounded-xl p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={20} color="#22c55e" />
                    <span className="font-bold text-white">Account Ready</span>
                  </div>
                  {isCountdownActive && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold" style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b' }}>
                      <Clock size={12} />
                      {countdown}s
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Account Number</label>
                  <div className="relative">
                    <input value={account.accountNumber} readOnly className="w-full p-3 rounded-lg font-mono pr-20 text-white" style={{ background: '#1a1a1a', border: '2px solid #22c55e' }} />
                    <button onClick={() => copyText(account.accountNumber, 'account')} className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded text-xs font-semibold text-white flex items-center gap-1" style={{ background: copiedInfo === 'account' ? '#22c55e' : '#2D8C72' }}>
                      {copiedInfo === 'account' ? <Check size={12} /> : <Copy size={12} />}
                      {copiedInfo === 'account' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Bank Name</label>
                  <div className="p-3 rounded-lg font-semibold text-white" style={{ background: '#1a1a1a' }}>
                    {account.bankName}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg" style={{ background: '#1a1a1a' }}>
                    <p className="text-xs text-gray-400 mb-1">Amount</p>
                    <p className="text-xl font-bold" style={{ color: '#2D8C72' }}>₦{parseFloat(amount).toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: '#1a1a1a' }}>
                    <p className="text-xs text-gray-400 mb-1">Status</p>
                    <p className="text-sm font-semibold text-white">Active</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: '#f59e0b' }}>Instructions</p>
                  <p className="text-xs" style={{ color: '#f59e0b' }}>
                    Transfer ₦{parseFloat(amount).toLocaleString()} to the account above. Funds reflect instantly.
                  </p>
                </div>

                <button
                  onClick={handleComplete}
                  disabled={isCountdownActive}
                  className="w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  style={{ background: isCountdownActive ? '#1a1a1a' : 'linear-gradient(135deg, #2D8C72 0%, #34A085 100%)' }}
                >
                  <CheckCircle size={20} />
                  {isCountdownActive ? `Wait ${countdown}s` : 'Payment Complete'}
                </button>

                <button onClick={handleReset} className="w-full py-3 rounded-lg font-semibold text-white" style={{ background: 'transparent', border: '2px solid #2D8C72' }}>
                  New Account
                </button>
              </div>
            )}
          </>
        )}

        {/* Crypto Tab */}
        {activeTab === 'crypto' && (
          <div className="rounded-xl p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-1">Deposit USDT</h3>
              <p className="text-xs text-gray-400">Send crypto to our wallet address</p>
            </div>

            {/* Success Message */}
            {cryptoSuccess && (
              <div className="p-4 rounded-lg" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} color="#22c55e" />
                  <p className="text-sm text-green-400">{cryptoSuccess}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {cryptoError && (
              <div className="p-4 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} color="#ef4444" />
                  <div>
                    <p className="text-red-400 font-bold mb-1">Error</p>
                    <p className="text-sm text-red-400">{cryptoError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {cryptoLoading && (
              <div className="p-8 flex flex-col items-center">
                <Loader2 size={40} className="animate-spin mb-3" color="#2D8C72" />
                <p className="text-white font-semibold">Processing...</p>
              </div>
            )}

            {/* Deposit Request Created Successfully */}
            {currentDeposit && !cryptoLoading && (
              <>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={20} color="#22c55e" />
                    <span className="font-bold text-white">Deposit Request Created</span>
                  </div>
                  {isCountdownActive && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold" style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b' }}>
                      <Clock size={12} />
                      {countdown}s
                    </div>
                  )}
                </div>

                {/* QR Code for destination wallet */}
                <div className="flex justify-center">
                  <div className="p-4 rounded-xl relative" style={{ background: '#fff' }}>
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentDeposit.dest_wallet_address)}`} 
                      alt="QR" 
                      className="w-40 h-40" 
                    />
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1" style={{ background: '#2D8C72', color: '#fff' }}>
                      <QrCode size={10} />
                      SCAN
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Send USDT to this address</label>
                  <div className="relative">
                    <input 
                      value={currentDeposit.dest_wallet_address} 
                      readOnly 
                      className="w-full p-3 rounded-lg font-mono text-xs pr-20 text-white" 
                      style={{ background: '#1a1a1a', border: '2px solid #22c55e' }} 
                    />
                    <button 
                      onClick={() => copyText(currentDeposit.dest_wallet_address, 'dest')} 
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded text-xs font-semibold text-white flex items-center gap-1" 
                      style={{ background: copiedInfo === 'dest' ? '#22c55e' : '#2D8C72' }}
                    >
                      {copiedInfo === 'dest' ? <Check size={12} /> : <Copy size={12} />}
                      {copiedInfo === 'dest' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg" style={{ background: '#1a1a1a' }}>
                    <p className="text-xs text-gray-400 mb-1">Amount</p>
                    <p className="text-xl font-bold" style={{ color: '#2D8C72' }}>{currentDeposit.amount} USDT</p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: '#1a1a1a' }}>
                    <p className="text-xs text-gray-400 mb-1">Network</p>
                    <p className="text-sm font-semibold text-white">{currentDeposit.chain}</p>
                  </div>
                  </div>

                <div className="p-3 rounded-lg" style={{ background: '#1a1a1a' }}>
                  <p className="text-xs text-gray-400 mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                    <p className="text-sm font-semibold text-amber-400">{currentDeposit.status}</p>
                    </div>
                </div>

                <div className="p-3 rounded-lg" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
                  <div className="flex gap-2">
                    <Info size={14} color="#f59e0b" className="flex-shrink-0 mt-0.5" />
                    <p className="text-xs" style={{ color: '#f59e0b' }}>
                      Send exactly {currentDeposit.amount} USDT from your wallet ({currentDeposit.source_wallet_address?.slice(0, 10)}...) to the address above. Your deposit will be processed after admin verification.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleComplete}
                  disabled={isCountdownActive}
                  className="w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  style={{ background: isCountdownActive ? '#1a1a1a' : 'linear-gradient(135deg, #2D8C72 0%, #34A085 100%)' }}
                >
                  <CheckCircle size={20} />
                  {isCountdownActive ? `Wait ${countdown}s` : 'I\'ve Sent Payment'}
                </button>

                <button 
                  onClick={handleCryptoReset}
                  className="w-full py-3 rounded-lg font-semibold text-white" 
                  style={{ background: 'transparent', border: '2px solid #2D8C72' }}
                >
                  New Deposit Request
                </button>
              </>
            )}

            {/* Deposit Form */}
            {!currentDeposit && !cryptoLoading && (
              <form onSubmit={handleCryptoDeposit} className="space-y-4">
                {/* Wallet Selection */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                    <Wallet size={14} />
                    Select Network & Wallet
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowWalletDropdown(!showWalletDropdown)}
                      className="w-full p-3 rounded-lg text-left flex items-center justify-between"
                      style={{ 
                        background: '#1a1a1a',
                        border: `2px solid ${selectedWallet ? 'rgba(45,140,114,0.5)' : 'rgba(255,255,255,0.1)'}`,
                      }}
                    >
                      {selectedWallet ? (
                        <div>
                          <p className="text-sm font-semibold text-white">{getChainLabel(selectedWallet.chain)}</p>
                          <p className="text-xs text-gray-400 font-mono truncate">{selectedWallet.address}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400">Select a wallet...</p>
                      )}
                      <ChevronDown size={20} className={`text-gray-400 transition-transform ${showWalletDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showWalletDropdown && (
                      <div 
                        className="absolute z-10 w-full mt-2 rounded-lg overflow-hidden"
                        style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        {getActiveAddresses().length === 0 ? (
                          <div className="p-4 text-center text-gray-400 text-sm">
                            No wallets available
                          </div>
                        ) : (
                          getActiveAddresses().map((wallet) => (
                            <button
                              key={wallet.id}
                              type="button"
                              onClick={() => {
                                setSelectedWallet(wallet);
                                setShowWalletDropdown(false);
                              }}
                              className="w-full p-3 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                            >
                              <p className="text-sm font-semibold text-white">{getChainLabel(wallet.chain)}</p>
                              <p className="text-xs text-gray-400 font-mono truncate">{wallet.address}</p>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                    <CreditCard size={14} />
                    Amount (USDT)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={cryptoAmount}
                      onChange={(e) => setCryptoAmount(e.target.value)}
                      placeholder="0.00"
                      min="1"
                      step="0.01"
                      className="w-full p-3 rounded-lg text-xl font-bold pr-16 text-white"
                      style={{ 
                        background: '#1a1a1a',
                        border: `2px solid ${cryptoAmount ? 'rgba(45,140,114,0.5)' : 'rgba(255,255,255,0.1)'}`,
                        outline: 'none'
                      }}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-bold" style={{ color: '#2D8C72' }}>
                      USDT
                    </span>
                  </div>
                </div>

                {/* Source Wallet Address */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                    <ArrowDownToLine size={14} />
                    Your Wallet Address
                  </label>
                  <input
                    type="text"
                    value={sourceWalletAddress}
                    onChange={(e) => setSourceWalletAddress(e.target.value)}
                    placeholder="Enter your wallet address (e.g., TYyy1234...)"
                    className="w-full p-3 rounded-lg text-sm font-mono text-white"
                    style={{ 
                      background: '#1a1a1a',
                      border: `2px solid ${sourceWalletAddress ? 'rgba(45,140,114,0.5)' : 'rgba(255,255,255,0.1)'}`,
                      outline: 'none'
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">The wallet address you'll be sending USDT from</p>
                </div>

                {/* Info Box */}
                <div className="p-3 rounded-lg" style={{ background: 'rgba(45,140,114,0.1)' }}>
                  <div className="flex items-start gap-3">
                    <Info size={16} color="#2D8C72" className="flex-shrink-0 mt-0.5" />
                    <p className="text-xs" style={{ color: '#2D8C72' }}>
                      After submitting, you'll receive a wallet address to send your USDT. 
                      Your deposit will be credited after admin verification.
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={!cryptoAmount || parseFloat(cryptoAmount) <= 0 || !selectedWallet || !sourceWalletAddress.trim() || cryptoLoading}
                  className="w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #2D8C72 0%, #34A085 100%)' }}
                >
                  {cryptoLoading ? <Loader2 size={20} className="animate-spin" /> : <Shield size={20} />}
                  {cryptoLoading ? 'Processing...' : 'Create Deposit Request'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default DepositPage;