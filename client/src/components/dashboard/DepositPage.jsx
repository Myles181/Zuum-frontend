import { ArrowDownToLine, BanknoteIcon, CreditCard, Copy } from 'lucide-react';
import { Card } from './WalletCard';
import { useState } from 'react';

export const DepositPage = ({ balance, onDeposit }) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank');
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onDeposit(parseFloat(amount));
    setAmount('');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const bankDetails = {
    bankName: "Eko Atlantic Bank",
    accountName: "Music Wallet Inc",
    accountNumber: "1234567890",
    accountType: "Current"
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <ArrowDownToLine size={24} className="text-[#2D8C72]" />
        Deposit Funds
      </h2>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (₦)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D8C72] focus:border-[#2D8C72]"
              placeholder="Enter amount"
              required
              min="100"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum deposit: ₦100</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deposit Method
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                <input
                  type="radio"
                  name="method"
                  value="bank"
                  checked={method === 'bank'}
                  onChange={() => setMethod('bank')}
                  className="text-[#2D8C72] focus:ring-[#2D8C72]"
                />
                <BanknoteIcon size={20} className="text-[#2D8C72]" />
                <span>Bank Transfer</span>
              </label>
              
              {method === 'bank' && (
                <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Bank Name:</span>
                    <span className="flex items-center gap-2">
                      {bankDetails.bankName}
                      <button 
                        type="button"
                        onClick={() => copyToClipboard(bankDetails.bankName)}
                        className="text-[#2D8C72] hover:text-[#1E6B5E]"
                      >
                        <Copy size={16} />
                      </button>
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Account Name:</span>
                    <span className="flex items-center gap-2">
                      {bankDetails.accountName}
                      <button 
                        type="button"
                        onClick={() => copyToClipboard(bankDetails.accountName)}
                        className="text-[#2D8C72] hover:text-[#1E6B5E]"
                      >
                        <Copy size={16} />
                      </button>
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Account Number:</span>
                    <span className="flex items-center gap-2">
                      {bankDetails.accountNumber}
                      <button 
                        type="button"
                        onClick={() => copyToClipboard(bankDetails.accountNumber)}
                        className="text-[#2D8C72] hover:text-[#1E6B5E]"
                      >
                        <Copy size={16} />
                      </button>
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Account Type:</span>
                    <span>{bankDetails.accountType}</span>
                  </div>
                  {copied && (
                    <div className="text-sm text-[#2D8C72] text-center mt-2">
                      Copied to clipboard!
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Transfer to this account and the money will reflect in your wallet within 24 hours
                  </p>
                </div>
              )}
              
              <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                <input
                  type="radio"
                  name="method"
                  value="card"
                  checked={method === 'card'}
                  onChange={() => setMethod('card')}
                  className="text-[#2D8C72] focus:ring-[#2D8C72]"
                />
                <CreditCard size={20} className="text-[#2D8C72]" />
                <span>Card Payment</span>
              </label>

              {method === 'card' && (
                <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D8C72] focus:border-[#2D8C72]"
                      placeholder="1234 5678 9012 3456"
                      pattern="\d{16}"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D8C72] focus:border-[#2D8C72]"
                        placeholder="MM/YY"
                        pattern="\d{2}/\d{2}"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D8C72] focus:border-[#2D8C72]"
                        placeholder="123"
                        pattern="\d{3}"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D8C72] focus:border-[#2D8C72]"
                      placeholder="Name on card"
                      required
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={!amount || parseFloat(amount) < 100}
            className={`w-full bg-[#2D8C72] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#1E6B5E] transition ${
              !amount || parseFloat(amount) < 100 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Deposit ₦{amount ? parseFloat(amount).toLocaleString('en-NG') : '0'}
          </button>
        </form>
      </Card>
    </div>
  );
};