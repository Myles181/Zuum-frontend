import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, User, Mail, ArrowRight, AlertCircle, CheckCircle, Loader2, Shield, Clock, Check, Users, Search, History } from 'lucide-react';
import Navbar from '../profile/NavBar';
import BottomNav from '../homepage/BottomNav';

const P2PTransferPage = ({ profile }) => {
  const [step, setStep] = useState(1); // 1: Enter details, 2: Confirm, 3: Success
  const [recipientEmail, setRecipientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [recipientInfo, setRecipientInfo] = useState(null);
  const [recentContacts, setRecentContacts] = useState([]);
  const [transactionData, setTransactionData] = useState(null);

  const navigate = useNavigate();

  // Mock recent contacts - in real app, this would come from API
  const mockRecentContacts = [
    { id: 1, email: 'john.doe@example.com', name: 'John Doe', avatar: 'JD', lastTransaction: '2 hours ago' },
    { id: 2, email: 'sarah.wilson@example.com', name: 'Sarah Wilson', avatar: 'SW', lastTransaction: '1 day ago' },
    { id: 3, email: 'mike.chen@example.com', name: 'Mike Chen', avatar: 'MC', lastTransaction: '3 days ago' },
    { id: 4, email: 'emma.davis@example.com', name: 'Emma Davis', avatar: 'ED', lastTransaction: '1 week ago' },
  ];

  // Quick amounts
  const quickAmounts = [1000, 5000, 10000, 20000, 50000];

  useEffect(() => {
    // Load recent contacts - in real app, this would be an API call
    setRecentContacts(mockRecentContacts);
  }, []);

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Check if user has sufficient balance
  const hasSufficientBalance = () => {
    return parseFloat(amount) <= parseFloat(profile?.balance || 0);
  };

  // Validate form
  const validateForm = () => {
    if (!recipientEmail.trim()) {
      setError('Please enter recipient email');
      return false;
    }
    if (!isValidEmail(recipientEmail)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!amount || parseFloat(amount) < 100) {
      setError('Minimum transfer amount is ₦100');
      return false;
    }
    if (!hasSufficientBalance()) {
      setError('Insufficient balance for this transfer');
      return false;
    }
    if (recipientEmail === profile?.email) {
      setError('You cannot transfer to yourself');
      return false;
    }
    return true;
  };

  // Search for recipient
  const searchRecipient = async (email) => {
    if (!email || !isValidEmail(email)) return;

    setSearching(true);
    setError(null);

    try {
      // Simulate API call to search for user
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock response - in real app, this would come from your backend
      const mockUsers = {
        'john.doe@example.com': { name: 'John Doe', avatar: 'JD', isVerified: true },
        'sarah.wilson@example.com': { name: 'Sarah Wilson', avatar: 'SW', isVerified: true },
        'mike.chen@example.com': { name: 'Mike Chen', avatar: 'MC', isVerified: false },
        'emma.davis@example.com': { name: 'Emma Davis', avatar: 'ED', isVerified: true },
      };

      const userInfo = mockUsers[email];
      if (userInfo) {
        setRecipientInfo(userInfo);
      } else {
        setRecipientInfo({ name: 'New User', avatar: 'NU', isVerified: false });
        setError('User not found in our system. They will receive an invitation to join.');
      }
    } catch (err) {
      setError('Failed to search for user');
      setRecipientInfo(null);
    } finally {
      setSearching(false);
    }
  };

  // Handle email input with debounced search
  useEffect(() => {
    if (recipientEmail && isValidEmail(recipientEmail)) {
      const timer = setTimeout(() => {
        searchRecipient(recipientEmail);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setRecipientInfo(null);
    }
  }, [recipientEmail]);

  // Handle contact selection
  const handleContactSelect = (contact) => {
    setRecipientEmail(contact.email);
    setRecipientInfo({
      name: contact.name,
      avatar: contact.avatar,
      isVerified: true
    });
  };

  // Handle transfer
  const handleTransfer = async (e) => {
    if (e) e.preventDefault();
    
    if (!validateForm()) return;

    if (step === 1) {
      setStep(2); // Move to confirmation
      return;
    }

    // Step 2: Confirm and process transfer
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));

      const transaction = {
        id: Date.now(),
        recipientEmail,
        recipientName: recipientInfo?.name || 'Unknown User',
        amount: parseFloat(amount),
        note: note || 'No note',
        fee: 0, // P2P transfers are often free
        netAmount: parseFloat(amount),
        status: 'completed',
        date: new Date().toISOString(),
        reference: `P2P${Date.now()}`
      };

      setTransactionData(transaction);
      setSuccess(true);
      setStep(3);

      // Reset form after delay
      setTimeout(() => {
        // In real app, you might want to navigate to transaction history or dashboard
        // For now, we'll reset to step 1
        setStep(1);
        setRecipientEmail('');
        setAmount('');
        setNote('');
        setRecipientInfo(null);
        setSuccess(false);
        setTransactionData(null);
      }, 5000);

    } catch (err) {
      setError('Transfer failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) return '0.00';
    return amount.toLocaleString();
  };

  const goBack = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(1);
      setSuccess(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#0f0f0f' }}>
      <Navbar name="Send Money" />
      
      <div className="max-w-2xl mx-auto p-4 pb-24">
        {/* Header */}
        <div className="relative overflow-hidden p-6 rounded-2xl mb-4" style={{ 
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2D8C72 100%)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <Send size={24} color="#fff" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Send Money</h1>
              <p className="text-xs text-white/80">Instant P2P Transfers</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 px-4">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all ${
                step >= stepNumber 
                  ? 'bg-green-500 text-white scale-110' 
                  : 'bg-gray-700 text-gray-400'
              }`}>
                {step > stepNumber ? <Check size={16} /> : stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`w-12 h-1 mx-2 transition-all ${
                  step > stepNumber ? 'bg-green-500' : 'bg-gray-700'
                }`} />
              )}
            </div>
          ))}
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 -z-10 h-1 bg-gray-700" />
        </div>

        {/* Step 1: Enter Details */}
        {step === 1 && (
          <form onSubmit={handleTransfer} className="space-y-6">
            {/* Available Balance */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-400">Available Balance</p>
                  <p className="text-2xl font-bold text-white">₦{formatAmount(profile?.balance)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Fee</p>
                  <p className="text-sm font-semibold text-green-400">FREE</p>
                </div>
              </div>
            </div>

            {/* Recent Contacts */}
            {recentContacts.length > 0 && (
              <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <History size={16} color="#2D8C72" />
                  <h3 className="font-semibold text-white">Recent Contacts</h3>
                </div>
                <div className="space-y-3">
                  {recentContacts.map(contact => (
                    <button
                      key={contact.id}
                      type="button"
                      onClick={() => handleContactSelect(contact)}
                      className="w-full flex items-center justify-between p-3 rounded-lg transition-all hover:scale-[1.02] active:scale-95"
                      style={{ 
                        background: recipientEmail === contact.email ? 'rgba(45,140,114,0.2)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${recipientEmail === contact.email ? '#2D8C72' : 'rgba(255,255,255,0.1)'}`
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                          style={{ background: 'linear-gradient(135deg, #2D8C72 0%, #34A085 100%)' }}
                        >
                          {contact.avatar}
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-white">{contact.name}</div>
                          <div className="text-xs text-gray-400">{contact.email}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">{contact.lastTransaction}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recipient Email */}
            <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <label className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
                <Mail size={14} />
                Recipient Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => {
                    setRecipientEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder="Enter recipient's email address"
                  className="w-full p-3 rounded-lg text-white pr-24"
                  style={{ 
                    background: '#1a1a1a',
                    border: `2px solid ${recipientEmail ? 'rgba(45,140,114,0.5)' : 'rgba(255,255,255,0.1)'}`,
                    outline: 'none'
                  }}
                />
                {searching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 size={16} className="animate-spin text-gray-400" />
                  </div>
                )}
              </div>

              {/* Recipient Info */}
              {recipientInfo && !searching && (
                <div className="mt-4 p-3 rounded-lg flex items-center gap-3" style={{ background: 'rgba(45,140,114,0.1)' }}>
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                    style={{ background: 'linear-gradient(135deg, #2D8C72 0%, #34A085 100%)' }}
                  >
                    {recipientInfo.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-white">{recipientInfo.name}</div>
                      {recipientInfo.isVerified && (
                        <div className="px-2 py-1 rounded-full text-xs bg-green-500 text-white flex items-center gap-1">
                          <Check size={10} />
                          Verified
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-400">{recipientEmail}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Amount */}
            <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                <User size={14} />
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
                    ₦{(amt/1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>

            {/* Note (Optional) */}
            <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                <Users size={14} />
                Note (Optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note for the recipient..."
                rows="3"
                className="w-full p-3 rounded-lg text-white resize-none"
                style={{ 
                  background: '#1a1a1a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  outline: 'none'
                }}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg flex items-start gap-3" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                <AlertCircle size={20} color="#ef4444" />
                <p className="text-sm text-red-400 flex-1">{error}</p>
              </div>
            )}

            {/* Continue Button */}
            <button
              type="submit"
              disabled={loading || !recipientEmail || !amount || !recipientInfo}
              className="w-full py-4 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #2D8C72 0%, #34A085 100%)' }}
            >
              Continue
              <ArrowRight size={20} />
            </button>
          </form>
        )}

        {/* Step 2: Confirmation */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 className="text-lg font-semibold text-white mb-4">Confirm Transfer</h3>
              
              {/* Recipient */}
              <div className="flex items-center justify-between p-4 rounded-lg mb-3" style={{ background: '#1a1a1a' }}>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                    style={{ background: 'linear-gradient(135deg, #2D8C72 0%, #34A085 100%)' }}
                  >
                    {recipientInfo?.avatar || 'UU'}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{recipientInfo?.name || 'Unknown User'}</div>
                    <div className="text-sm text-gray-400">{recipientEmail}</div>
                  </div>
                </div>
                {recipientInfo?.isVerified && (
                  <div className="px-3 py-1 rounded-full text-xs bg-green-500 text-white flex items-center gap-1">
                    <Check size={12} />
                    Verified
                  </div>
                )}
              </div>

              {/* Amount Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Amount</span>
                  <span className="text-xl font-bold text-white">₦{formatAmount(parseFloat(amount))}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Transfer Fee</span>
                  <span className="text-green-400">FREE</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                  <span className="text-gray-400">Total</span>
                  <span className="text-xl font-bold text-white">₦{formatAmount(parseFloat(amount))}</span>
                </div>
              </div>

              {/* Note */}
              {note && (
                <div className="mt-4 p-3 rounded-lg" style={{ background: 'rgba(45,140,114,0.1)' }}>
                  <div className="text-sm text-gray-400 mb-1">Note:</div>
                  <div className="text-white">{note}</div>
                </div>
              )}
            </div>

            {/* Security Notice */}
            <div className="p-4 rounded-lg" style={{ background: 'rgba(245,158,11,0.1)' }}>
              <div className="flex items-start gap-3">
                <Shield size={16} color="#f59e0b" className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold mb-1" style={{ color: '#f59e0b' }}>Security Check</p>
                  <p className="text-xs" style={{ color: '#f59e0b' }}>
                    Please double-check the recipient's email address. P2P transfers are instant and cannot be reversed.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={goBack}
                disabled={loading}
                className="py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50"
                style={{ 
                  background: 'transparent',
                  border: '2px solid #2D8C72'
                }}
              >
                Back
              </button>
              <button
                onClick={handleTransfer}
                disabled={loading}
                className="py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #2D8C72 0%, #34A085 100%)' }}
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Confirm Send
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && transactionData && (
          <div className="space-y-6">
            <div className="rounded-xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={40} color="#fff" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Transfer Successful!</h3>
              <p className="text-gray-400 mb-6">Your money has been sent successfully</p>

              <div className="space-y-4 max-w-sm mx-auto">
                <div className="flex justify-between items-center p-3 rounded-lg" style={{ background: '#1a1a1a' }}>
                  <span className="text-gray-400">Amount Sent</span>
                  <span className="text-xl font-bold text-white">₦{formatAmount(transactionData.amount)}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg" style={{ background: '#1a1a1a' }}>
                  <span className="text-gray-400">To</span>
                  <span className="text-white">{transactionData.recipientName}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg" style={{ background: '#1a1a1a' }}>
                  <span className="text-gray-400">Reference</span>
                  <span className="text-white text-sm">{transactionData.reference}</span>
                </div>
              </div>

              <div className="mt-6 p-3 rounded-lg flex items-center justify-center gap-2" style={{ background: 'rgba(34,197,94,0.1)' }}>
                <Clock size={16} color="#22c55e" />
                <p className="text-sm text-green-400">Recipient will receive funds instantly</p>
              </div>
            </div>

            <button
              onClick={goBack}
              className="w-full py-4 rounded-lg font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #2D8C72 0%, #34A085 100%)' }}
            >
              Send Another Transfer
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default P2PTransferPage;