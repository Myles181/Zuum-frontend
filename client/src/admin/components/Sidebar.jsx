import { useState } from 'react';
import { 
  Users, 
  Package, 
  Megaphone, 
  Mail, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  X,
  Shield,
  FileText,
  TrendingUp,
  LogOut
} from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';

const AdminSidebar = ({ currentPage = 'users', onPageChange, isCollapsed, onToggleCollapse }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const navigate = useNavigate();

  const navigationItems = [
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      description: 'Manage user accounts'
    },
    {
      id: 'distribution',
      label: 'Distribution Requests',
      icon: Mail,
      description: 'Handle distribution requests'
    },
    {
      id: 'beat',
      label: 'Beat Purchases',
      icon: Package,
      description: 'Manage beat purchases & licenses'
    },
    {
      id: 'promotion',
      label: 'Promotions',
      icon: Megaphone,
      description: 'Manage promotional campaigns'
    }
  ];

  const handleNavigation = (pageId) => {
    
    onPageChange(pageId);
    navigate(`/${pageId}`);


    console.log(pageId);
    
    setIsMobileMenuOpen(false);
  };

  const SidebarContent = ({ isMobile = false }) => (
    <div className={`flex flex-col h-full ${isMobile ? 'p-4' : ''}`}>
      {/* Header */}
      <div className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'justify-between'} mb-8`}>
        {(!isCollapsed || isMobile) && (
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-[#2d7a63] rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-600">Management Dashboard</p>
            </div>
          </div>
        )}
        
        {isCollapsed && !isMobile && (
          <div className="flex items-center justify-center w-10 h-10 bg-[#2d7a63] rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
        )}

        {isMobile && (
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center px-3 py-3 rounded-lg text-left transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#2d7a63] text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-[#2d7a63]'
                }`}
              >
                <Icon 
                  className={`w-5 h-5 flex-shrink-0 ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#2d7a63]'
                  }`} 
                />
                {(!isCollapsed || isMobile) && (
                  <div className="ml-3 flex-1 min-w-0">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-white' : 'text-gray-900'
                    }`}>
                      {item.label}
                    </p>
                    <p className={`text-xs ${
                      isActive ? 'text-green-100' : 'text-gray-500'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                )}
                
                {isCollapsed && !isMobile && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Stats Summary */}
      {(!isCollapsed || isMobile) && (
        <div className="mt-auto pt-6 border-t border-gray-200">
          <div className="bg-gradient-to-r from-[#2d7a63] to-[#3d8b73] rounded-lg p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs font-medium">System Status</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Active Users</span>
                <span className="font-medium">1,247</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pending Requests</span>
                <span className="font-medium">23</span>
              </div>
            </div>
          </div>
        </div>
      )}

      

    {/* Logout Button */}
{/* Logout Button */}
<button
  onClick={() => {
    localStorage.clear();
    navigate('/login');
  }}
  className={`mt-4 flex items-center ${
    isCollapsed ? 'justify-center' : 'justify-start'
  } w-full py-2 px-3 text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded-lg transition-all duration-200`}
>
  <LogOut className="w-5 h-5" />
  {!isCollapsed && <span className="ml-2 text-sm font-medium">Logout</span>}
</button>

{/* Collapse Toggle - Desktop Only */}
{!isMobile && (
  <button
    onClick={onToggleCollapse}
    className="mt-4 flex items-center justify-center w-full py-2 text-gray-400 hover:text-[#2d7a63] hover:bg-gray-100 rounded-lg transition-colors duration-200"
  >
    {isCollapsed ? (
      <ChevronRight className="w-5 h-5" />
    ) : (
      <ChevronLeft className="w-5 h-5" />
    )}
  </button>
)}

    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-lg border border-gray-200 text-gray-600 hover:text-[#2d7a63]"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl">
            <SidebarContent isMobile={true} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? 'lg:w-20' : 'lg:w-72'
      }`}>
        <div className="flex-1 flex flex-col min-h-0 py-6 px-4">
          <SidebarContent />
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;