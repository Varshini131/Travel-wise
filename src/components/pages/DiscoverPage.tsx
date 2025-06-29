import React, { useState } from 'react';
import { Search, MapPin, Star, Filter, Compass, Camera, Mountain, Utensils } from 'lucide-react';

const DiscoverPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All', icon: Compass },
    { id: 'attractions', label: 'Attractions', icon: Camera },
    { id: 'food', label: 'Food & Dining', icon: Utensils },
    { id: 'nature', label: 'Nature', icon: Mountain },
  ];

  const destinations = [
    {
      id: 1,
      name: 'Mumbai, India',
      description: 'The financial capital with vibrant street life and colonial architecture',
      image: 'https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.6,
      attractions: 150,
      category: 'attractions'
    },
    {
      id: 2,
      name: 'Goa, India',
      description: 'Beautiful beaches, Portuguese heritage, and vibrant nightlife',
      image: 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      attractions: 89,
      category: 'nature'
    },
    {
      id: 3,
      name: 'Delhi, India',
      description: 'Rich history, diverse cuisine, and bustling markets',
      image: 'https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.4,
      attractions: 200,
      category: 'food'
    },
    {
      id: 4,
      name: 'Kerala, India',
      description: 'Backwaters, spice plantations, and serene hill stations',
      image: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.7,
      attractions: 120,
      category: 'nature'
    },
    {
      id: 5,
      name: 'Rajasthan, India',
      description: 'Majestic palaces, desert landscapes, and royal heritage',
      image: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.5,
      attractions: 180,
      category: 'attractions'
    },
    {
      id: 6,
      name: 'Bangalore, India',
      description: 'Tech hub with gardens, pubs, and modern attractions',
      image: 'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.3,
      attractions: 95,
      category: 'food'
    }
  ];

  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dest.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || dest.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Discover Amazing Destinations</h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Explore authentic experiences and hidden gems with our AI-powered travel recommendations
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destinations, attractions, or experiences..."
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 text-lg focus:ring-2 focus:ring-white focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{category.label}</span>
              </button>
            );
          })}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredDestinations.length} destinations found
          </h2>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500">
              <option>Sort by Popularity</option>
              <option>Sort by Rating</option>
              <option>Sort by Name</option>
            </select>
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((destination) => (
            <div key={destination.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img 
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-sm">{destination.rating}</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <h3 className="text-xl font-bold text-gray-900">{destination.name}</h3>
                </div>
                
                <p className="text-gray-600 mb-4">{destination.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {destination.attractions} attractions
                  </span>
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all">
                    Explore
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredDestinations.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No destinations found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverPage;