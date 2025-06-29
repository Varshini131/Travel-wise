import React, { useState } from 'react';
import { Sun, Cloud, CloudRain, Calendar } from 'lucide-react';

const StyleWeather: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState('today');

  const days = [
    { id: 'today', label: 'Today', active: true },
    { id: 'tomorrow', label: 'Tomorrow', active: false },
    { id: 'day3', label: 'Day 3', active: false },
    { id: 'day4', label: 'Day 4', active: false },
    { id: 'day5', label: 'Day 5', active: false },
  ];

  const forecast = [
    { day: 'Day 1', temp: '28°/20°', icon: Sun },
    { day: 'Day 2', temp: '26°/18°', icon: Cloud },
    { day: 'Day 3', temp: '24°/19°', icon: CloudRain },
    { day: 'Day 4', temp: '27°/21°', icon: Sun },
    { day: 'Day 5', temp: '29°/22°', icon: Sun },
  ];

  const dontForgetItems = ['Light jacket', 'Sunglasses', 'Small bag'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Clothes & Weather</h1>
          <p className="text-gray-600">Weather-based outfit recommendations for your trip to Mumbai</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">📍</span>
          <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500">
            <option>Mumbai</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Day Selection */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Select Day</h2>
            <div className="space-y-2">
              {days.map((day) => (
                <button
                  key={day.id}
                  onClick={() => setSelectedDay(day.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    day.id === selectedDay
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-white border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">{day.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 5-Day Forecast */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="font-bold text-lg mb-4">5-Day Forecast</h3>
            <div className="space-y-3">
              {forecast.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-600">{item.day}</span>
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{item.temp}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Climate Info */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="font-bold text-lg mb-3">Climate Info</h3>
            <p className="text-gray-600 text-sm">
              Mumbai has a tropical climate with high humidity throughout the year. The monsoon season brings heavy rainfall from June to September.
            </p>
          </div>
        </div>

        {/* Center Column - Weather Today */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-4xl font-bold">28°</div>
                <div className="text-purple-100">Low: 20°</div>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Sun className="w-8 h-8" />
              </div>
            </div>
            <div>
              <div className="text-xl font-semibold mb-1">Pleasant</div>
              <div className="text-purple-100">City exploration</div>
            </div>
          </div>

          {/* Perfect Outfit */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
              <h3 className="font-bold text-lg">Perfect Outfit</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Top:</span>
                <span className="font-medium">Cotton shirt</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Bottom:</span>
                <span className="font-medium">Comfortable pants</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Shoes:</span>
                <span className="font-medium">Walking shoes</span>
              </div>
            </div>
          </div>

          {/* Don't Forget */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
              <h3 className="font-bold text-lg">Don't Forget</h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {dontForgetItems.map((item, index) => (
                <span 
                  key={index}
                  className="bg-purple-100 text-purple-700 px-3 py-2 rounded-full text-sm font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Additional Weather Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="font-bold text-lg mb-4">Weather Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-purple-500">🌬️</span>
                  <span className="text-gray-600">Light breeze</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-500">💧</span>
                  <span className="text-gray-600">20% rain</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="font-bold text-lg mb-4">🕐 Style Tips for Mumbai</h3>
            <div className="space-y-3 text-sm">
              <p className="text-gray-600">
                Light, breathable fabrics work best in Mumbai's humid climate. Cotton and linen are your best friends.
              </p>
              <p className="text-gray-600">
                Always carry a light jacket or shawl for air-conditioned spaces.
              </p>
              <p className="text-gray-600">
                Comfortable walking shoes are essential for exploring the city's bustling streets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleWeather;