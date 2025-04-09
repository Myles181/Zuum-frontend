import { ArrowUpFromLine, BanknoteIcon } from 'lucide-react';
import { Card } from './WalletCard';
import { useState } from 'react';

export const WithdrawalPage = ({ balance, onWithdraw }) => {
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onWithdraw(parseFloat(amount), bankName, accountNumber);
    setAmount('');
    setAccountNumber('');
    setBankName('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <ArrowUpFromLine size={24} className="text-[#2D8C72]" />
        Withdraw Funds
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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bank Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BanknoteIcon size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D8C72] focus:border-[#2D8C72]"
                placeholder="Enter bank name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Number
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D8C72] focus:border-[#2D8C72]"
              placeholder="Enter account number"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#2D8C72] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#1E6B5E] transition"
          >
            Withdraw ₦{amount ? parseFloat(amount).toLocaleString('en-NG') : '0'}
          </button>
        </form>
      </Card>
    </div>
  );
};