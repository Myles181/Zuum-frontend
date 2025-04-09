import { Send, Mail } from 'lucide-react';
import { Card } from './WalletCard';
import { useState } from 'react';

export const TransferPage = ({ balance, onTransfer }) => {
  const [amount, setAmount] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [note, setNote] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setRecipientEmail(email);
    setIsValidEmail(email === '' || validateEmail(email));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(recipientEmail)) {
      setIsValidEmail(false);
      return;
    }
    onTransfer(recipientEmail, parseFloat(amount), note);
    setAmount('');
    setRecipientEmail('');
    setNote('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Send size={24} className="text-[#2D8C72]" />
        Transfer Money
      </h2>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                type="email"
                value={recipientEmail}
                onChange={handleEmailChange}
                className={`w-full pl-10 p-3 border ${isValidEmail ? 'border-gray-300' : 'border-red-500'} rounded-lg focus:ring-2 focus:ring-[#2D8C72] focus:border-[#2D8C72]`}
                placeholder="Enter recipient's email"
                required
              />
              {!isValidEmail && (
                <p className="mt-1 text-sm text-red-600">Please enter a valid email address</p>
              )}
            </div>
          </div>

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
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D8C72] focus:border-[#2D8C72]"
              placeholder="Add a note"
              rows={3}
            />
          </div>

          <button
            type="submit"
            disabled={!isValidEmail || !amount}
            className={`w-full bg-[#2D8C72] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#1E6B5E] transition ${(!isValidEmail || !amount) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Transfer ₦{amount ? parseFloat(amount).toLocaleString('en-NG') : '0'}
          </button>
        </form>
      </Card>
    </div>
  );
};