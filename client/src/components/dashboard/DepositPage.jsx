import React, { useEffect, useState } from 'react';
import { ArrowDownToLine, Copy, CheckCircle } from 'lucide-react';
import useDepositAccount from '../../../Hooks/subscription/useCreateAccount';

// Card wrapper for consistent styling
const Card = ({ children, className = '' }) => (
  <div className={`bg-white shadow-sm rounded-lg ${className}`}>{children}</div>
);

export const DepositPage = () => {
  const [copied, setCopied] = useState(false);
  const [copiedField, setCopiedField] = useState('');
  const { getDepositAccount, paymentDetails, loading, error } = useDepositAccount();

  // Fetch bank details once on mount
  useEffect(() => {
    console.debug('[DepositPage] calling getDepositAccount');
    getDepositAccount();
  }, [getDepositAccount]);

  console.log(paymentDetails);
  

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setCopiedField(field);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <ArrowDownToLine size={24} className="text-[#2D8C72]" />
        Deposit Funds
      </h2>

      {loading && (
        <div className="p-4 bg-gray-50 rounded-lg text-center text-[#2D8C72]">
          Loading bank details…
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {paymentDetails ? (
        <Card className="p-6">
          <div className="space-y-4">
            {[
              ['Bank Name', paymentDetails.bankName],
              ['Account No.', paymentDetails.accountNumber],
              ['Reference', paymentDetails.reference],
              ['Amount (₦)', paymentDetails.amount],
              ['Expires', new Date(paymentDetails.account_expiration).toLocaleString()],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between items-center">
                <span className="font-medium text-sm">{label}:</span>
                <span className="flex items-center gap-2">
                  {val}
                  <button
                    type="button"
                    onClick={() => copyToClipboard(val, label)}
                    className="text-[#2D8C72] hover:text-[#1E6B5E]"
                  >
                    {copied && copiedField === label ? (
                      <CheckCircle size={16} />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </span>
              </div>
            ))}
            <p className="text-xs text-gray-500">
              Transfer to this account; your wallet will be credited automatically once confirmed.
            </p>
            {copied && (
              <div className="text-sm text-[#2D8C72] text-center">
                Copied to clipboard!
              </div>
            )}
          </div>
        </Card>
      ) : (
        !loading && !error && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
            No account details available.
          </div>
        )
      )}
    </div>
  );
};

export default DepositPage;
