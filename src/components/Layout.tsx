import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Brain, 
  Utensils, 
  Shirt, 
  MapPin, 
  Settings,
  Home,
  Compass,
  DollarSign,
  HelpCircle,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import NotificationPanel from './NotificationPanel';
import ThemeToggle from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ai-planner', label: 'AI Planner', icon: Brain },
    { id: 'food-discoveries', label: 'Food Discoveries', icon: Utensils },
    { id: 'style-weather', label: 'Style & Weather', icon: Shirt },
    { id: 'attractions', label: 'Attractions', icon: MapPin },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const headerNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ];

  const handleNavClick = (itemId: string) => {
    onPageChange(itemId);
    setShowMobileMenu(false);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <header className={`shadow-lg relative z-40 transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-r from-purple-800 via-pink-700 to-pink-600' 
          : 'bg-gradient-to-r from-purple-600 via-pink-500 to-pink-400'
      } text-white`}>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}>
                <span className={`font-bold text-lg transition-colors duration-300 ${
                  isDark ? 'text-purple-400' : 'text-purple-600'
                }`}>T</span>
              </div>
              <span className="text-xl font-bold">TravelWise</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              {headerNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="flex items-center space-x-1 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Notifications */}
            <button 
              onClick={() => setShowNotifications(true)}
              className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                9+
              </span>
            </button>
            
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-2 hover:bg-white/20 transition-colors"
              >
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <User className="w-5 h-5" />
                )}
                <span className="hidden sm:block max-w-32 truncate">{user?.name || 'User'}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showUserMenu && (
                <div className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg py-2 z-50 transition-colors duration-300 ${
                  isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}>
                  <div className={`px-4 py-2 border-b transition-colors duration-300 ${
                    isDark ? 'border-gray-700' : 'border-gray-100'
                  }`}>
                    <p className={`font-medium transition-colors duration-300 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{user?.name}</p>
                    <p className={`text-sm transition-colors duration-300 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      onPageChange('settings');
                      setShowUserMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 transition-colors duration-300 ${
                      isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-red-600 transition-colors duration-300 ${
                      isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Welcome Banner */}
        <div className={`px-6 py-4 transition-colors duration-300 ${
          isDark 
            ? 'bg-gradient-to-r from-purple-900 to-pink-800' 
            : 'bg-gradient-to-r from-purple-700 to-pink-600'
        }`}>
          <div className="flex items-center space-x-2 text-white/90">
            <span className="text-2xl">✨</span>
            <span className="font-medium">Welcome back, {user?.name}!</span>
          </div>
          <p className="text-white/80 mt-1">Plan your wise adventure</p>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className={`md:hidden border-t transition-colors duration-300 ${
            isDark 
              ? 'bg-purple-900 border-purple-700' 
              : 'bg-purple-700 border-purple-500'
          }`}>
            <nav className="px-6 py-4 space-y-2">
              {headerNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left"
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      <div className="flex">
        {/* Sidebar - Hidden on mobile when showing main pages */}
        {!['home', 'discover', 'pricing', 'help'].includes(currentPage) && (
          <aside className={`hidden md:block w-64 shadow-lg min-h-screen transition-colors duration-300 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <nav className="p-4">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                let bgColor = isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100';
                if (isActive) {
                  if (item.id === 'dashboard') bgColor = 'bg-gradient-to-r from-teal-400 to-green-400 text-white';
                  else if (item.id === 'ai-planner') bgColor = 'bg-gradient-to-r from-blue-400 to-blue-500 text-white';
                  else if (item.id === 'food-discoveries') bgColor = 'bg-gradient-to-r from-orange-400 to-red-500 text-white';
                  else if (item.id === 'style-weather') bgColor = 'bg-gradient-to-r from-purple-400 to-pink-500 text-white';
                  else if (item.id === 'attractions') bgColor = 'bg-gradient-to-r from-cyan-400 to-blue-400 text-white';
                  else bgColor = isDark ? 'bg-gray-700' : 'bg-gray-200';
                }

                const textColor = isActive && !bgColor.includes('gradient') 
                  ? (isDark ? 'text-white' : 'text-gray-900')
                  : (isDark ? 'text-gray-300' : 'text-gray-700');

                return (
                  <button
                    key={item.id}
                    onClick={() => onPageChange(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all mb-2 ${bgColor} ${textColor} ${isActive ? 'shadow-lg' : ''}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 transition-colors duration-300 ${
          !['home', 'discover', 'pricing', 'help'].includes(currentPage) ? 'p-6' : ''
        }`}>
          {children}
        </main>
      </div>

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />

      {/* Click outside to close menus */}
      {(showUserMenu || showMobileMenu) && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => {
            setShowUserMenu(false);
            setShowMobileMenu(false);
          }}
        ></div>
      )}
    </div>
  );
};

export default Layout;