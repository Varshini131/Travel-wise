import React, { useState } from 'react';
import { Brain, Search, MapPin, Target, Calendar, Clock, DollarSign, Star, Navigation, Sparkles, Globe, Zap, CheckCircle } from 'lucide-react';
import { enhancedGeminiTravelService, EnhancedTravelPlan, EnhancedTravelSuggestion } from '../services/enhancedGeminiService';
import { placesDataService } from '../services/placesDataService';

const AIPlanner: React.FC = () => {
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('Mid-range');
  const [travelType, setTravelType] = useState('Couple');
  const [duration, setDuration] = useState(3);
  const [selectedInterests, setSelectedInterests] = useState(['Culture', 'Food']);
  const [isPlanning, setIsPlanning] = useState(false);
  const [travelPlan, setTravelPlan] = useState<EnhancedTravelPlan | null>(null);
  const [suggestions, setSuggestions] = useState<EnhancedTravelSuggestion[]>([]);
  const [showPlan, setShowPlan] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);

  const interests = [
    { id: 'culture', label: 'Culture' },
    { id: 'food', label: 'Food' },
    { id: 'nature', label: 'Nature' },
    { id: 'shopping', label: 'Shopping' },
    { id: 'adventure', label: 'Adventure' },
    { id: 'relaxation', label: 'Relaxation' },
    { id: 'photography', label: 'Photography' },
    { id: 'history', label: 'History' },
    { id: 'beach', label: 'Beach' },
    { id: 'nightlife', label: 'Nightlife' },
    { id: 'spiritual', label: 'Spiritual' }
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleDestinationChange = (value: string) => {
    setDestination(value);
    
    if (value.length > 1) {
      const cities = placesDataService.getAllCities();
      const filtered = cities.filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setSearchSuggestions(filtered);
    } else {
      setSearchSuggestions([]);
    }
  };

  const selectDestination = (city: string) => {
    setDestination(city);
    setSearchSuggestions([]);
  };

  const handleGetSuggestions = async () => {
    if (!destination.trim()) {
      alert('Please enter a destination to get suggestions!');
      return;
    }

    setIsPlanning(true);
    setShowSuggestions(false);

    try {
      const newSuggestions = await enhancedGeminiTravelService.generateEnhancedTravelSuggestions(
        destination,
        budget,
        travelType,
        selectedInterests,
        duration
      );
      
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
      
      const message = document.createElement('div');
      message.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      message.innerHTML = `
        <div class="flex items-center space-x-2">
          <span>🌟 Found ${newSuggestions.length} enhanced destinations!</span>
        </div>
      `;
      document.body.appendChild(message);
      
      setTimeout(() => {
        if (document.body.contains(message)) {
          document.body.removeChild(message);
        }
      }, 4000);
      
    } catch (error) {
      console.error('Error generating suggestions:', error);
      alert('Sorry, there was an error getting suggestions. Please try again.');
    } finally {
      setIsPlanning(false);
    }
  };

  const handlePlan = async () => {
    if (!destination.trim()) {
      alert('Please enter a destination to start planning!');
      return;
    }

    setIsPlanning(true);
    setShowPlan(false);

    try {
      const plan = await enhancedGeminiTravelService.generateEnhancedTravelPlan(
        destination,
        budget,
        travelType,
        selectedInterests,
        duration
      );
      
      setTravelPlan(plan);
      setShowPlan(true);
      setShowSuggestions(false);
      
      const message = document.createElement('div');
      message.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      message.innerHTML = `
        <div class="flex items-center space-x-2">
          <span>✅ Enhanced ${duration}-day plan created with ${plan.confidence}% confidence!</span>
        </div>
      `;
      document.body.appendChild(message);
      
      setTimeout(() => {
        if (document.body.contains(message)) {
          document.body.removeChild(message);
        }
      }, 4000);
      
    } catch (error) {
      console.error('Error generating travel plan:', error);
      alert('Sorry, there was an error generating your travel plan. Please try again.');
    } finally {
      setIsPlanning(false);
    }
  };

  const selectSuggestion = (suggestion: EnhancedTravelSuggestion) => {
    setDestination(suggestion.place);
    setShowSuggestions(false);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'attraction': return <MapPin className="w-4 h-4" />;
      case 'restaurant': return <span className="text-sm">🍽️</span>;
      case 'shopping': return <span className="text-sm">🛍️</span>;
      case 'experience': return <span className="text-sm">✨</span>;
      case 'transport': return <Navigation className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'attraction': return 'bg-blue-100 text-blue-600';
      case 'restaurant': return 'bg-orange-100 text-orange-600';
      case 'shopping': return 'bg-purple-100 text-purple-600';
      case 'experience': return 'bg-green-100 text-green-600';
      case 'transport': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'dataset': return <CheckCircle className="w-4 h-4" />;
      case 'ai': return <Brain className="w-4 h-4" />;
      case 'hybrid': return <Zap className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  // Show enhanced suggestions view (without images)
  if (showSuggestions && suggestions.length > 0) {
    return (
      <div className="max-w-6xl mx-auto">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Enhanced AI Travel Suggestions</h1>
              <p className="text-blue-100 text-lg mb-4">Powered by Advanced Dataset Intelligence & Google Gemini AI</p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>{budget} Budget</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">👥</span>
                  <span>{travelType} Travel</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{duration} Days</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Smart Recommendations</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowSuggestions(false)}
              className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Back to Planning
            </button>
          </div>
        </div>

        {/* Enhanced Suggestions Grid (without images) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Header with badges only */}
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {suggestion.country}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getConfidenceColor(suggestion.confidence)}`}>
                    {getSourceIcon(suggestion.source)}
                    <span>{suggestion.confidence} confidence</span>
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{suggestion.place}</h3>
              </div>

              <div className="p-6">
                <p className="text-gray-600 mb-4">{suggestion.description}</p>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Top Highlights:</h4>
                  <div className="flex flex-wrap gap-2">
                    {suggestion.highlights.map((highlight, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Perfect For:</h4>
                  <div className="flex flex-wrap gap-2">
                    {suggestion.bestFor.map((item, idx) => (
                      <span key={idx} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {suggestion.rating && (
                  <div className="mb-4 flex items-center space-x-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-lg">{suggestion.rating.toFixed(1)}</span>
                    <span className="text-gray-500 text-sm">Average Rating</span>
                  </div>
                )}

                <button
                  onClick={() => selectSuggestion(suggestion)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Plan Enhanced Trip to {suggestion.place}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show enhanced detailed plan view (without images)
  if (showPlan && travelPlan) {
    return (
      <div className="max-w-6xl mx-auto">
        {/* Enhanced Plan Header */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Your Enhanced {travelPlan.duration}-Day Trip</h1>
              <p className="text-purple-100 text-lg mb-4">{travelPlan.destination}</p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>{travelPlan.budget} Budget</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">👥</span>
                  <span>{travelPlan.travelType} Travel</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{travelPlan.duration} Days</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>{travelPlan.confidence}% AI Confidence</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowPlan(false)}
              className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Plan New Trip
            </button>
          </div>
        </div>

        {/* Enhanced Daily Plans (without images) */}
        <div className="space-y-8">
          {travelPlan.days.map((day) => (
            <div key={day.day} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Enhanced Day Header */}
              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Day {day.day}</h2>
                    <p className="text-teal-100">{day.date}</p>
                    <p className="text-teal-100 font-medium mt-1">{day.theme}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">₹{day.estimatedCost.toLocaleString()}</div>
                    <div className="text-teal-100 text-sm">Estimated Cost</div>
                  </div>
                </div>
              </div>

              {/* Enhanced Activities (without images) */}
              <div className="p-6">
                <div className="space-y-6">
                  {day.activities.map((activity, index) => (
                    <div key={index} className="flex space-x-4">
                      {/* Time */}
                      <div className="flex-shrink-0 w-20 text-center">
                        <div className="bg-gray-100 rounded-lg p-2">
                          <Clock className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                          <div className="text-xs font-medium text-gray-600">{activity.time}</div>
                        </div>
                      </div>

                      {/* Enhanced Activity Card (without images) */}
                      <div className="flex-1 bg-gray-50 rounded-xl p-4">
                        <div className="flex items-start space-x-4">
                          {/* Activity Icon */}
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                            {getActivityIcon(activity.type)}
                          </div>

                          {/* Activity Details */}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-bold text-lg text-gray-900">{activity.name}</h3>
                              {activity.rating && (
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-medium">{activity.rating.toFixed(1)}</span>
                                </div>
                              )}
                              {activity.confidence && (
                                <span className={`px-2 py-1 rounded-full text-xs ${getConfidenceColor(activity.confidence)}`}>
                                  {activity.confidence}
                                </span>
                              )}
                            </div>

                            <p className="text-gray-600 mb-3">{activity.description}</p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                              <div className="flex items-center space-x-2 text-gray-500">
                                <MapPin className="w-4 h-4" />
                                <span>{activity.location}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-gray-500">
                                <Clock className="w-4 h-4" />
                                <span>{activity.duration}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-gray-500">
                                <DollarSign className="w-4 h-4" />
                                <span>{activity.cost}</span>
                              </div>
                            </div>

                            {/* Map Link */}
                            {activity.mapLink && (
                              <div className="mb-3">
                                <a 
                                  href={activity.mapLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  <MapPin className="w-4 h-4" />
                                  <span>View on Google Maps</span>
                                </a>
                              </div>
                            )}

                            {/* Tips */}
                            {activity.tips && activity.tips.length > 0 && (
                              <div className="mt-3">
                                <h4 className="text-sm font-semibold text-gray-700 mb-1">💡 Smart Tips:</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {activity.tips.map((tip, tipIndex) => (
                                    <li key={tipIndex} className="flex items-start space-x-1">
                                      <span className="text-gray-400">•</span>
                                      <span>{tip}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Day Tips */}
                {day.tips.length > 0 && (
                  <div className="mt-6 bg-blue-50 rounded-xl p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">🎯 Day {day.day} Smart Tips:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      {day.tips.map((tip, index) => (
                        <li key={index} className="flex items-start space-x-1">
                          <span className="text-blue-400">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Plan Summary */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Enhanced Trip Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                ₹{travelPlan.days.reduce((total, day) => total + day.estimatedCost, 0).toLocaleString()}
              </div>
              <div className="text-gray-600">Total Estimated Cost</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {travelPlan.days.reduce((total, day) => total + day.activities.length, 0)}
              </div>
              <div className="text-gray-600">Activities Planned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{travelPlan.duration}</div>
              <div className="text-gray-600">Days of Adventure</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{travelPlan.confidence}%</div>
              <div className="text-gray-600">AI Confidence</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main planning interface
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Enhanced AI Travel Planner</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Create personalized travel itineraries with real places from our comprehensive dataset, powered by Google Gemini AI and intelligent location matching
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="space-y-6">
          {/* Destination Search */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <MapPin className="w-5 h-5 text-blue-500" />
              <label className="font-semibold text-gray-900">Where do you want to explore?</label>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={destination}
                onChange={(e) => handleDestinationChange(e.target.value)}
                placeholder="Enter city name (e.g., Mumbai, Delhi, Bangalore)..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
              
              {/* Search Suggestions Dropdown */}
              {searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
                  {searchSuggestions.map((city, index) => (
                    <button
                      key={index}
                      onClick={() => selectDestination(city)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{city}</span>
                      <span className="text-sm text-gray-500 ml-auto">
                        {placesDataService.findCityData(city)?.state}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              🎯 Smart suggestions from our dataset of {placesDataService.getAllCities().length} cities across India
            </p>
          </div>

          {/* Travel Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block font-semibold text-gray-900 mb-3">Budget</label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Budget">Budget (₹1000-3000/day)</option>
                <option value="Mid-range">Mid-range (₹3000-8000/day)</option>
                <option value="Luxury">Luxury (₹8000+/day)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-900 mb-3">Travel Type</label>
              <select
                value={travelType}
                onChange={(e) => setTravelType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Solo">Solo Traveler</option>
                <option value="Couple">Couple</option>
                <option value="Family">Family with Kids</option>
                <option value="Friends">Group of Friends</option>
                <option value="Business">Business Travel</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-900 mb-3">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>1 Day</option>
                <option value={2}>2 Days</option>
                <option value={3}>3 Days</option>
                <option value={4}>4 Days</option>
                <option value={5}>5 Days</option>
                <option value={7}>1 Week</option>
                <option value={10}>10 Days</option>
                <option value={14}>2 Weeks</option>
              </select>
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block font-semibold text-gray-900 mb-4">What interests you?</label>
            <div className="flex flex-wrap gap-3">
              {interests.map((interest) => (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.label)}
                  className={`px-6 py-3 rounded-full font-medium transition-all ${
                    selectedInterests.includes(interest.label)
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {interest.label}
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="pt-6 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleGetSuggestions}
              disabled={isPlanning}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-lg flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isPlanning ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Getting Smart Suggestions...</span>
                </>
              ) : (
                <>
                  <Globe className="w-5 h-5" />
                  <span>Get Smart Suggestions</span>
                </>
              )}
            </button>

            <button 
              onClick={handlePlan}
              disabled={isPlanning}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-lg flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isPlanning ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Enhanced Plan...</span>
                </>
              ) : (
                <>
                  <Target className="w-5 h-5" />
                  <span>Generate Enhanced AI Plan</span>
                </>
              )}
            </button>
          </div>

          {/* Enhanced Features */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">✨ Enhanced with Advanced AI & Smart Data:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Real places from verified dataset</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>AI-powered destination matching</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Multi-layered fallback system</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Confidence scoring for all suggestions</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Smart itinerary optimization</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Local tips and insider recommendations</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPlanner;