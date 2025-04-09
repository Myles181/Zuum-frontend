import { useState, useEffect } from 'react';
import { MobileDashboard } from '../components/dashboard/MobileDashboard';
import { DepositPage } from '../components/dashboard/DepositPage';
import { TransferPage } from '../components/dashboard/TransferPage';
import { WithdrawalPage } from '../components/dashboard/WithdrawalPage';
import { TransactionHistory } from '../components/dashboard/TransactionHistory';
import Navbar from '../components/profile/NavBar';
import Sidebar from '../components/homepage/Sidebar';
import Overlay from '../components/homepage/Overlay';
import BottomNav from '../components/homepage/BottomNav';

const MusicDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeWalletPage, setActiveWalletPage] = useState('dashboard');
  const [balance, setBalance] = useState(50000.00);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('Dashboard');
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Update page title based on current view
    if (activeTab === 'history') {
      setPageTitle('Transaction History');
    } else {
      switch (activeWalletPage) {
        case 'deposit':
          setPageTitle('Deposit Funds');
          break;
        case 'transfer':
          setPageTitle('Transfer Money');
          break;
        case 'withdraw':
          setPageTitle('Withdraw Funds');
          break;
        default:
          setPageTitle('Dashboard');
      }
    }
  }, [activeTab, activeWalletPage]);

  const recentTransactions = [
    { id: 1, type: 'purchase', amount: 4990, to: 'ProducerX', date: '2023-05-15', status: 'completed' },
    { id: 2, type: 'deposit', amount: 50000, from: 'Bank Transfer', date: '2023-05-10', status: 'completed' },
    { id: 3, type: 'transfer', amount: 10000, to: 'ArtistY', date: '2023-05-08', status: 'completed' },
    { id: 4, type: 'withdrawal', amount: 20000, to: 'Bank Account', date: '2023-05-05', status: 'pending' }
  ];

  // Wallet action handlers
  const handleDeposit = (amount) => {
    setBalance(prev => prev + amount);
    setActiveWalletPage('dashboard');
    recentTransactions.unshift({
      id: Date.now(),
      type: 'deposit',
      amount,
      from: 'You',
      date: new Date().toISOString().split('T')[0],
      status: 'completed'
    });
  };

  const handleTransfer = (recipient, amount, note) => {
    setBalance(prev => prev - amount);
    setActiveWalletPage('dashboard');
    recentTransactions.unshift({
      id: Date.now(),
      type: 'transfer',
      amount,
      to: recipient,
      note,
      date: new Date().toISOString().split('T')[0],
      status: 'completed'
    });
  };

  const handleWithdraw = (amount, bankName, accountNumber) => {
    setBalance(prev => prev - amount);
    setActiveWalletPage('dashboard');
    recentTransactions.unshift({
      id: Date.now(),
      type: 'withdrawal',
      amount,
      to: `${bankName} (${accountNumber})`,
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 my-13">
     
<Navbar 
  toggleSidebar={toggleSidebar}
  name={pageTitle}
  isDashboardPage={activeWalletPage !== 'dashboard'}
  isMessagePage={false} // Set to true if this is a message page
  goBack={() => setActiveWalletPage('dashboard')}
/>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Overlay isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-4 max-w-md mx-auto">
          {activeTab === 'dashboard' ? (
            activeWalletPage === 'dashboard' ? (
              <MobileDashboard
                balance={balance}
                recentTransactions={recentTransactions}
                onFund={() => setActiveWalletPage('deposit')}
                onSend={() => setActiveWalletPage('transfer')}
                onWithdraw={() => setActiveWalletPage('withdraw')}
                setActiveTab={setActiveTab}
              />
            ) : activeWalletPage === 'deposit' ? (
              <DepositPage
                balance={balance}
                onDeposit={handleDeposit}
                onBack={() => setActiveWalletPage('dashboard')}
              />
            ) : activeWalletPage === 'transfer' ? (
              <TransferPage
                balance={balance}
                onTransfer={handleTransfer}
                onBack={() => setActiveWalletPage('dashboard')}
              />
            ) : (
              <WithdrawalPage
                balance={balance}
                onWithdraw={handleWithdraw}
                onBack={() => setActiveWalletPage('dashboard')}
              />
            )
          ) : (
            <TransactionHistory 
              transactions={recentTransactions} 
            />
          )}
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default MusicDashboard;