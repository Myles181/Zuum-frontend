import { useState } from 'react';
import { 
  Users, 
  Megaphone, 
  Send,
  Music2,
  Wallet,
  ChevronLeft, 
  ChevronRight,
  Menu,
  X,
  Shield,
  BarChart3,
  TrendingUp,
  LogOut
} from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';


const AdminSidebar = ({ currentPage = 'users', onPageChange, isCollapsed, onToggleCollapse }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const navigate = useNavigate();

  const navigationSections = [
    {
      title: 'Core Operations',
      items: [
    {
      id: 'users',
          label: 'User Directory',
      icon: Users,
          description: 'Profiles, roles & access',
          badge: 'Live',
          badgeClass: 'bg-emerald-100 text-emerald-700'
    },
    {
          id: 'distribution',
          label: 'Distribution Desk',
          icon: Send,
          description: 'Release approvals & QC',
          badge: '12 pending',
          badgeClass: 'bg-amber-100 text-amber-700'
        },
        {
          id: 'promotion',
          label: 'Promotion Hub',
          icon: Megaphone,
          description: 'Campaign oversight',
          badge: 'In review',
          badgeClass: 'bg-sky-100 text-sky-700'
        }
      ]
    },
    {
      title: 'Monetization',
      items: [
    {
      id: 'beat',
          label: 'Beat Sales',
          icon: Music2,
          description: 'Orders, licenses & delivery'
    },
    {
      id: 'withdrawalRequest',
          label: 'Payout Requests',
          icon: Wallet,
          description: 'Settlements & compliance'
        }
      ]
    }
  ];

  const handlePageChange = (pageId) => {
    onPageChange(pageId);
    console.log(pageId);
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
        <div className="space-y-6">
          {navigationSections.map((section) => (
            <div key={section.title}>
              {(!isCollapsed || isMobile) && (
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                  {section.title}
                </p>
              )}
        <div className="space-y-2">
                {section.items.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handlePageChange(item.id)}
                      className={`relative w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 group ${
                  isActive
                          ? 'bg-gradient-to-r from-[#1f5f4a] to-[#2d7a63] text-white shadow-lg'
                          : 'bg-white/70 text-gray-700 border border-transparent hover:border-gray-200 hover:bg-white'
                }`}
              >
                      <span
                        className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                          isActive ? 'bg-white/15 text-white' : 'bg-gray-100 text-gray-500 group-hover:text-[#2d7a63]'
                  }`} 
                      >
                        <Icon className="w-5 h-5" />
                      </span>

                {(!isCollapsed || isMobile) && (
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-gray-900'}`}>
                      {item.label}
                    </p>
                    <p className={`text-xs ${
                            isActive ? 'text-emerald-100' : 'text-gray-500'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                )}

                      {item.badge && !isCollapsed && (
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.badgeClass || 'bg-gray-100 text-gray-600'}`}>
                          {item.badge}
                        </span>
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
            </div>
          ))}
        </div>
      </nav>

      {/* Stats Summary */}
      {(!isCollapsed || isMobile) && (
        <div className="mt-auto space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400">Operational Pulse</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">This Week</p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">New creators</span>
                <span className="font-semibold text-gray-900">+124</span>
            </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Payout volume</span>
                <span className="font-semibold text-gray-900">$32.4k</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Distribution SLA</span>
                <span className="font-semibold text-emerald-600">98%</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-emerald-900">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs font-semibold">Status: Stable</span>
            </div>
            <p className="text-sm leading-relaxed">
              All systems are performing within service thresholds. Keep an eye on distribution backlog heading into the weekend.
            </p>
          </div>
        </div>
      )}

      

    {/* Logout Button */}
{/* Logout Button */}
<button
  onClick={() => {
    localStorage.clear();
    navigate('/adlog');
  }}
  className={`mt-6 flex items-center ${
    isCollapsed ? 'justify-center' : 'justify-between'
  } w-full py-3 px-4 text-sm font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-all duration-200`}
>
  {!isCollapsed && <span>Sign out of console</span>}
  <LogOut className="w-5 h-5" />
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
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl overflow-y-auto">
            <SidebarContent isMobile={true} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? 'lg:w-20' : 'lg:w-72'
      }`}>
        <div className="flex-1 flex flex-col min-h-0 py-6 px-4 overflow-y-auto">
          <SidebarContent />
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;