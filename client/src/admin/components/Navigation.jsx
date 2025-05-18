import React, { useState, useEffect } from 'react';
import { Users, BarChart3, Settings, Menu, X } from 'lucide-react';
import useMobile from '../components/use-mobile';
import { Link } from 'react-router-dom';

const AdminNavigation = ({ activePage }) => {
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      name: "Users",
      icon: <Users className="h-5 w-5" />,
      href: "/admin/users",
    },
    {
      name: "Distribution",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/admin/distribution",
    },
    {
      name: "Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/admin/settings",
    },
  ];

  // Close sidebar when switching to mobile view
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center justify-center w-full h-full ${
                activePage === item.name.toLowerCase() ? "text-[#2D8C72]" : "text-gray-500"
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar for desktop */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 z-40 ${
          isOpen ? "w-64" : "w-0 lg:w-64"
        } overflow-hidden`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-[#2D8C72] mb-8">Admin Panel</h2>
          <nav className="space-y-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  activePage === item.name.toLowerCase()
                    ? "bg-[#2D8C72] bg-opacity-10 text-[#2D8C72]"
                    : "hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default AdminNavigation;