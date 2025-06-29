import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Sun, Star, Heart, X, Plus } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Dashboard: React.FC = () => {
  const [savedItems, setSavedItems] = useState(0);
  const { isDark } = useTheme();

  const handleLoveFood = () => {
    setSavedItems(prev => prev + 1);
    // Show success message
    const message = document.createElement('div');
    message.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    message.textContent = 'Added to your culinary journey!';
    document.body.appendChild(message);
    setTimeout(() => {
      document.body.removeChild(message);
    }, 3000);
  };

  const handleSkipFood = () => {
    // Show skip message
    const message = document.createElement('div');
    message.className = 'fixed top-4 right-4 bg-gray-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    message.textContent = 'Skipped - finding more options...';
    document.body.appendChild(message);
    setTimeout(() => {
      document.body.removeChild(message);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className={`text-4xl font-bold mb-2 transition-colors duration-300 ${
            isDark ? 'text-teal-400' : 'text-teal-600'
          }`}>Your TravelWise Dashboard</h1>
          <div className={`flex items-center space-x-4 transition-colors duration-300 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Sunday, June 29, 2025</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Mumbai</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <div className={`rounded-lg p-4 shadow-md text-center transition-colors duration-300 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`font-semibold transition-colors duration-300 ${
              isDark ? 'text-teal-400' : 'text-teal-600'
            }`}>Trip Progress:</div>
            <div className={`text-2xl font-bold transition-colors duration-300 ${
              isDark ? 'text-teal-400' : 'text-teal-600'
            }`}>65%</div>
          </div>
          <div className={`rounded-lg p-4 shadow-md text-center transition-colors duration-300 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`font-semibold transition-colors duration-300 ${
              isDark ? 'text-purple-400' : 'text-purple-600'
            }`}>Saved</div>
            <div className={`text-2xl font-bold transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>{savedItems}</div>
          </div>
          <div className={`rounded-lg p-4 shadow-md text-center transition-colors duration-300 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`font-semibold transition-colors duration-300 ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`}>AI Powered</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Smart Plan */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`rounded-lg shadow-md p-6 transition-colors duration-300 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex items-center space-x-3 mb-6">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                isDark ? 'bg-teal-900' : 'bg-teal-100'
              }`}>
                <span className={`text-xl transition-colors duration-300 ${
                  isDark ? 'text-teal-400' : 'text-teal-600'
                }`}>✨</span>
              </div>
              <h2 className={`text-xl font-bold transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Today's Smart Plan</h2>
            </div>

            <div className="space-y-4">
              <div className={`flex items-center space-x-4 p-4 rounded-lg transition-colors duration-300 ${
                isDark ? 'bg-orange-900/30' : 'bg-orange-50'
              }`}>
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <div>
                  <div className={`font-semibold transition-colors duration-300 ${
                    isDark ? 'text-orange-400' : 'text-orange-600'
                  }`}>BREAKFAST • 9:00 AM</div>
                  <div className={`text-sm mt-1 transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    👆 Swipe right on food suggestions to add
                  </div>
                </div>
              </div>

              <div className={`flex items-center space-x-4 p-4 rounded-lg transition-colors duration-300 ${
                isDark ? 'bg-teal-900/30' : 'bg-teal-50'
              }`}>
                <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                <div>
                  <div className={`font-semibold transition-colors duration-300 ${
                    isDark ? 'text-teal-400' : 'text-teal-600'
                  }`}>ACTIVITIES • 11:00 AM</div>
                  <div className={`text-sm mt-1 transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    👆 Swipe right on attractions to add
                  </div>
                </div>
              </div>

              <div className={`flex items-center space-x-4 p-4 rounded-lg transition-colors duration-300 ${
                isDark ? 'bg-purple-900/30' : 'bg-purple-50'
              }`}>
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <div>
                  <div className={`font-semibold transition-colors duration-300 ${
                    isDark ? 'text-purple-400' : 'text-purple-600'
                  }`}>TODAY'S WEATHER</div>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="bg-purple-500 rounded-lg p-3 text-white">
                      <Sun className="w-6 h-6" />
                    </div>
                    <div>
                      <div className={`font-semibold transition-colors duration-300 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>Pleasant</div>
                      <div className={`text-sm transition-colors duration-300 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>City exploration</div>
                    </div>
                    <div className="ml-auto">
                      <div className={`text-2xl font-bold transition-colors duration-300 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>28°</div>
                      <div className={`text-sm transition-colors duration-300 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>Low: 20°</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Food Discovery Card */}
        <div className="space-y-6">
          <div className={`rounded-lg shadow-md overflow-hidden transition-colors duration-300 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4">
              <h3 className="font-bold text-lg">Discover Amazing Food in Mumbai</h3>
              <p className="text-orange-100 text-sm">Swipe right to love it, left to skip</p>
            </div>

            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=400" 
                alt="Trishna Restaurant seafood"
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Seafood
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className="bg-white text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                  🔥 Authentic
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className={`font-bold text-lg transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Trishna Restaurant</h4>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className={`font-semibold transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>4.8</span>
                </div>
              </div>
              <p className={`text-sm mb-4 transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Award-winning seafood restaurant with contemporary Indian coastal cuisine
              </p>
              
              <div className={`flex items-center justify-between text-sm mb-4 transition-colors duration-300 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>Fort, Mumbai</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>15-20 min</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button 
                  onClick={handleSkipFood}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 border rounded-lg hover:bg-gray-50 transition-colors ${
                    isDark 
                      ? 'border-gray-600 hover:bg-gray-700 text-gray-300' 
                      : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <X className="w-4 h-4" />
                  <span>Skip</span>
                </button>
                <button 
                  onClick={handleLoveFood}
                  className="flex-1 flex items-center justify-center space-x-2 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  <span>Love It!</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;