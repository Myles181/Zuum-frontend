import React, { useState, useEffect } from 'react';
import { 
  Wallet, Music, Search, Send,
  ChevronRight, ArrowRightLeft, 
  BanknoteIcon, BarChart3, ArrowDownLeft, User,
  Download, Upload, Clock
} from 'lucide-react';

const Card = ({ children, className = "" }) => (
  <div className={`rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ balance }) => (
  <div className="bg-gradient-to-r from-[#2D8C72] to-[#1E6B5E] p-5 text-white">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-green-100 font-medium text-sm tracking-wide">Available Balance</p>
        <div className="flex items-baseline mt-1">
          <span className="text-3xl font-semibold">${balance.toFixed(2)}</span>
          <span className="text-green-100 ml-2 text-xs">USD</span>
        </div>
      </div>
      <div
        className="p-3 rounded-full bg-white bg-opacity-20 backdrop-blur-sm"
        aria-hidden="true"
      >
        <Wallet size={20} strokeWidth={1.5} />
      </div>
    </div>
  </div>
);

const ActionButton = ({ label, icon: Icon, variant = "light", onClick }) => {
  const base = "flex flex-col items-center justify-center py-3 px-2 rounded-xl transition focus:outline-none focus:ring-2";
  const variants = {
    light:
      "bg-green-50 text-[#2D8C72] hover:bg-green-100 focus:ring-green-200",
    solid:
      "bg-[#2D8C72] text-white hover:bg-[#1E6B5E] focus:ring-green-300",
    danger:
      "bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-200",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${variants[variant]}`}
      aria-label={label}
    >
      <Icon size={18} strokeWidth={1.5} className="mb-1" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};

const WalletCard = ({ balance, onFund, onSend, onWithdraw }) => (
  <Card>
    <CardHeader balance={balance} />
    <div className="grid grid-cols-3 gap-3 p-4">
      <ActionButton label="Deposit" icon={Download} variant="light" onClick={onFund} />
      <ActionButton label="Send" icon={Send} variant="solid" onClick={onSend} />
      <ActionButton label="Withdraw" icon={Upload} variant="light" onClick={onWithdraw} />
    </div>
  </Card>
);

const MobileDashboard = ({ balance, recentTransactions, onFund, onSend, onWithdraw, setActiveTab }) => (
  <div className="space-y-5">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold text-gray-800">My Wallet</h1>
        <p className="text-sm text-gray-500">Welcome back</p>
      </div>
      <button className="p-2 rounded-full bg-white border border-gray-100 hover:bg-gray-50 transition">
        <Search size={18} strokeWidth={1.5} className="text-gray-600" />
      </button>
    </div>

    <WalletCard 
      balance={balance}
      onFund={onFund}
      onSend={onSend}
      onWithdraw={onWithdraw}
    />

    <div className="grid grid-cols-2 gap-3">
      <Card className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-xs font-medium">Purchases</p>
            <p className="text-lg font-semibold mt-1">$349.97</p>
          </div>
          <div className="p-2 rounded-lg bg-green-50 text-[#2D8C72]">
            <Music size={16} strokeWidth={1.5} />
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-xs font-medium">Activity</p>
            <p className="text-lg font-semibold mt-1">4</p>
          </div>
          <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
            <BarChart3 size={16} strokeWidth={1.5} />
          </div>
        </div>
      </Card>
    </div>

    <Card>
      <div className="flex justify-between items-center px-4 pt-4 pb-2">
        <h3 className="text-base font-semibold text-gray-800">Recent Transactions</h3>
        <button 
          className="text-sm flex items-center text-[#2D8C72] font-medium" 
          onClick={() => setActiveTab('history')}
        >
          View All <ChevronRight size={14} className="ml-1" strokeWidth={2} />
        </button>
      </div>
      <div className="divide-y divide-gray-50">
        {recentTransactions.slice(0, 3).map(tx => (
          <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                tx.type === 'purchase' ? 'bg-green-50 text-[#2D8C72]' :
                tx.type === 'deposit'  ? 'bg-green-50 text-green-600' :
                tx.type === 'transfer' ? 'bg-purple-50 text-purple-600' :
                'bg-orange-50 text-orange-600'
              }`}>
                {tx.type === 'purchase' && <Music size={16} strokeWidth={1.5} />}
                {tx.type === 'deposit'  && <BanknoteIcon size={16} strokeWidth={1.5} />}
                {tx.type === 'transfer' && <ArrowRightLeft size={16} strokeWidth={1.5} />}
                {tx.type === 'withdrawal' && <ArrowDownLeft size={16} strokeWidth={1.5} />}
              </div>
              <div>
                <p className="font-medium text-sm capitalize text-gray-800">{tx.type}</p>
                <p className="text-xs text-gray-500">
                  {tx.type === 'deposit' ? `From: ${tx.from}` : `To: ${tx.to}`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-medium text-sm ${
                tx.type === 'deposit' ? 'text-green-600' : 'text-gray-800'
              }`}>
                {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">{tx.date}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                tx.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
              }`}>
                {tx.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>

    <Card className="p-4">
      <h3 className="text-base font-semibold text-gray-800 mb-3">Quick Actions</h3>
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: <Music size={18} strokeWidth={1.5} />, label: 'Beats', onClick: () => {} },
          { icon: <Send size={18} strokeWidth={1.5} />, label: 'Send', onClick: () => {} },
          { icon: <Clock size={18} strokeWidth={1.5} />, label: 'History', onClick: () => setActiveTab('history') },
          { icon: <User size={18} strokeWidth={1.5} />, label: 'Profile', onClick: () => {} },
        ].map((action, i) => (
          <button
            key={i}
            onClick={action.onClick}
            className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-gray-50 transition"
          >
            <div
              className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-2"
              style={{ color: '#2D8C72' }}
            >
              {action.icon}
            </div>
            <span className="text-xs text-gray-700 font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </Card>
  </div>
);

const TransactionHistory = ({ transactions, isMobile }) => {
  const [filter, setFilter] = useState("all");
  
  const filteredTransactions = filter === "all" 
    ? transactions 
    : transactions.filter(tx => tx.type === filter);
  
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-800">Transaction History</h1>
      
      <div className="flex overflow-x-auto py-2 space-x-2 hide-scrollbar">
        {[
          { id: "all", label: "All" },
          { id: "purchase", label: "Purchases" },
          { id: "deposit", label: "Deposits" },
          { id: "transfer", label: "Transfers" },
          { id: "withdrawal", label: "Withdrawals" }
        ].map((option) => (
          <button 
            key={option.id}
            onClick={() => setFilter(option.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              filter === option.id ? "bg-[#2D8C72] text-white" : "bg-white text-gray-700 border border-gray-200"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      
      <Card>
        <div className="divide-y divide-gray-100">
          {filteredTransactions.map(tx => (
            <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  tx.type === 'purchase' ? 'bg-green-50 text-[#2D8C72]' :
                  tx.type === 'deposit'  ? 'bg-green-50 text-green-600' :
                  tx.type === 'transfer' ? 'bg-purple-50 text-purple-600' :
                  'bg-orange-50 text-orange-600'
                }`}>
                  {tx.type === 'purchase' && <Music size={16} strokeWidth={1.5} />}
                  {tx.type === 'deposit'  && <BanknoteIcon size={16} strokeWidth={1.5} />}
                  {tx.type === 'transfer' && <ArrowRightLeft size={16} strokeWidth={1.5} />}
                  {tx.type === 'withdrawal' && <ArrowDownLeft size={16} strokeWidth={1.5} />}
                </div>
                <div>
                  <p className="font-medium text-sm capitalize text-gray-800">{tx.type}</p>
                  <p className="text-xs text-gray-500">
                    {tx.type === 'deposit' ? `From: ${tx.from}` : `To: ${tx.to}`}
                  </p>
                  <p className="text-xs text-gray-500">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${
                  tx.type === 'deposit' ? 'text-green-600' : 'text-gray-800'
                }`}>
                  {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                </p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  tx.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                }`}>
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const MusicDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [balance, setBalance] = useState(1250.50);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const recentTransactions = [
    { id: 1, type: 'purchase', amount: 49.99, to: 'ProducerX', date: '2023-05-15', status: 'completed' },
    { id: 2, type: 'deposit', amount: 500.00, from: 'Bank Transfer', date: '2023-05-10', status: 'completed' },
    { id: 3, type: 'transfer', amount: 100.00, to: 'ArtistY', date: '2023-05-08', status: 'completed' },
    { id: 4, type: 'withdrawal', amount: 200.00, to: 'Bank Account', date: '2023-05-05', status: 'pending' }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1 overflow-auto">
        <div className="p-4 max-w-md mx-auto">
          {activeTab === 'dashboard' && (
            <MobileDashboard 
              balance={balance}
              recentTransactions={recentTransactions}
              onFund={() => {/* fund logic */}}
              onSend={() => {/* send logic */}}
              onWithdraw={() => {/* withdraw logic */}}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === 'history' && (
            <TransactionHistory 
              transactions={recentTransactions} 
              isMobile={isMobile} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicDashboard;