import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, User, Mail, ArrowRight, AlertCircle, CheckCircle, Loader2, Shield, Clock, Check, Users, History } from 'lucide-react';
import Navbar from '../profile/NavBar';
import BottomNav from '../homepage/BottomNav';
import { useTransferFunds } from '../../../Hooks/Dashbored/useCreateWithdrawal';

const P2PTransferPage = ({ profile }) => {
  const [step, setStep] = useState(1); // 1: Enter details, 2: Confirm, 3: Success
  const [recipientEmail, setRecipientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [searching, setSearching] = useState(false);
  const [recipientInfo, setRecipientInfo] = useState(null);
  const [recentContacts, setRecentContacts] = useState([]);
  const [transactionData, setTransactionData] = useState(null);
  const [formError, setFormError] = useState(null);

  const navigate = useNavigate();
  
  // Use the transfer hook
  const { transferFunds, loading, error: apiError, success: apiSuccess } = useTransferFunds();

  // Combined error handling
  const error = formError || apiError;

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

  // Handle successful transfer
  useEffect(() => {
    if (apiSuccess) {
      const transaction = {
        id: Date.now(),
        recipientEmail,
        recipientName: recipientInfo?.name || 'Unknown User',
        amount: parseFloat(amount),
        note: note || 'No note',
        fee: 0,
        netAmount: parseFloat(amount),
        status: 'completed',
        date: new Date().toISOString(),
        reference: `P2P${Date.now()}`
      };

      setTransactionData(transaction);
      setStep(3);

      // Reset form after 5 seconds
      setTimeout(() => {
        setStep(1);
        setRecipientEmail('');
        setAmount('');
        setNote('');
        setRecipientInfo(null);
        setTransactionData(null);
      }, 5000);
    }
  }, [apiSuccess]);

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
      setFormError('Please enter recipient email');
      return false;
    }
    if (!isValidEmail(recipientEmail)) {
      setFormError('Please enter a valid email address');
      return false;
    }
    if (!amount || parseFloat(amount) < 100) {
      setFormError('Minimum transfer amount is ₦100');
      return false;
    }
    if (!hasSufficientBalance()) {
      setFormError('Insufficient balance for this transfer');
      return false;
    }
    if (recipientEmail === profile?.email) {
      setFormError('You cannot transfer to yourself');
      return false;
    }
    return true;
  };

  // Search for recipient
  const searchRecipient = async (email) => {
    if (!email || !isValidEmail(email)) return;

    setSearching(true);
    setFormError(null);

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
        setFormError('User not found in our system. They will receive an invitation to join.');
      }
    } catch (err) {
      setFormError('Failed to search for user');
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

    // Step 2: Confirm and process transfer via API
    setFormError(null);
    
    const payload = {
      recipient_email: recipientEmail,
      amount: parseFloat(amount)
    };

    await transferFunds(payload);
  };

  const formatAmount = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) return '0.00';
    return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const goBack = () => {
    if (step === 2) {
      setStep(1);
      setFormError(null);
    } else if (step === 3) {
      setStep(1);
      setTransactionData(null);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <Navbar name="Send Money" />
      
      <div className="max-w-2xl mx-auto p-4 pb-24">
        {/* Header */}
        <div className="relative overflow-hidden p-6 rounded-2xl mb-6" style={{ 
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2D8C72 100%)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <Send size={24} color="#fff" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Send Money</h1>
              <p className="text-sm text-white/80">Instant P2P Transfers • Fee-Free</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="relative flex items-center justify-between mb-8 px-4">
          {[1, 2, 3].map((stepNumber, index) => (
            <React.Fragment key={stepNumber}>
              <div className="relative z-10 flex items-center justify-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold transition-all duration-300 ${
                  step >= stepNumber 
                    ? 'bg-green-500 text-white scale-110 shadow-lg' 
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {step > stepNumber ? <Check size={18} /> : stepNumber}
                </div>
              </div>
              {stepNumber < 3 && (
                <div className={`flex-1 h-1 mx-3 transition-all duration-300 ${
                  step > stepNumber ? 'bg-green-500' : 'bg-gray-700'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Enter Details */}
        {step === 1 && (
          <form onSubmit={handleTransfer} className="space-y-5">
            {/* Available Balance */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Available Balance</p>
                  <p className="text-3xl font-bold text-white">₦{formatAmount(profile?.balance || 0)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400 mb-1">Transfer Fee</p>
                  <p className="text-lg font-bold text-green-400">FREE</p>
                </div>
              </div>
            </div>

            {/* Recent Contacts */}
            {recentContacts.length > 0 && (
              <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <History size={18} color="#2D8C72" />
                  <h3 className="font-semibold text-white">Recent Contacts</h3>
                </div>
                <div className="space-y-2">
                  {recentContacts.slice(0, 3).map(contact => (
                    <button
                      key={contact.id}
                      type="button"
                      onClick={() => handleContactSelect(contact)}
                      className="w-full flex items-center justify-between p-3 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99]"
                      style={{ 
                        background: recipientEmail === contact.email ? 'rgba(45,140,114,0.15)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${recipientEmail === contact.email ? '#2D8C72' : 'rgba(255,255,255,0.1)'}`
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-semibold"
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
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                <Mail size={16} />
                Recipient Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => {
                    setRecipientEmail(e.target.value);
                    setFormError(null);
                  }}
                  placeholder="Enter recipient's email address"
                  className="w-full p-4 rounded-xl text-white pr-12"
                  style={{ 
                    background: '#1a1a1a',
                    border: `2px solid ${recipientEmail ? 'rgba(45,140,114,0.5)' : 'rgba(255,255,255,0.1)'}`,
                    outline: 'none'
                  }}
                />
                {searching && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Loader2 size={18} className="animate-spin text-gray-400" />
                  </div>
                )}
              </div>

              {/* Recipient Info */}
              {recipientInfo && !searching && (
                <div className="mt-4 p-4 rounded-xl flex items-center gap-3" style={{ background: 'rgba(45,140,114,0.1)', border: '1px solid rgba(45,140,114,0.2)' }}>
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold"
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
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                <User size={16} />
                Amount
              </label>
              <div className="relative mb-4">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setFormError(null);
                  }}
                  placeholder="0.00"
                  min="100"
                  step="0.01"
                  className="w-full p-4 rounded-xl text-2xl font-bold pr-20 text-white"
                  style={{ 
                    background: '#1a1a1a',
                    border: `2px solid ${amount ? 'rgba(45,140,114,0.5)' : 'rgba(255,255,255,0.1)'}`,
                    outline: 'none'
                  }}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-bold" style={{ color: '#2D8C72' }}>
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
                    className="p-2.5 rounded-lg text-xs font-semibold transition-all hover:scale-105 active:scale-95"
                    style={{ 
                      background: amount === amt.toString() ? '#2D8C72' : '#1a1a1a',
                      border: `1px solid ${amount === amt.toString() ? '#34A085' : 'rgba(255,255,255,0.1)'}`,
                      color: '#fff'
                    }}
                  >
                    ₦{(amt/1000)}k
                  </button>
                ))}
              </div>
            </div>

            {/* Note (Optional) */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                <Users size={16} />
                Note (Optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note for the recipient..."
                rows="3"
                maxLength="200"
                className="w-full p-4 rounded-xl text-white resize-none"
                style={{ 
                  background: '#1a1a1a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  outline: 'none'
                }}
              />
              <div className="text-xs text-gray-400 mt-2 text-right">{note.length}/200</div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-xl flex items-start gap-3" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                <AlertCircle size={20} color="#ef4444" className="flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400 flex-1">{error}</p>
              </div>
            )}

            {/* Continue Button */}
            <button
              type="submit"
              disabled={loading || !recipientEmail || !amount || !recipientInfo || searching}
              className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #2D8C72 0%, #34A085 100%)' }}
            >
              Continue
              <ArrowRight size={20} />
            </button>
          </form>
        )}

        {/* Step 2: Confirmation */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 className="text-xl font-bold text-white mb-5">Confirm Transfer</h3>
              
              {/* Recipient */}
              <div className="flex items-center justify-between p-4 rounded-xl mb-4" style={{ background: '#1a1a1a' }}>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-semibold text-lg"
                    style={{ background: 'linear-gradient(135deg, #2D8C72 0%, #34A085 100%)' }}
                  >
                    {recipientInfo?.avatar || 'UU'}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-lg">{recipientInfo?.name || 'Unknown User'}</div>
                    <div className="text-sm text-gray-400">{recipientEmail}</div>
                  </div>
                </div>
                {recipientInfo?.isVerified && (
                  <div className="px-3 py-1.5 rounded-full text-xs bg-green-500 text-white flex items-center gap-1">
                    <Check size={12} />
                    Verified
                  </div>
                )}
              </div>

              {/* Amount Details */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Amount</span>
                  <span className="text-2xl font-bold text-white">₦{formatAmount(parseFloat(amount))}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Transfer Fee</span>
                  <span className="text-green-400 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                  <span className="text-gray-400 font-semibold">Total</span>
                  <span className="text-2xl font-bold text-white">₦{formatAmount(parseFloat(amount))}</span>
                </div>
              </div>

              {/* Note */}
              {note && (
                <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(45,140,114,0.1)', border: '1px solid rgba(45,140,114,0.2)' }}>
                  <div className="text-sm text-gray-400 mb-1">Note:</div>
                  <div className="text-white">{note}</div>
                </div>
              )}
            </div>

            {/* Security Notice */}
            <div className="p-4 rounded-xl" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <div className="flex items-start gap-3">
                <Shield size={18} color="#f59e0b" className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: '#f59e0b' }}>Security Check</p>
                  <p className="text-xs" style={{ color: '#f59e0b' }}>
                    Please verify the recipient's email. P2P transfers are instant and cannot be reversed.
                  </p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-xl flex items-start gap-3" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                <AlertCircle size={20} color="#ef4444" className="flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400 flex-1">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={goBack}
                disabled={loading}
                className="py-4 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
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
                className="py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
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
          <div className="space-y-5">
            <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-5 animate-pulse">
                <CheckCircle size={48} color="#fff" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">Transfer Successful!</h3>
              <p className="text-gray-400 mb-8">Your money has been sent successfully</p>

              <div className="space-y-3 max-w-sm mx-auto">
                <div className="flex justify-between items-center p-4 rounded-xl" style={{ background: '#1a1a1a' }}>
                  <span className="text-gray-400">Amount Sent</span>
                  <span className="text-2xl font-bold text-white">₦{formatAmount(transactionData.amount)}</span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-xl" style={{ background: '#1a1a1a' }}>
                  <span className="text-gray-400">To</span>
                  <span className="text-white font-medium">{transactionData.recipientName}</span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-xl" style={{ background: '#1a1a1a' }}>
                  <span className="text-gray-400">Reference</span>
                  <span className="text-white text-sm font-mono">{transactionData.reference}</span>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl flex items-center justify-center gap-2" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <Clock size={18} color="#22c55e" />
                <p className="text-sm text-green-400 font-medium">Recipient will receive funds instantly</p>
              </div>
            </div>

            <button
              onClick={goBack}
              className="w-full py-4 rounded-xl font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
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