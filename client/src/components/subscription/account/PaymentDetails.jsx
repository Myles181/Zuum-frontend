import { FiCopy, FiCheck, FiArrowRight, FiShield, FiUser, FiChevronLeft } from 'react-icons/fi';

export const PaymentDetails = ({
  activeStep,
  accountDetails,
  copiedField,
  paymentLoading,
  timeLeft,
  copyToClipboard,
  setActiveStep,
  handleBack,
  handleSubscribe
}) => {
  if (activeStep === 1) {
    return (
      <div className="px-6 pb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Bank Transfer Details</h2>
        <div className="space-y-5">
          {[
            { label: "Bank Name", value: accountDetails.bankName },
           
            { label: "Account Number", value: accountDetails.accountNumber, copyable: true, field: 'accountNumber' },
            { label: "Amount", value: accountDetails.amount },
            { label: "Reference", value: accountDetails.reference, copyable: true, field: 'reference' },
          ].map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <span className="text-gray-500 text-sm">{item.label}</span>
              <div className="flex items-center">
                <span className="font-medium text-gray-800 mr-2">{item.value}</span>
                {item.copyable && (
                  <button 
                    onClick={() => copyToClipboard(item.value, item.field)}
                    className="text-[#2D8C72] hover:text-[#24735a] transition-colors p-1 rounded-full hover:bg-[#2D8C72]/10"
                  >
                    {copiedField === item.field ? <FiCheck className="h-4 w-4 text-green-500" /> : <FiCopy className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-start">
            <FiShield className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-sm text-blue-700">
              Your payment is secure. Please include the <strong>exact amount</strong> and the <strong>reference code</strong>.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveStep(2)}
          disabled={paymentLoading || timeLeft === 'Expired'}
          className={`mt-6 w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center ${
            paymentLoading || timeLeft === 'Expired'
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#2D8C72] text-white hover:bg-[#24735a] shadow-md hover:shadow-lg'
          }`}
        >
          {paymentLoading ? 'Loading...' : <>I've Made the Transfer <FiArrowRight className="ml-2" /></>}
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 pb-8">
      <button onClick={handleBack} className="flex items-center text-gray-500 hover:text-gray-700 mb-4 transition-colors">
        <FiChevronLeft className="mr-1" /> Back
      </button>

      <h2 className="text-xl font-semibold text-gray-900 mb-6">Confirm Your Transfer</h2>
      
      <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-[#2D8C72]/10 p-2 rounded-full mr-3">
              <FiUser className="text-[#2D8C72]" />
            </div>
            <div>
              <p className="font-medium">Bank Transfer</p>
              <p className="text-sm text-gray-500">One-time payment</p>
            </div>
          </div>
          <span className="font-bold text-lg">{accountDetails.amount}</span>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="font-medium text-gray-900">{accountDetails.bankName}</p>
      
          <p className="font-mono text-gray-800 mt-1">{accountDetails.accountNumber}</p>
          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm text-gray-500">Reference:</span>
            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{accountDetails.reference}</span>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={handleBack}
          className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSubscribe}
          disabled={paymentLoading || timeLeft === 'Expired'}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            paymentLoading || timeLeft === 'Expired'
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#2D8C72] text-white hover:bg-[#24735a] shadow-md hover:shadow-lg'
          }`}
        >
          Yes, I Paid
        </button>
      </div>
    </div>
  );
};