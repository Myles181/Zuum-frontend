import { Music, Search, ChevronRight, BarChart3, BanknoteIcon, ArrowRightLeft, ArrowDownLeft } from 'lucide-react';
import { Card } from './WalletCard';
import { WalletCard } from './WalletCard';

export const MobileDashboard = ({ 
  balance, 
  recentTransactions, 
  onFund, 
  onSend, 
  onWithdraw, 
  setActiveTab 
}) => (
  <div className="space-y-5">
   
    
    <WalletCard 
      balance={balance}
      onFund={onFund}
      onSend={onSend}
      onWithdraw={onWithdraw}
    />

    <StatsCards />

    <RecentTransactions 
      transactions={recentTransactions} 
      setActiveTab={setActiveTab} 
    />
  </div>
);

const Header = () => (
  <div className="flex justify-between items-center">
    <div>
      <h1 className="text-xl font-bold text-gray-800">My Wallet</h1>
      <p className="text-sm text-gray-500">Welcome back</p>
    </div>
    <button className="p-2 rounded-full bg-white border border-gray-100 hover:bg-gray-50 transition">
      <Search size={18} strokeWidth={1.5} className="text-gray-600" />
    </button>
  </div>
);

const StatsCards = () => (
  <div className="grid grid-cols-2 gap-3">
    <StatCard 
      label="Purchases" 
      value="$349.97" 
      icon={<Music size={16} strokeWidth={1.5} />} 
      color="bg-green-50 text-[#2D8C72]" 
    />
    <StatCard 
      label="Activity" 
      value="4" 
      icon={<BarChart3 size={16} strokeWidth={1.5} />} 
      color="bg-purple-50 text-purple-600" 
    />
  </div>
);

const StatCard = ({ label, value, icon, color }) => (
  <Card className="p-4">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-xs font-medium">{label}</p>
        <p className="text-lg font-semibold mt-1">{value}</p>
      </div>
      <div className={`p-2 rounded-lg ${color}`}>
        {icon}
      </div>
    </div>
  </Card>
);

const RecentTransactions = ({ transactions, setActiveTab }) => (
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
      {transactions.slice(0, 3).map(tx => (
        <TransactionItem key={tx.id} transaction={tx} />
      ))}
    </div>
  </Card>
);

const TransactionItem = ({ transaction: tx }) => {
  const icons = {
    purchase: <Music size={16} strokeWidth={1.5} />,
    deposit: <BanknoteIcon size={16} strokeWidth={1.5} />,
    transfer: <ArrowRightLeft size={16} strokeWidth={1.5} />,
    withdrawal: <ArrowDownLeft size={16} strokeWidth={1.5} />
  };
  
  const bgColors = {
    purchase: 'bg-green-50 text-[#2D8C72]',
    deposit: 'bg-green-50 text-green-600',
    transfer: 'bg-purple-50 text-purple-600',
    withdrawal: 'bg-orange-50 text-orange-600'
  };
  
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${bgColors[tx.type]}`}>
          {icons[tx.type]}
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
  );
};