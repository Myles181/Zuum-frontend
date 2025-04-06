import { useState, useEffect } from 'react';

import useBankTransferPayment, { useFlutterwaveWebhook } from '../../../Hooks/subscription/useCreateAccount';
import { SubscriptionHeader } from './account/SubscriptionHeader';
import { SubscriptionProgress } from './account/SubscriptionProgress';
import { SubscriptionStatus } from './account/SubcriptionStatus';
import { PaymentDetails } from './account/PaymentDetails';

const EXPIRATION_MINUTES = 30;

const SubscriptionPage = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [expiryTime, setExpiryTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  
  // Payment details hook
  const {
    loading: paymentLoading,
    error: paymentError,
    paymentDetails,
    createBankTransferPayment,
  } = useBankTransferPayment();

  // Webhook handling hook
  const {
    loading: webhookLoading,
    error: webhookError,
    handleWebhook,
  } = useFlutterwaveWebhook();

  // Fetch payment details on component mount
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        await createBankTransferPayment();
      } catch (err) {
        console.error("Failed to fetch payment details:", err);
      }
    };
    fetchPaymentDetails();
  }, []);

  // Set expiration time when payment details are received
  useEffect(() => {
    if (paymentDetails?.expiresAt) {
      const expiry = new Date(paymentDetails.expiresAt);
      setExpiryTime(expiry);
    } else if (paymentDetails) {
      // Fallback: set expiration 30 minutes from now
      const now = new Date();
      const expiry = new Date(now.getTime() + EXPIRATION_MINUTES * 60000);
      setExpiryTime(expiry);
    }
  }, [paymentDetails]);

  // Update countdown timer every second
  useEffect(() => {
    if (!expiryTime) return;

    const timer = setInterval(() => {
      const now = new Date();
      const diff = expiryTime - now;

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft('Expired');
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryTime]);

  // Fallback account details
  const fallbackAccountDetails = {
    bankName: "--- -----",
   
    accountNumber: "----------",
    amount: "--,---",
    reference: "-----------"
  };

  // Extract payment details from the API response or use fallback
  const accountDetails = paymentDetails?.paymentDetails ? {
    bankName: paymentDetails.paymentDetails.bankName || fallbackAccountDetails.bankName,
   
    accountNumber: paymentDetails.paymentDetails.accountNumber || fallbackAccountDetails.accountNumber,
    amount: paymentDetails.paymentDetails.amount || fallbackAccountDetails.amount,
    reference: paymentDetails.paymentDetails.reference || fallbackAccountDetails.reference
  } : fallbackAccountDetails;

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubscribe = async () => {
    try {
      // If payment details expired, regenerate them
      if (timeLeft === 'Expired') {
        await createBankTransferPayment();
      }
      
      // Move to verification step
      setActiveStep(3);
      
      // Create webhook payload
      const webhookEvent = {
        event: 'charge.completed',
        data: {
          id: paymentDetails?.id || `mock-${Date.now()}`,
          tx_ref: paymentDetails?.reference || accountDetails.reference,
          amount: parseFloat(accountDetails.amount.replace(/[^0-9.]/g, '')) * 100,
          currency: 'USD',
          status: 'successful',
          payment_type: 'bank_transfer',
          created_at: new Date().toISOString(),
          customer: {
            email: 'user@example.com' // Replace with actual user email
          }
        }
      };

      // Process the webhook
      await handleWebhook(webhookEvent);
      
      // On successful verification
      setTimeout(() => {
        setSubscribed(true);
      }, 1500);
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  const handleBack = () => {
    setActiveStep(1);
  };

  const handleRefreshPayment = async () => {
    try {
      await createBankTransferPayment();
    } catch (err) {
      console.error("Failed to refresh payment:", err);
    }
  };


  return (
    <div className="min-h-screen h-full bg-gray-500 flex justify-center relative ">
      {/* Blurry overlay */}
      <div className="absolute inset-0  bg-opacity-30 backdrop-blur-sm"></div>
      
      {/* Content container with higher z-index */}
      <div className="w-full max-w-md bg-white shadow-lg overflow-hidden relative z-10">
        <SubscriptionHeader 
          title="Zuum Premium" 
          subtitle="Unlock exclusive features"
          timeLeft={activeStep !== 3 ? timeLeft : null}
          showBackButton={activeStep !== 1}
          onRefresh={handleRefreshPayment}
        />

        {paymentError && (
          <div className="px-6 py-4 bg-red-50 text-red-600">
            <p>{paymentError}</p>
            <button onClick={handleRefreshPayment} className="mt-2 text-sm text-[#2D8C72] hover:underline">
              Try Again
            </button>
          </div>
        )}

        <SubscriptionProgress activeStep={activeStep} />

        {activeStep !== 3 ? (
          <PaymentDetails
            activeStep={activeStep}
            accountDetails={accountDetails}
            copiedField={copiedField}
            paymentLoading={paymentLoading}
            timeLeft={timeLeft}
            copyToClipboard={copyToClipboard}
            setActiveStep={setActiveStep}
            handleBack={handleBack}
            handleSubscribe={handleSubscribe}
          />
        ) : (
          <SubscriptionStatus
            subscribed={subscribed}
            webhookLoading={webhookLoading}
            webhookError={webhookError}
            handleSubscribe={handleSubscribe}
          />
        )}

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Need help? <a href="#" className="text-[#2D8C72] hover:underline">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;