import React, { useEffect, useState } from 'react';
import { ArrowDownToLine, Copy, CheckCircle, AlertCircle, Loader2, Clock } from 'lucide-react';
import useDepositAccount from '../../../Hooks/subscription/useCreateAccount';

export const DepositPage = () => {
  const [copied, setCopied] = useState(false);
  const [copiedField, setCopiedField] = useState('');
  // Initialize countdown state with a complete shape to prevent undefined values
  const [timeRemaining, setTimeRemaining] = useState({
    expired: true,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const { getDepositAccount, paymentDetails, loading, error } = useDepositAccount();

  // Fetch bank details on component mount
  useEffect(() => {
    getDepositAccount();
  }, [getDepositAccount]);

  // Map API response to our local data structure
  const depositData = paymentDetails
    ? {
        accountNumber: paymentDetails.accountNumber,
        bankName: paymentDetails.bankName,
        reference: paymentDetails.reference,
        expiresAt: paymentDetails.expiresAt || paymentDetails.account_expiration,
      }
    : null;

  // Countdown timer effect
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

  // Copy helper
  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setCopiedField(field);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format date helper
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

  // Format countdown display
  const formatCountdown = () => {
    if (timeRemaining.expired) {
      return 'Expired';
    }
    const { hours, minutes, seconds } = timeRemaining;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-md mx-auto my-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-6 rounded-xl mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 mb-2">
          <ArrowDownToLine size={22} className="text-blue-600" />
          Deposit Funds
        </h2>
        <p className="text-gray-600 text-sm">
          Transfer money to your account using the details below
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center justify-center">
          <Loader2 size={36} className="text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading your account details...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-red-700 mb-1">Error</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Deposit Details */}
      {depositData && !loading && !error && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-5">
          {timeRemaining.expired && (
            <div className="mb-4 bg-red-50 p-3 rounded-lg flex items-center gap-3">
              <AlertCircle size={18} className="text-red-500" />
              <p className="text-sm text-red-700 font-medium">
                This account has expired. Please generate a new one.
              </p>
            </div>
          )}

          <div className="grid gap-4 divide-y divide-gray-100">
            {/* Bank Name */}
            <div className="pb-2">
              <p className="text-sm text-gray-500 mb-1">Bank Name</p>
              <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-800">{depositData.bankName}</p>
                <button
                  onClick={() => copyToClipboard(depositData.bankName, 'Bank Name')}
                  className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Copy bank name"
                >
                  {copied && copiedField === 'Bank Name' ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : (
                    <Copy size={16} className="text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Account Number */}
            <div className="py-4">
              <p className="text-sm text-gray-500 mb-1">Account Number</p>
              <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-800 text-lg tracking-wider">
                  {depositData.accountNumber}
                </p>
                <button
                  onClick={() => copyToClipboard(depositData.accountNumber, 'Account Number')}
                  className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Copy account number"
                >
                  {copied && copiedField === 'Account Number' ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : (
                    <Copy size={16} className="text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Reference */}
            <div className="py-4">
              <p className="text-sm text-gray-500 mb-1">
                Reference <span className="text-red-500">*</span>
              </p>
              <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-800">{depositData.reference}</p>
                <button
                  onClick={() => copyToClipboard(depositData.reference, 'Reference')}
                  className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Copy reference"
                >
                  {copied && copiedField === 'Reference' ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : (
                    <Copy size={16} className="text-gray-500" />
                  )}
                </button>
              </div>
              <p className="text-xs text-red-600 mt-1">
                Always include this reference with your transfer
              </p>
            </div>

            <div className="pt-4">
              <p className="text-sm text-gray-500 mb-1">Account Expires In</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock size={16} className={`${timeRemaining.expired ? 'text-red-500' : 'text-gray-400'}`} />
                  <div>
                    <p className={`font-medium ${timeRemaining.expired ? 'text-red-600' : 'text-gray-800'}`}>
                      {timeRemaining.expired ? 'Expired' : formatCountdown()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(depositData.expiresAt)}
                    </p>
                  </div>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  timeRemaining.expired 
                    ? 'bg-red-100 text-red-800' 
                    : timeRemaining.hours < 1 
                      ? 'bg-orange-100 text-orange-800' 
                      : 'bg-blue-100 text-blue-800'
                }`}>
                  {timeRemaining.expired 
                    ? 'Expired' 
                    : timeRemaining.hours < 1 
                      ? 'Expiring Soon' 
                      : 'Temporary Account'}
                </div>
              </div>
            </div>
          </div>

          {copied && (
            <div className="mt-4 bg-green-50 text-green-700 p-3 rounded-lg text-sm flex items-center justify-center gap-2">
              <CheckCircle size={16} />
              <span>{copiedField} copied to clipboard!</span>
            </div>
          )}
          
          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <div className="flex gap-3">
              <div className="text-blue-600 mt-0.5">
                <AlertCircle size={18} />
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">Important</p>
                <p className="text-xs text-blue-600 mt-1">
                  Transfer any amount to this bank account with the reference code provided. 
                  Your wallet will be credited automatically once payment is confirmed.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!depositData && !loading && !error && (
        <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-100 flex items-start gap-3">
          <AlertCircle size={20} className="text-yellow-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-yellow-800 mb-1">No Account Details</p>
            <p className="text-yellow-700 text-sm">No deposit account details are currently available. Please try again later.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepositPage;