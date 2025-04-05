import { useState } from 'react';
import { 
  FiCheckCircle, 
  FiCreditCard, 
  FiClock, 
  FiZap, 
  FiCalendar, 
  FiDollarSign,
  FiShield,
  FiHelpCircle,
  FiArrowRight,
  FiRefreshCw
} from 'react-icons/fi';

const SubscriptionDetails = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data
  const subscriptionData = {
    currentPlan: {
      name: "Premium Pro",
      price: "$9.99/month",
      status: "Active",
      nextBilling: "May 15, 2023",
      features: [
        "Unlimited audio rooms",
        "Premium badges",
        "Ad-free experience",
        "Early access to features",
        "Exclusive content"
      ]
    },
    billingHistory: [
      { id: 1, date: "Apr 15, 2023", amount: "$9.99", status: "Paid" },
      { id: 2, date: "Mar 15, 2023", amount: "$9.99", status: "Paid" },
      { id: 3, date: "Feb 15, 2023", amount: "$9.99", status: "Refunded" }
    ],
    paymentMethods: [
      { id: 1, type: "Visa", last4: "4242", expiry: "05/25", primary: true }
    ],
    upcomingFeatures: [
      "HD Audio Quality (Coming June 2023)",
      "Custom Badges (Coming July 2023)",
      "Exclusive Creator Content (Beta Access)"
    ]
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
            <p className="text-gray-600">View and manage your Zuum Premium subscription</p>
          </div>
          <button 
            onClick={handleRefresh}
            className="flex items-center text-[#2D8C72] hover:text-[#24735a]"
          >
            <FiRefreshCw className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('current')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'current'
                  ? 'border-[#2D8C72] text-[#2D8C72]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Current Plan
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'billing'
                  ? 'border-[#2D8C72] text-[#2D8C72]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Billing History
            </button>
            <button
              onClick={() => setActiveTab('payment')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'payment'
                  ? 'border-[#2D8C72] text-[#2D8C72]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Payment Methods
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'upcoming'
                  ? 'border-[#2D8C72] text-[#2D8C72]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Upcoming Features
            </button>
          </nav>
        </div>

        {/* Current Plan Tab */}
        {activeTab === 'current' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-2">
                    <FiZap className="h-5 w-5 text-[#2D8C72] mr-2" />
                    <span className="text-lg font-semibold">{subscriptionData.currentPlan.name}</span>
                    <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      {subscriptionData.currentPlan.status}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{subscriptionData.currentPlan.price}</p>
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Change Plan
                </button>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">PLAN BENEFITS</h3>
                <ul className="space-y-3">
                  {subscriptionData.currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <FiCheckCircle className="h-5 w-5 text-[#2D8C72] mt-0.5 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FiCalendar className="h-5 w-5 text-gray-400 mr-2" />
                      <h4 className="text-sm font-medium text-gray-500">Next Billing Date</h4>
                    </div>
                    <p className="text-lg font-medium">{subscriptionData.currentPlan.nextBilling}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FiShield className="h-5 w-5 text-gray-400 mr-2" />
                      <h4 className="text-sm font-medium text-gray-500">Subscription Protection</h4>
                    </div>
                    <p className="text-lg font-medium">Active</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Need help with your subscription? <a href="#" className="text-[#2D8C72] hover:underline">Contact support</a>
              </p>
              <button className="text-sm font-medium text-red-600 hover:text-red-500">
                Cancel Subscription
              </button>
            </div>
          </div>
        )}

        {/* Billing History Tab */}
        {activeTab === 'billing' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Billing History</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {subscriptionData.billingHistory.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.status === 'Paid' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2D8C72] hover:underline">
                          <a href="#">Download</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Payment Methods Tab */}
        {activeTab === 'payment' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">Payment Methods</h2>
                <button className="px-4 py-2 bg-[#2D8C72] text-white rounded-md text-sm font-medium hover:bg-[#24735a]">
                  Add Payment Method
                </button>
              </div>

              {subscriptionData.paymentMethods.map((method) => (
                <div key={method.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <FiCreditCard className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium">
                          {method.type} ending in {method.last4}
                        </p>
                        <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                      </div>
                    </div>
                    <div>
                      {method.primary && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          Primary
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-200 flex space-x-4">
                    <button className="text-sm text-[#2D8C72] hover:underline">
                      Make Primary
                    </button>
                    <button className="text-sm text-gray-600 hover:underline">
                      Update
                    </button>
                    <button className="text-sm text-red-600 hover:underline">
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-8 bg-blue-50 p-4 rounded-lg flex items-start">
                <FiShield className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                  Your payment information is processed securely. We don't store your card details on our servers.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Features Tab */}
        {activeTab === 'upcoming' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">What's Coming Next</h2>
              
              <div className="space-y-6">
                {subscriptionData.upcomingFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#2D8C72]/10">
                        <FiClock className="h-5 w-5 text-[#2D8C72]" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-base font-medium text-gray-900">{feature}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        Available exclusively for Premium subscribers
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Have feature requests?</h3>
                <p className="text-gray-600 mb-4">
                  We're constantly improving Zuum Premium. Tell us what you'd like to see next!
                </p>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Suggest a Feature <FiArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionDetails;