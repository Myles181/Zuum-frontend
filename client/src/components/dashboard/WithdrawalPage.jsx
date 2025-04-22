import { ArrowUpFromLine, BanknoteIcon, Loader2, CheckCircle, AlertCircle, ChevronDown, Search, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import banks from './bank.json'; 
import { useWithdrawal } from '../../../Hooks/subscription/useCreateAccount';

export const WithdrawalPage = ({ balance }) => {
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [saveAccount, setSaveAccount] = useState(false);
  
  // Custom dropdown states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBanks, setFilteredBanks] = useState(banks);
  const dropdownRef = useRef(null);
  
  const { 
    initiateWithdrawal, 
    withdrawalData, 
    loading, 
    error, 
    success,
    reset 
  } = useWithdrawal();

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter banks based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = banks.filter(bank => 
        bank.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBanks(filtered);
    } else {
      setFilteredBanks(banks);
    }
  }, [searchQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Find the selected bank's code
    const bank = banks.find(b => b.name === selectedBank);
    
    await initiateWithdrawal({
      amount: parseFloat(amount),
      accountNumber,
      bankCode: bank?.code || '',
      save: saveAccount
    });
  };

  const handleReset = () => {
    reset();
    setAmount('');
    setAccountNumber('');
    setSelectedBank('');
    setSaveAccount(false);
    setSearchQuery('');
  };

  const formatCurrency = (value) => {
    return value ? parseFloat(value).toLocaleString('en-NG') : '0';
  };

  const selectBank = (bankName) => {
    setSelectedBank(bankName);
    setIsDropdownOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 mb-2">
          <ArrowUpFromLine size={22} className="text-emerald-600" />
          Withdraw Funds
        </h2>
        <p className="text-gray-600 text-sm">
          Transfer money from your account to your bank account
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-5">
        {success ? (
          <div className="text-center py-4">
            <div className="flex justify-center mb-4">
              <CheckCircle size={48} className="text-emerald-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Withdrawal Successful!
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 mb-5 text-left">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-gray-500">Reference:</p>
                <p className="font-medium text-gray-700">{withdrawalData?.tx_ref}</p>
                <p className="text-gray-500">Amount:</p>
                <p className="font-medium text-gray-700">₦{formatCurrency(withdrawalData?.amount)}</p>
                <p className="text-gray-500">Bank:</p>
                <p className="font-medium text-gray-700">{withdrawalData?.bank_name}</p>
                <p className="text-gray-500">Account:</p>
                <p className="font-medium text-gray-700">**** {accountNumber.slice(-4)}</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-700 transition w-full"
            >
              Make Another Withdrawal
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-start gap-3">
                <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="bg-emerald-50 p-4 rounded-lg mb-4">
              <p className="text-sm font-medium text-emerald-700 flex items-center justify-between">
                <span>Available Balance</span>
                <span className="text-lg">₦{formatCurrency(balance)}</span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₦)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                placeholder="Enter amount"
                min="100"
                required
              />
              <p className="text-xs text-gray-500 mt-1.5">
                Minimum withdrawal: ₦100
              </p>
            </div>

            {/* Custom Bank Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name
              </label>
              <button
                type="button"
                className="w-full p-3 flex justify-between items-center text-left border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className={selectedBank ? "text-gray-900" : "text-gray-400"}>
                  {selectedBank || "Select your bank"}
                </span>
                <ChevronDown size={20} className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-hidden flex flex-col">
                  <div className="p-2 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <div className="relative">
                      <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search banks..."
                        className="w-full pl-9 p-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  
                  <div className="overflow-y-auto max-h-52">
                    {filteredBanks.length > 0 ? (
                      filteredBanks.map((bank) => (
                        <button
                          key={bank.code}
                          type="button"
                          className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center justify-between ${
                            selectedBank === bank.name ? 'bg-emerald-50 text-emerald-700' : 'text-gray-800'
                          }`}
                          onClick={() => selectBank(bank.name)}
                        >
                          <span className="text-sm">{bank.name}</span>
                          {selectedBank === bank.name && (
                            <Check size={16} className="text-emerald-600" />
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-3 text-gray-500 text-sm">
                        No banks found
                      </div>
                    )}
                  </div>
                </div>
              )}
              {selectedBank === '' && (
                <p className="text-xs text-red-500 mt-1 invisible">
                  Please select a bank
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BanknoteIcon size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  placeholder="Enter account number"
                  pattern="[0-9]{10}"
                  maxLength="10"
                  required
                />
              </div>
            </div>

            <div className="flex items-center bg-gray-50 p-3 rounded-lg">
              <input
                type="checkbox"
                id="saveAccount"
                checked={saveAccount}
                onChange={(e) => setSaveAccount(e.target.checked)}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="saveAccount" className="ml-3 block text-sm text-gray-700">
                Save this account for future withdrawals
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !amount || !selectedBank || !accountNumber}
              className="w-full flex justify-center items-center gap-2 bg-emerald-600 text-white py-3.5 px-4 rounded-lg font-medium hover:bg-emerald-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Processing...
                </>
              ) : (
                `Withdraw ₦${formatCurrency(amount)}`
              )}
            </button>
          </form>
        )}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
        <div className="text-blue-600 mt-0.5">
          <AlertCircle size={18} />
        </div>
        <div>
          <p className="text-sm text-blue-700 font-medium">Processing Info</p>
          <p className="text-xs text-blue-600 mt-1">
            Withdrawals are typically processed within 24 hours. A processing fee of ₦25 applies to all transactions.
          </p>
        </div>
      </div>
    </div>
  );
};