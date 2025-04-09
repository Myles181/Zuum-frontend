import { useState } from 'react';
import { Music, BanknoteIcon, ArrowRightLeft, ArrowDownLeft } from 'lucide-react';
import { Card } from './WalletCard';


export const TransactionHistory = ({ transactions }) => {
  const [filter, setFilter] = useState("all");
  
  const filteredTransactions = filter === "all" 
    ? transactions 
    : transactions.filter(tx => tx.type === filter);
  
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-800">Transaction History</h1>
      
      <div className="flex overflow-x-auto py-2 space-x-2 hide-scrollbar">
        {['all', 'purchase', 'deposit', 'transfer', 'withdrawal'].map((id) => (
          <FilterButton 
            key={id}
            id={id}
            filter={filter}
            setFilter={setFilter}
          />
        ))}
      </div>
      
      <Card>
        <div className="divide-y divide-gray-100">
          {filteredTransactions.map(tx => (
            <TransactionItem key={tx.id} transaction={tx} />
          ))}
        </div>
      </Card>
    </div>
  );
};

const FilterButton = ({ id, filter, setFilter }) => {
  const labels = {
    all: "All",
    purchase: "Purchases",
    deposit: "Deposits",
    transfer: "Transfers",
    withdrawal: "Withdrawals"
  };
  
  return (
    <button 
      onClick={() => setFilter(id)}
      className={`px-4 py-2 rounded-full whitespace-nowrap ${
        filter === id ? "bg-[#2D8C72] text-white" : "bg-white text-gray-700 border border-gray-200"
      }`}
    >
      {labels[id]}
    </button>
  );
};

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
          <p className="text-xs text-gray-500">{tx.date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-medium ${tx.type === 'deposit' ? 'text-green-600' : 'text-gray-800'}`}>
          {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
        </p>
        <StatusBadge status={tx.status} />
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => (
  <span className={`text-xs px-2 py-0.5 rounded-full ${
    status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
  }`}>
    {status}
  </span>
);