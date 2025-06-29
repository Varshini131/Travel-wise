import React, { useState } from 'react';
import { MapPin, Clock, Star, Heart, X, Filter } from 'lucide-react';

const FoodDiscoveries: React.FC = () => {
  const [currentRestaurant, setCurrentRestaurant] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState('Mumbai');
  const [viewedRestaurants, setViewedRestaurants] = useState<number[]>([]);

  // Location-specific restaurant data with more options
  const locationRestaurants: { [key: string]: any[] } = {
    Mumbai: [
      {
        id: 1,
        name: "Trishna Restaurant",
        cuisine: "Seafood",
        rating: 4.8,
        description: "Award-winning seafood restaurant with contemporary Indian coastal cuisine and fresh catch of the day",
        location: "Fort, Mumbai",
        duration: "15-20 min",
        image: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["Authentic", "Award-winning"],
        mustTry: ["Koliwada Prawns", "Butter Pepper Garlic Soft Shell Crab", "Solkadhi", "Fish Curry Rice", "Bombay Duck"]
      },
      {
        id: 2,
        name: "Leopold Cafe",
        cuisine: "Continental",
        rating: 4.2,
        description: "Historic cafe serving continental dishes and local favorites since 1871, a Mumbai institution",
        location: "Colaba, Mumbai",
        duration: "10-15 min",
        image: "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["Historic", "Iconic"],
        mustTry: ["Fish & Chips", "Chicken Tikka", "Masala Chai", "Mutton Pepper Fry", "Chocolate Brownie"]
      },
      {
        id: 3,
        name: "Britannia & Co.",
        cuisine: "Parsi",
        rating: 4.6,
        description: "Legendary Parsi cafe famous for berry pulao and authentic Parsi cuisine since 1923",
        location: "Ballard Estate, Mumbai",
        duration: "20-25 min",
        image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["Legendary", "Parsi"],
        mustTry: ["Berry Pulao", "Mutton Cutlets", "Caramel Custard", "Dhansak", "Sali Boti"]
      },
      {
        id: 4,
        name: "Khyber Restaurant",
        cuisine: "North Indian",
        rating: 4.5,
        description: "Upscale North Indian restaurant with rich Mughlai cuisine and elegant ambiance",
        location: "Fort, Mumbai",
        duration: "25-30 min",
        image: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["Upscale", "Mughlai"],
        mustTry: ["Dal Khyber", "Mutton Rogan Josh", "Naan Varieties", "Kulfi", "Lassi"]
      },
      {
        id: 5,
        name: "Cafe Mocha",
        cuisine: "Continental",
        rating: 4.3,
        description: "Trendy cafe chain known for coffee, desserts, and continental dishes in a cozy atmosphere",
        location: "Bandra, Mumbai",
        duration: "15-20 min",
        image: "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["Trendy", "Coffee"],
        mustTry: ["Mocha Coffee", "Chocolate Cake", "Pasta", "Sandwiches", "Smoothies"]
      },
      {
        id: 6,
        name: "Mahesh Lunch Home",
        cuisine: "Mangalorean",
        rating: 4.4,
        description: "Famous for authentic Mangalorean seafood and coastal Karnataka cuisine",
        location: "Fort, Mumbai",
        duration: "20-25 min",
        image: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["Authentic", "Coastal"],
        mustTry: ["Koliwada Prawns", "Fish Curry", "Neer Dosa", "Ghee Roast", "Sol Kadhi"]
      }
    ],
    Delhi: [
      {
        id: 1,
        name: "Karim's Restaurant",
        cuisine: "Mughlai",
        rating: 4.7,
        description: "Legendary Mughlai restaurant serving authentic kebabs and biryanis since 1913 in Old Delhi",
        location: "Jama Masjid, Delhi",
        duration: "20-25 min",
        image: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["Legendary", "Mughlai"],
        mustTry: ["Mutton Burra", "Chicken Jahangiri", "Mutton Korma", "Roomali Roti", "Firni"]
      },
      {
        id: 2,
        name: "Paranthe Wali Gali",
        cuisine: "North Indian",
        rating: 4.4,
        description: "Famous narrow lane in Chandni Chowk serving stuffed paranthas with traditional accompaniments",
        location: "Chandni Chowk, Delhi",
        duration: "15-20 min",
        image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["Traditional", "Street Food"],
        mustTry: ["Aloo Parantha", "Gobhi Parantha", "Paneer Parantha", "Rabri", "Lassi"]
      },
      {
        id: 3,
        name: "Indian Accent",
        cuisine: "Modern Indian",
        rating: 4.9,
        description: "Award-winning restaurant offering innovative Indian cuisine with contemporary presentation",
        location: "Lodhi Road, Delhi",
        duration: "25-30 min",
        image: "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["Award-winning", "Modern"],
        mustTry: ["Duck Khurchan", "Pork Ribs", "Mishti Doi Cannelloni", "Blue Cheese Naan", "Ghee Roast Mutton"]
      },
      {
        id: 4,
        name: "Al Jawahar",
        cuisine: "Mughlai",
        rating: 4.3,
        description: "Traditional Mughlai restaurant near Jama Masjid serving authentic Old Delhi flavors",
        location: "Jama Masjid, Delhi",
        duration: "20-25 min",
        image: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["Traditional", "Old Delhi"],
        mustTry: ["Mutton Biryani", "Chicken Changezi", "Seekh Kebab", "Sheermal", "Kulfi"]
      },
      {
        id: 5,
        name: "Bukhara",
        cuisine: "North Indian",
        rating: 4.8,
        description: "World-renowned restaurant famous for its rustic ambiance and exceptional tandoor cuisine",
        location: "ITC Maurya, Delhi",
        duration: "30-35 min",
        image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["World-renowned", "Tandoor"],
        mustTry: ["Dal Bukhara", "Sikandari Raan", "Tandoori Chicken", "Naan", "Kulfi"]
      }
    ],
    Goa: [
      {
        id: 1,
        name: "Fisherman's Wharf",
        cuisine: "Goan Seafood",
        rating: 4.5,
        description: "Authentic Goan seafood restaurant with fresh catch and traditional Konkani flavors by the riverside",
        location: "Cavelossim, Goa",
        duration: "20-25 min",
        image: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["Authentic", "Riverside"],
        mustTry: ["Fish Curry Rice", "Prawn Balchão", "Bebinca", "Feni", "Goan Sausage"]
      },
      {
        id: 2,
        name: "Vinayak Family Restaurant",
        cuisine: "Goan",
        rating: 4.3,
        description: "Local favorite serving traditional Goan dishes and fresh seafood in a homely atmosphere",
        location: "Assagao, Goa",
        duration: "15-20 min",
        image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["Local Favorite", "Homely"],
        mustTry: ["Goan Fish Curry", "Pork Vindaloo", "Solkadhi", "Xacuti", "Sorpotel"]
      },
      {
        id: 3,
        name: "Thalassa",
        cuisine: "Greek-Goan",
        rating: 4.6,
        description: "Beachfront restaurant offering Greek cuisine with Goan influences and stunning sunset views",
        location: "Vagator Beach, Goa",
        duration: "30-35 min",
        image: "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["Beachfront", "Sunset Views"],
        mustTry: ["Greek Salad", "Moussaka", "Grilled Fish", "Ouzo", "Baklava"]
      },
      {
        id: 4,
        name: "Mum's Kitchen",
        cuisine: "Goan",
        rating: 4.4,
        description: "Authentic Goan home-style cooking with traditional recipes passed down through generations",
        location: "Panaji, Goa",
        duration: "20-25 min",
        image: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["Home-style", "Traditional"],
        mustTry: ["Goan Thali", "Chicken Cafreal", "Fish Recheado", "Ros Omelette", "Serradura"]
      }
    ],
    Kerala: [
      {
        id: 1,
        name: "Dhe Puttu",
        cuisine: "Kerala",
        rating: 4.7,
        description: "Specialty restaurant famous for puttu varieties and authentic Kerala breakfast dishes",
        location: "Kochi, Kerala",
        duration: "15-20 min",
        image: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["Specialty", "Breakfast"],
        mustTry: ["Puttu Varieties", "Appam with Stew", "Fish Molee", "Payasam", "Filter Coffee"]
      },
      {
        id: 2,
        name: "Paragon Restaurant",
        cuisine: "Malabar",
        rating: 4.5,
        description: "Iconic restaurant chain serving authentic Malabar cuisine and famous biryanis",
        location: "Calicut, Kerala",
        duration: "20-25 min",
        image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["Iconic", "Biryani"],
        mustTry: ["Malabar Biryani", "Fish Curry", "Kozhikode Halwa", "Pathiri", "Sulaimani Tea"]
      },
      {
        id: 3,
        name: "Kayees Biryani",
        cuisine: "Biryani",
        rating: 4.8,
        description: "Legendary biryani house serving the most authentic Thalassery biryani since 1957",
        location: "Thalassery, Kerala",
        duration: "25-30 min",
        image: "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["Legendary", "Since 1957"],
        mustTry: ["Thalassery Biryani", "Mutton Biryani", "Chicken 65", "Raita", "Kulfi"]
      },
      {
        id: 4,
        name: "Kashi Art Cafe",
        cuisine: "Continental",
        rating: 4.2,
        description: "Artistic cafe in Fort Kochi serving continental dishes with local art and cultural ambiance",
        location: "Fort Kochi, Kerala",
        duration: "20-25 min",
        image: "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["Artistic", "Cultural"],
        mustTry: ["Fish & Chips", "Pasta", "Fresh Juices", "Desserts", "Coffee"]
      }
    ],
    Rajasthan: [
      {
        id: 1,
        name: "Chokhi Dhani",
        cuisine: "Rajasthani",
        rating: 4.4,
        description: "Traditional Rajasthani village resort offering authentic dal baati churma and cultural experience",
        location: "Jaipur, Rajasthan",
        duration: "45-60 min",
        image: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["Traditional", "Cultural"],
        mustTry: ["Dal Baati Churma", "Gatte ki Sabzi", "Ker Sangri", "Bajre ki Roti", "Ghevar"]
      },
      {
        id: 2,
        name: "Laxmi Mishthan Bhandar",
        cuisine: "Rajasthani Sweets",
        rating: 4.6,
        description: "Famous sweet shop and restaurant serving traditional Rajasthani sweets and snacks since 1954",
        location: "Jaipur, Rajasthan",
        duration: "15-20 min",
        image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["Famous", "Since 1954"],
        mustTry: ["Ghevar", "Pyaaz Kachori", "Raj Kachori", "Mawa Kachori", "Rabri"]
      },
      {
        id: 3,
        name: "Ambrai Restaurant",
        cuisine: "Rajasthani",
        rating: 4.7,
        description: "Lakeside restaurant in Udaipur offering royal Rajasthani cuisine with stunning City Palace views",
        location: "Udaipur, Rajasthan",
        duration: "30-35 min",
        image: "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["Lakeside", "Royal"],
        mustTry: ["Laal Maas", "Safed Maas", "Rajasthani Thali", "Malpua", "Masala Chai"]
      },
      {
        id: 4,
        name: "Natraj Dining Hall",
        cuisine: "Rajasthani",
        rating: 4.3,
        description: "Local favorite serving authentic Rajasthani thali with unlimited servings in traditional style",
        location: "Jaipur, Rajasthan",
        duration: "25-30 min",
        image: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=600",
        tags: ["Local Favorite", "Unlimited"],
        mustTry: ["Rajasthani Thali", "Dal Baati", "Gatte ki Sabzi", "Churma", "Buttermilk"]
      }
    ]
  };

  const restaurants = locationRestaurants[selectedLocation] || locationRestaurants.Mumbai;
  
  // Get next restaurant that hasn't been viewed recently
  const getNextRestaurant = () => {
    const availableRestaurants = restaurants.filter((_, index) => 
      !viewedRestaurants.includes(index) || viewedRestaurants.length >= restaurants.length - 1
    );
    
    if (availableRestaurants.length === 0) {
      // Reset viewed restaurants if all have been seen
      setViewedRestaurants([]);
      return 0;
    }
    
    const randomIndex = Math.floor(Math.random() * availableRestaurants.length);
    const selectedRestaurant = availableRestaurants[randomIndex];
    return restaurants.indexOf(selectedRestaurant);
  };

  const currentRes = restaurants[currentRestaurant % restaurants.length];

  const handleLove = () => {
    setSavedCount(prev => prev + 1);
    
    // Show success message
    const message = document.createElement('div');
    message.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
    message.innerHTML = `
      <span>❤️</span>
      <span>Added ${currentRes.name} to your culinary journey!</span>
    `;
    document.body.appendChild(message);
    
    setTimeout(() => {
      if (document.body.contains(message)) {
        document.body.removeChild(message);
      }
    }, 3000);

    // Add current restaurant to viewed list
    setViewedRestaurants(prev => [...prev, currentRestaurant]);
    
    // Move to next restaurant
    const nextIndex = getNextRestaurant();
    setCurrentRestaurant(nextIndex);
  };

  const handleSkip = () => {
    // Show skip message
    const message = document.createElement('div');
    message.className = 'fixed top-4 right-4 bg-gray-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
    message.innerHTML = `
      <span>⏭️</span>
      <span>Skipped - finding more delicious options...</span>
    `;
    document.body.appendChild(message);
    
    setTimeout(() => {
      if (document.body.contains(message)) {
        document.body.removeChild(message);
      }
    }, 2000);

    // Add current restaurant to viewed list
    setViewedRestaurants(prev => [...prev, currentRestaurant]);
    
    // Move to next restaurant
    const nextIndex = getNextRestaurant();
    setCurrentRestaurant(nextIndex);
  };

  const handleLocationChange = (newLocation: string) => {
    setSelectedLocation(newLocation);
    setCurrentRestaurant(0); // Reset to first restaurant of new location
    setViewedRestaurants([]); // Reset viewed restaurants for new location
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Authentic Food Discoveries</h1>
          <p className="text-gray-600">
            Discover genuine restaurants and local cuisines in {selectedLocation} with real reviews and authentic experiences
          </p>
        </div>
        
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-gray-400" />
            <select 
              value={selectedLocation}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500"
            >
              <option value="Mumbai">Mumbai, India</option>
              <option value="Delhi">Delhi, India</option>
              <option value="Goa">Goa, India</option>
              <option value="Kerala">Kerala, India</option>
              <option value="Rajasthan">Rajasthan, India</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500">
              <option>All Cuisines</option>
              <option>Seafood</option>
              <option>Street Food</option>
              <option>Traditional</option>
              <option>Modern</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Restaurant Card */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
            <div className="relative">
              <img 
                src={currentRes.image}
                alt={currentRes.name}
                className="w-full h-80 object-cover transition-transform duration-300"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-orange-500 text-white px-4 py-2 rounded-full font-medium shadow-lg">
                  {currentRes.cuisine}
                </span>
              </div>
              <div className="absolute top-4 right-4 flex space-x-2">
                {currentRes.tags.map((tag: string, index: number) => (
                  <span key={index} className="bg-white/90 text-orange-600 px-3 py-1 rounded-full text-sm font-medium shadow-md">
                    🔥 {tag}
                  </span>
                ))}
              </div>
              <div className="absolute bottom-4 left-4">
                <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {viewedRestaurants.length + 1} of {restaurants.length} restaurants
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{currentRes.name}</h2>
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-lg">{currentRes.rating}</span>
                </div>
              </div>

              <p className="text-gray-600 mb-6 text-lg">
                {currentRes.description}
              </p>

              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2 text-gray-500">
                  <MapPin className="w-5 h-5" />
                  <span>{currentRes.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                  <Clock className="w-5 h-5" />
                  <span>{currentRes.duration}</span>
                </div>
              </div>

              <div className="flex space-x-4">
                <button 
                  onClick={handleSkip}
                  className="flex-1 flex items-center justify-center space-x-2 py-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all text-lg font-medium group"
                >
                  <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Skip</span>
                </button>
                <button 
                  onClick={handleLove}
                  className="flex-1 flex items-center justify-center space-x-2 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all text-lg font-medium group"
                >
                  <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Love It!</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Culinary Journey */}
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🍽️</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Your Culinary Journey</h3>
            <p className="text-gray-500 text-sm mb-4">
              {savedCount > 0 ? `${savedCount} restaurants saved!` : 'Start swiping to build your culinary adventure!'}
            </p>
            <div className="bg-gray-100 rounded-full h-2 mb-3">
              <div 
                className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((savedCount / 5) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-gray-400 text-xs">Swipe right to love, left to skip</p>
          </div>

          {/* Location Food Culture */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🥘</span>
              <h3 className="font-bold text-lg">{selectedLocation} Food Culture</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              {selectedLocation === 'Mumbai' && "Mumbai offers incredible street food and coastal cuisine with influences from Maharashtrian, Gujarati, and South Indian traditions."}
              {selectedLocation === 'Delhi' && "Delhi is a food paradise with rich Mughlai heritage, street food culture, and diverse regional cuisines from across India."}
              {selectedLocation === 'Goa' && "Goan cuisine blends Portuguese and Konkani flavors with fresh seafood, coconut, and aromatic spices creating unique coastal dishes."}
              {selectedLocation === 'Kerala' && "Kerala cuisine features coconut, curry leaves, and spices with emphasis on seafood, vegetarian dishes, and traditional breakfast items."}
              {selectedLocation === 'Rajasthan' && "Rajasthani cuisine is known for its rich, spicy flavors with dal baati churma, sweets, and royal heritage dishes."}
            </p>
            
            <div className="mb-4">
              <h4 className="font-semibold text-orange-600 mb-2">Must-Try Dishes:</h4>
              <div className="flex flex-wrap gap-2">
                {currentRes.mustTry.slice(0, 4).map((dish: string, index: number) => (
                  <span key={index} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                    {dish}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Location Stats */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="font-bold text-lg mb-4">📊 {selectedLocation} Food Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Restaurants Available</span>
                <span className="font-semibold">{restaurants.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Avg Rating</span>
                <span className="font-semibold">{(restaurants.reduce((sum, r) => sum + r.rating, 0) / restaurants.length).toFixed(1)} ⭐</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Cuisine Types</span>
                <span className="font-semibold">{new Set(restaurants.map(r => r.cuisine)).size}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Explored</span>
                <span className="font-semibold">{viewedRestaurants.length}/{restaurants.length}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
            <h3 className="font-bold text-lg mb-3">🎯 Quick Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={() => {
                  const nextIndex = getNextRestaurant();
                  setCurrentRestaurant(nextIndex);
                }}
                className="w-full bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                🔄 Show Another Restaurant
              </button>
              <button 
                onClick={() => {
                  setViewedRestaurants([]);
                  setCurrentRestaurant(0);
                }}
                className="w-full bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                🔄 Reset Exploration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDiscoveries;