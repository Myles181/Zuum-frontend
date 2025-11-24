import { Download, Send, Upload, Wallet } from 'lucide-react';

export const Card = ({ children, className = "" }) => (
  <div className={`rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ balance }) => (
  <div className="bg-gradient-to-r from-[#2D8C72] to-[#1E6B5E] p-5 text-white">
    <div className="flex justify-between items-center">
      <div>
        <div className="flex items-center gap-2">
          <Wallet size={18} strokeWidth={1.5} className="text-green-100" />
          <p className="text-green-100 font-medium text-sm tracking-wide">Available Balance</p>
        </div>
        <div className="flex items-baseline mt-1">
          <span className="text-3xl font-semibold">₦{balance.toLocaleString('en-NG')}</span>
          <span className="text-green-100 ml-2 text-xs">NGN</span>
        </div>
      </div>
      <div className="p-3 rounded-full bg-white text-[#2D8C72] bg-opacity-20 backdrop-blur-sm">
        <Wallet size={20} strokeWidth={1.5} />
      </div>
    </div>
  </div>
);

const ActionButton = ({ label, icon: Icon, variant = "light", onClick }) => {
  const base = "flex flex-col items-center justify-center py-3 px-2 rounded-xl transition focus:outline-none focus:ring-2";
  const variants = {
    light: "bg-green-50 text-[#2D8C72] hover:bg-green-100 focus:ring-green-200",
    solid: "bg-[#2D8C72] text-white hover:bg-[#1E6B5E] focus:ring-green-300",
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

export const WalletCard = ({ balance, onFund, onSend, onWithdraw }) => (
  <Card>
    <CardHeader balance={balance} />
    <div className="grid grid-cols-3 gap-3 p-4">
      <ActionButton 
        label="Deposit" 
        icon={Download} 
        variant="light" 
        onClick={onFund} 
      />
      <ActionButton 
        label="Send" 
        icon={Send} 
        variant="solid" 
        onClick={onSend} 
      />
      <ActionButton 
        label="Withdraw" 
        icon={Upload} 
        variant="light" 
        onClick={onWithdraw} 
      />
    </div>
  </Card>
);