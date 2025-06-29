import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AIPlanner from './components/AIPlanner';
import FoodDiscoveries from './components/FoodDiscoveries';
import StyleWeather from './components/StyleWeather';
import Attractions from './components/Attractions';
import AuthPage from './components/auth/AuthPage';
import HomePage from './components/pages/HomePage';
import DiscoverPage from './components/pages/DiscoverPage';
import PricingPage from './components/pages/PricingPage';
import HelpPage from './components/pages/HelpPage';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { user, isLoading } = useAuth();
  const { isDark } = useTheme();

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700' 
          : 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400'
      }`}>
        <div className="text-center">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transition-colors duration-300 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <span className={`font-bold text-2xl transition-colors duration-300 ${
              isDark ? 'text-purple-400' : 'text-purple-600'
            }`}>T</span>
          </div>
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white mt-4 font-medium">Loading TravelWise...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'discover':
        return <DiscoverPage />;
      case 'pricing':
        return <PricingPage />;
      case 'help':
        return <HelpPage />;
      case 'dashboard':
        return <Dashboard />;
      case 'ai-planner':
        return <AIPlanner />;
      case 'food-discoveries':
        return <FoodDiscoveries />;
      case 'style-weather':
        return <StyleWeather />;
      case 'attractions':
        return <Attractions />;
      case 'settings':
        return (
          <div className="max-w-4xl mx-auto">
            <h1 className={`text-3xl font-bold mb-6 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Settings</h1>
            <div className={`rounded-2xl shadow-lg p-8 transition-colors duration-300 ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="space-y-6">
                <div>
                  <h2 className={`text-xl font-semibold mb-4 transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Account Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>Name</label>
                      <input 
                        type="text" 
                        value={user?.name || ''} 
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-300 ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>Email</label>
                      <input 
                        type="email" 
                        value={user?.email || ''} 
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-300 ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className={`text-xl font-semibold mb-4 transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Preferences</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`transition-colors duration-300 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>Email Notifications</span>
                      <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`transition-colors duration-300 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>Push Notifications</span>
                      <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;