import React, { useState } from 'react';
import { MapPin, Clock, DollarSign, Star, Plus, X } from 'lucide-react';

const Attractions: React.FC = () => {
  const [currentAttraction, setCurrentAttraction] = useState(0);
  const [itineraryCount, setItineraryCount] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState('Mumbai');

  // Location-specific attractions data
  const locationAttractions: { [key: string]: any[] } = {
    Mumbai: [
      {
        id: 1,
        name: "Gateway of India",
        rating: 4.5,
        description: "Iconic arch monument overlooking the Arabian Sea, built to commemorate King George V's visit",
        duration: "1-2 hours",
        price: "Free",
        location: "Colaba, Mumbai",
        image: "https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["Monument", "Must Visit", "Historical"],
        category: "Historical",
        highlights: ["Boat rides to Elephanta Caves", "Street food vendors", "Taj Hotel nearby"]
      },
      {
        id: 2,
        name: "Marine Drive",
        rating: 4.3,
        description: "Beautiful waterfront promenade known as Queen's Necklace, perfect for evening walks and sunset views",
        duration: "2-3 hours",
        price: "Free",
        location: "South Mumbai",
        image: "https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["Scenic", "Popular", "Evening"],
        category: "Waterfront",
        highlights: ["Sunset views", "Street food", "Art Deco buildings"]
      },
      {
        id: 3,
        name: "Elephanta Caves",
        rating: 4.4,
        description: "Ancient rock-cut caves dedicated to Lord Shiva, UNESCO World Heritage site on Elephanta Island",
        duration: "4-5 hours",
        price: "₹40 + Ferry ₹150",
        location: "Elephanta Island",
        image: "https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["UNESCO", "Ancient", "Spiritual"],
        category: "Historical",
        highlights: ["Ancient sculptures", "Ferry ride", "Island exploration"]
      }
    ],
    Delhi: [
      {
        id: 1,
        name: "Red Fort",
        rating: 4.6,
        description: "Magnificent Mughal fortress and UNESCO World Heritage site, symbol of India's rich history",
        duration: "2-3 hours",
        price: "₹35",
        location: "Old Delhi",
        image: "https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["UNESCO", "Mughal", "Fortress"],
        category: "Historical",
        highlights: ["Mughal architecture", "Light and sound show", "Museum"]
      },
      {
        id: 2,
        name: "India Gate",
        rating: 4.4,
        description: "War memorial arch honoring Indian soldiers, surrounded by beautiful gardens and fountains",
        duration: "1-2 hours",
        price: "Free",
        location: "Rajpath, Delhi",
        image: "https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["Memorial", "Gardens", "Iconic"],
        category: "Monument",
        highlights: ["Evening illumination", "Boat rides", "Street food"]
      },
      {
        id: 3,
        name: "Lotus Temple",
        rating: 4.7,
        description: "Stunning lotus-shaped Bahá'í House of Worship known for its architectural beauty and peaceful atmosphere",
        duration: "1-2 hours",
        price: "Free",
        location: "Kalkaji, Delhi",
        image: "https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["Architectural", "Peaceful", "Modern"],
        category: "Spiritual",
        highlights: ["Unique architecture", "Meditation", "Gardens"]
      }
    ],
    Goa: [
      {
        id: 1,
        name: "Basilica of Bom Jesus",
        rating: 4.5,
        description: "UNESCO World Heritage church housing the mortal remains of St. Francis Xavier",
        duration: "1-2 hours",
        price: "Free",
        location: "Old Goa",
        image: "https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["UNESCO", "Portuguese", "Religious"],
        category: "Historical",
        highlights: ["Baroque architecture", "St. Francis Xavier", "Art gallery"]
      },
      {
        id: 2,
        name: "Calangute Beach",
        rating: 4.2,
        description: "Queen of beaches with golden sand, water sports, and vibrant beach shacks",
        duration: "3-4 hours",
        price: "Free",
        location: "North Goa",
        image: "https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["Beach", "Water Sports", "Vibrant"],
        category: "Beach",
        highlights: ["Water sports", "Beach shacks", "Sunset views"]
      },
      {
        id: 3,
        name: "Dudhsagar Falls",
        rating: 4.6,
        description: "Spectacular four-tiered waterfall cascading from 310 meters, one of India's tallest waterfalls",
        duration: "5-6 hours",
        price: "₹30 + Jeep ₹3000",
        location: "Mollem, Goa",
        image: "https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["Waterfall", "Adventure", "Nature"],
        category: "Nature",
        highlights: ["Jeep safari", "Swimming", "Photography"]
      }
    ],
    Kerala: [
      {
        id: 1,
        name: "Alleppey Backwaters",
        rating: 4.7,
        description: "Serene network of canals, rivers, and lakes with traditional houseboat experiences",
        duration: "Full day",
        price: "₹8000-15000",
        location: "Alleppey, Kerala",
        image: "https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["Backwaters", "Houseboat", "Serene"],
        category: "Nature",
        highlights: ["Houseboat cruise", "Village life", "Sunset views"]
      },
      {
        id: 2,
        name: "Munnar Tea Gardens",
        rating: 4.6,
        description: "Rolling hills covered with tea plantations offering breathtaking views and cool climate",
        duration: "4-5 hours",
        price: "₹50-100",
        location: "Munnar, Kerala",
        image: "https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["Tea Gardens", "Hills", "Scenic"],
        category: "Nature",
        highlights: ["Tea factory visit", "Trekking", "Photography"]
      },
      {
        id: 3,
        name: "Chinese Fishing Nets",
        rating: 4.3,
        description: "Iconic fishing nets introduced by Chinese traders, symbol of Kochi's maritime heritage",
        duration: "1-2 hours",
        price: "Free",
        location: "Fort Kochi, Kerala",
        image: "https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["Heritage", "Maritime", "Iconic"],
        category: "Cultural",
        highlights: ["Sunset photography", "Fresh fish market", "Heritage walk"]
      }
    ],
    Rajasthan: [
      {
        id: 1,
        name: "Amber Fort",
        rating: 4.8,
        description: "Magnificent hilltop fort with stunning Rajput architecture and panoramic views of Jaipur",
        duration: "3-4 hours",
        price: "₹100",
        location: "Jaipur, Rajasthan",
        image: "https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["Fort", "Rajput", "Hilltop"],
        category: "Historical",
        highlights: ["Elephant ride", "Mirror palace", "Light show"]
      },
      {
        id: 2,
        name: "City Palace Udaipur",
        rating: 4.7,
        description: "Opulent palace complex overlooking Lake Pichola, showcasing royal Rajasthani architecture",
        duration: "2-3 hours",
        price: "₹300",
        location: "Udaipur, Rajasthan",
        image: "https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["Palace", "Lake View", "Royal"],
        category: "Historical",
        highlights: ["Lake views", "Royal artifacts", "Architecture"]
      },
      {
        id: 3,
        name: "Thar Desert",
        rating: 4.5,
        description: "Golden sand dunes offering camel safaris, desert camping, and stunning sunset experiences",
        duration: "Full day",
        price: "₹2000-5000",
        location: "Jaisalmer, Rajasthan",
        image: "https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["Desert", "Camel Safari", "Adventure"],
        category: "Adventure",
        highlights: ["Camel safari", "Desert camping", "Cultural shows"]
      }
    ]
  };

  const attractions = locationAttractions[selectedLocation] || locationAttractions.Mumbai;
  const attraction = attractions[currentAttraction % attractions.length];

  const handleAddToPlan = () => {
    setItineraryCount(prev => prev + 1);
    
    // Show success message
    const message = document.createElement('div');
    message.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    message.textContent = `Added ${attraction.name} to your itinerary!`;
    document.body.appendChild(message);
    
    setTimeout(() => {
      document.body.removeChild(message);
    }, 3000);

    // Move to next attraction
    setCurrentAttraction(prev => (prev + 1) % attractions.length);
  };

  const handleSkip = () => {
    // Show skip message
    const message = document.createElement('div');
    message.className = 'fixed top-4 right-4 bg-gray-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    message.textContent = 'Skipped - finding more attractions...';
    document.body.appendChild(message);
    
    setTimeout(() => {
      document.body.removeChild(message);
    }, 2000);

    // Move to next attraction
    setCurrentAttraction(prev => (prev + 1) % attractions.length);
  };

  const handleLocationChange = (newLocation: string) => {
    setSelectedLocation(newLocation);
    setCurrentAttraction(0); // Reset to first attraction of new location
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Authentic Attractions & Experiences
          </h1>
          <p className="text-gray-600">
            Discover genuine landmarks and experiences in {selectedLocation} with real reviews, accurate pricing, and local insights
          </p>
        </div>
        
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-gray-400" />
            <select 
              value={selectedLocation}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500"
            >
              <option value="Mumbai">Mumbai, India</option>
              <option value="Delhi">Delhi, India</option>
              <option value="Goa">Goa, India</option>
              <option value="Kerala">Kerala, India</option>
              <option value="Rajasthan">Rajasthan, India</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500">
              <option>All Categories</option>
              <option>Historical</option>
              <option>Nature</option>
              <option>Beach</option>
              <option>Cultural</option>
              <option>Adventure</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Attraction Card */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="relative">
              <img 
                src={attraction.image}
                alt={attraction.name}
                className="w-full h-80 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-cyan-500 text-white px-4 py-2 rounded-full font-medium">
                  {attraction.category}
                </span>
              </div>
              <div className="absolute top-4 right-4 flex space-x-2">
                {attraction.tags.map((tag: string, index: number) => (
                  <span key={index} className="bg-white/90 text-cyan-600 px-3 py-1 rounded-full text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{attraction.name}</h2>
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-lg">{attraction.rating}</span>
                </div>
              </div>

              <p className="text-gray-600 mb-6 text-lg">
                {attraction.description}
              </p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="flex items-center space-x-2 text-gray-500">
                  <Clock className="w-5 h-5" />
                  <span>{attraction.duration}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                  <DollarSign className="w-5 h-5" />
                  <span>{attraction.price}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                  <MapPin className="w-5 h-5" />
                  <span>{attraction.location}</span>
                </div>
              </div>

              {/* Highlights */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-3">✨ Highlights:</h4>
                <div className="flex flex-wrap gap-2">
                  {attraction.highlights.map((highlight: string, index: number) => (
                    <span key={index} className="bg-cyan-100 text-cyan-700 px-3 py-2 rounded-full text-sm">
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4">
                <button 
                  onClick={handleSkip}
                  className="flex-1 flex items-center justify-center space-x-2 py-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-lg font-medium"
                >
                  <X className="w-5 h-5" />
                  <span>Skip</span>
                </button>
                <button 
                  onClick={handleAddToPlan}
                  className="flex-1 flex items-center justify-center space-x-2 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all text-lg font-medium"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add to Plan</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Travel Itinerary */}
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-bold text-lg mb-2">Your Travel Itinerary</h3>
            <p className="text-gray-500 text-sm mb-4">
              {itineraryCount > 0 ? `${itineraryCount} attractions added!` : 'Start exploring to build your perfect itinerary!'}
            </p>
            <p className="text-gray-400 text-xs">Swipe right to add, left to skip</p>
          </div>

          {/* About Location */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="w-5 h-5 text-cyan-500" />
              <h3 className="font-bold text-lg">About {selectedLocation}</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              {selectedLocation === 'Mumbai' && "Mumbai, the financial capital of India, offers a perfect blend of colonial architecture, modern skyscrapers, and vibrant street life along the Arabian Sea coast."}
              {selectedLocation === 'Delhi' && "Delhi, India's capital, showcases 1000 years of history with magnificent Mughal monuments, bustling markets, and diverse cultural experiences."}
              {selectedLocation === 'Goa' && "Goa offers beautiful beaches, Portuguese heritage, and vibrant nightlife making it a perfect tropical getaway with unique cultural blend."}
              {selectedLocation === 'Kerala' && "Kerala, God's Own Country, features serene backwaters, lush hill stations, and spice plantations offering perfect nature retreats."}
              {selectedLocation === 'Rajasthan' && "Rajasthan showcases royal heritage with majestic palaces, desert landscapes, and vibrant culture reflecting India's regal past."}
            </p>
            
            <div className="mb-4">
              <h4 className="font-semibold text-cyan-600 mb-2">Top Highlights:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {attractions.slice(0, 4).map((attr, index) => (
                  <li key={index}>• {attr.name}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Location Stats */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="font-bold text-lg mb-4">📊 {selectedLocation} Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Attractions Available</span>
                <span className="font-semibold">{attractions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Avg Rating</span>
                <span className="font-semibold">{(attractions.reduce((sum, a) => sum + a.rating, 0) / attractions.length).toFixed(1)} ⭐</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Categories</span>
                <span className="font-semibold">{new Set(attractions.map(a => a.category)).size}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attractions;