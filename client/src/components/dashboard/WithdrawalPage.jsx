import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpFromLine, Wallet, AlertCircle, CheckCircle, Loader2, Copy, Shield, CreditCard, Clock, Check, Info, Banknote } from 'lucide-react';
import Navbar from '../profile/NavBar';
import BottomNav from '../homepage/BottomNav';
import { useCreateWithdrawal } from "../../../Hooks/Dashbored/useCreateWithdrawal";

const WithdrawalPage = ({ profile }) => {
  const [activeTab, setActiveTab] = useState('bank');
  const [amount, setAmount] = useState('');
  // const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [success, setSuccess] = useState(false);
  const [copiedInfo, setCopiedInfo] = useState(null);
  const [withdrawalData, setWithdrawalData] = useState(null);
  const { createWithdrawal, loading, errorFromServer, success } = useCreateWithdrawal();
  // Bank details state
  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
    bankCode: ''
  });

  // USDT details state
  const [usdtDetails, setUsdtDetails] = useState({
    walletAddress: '',
    network: 'TRC20'
  });

  // Available banks in Nigeria (sample)
  const banks = [
    { code: '057', name: 'Zenith Bank' },
    { code: '058', name: 'GTBank' },
    { code: '039', name: 'First Bank' },
    { code: '032', name: 'Union Bank' },
    { code: '033', name: 'UBA' },
    { code: '035', name: 'Wema Bank' },
    { code: '050', name: 'Ecobank' },
    { code: '070', name: 'Fidelity Bank' },
    { code: '011', name: 'First City Monument Bank' },
    { code: '214', name: 'Access Bank' },
    { code: '215', name: 'Unity Bank' },
    { code: '221', name: 'Stanbic IBTC' },
    { code: '232', name: 'Sterling Bank' }
  ];

  const navigate = useNavigate();

  // Quick withdrawal amounts
  const quickAmounts = [5000, 10000, 20000, 50000, 100000];

  // Check if user has sufficient balance
  const hasSufficientBalance = () => {
    const balance = activeTab === 'bank' ? profile?.balance : profile?.usdt_balance;
    return parseFloat(amount) <= parseFloat(balance || 0);
  };

  // Validate bank details
  const validateBankDetails = () => {
    if (!bankDetails.accountName.trim()) {
      setError('Account name is required');
      return false;
    }
    if (!bankDetails.accountNumber || bankDetails.accountNumber.length < 10) {
      setError('Valid account number is required (10 digits)');
      return false;
    }
    if (!bankDetails.bankName) {
      setError('Please select a bank');
      return false;
    }
    if (!amount || parseFloat(amount) < 1000) {
      setError('Minimum withdrawal amount is ₦1,000');
      return false;
    }
    if (!hasSufficientBalance()) {
      setError('Insufficient balance for this withdrawal');
      return false;
    }
    return true;
  };

  // Validate USDT details
  const validateUsdtDetails = () => {
    if (!usdtDetails.walletAddress.trim()) {
      setError('USDT wallet address is required');
      return false;
    }
    if (usdtDetails.walletAddress.length < 25) {
      setError('Please enter a valid USDT wallet address');
      return false;
    }
    if (!amount || parseFloat(amount) < 10) {
      setError('Minimum USDT withdrawal is 10 USDT');
      return false;
    }
    if (!hasSufficientBalance()) {
      setError('Insufficient USDT balance for this withdrawal');
      return false;
    }
    return true;
  };

  const handleBankDetailsChange = (field, value) => {
    setBankDetails(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const handleUsdtDetailsChange = (field, value) => {
    setUsdtDetails(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

 const handleWithdrawal = async (e) => {
  e.preventDefault();
  setError(null);

  const isValid = activeTab === 'bank'
    ? validateBankDetails()
    : validateUsdtDetails();

   if (!isValid) return;
   
   const withdrawalRecord = {
     id: Date.now(),
     type: activeTab,
     amount: parseFloat(amount),
     details: activeTab === 'bank' ? bankDetails : usdtDetails, status: 'pending',
     date: new Date().toISOString(), fee: activeTab === 'bank' ? 50 : 1,
     // NGN fee for bank, USDT fee for crypto 
     netAmount: activeTab === 'bank' ? parseFloat(amount) - 50 : parseFloat(amount) - 1
   };
   
    setWithdrawalData(withdrawalRecord);
   const payload = {
    amount: parseFloat(amount),
    account_name: bankDetails.accountName,
    account_number: bankDetails.accountNumber,
    bank_name: bankDetails.bankName
   };

  try {
    const res = await createWithdrawal(payload); // ✅ real API call

    // if (!res) return; // Error already handled in hook

    // ✅ backend succeeded → reset form
    setAmount("");

    if (activeTab === "bank") {
      setBankDetails({
        accountName: '',
        accountNumber: '',
        bankName: '',
        bankCode: ''
      });
    } else {
      setUsdtDetails({
        walletAddress: '',
        network: 'TRC20'
      });
    }

    console.log("✅ Withdrawal success:", res);

  } catch (err) {
    console.log("❌ Withdrawal error:", err);
    setError("Withdrawal failed.");
  }
  };
  

  const copyText = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedInfo(type);
    setTimeout(() => setCopiedInfo(null), 2000);
  };

  const getAvailableBalance = () => {
    return activeTab === 'bank' ? profile?.balance : profile?.usdt_balance;
  };

  const formatAmount = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) return '0.00';
    return amount.toLocaleString();
  };

  return (
    <div className="min-h-screen mt-13" style={{ background: '#0f0f0f' }}>
      <Navbar name="Withdraw" />
      
      <div className="max-w-2xl mx-auto p-4 pb-24">
        {/* Header */}
        <div className="relative overflow-hidden p-6 rounded-2xl mb-4" style={{ 
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2D8C72 100%)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <ArrowUpFromLine size={24} color="#fff" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Withdraw Funds</h1>
              <p className="text-xs text-white/80">Fast & Secure Withdrawals</p>
            </div>
          </div>
        </div>

        {/* Available Balance */}
        <div className="rounded-xl p-4 mb-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400">Available Balance</p>
              <p className="text-2xl font-bold text-white">
                {activeTab === 'bank' ? '₦' : '$'}{formatAmount(getAvailableBalance())}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Network</p>
              <p className="text-sm font-semibold text-white">
                {activeTab === 'bank' ? 'Bank Transfer' : 'TRC20'}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 gap-2 p-2 rounded-xl mb-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {[
            { id: 'bank', label: 'Bank Transfer', icon: Banknote },
            { id: 'usdt', label: 'USDT', icon: Wallet }
          ].map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative p-3 rounded-lg transition-all"
                style={{
                  background: activeTab === tab.id ? '#2D8C72' : '#1a1a1a',
                  border: activeTab === tab.id ? '2px solid #34A085' : '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <div className="flex items-center gap-2 justify-center">
                  <IconComponent size={16} color="#fff" />
                  <div className="font-semibold text-sm text-white">{tab.label}</div>
                </div>
                {activeTab === tab.id && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                    <Check size={10} color="#fff" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Withdrawal Form */}
        <form onSubmit={handleWithdrawal} className="space-y-4">
          {/* Amount Input */}
          <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
              <CreditCard size={14} />
              Amount
            </label>
            <div className="relative mb-4">
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError(null);
                }}
                placeholder="0.00"
                min={activeTab === 'bank' ? "1000" : "10"}
                step="0.01"
                className="w-full p-3 rounded-lg text-xl font-bold pr-16 text-white"
                style={{ 
                  background: '#1a1a1a',
                  border: `2px solid ${amount ? 'rgba(45,140,114,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  outline: 'none'
                }}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-bold" style={{ color: '#2D8C72' }}>
                {activeTab === 'bank' ? 'NGN' : 'USDT'}
              </span>
            </div>

            {/* Quick Amounts */}
            <div className="grid grid-cols-5 gap-2">
              {quickAmounts.map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt.toString())}
                  className="p-2 rounded-lg text-xs font-semibold transition-all"
                  style={{ 
                    background: amount === amt.toString() ? '#2D8C72' : '#1a1a1a',
                    border: `1px solid ${amount === amt.toString() ? '#34A085' : 'rgba(255,255,255,0.1)'}`,
                    color: '#fff'
                  }}
                >
                  {activeTab === 'bank' ? `₦${(amt/1000).toFixed(0)}k` : `${amt}`}
                </button>
              ))}
            </div>
          </div>

          {/* Bank Details Form */}
          {activeTab === 'bank' && (
            <div className="rounded-xl p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 className="text-lg font-semibold text-white mb-4">Bank Details</h3>
              
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Account Name</label>
                <input
                  type="text"
                  value={bankDetails.accountName}
                  onChange={(e) => handleBankDetailsChange('accountName', e.target.value)}
                  placeholder="Enter account name"
                  className="w-full p-3 rounded-lg text-white"
                  style={{ 
                    background: '#1a1a1a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Account Number</label>
                <input
                  type="text"
                  value={bankDetails.accountNumber}
                  onChange={(e) => handleBankDetailsChange('accountNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter account number"
                  className="w-full p-3 rounded-lg text-white"
                  style={{ 
                    background: '#1a1a1a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Bank Name</label>
                <select
                  value={bankDetails.bankName}
                  onChange={(e) => {
                    const selectedBank = banks.find(bank => bank.name === e.target.value);
                    handleBankDetailsChange('bankName', e.target.value);
                    handleBankDetailsChange('bankCode', selectedBank?.code || '');
                  }}
                  className="w-full p-3 rounded-lg text-white"
                  style={{ 
                    background: '#1a1a1a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    outline: 'none'
                  }}
                >
                  <option value="">Select Bank</option>
                  {banks.map(bank => (
                    <option key={bank.code} value={bank.name}>{bank.name}</option>
                  ))}
                </select>
              </div>

              {/* Fee Information */}
              <div className="p-3 rounded-lg" style={{ background: 'rgba(245,158,11,0.1)' }}>
                <div className="flex items-start gap-2">
                  <Info size={14} color="#f59e0b" className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: '#f59e0b' }}>Withdrawal Information</p>
                    <ul className="text-xs space-y-1" style={{ color: '#f59e0b' }}>
                      <li>• Minimum withdrawal: ₦1,000</li>
                      <li>• Processing fee: ₦50 per transaction</li>
                      <li>• Processing time: 1-24 hours</li>
                      <li>• Ensure account name matches your registered name</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* USDT Details Form */}
          {activeTab === 'usdt' && (
            <div className="rounded-xl p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 className="text-lg font-semibold text-white mb-4">USDT Withdrawal</h3>
              
              <div>
                <label className="text-sm text-gray-400 mb-2 block">USDT Wallet Address (TRC20)</label>
                <input
                  type="text"
                  value={usdtDetails.walletAddress}
                  onChange={(e) => handleUsdtDetailsChange('walletAddress', e.target.value)}
                  placeholder="Enter your USDT TRC20 wallet address"
                  className="w-full p-3 rounded-lg text-white font-mono text-sm"
                  style={{ 
                    background: '#1a1a1a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Network</label>
                <div className="p-3 rounded-lg font-semibold text-white" style={{ background: '#1a1a1a' }}>
                  TRC20 (Recommended)
                </div>
              </div>

              {/* Fee Information */}
              <div className="p-3 rounded-lg" style={{ background: 'rgba(245,158,11,0.1)' }}>
                <div className="flex items-start gap-2">
                  <Info size={14} color="#f59e0b" className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: '#f59e0b' }}>Withdrawal Information</p>
                    <ul className="text-xs space-y-1" style={{ color: '#f59e0b' }}>
                      <li>• Minimum withdrawal: 10 USDT</li>
                      <li>• Network fee: 1 USDT per transaction</li>
                      <li>• Processing time: 5-30 minutes</li>
                      <li>• Only TRC20 network supported</li>
                      <li>• Double-check wallet address before submitting</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-lg flex items-start gap-3" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <AlertCircle size={20} color="#ef4444" />
              <p className="text-sm text-red-400 flex-1">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && withdrawalData && (
            <div className="rounded-xl p-5 space-y-4" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <div className="flex items-center gap-3">
                <CheckCircle size={24} color="#22c55e" />
                <div>
                  <p className="font-semibold text-white">Withdrawal Request Submitted!</p>
                  <p className="text-sm text-green-400">Your withdrawal is being processed</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg" style={{ background: 'rgba(34,197,94,0.1)' }}>
                  <p className="text-xs text-green-400 mb-1">Amount</p>
                  <p className="text-sm font-semibold text-white">
                    {activeTab === 'bank' ? '₦' : ''}{formatAmount(withdrawalData.amount)}{activeTab === 'usdt' ? ' USDT' : ''}
                  </p>
                </div>
                <div className="p-3 rounded-lg" style={{ background: 'rgba(34,197,94,0.1)' }}>
                  <p className="text-xs text-green-400 mb-1">Fee</p>
                  <p className="text-sm font-semibold text-white">
                    {activeTab === 'bank' ? '₦' : ''}{withdrawalData.fee}{activeTab === 'usdt' ? ' USDT' : ''}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg" style={{ background: 'rgba(34,197,94,0.1)' }}>
                <p className="text-xs text-green-400 mb-1">You will receive</p>
                <p className="text-lg font-bold text-white">
                  {activeTab === 'bank' ? '₦' : ''}{formatAmount(withdrawalData.netAmount)}{activeTab === 'usdt' ? ' USDT' : ''}
                </p>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'rgba(34,197,94,0.2)' }}>
                <Clock size={16} color="#22c55e" />
                <p className="text-xs text-green-400">
                  Estimated processing: {activeTab === 'bank' ? '1-24 hours' : '5-30 minutes'}
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-4 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #2D8C72 0%, #34A085 100%)' }}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Shield size={20} />
                {success ? 'Withdrawal Submitted' : 'Confirm Withdrawal'}
              </>
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-6 p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="flex items-start gap-3">
            <Shield size={16} color="#2D8C72" className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold mb-1 text-white">Security Notice</p>
              <p className="text-xs text-gray-400">
                Always double-check your withdrawal details. {activeTab === 'usdt' && 'USDT transactions are irreversible.'} 
                Contact support immediately if you notice any suspicious activity.
              </p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default WithdrawalPage;