import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import { placesDataService, PlaceInfo } from './placesDataService';

// Initialize Gemini AI
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'demo_key';
const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || 'demo_key';
const GOOGLE_CUSTOM_SEARCH_API_KEY = import.meta.env.VITE_GOOGLE_CUSTOM_SEARCH_API_KEY || 'demo_key';
const GOOGLE_CUSTOM_SEARCH_ENGINE_ID = import.meta.env.VITE_GOOGLE_CUSTOM_SEARCH_ENGINE_ID || 'demo_cx';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export interface TravelSuggestion {
  place: string;
  country: string;
  description: string;
  highlights: string[];
  bestFor: string[];
  searchTerm: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface PlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  price_level?: number;
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  types: string[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export interface TravelPlan {
  destination: string;
  budget: string;
  travelType: string;
  interests: string[];
  duration: number;
  days: DayPlan[];
  suggestions: TravelSuggestion[];
}

export interface DayPlan {
  day: number;
  date: string;
  theme: string;
  activities: Activity[];
  estimatedCost: number;
  tips: string[];
}

export interface Activity {
  time: string;
  type: 'attraction' | 'restaurant' | 'transport' | 'shopping' | 'experience';
  name: string;
  description: string;
  location: string;
  duration: string;
  cost: string;
  rating?: number;
  image: string;
  tips: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export class GeminiTravelService {
  private model: any;

  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  async generateTravelSuggestions(
    destination: string,
    budget: string,
    travelType: string,
    interests: string[],
    duration: number
  ): Promise<TravelSuggestion[]> {
    try {
      // First, try to find exact city match in our dataset
      const cityData = placesDataService.findCityData(destination);
      
      if (cityData) {
        // Generate suggestions based on the dataset
        return this.generateDatasetBasedSuggestions(cityData, interests, budget);
      }
      
      // If no exact match, get interest-based suggestions
      const interestSuggestions = placesDataService.getSuggestionsByInterests(interests, budget);
      
      if (interestSuggestions.length > 0) {
        return this.convertToTravelSuggestions(interestSuggestions.slice(0, 4), interests);
      }
      
      // Fallback to AI generation
      const prompt = this.createSuggestionPrompt(destination, budget, travelType, interests, duration);
      
      if (GEMINI_API_KEY !== 'demo_key') {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const suggestions = this.parseGeminiSuggestions(text);
        if (suggestions.length > 0) {
          return suggestions;
        }
      }
      
      // Final fallback to intelligent mock data
      return this.getIntelligentSuggestions(destination, interests, budget);
    } catch (error) {
      console.error('Error generating travel suggestions:', error);
      return this.getIntelligentSuggestions(destination, interests, budget);
    }
  }

  async generateTravelPlan(
    destination: string,
    budget: string,
    travelType: string,
    interests: string[],
    duration: number
  ): Promise<TravelPlan> {
    try {
      // Get travel suggestions first
      const suggestions = await this.generateTravelSuggestions(destination, budget, travelType, interests, duration);
      
      // Generate detailed day plans using dataset
      const days = await this.generateDatasetBasedDayPlans(destination, budget, travelType, interests, duration);
      
      return {
        destination,
        budget,
        travelType,
        interests,
        duration,
        days,
        suggestions
      };
    } catch (error) {
      console.error('Error generating travel plan:', error);
      return this.getIntelligentTravelPlan(destination, budget, travelType, interests, duration);
    }
  }

  private generateDatasetBasedSuggestions(
    cityData: any,
    interests: string[],
    budget: string
  ): TravelSuggestion[] {
    const suggestions: TravelSuggestion[] = [];
    
    // Add the main city as first suggestion
    const mainCityPlaces = cityData.popular_places.slice(0, 5);
    suggestions.push({
      place: cityData.city,
      country: 'India',
      description: this.generateCityDescription(cityData.city, cityData.state, mainCityPlaces),
      highlights: mainCityPlaces.slice(0, 3),
      bestFor: this.getCityBestFor(mainCityPlaces, interests),
      searchTerm: `${cityData.city} ${cityData.state} tourism`
    });
    
    // Add nearby cities from same state
    const nearbyCities = placesDataService.getNearbyCities(cityData.city);
    nearbyCities.slice(0, 3).forEach(nearbyCity => {
      const nearbyPlaces = nearbyCity.popular_places.slice(0, 3);
      suggestions.push({
        place: nearbyCity.city,
        country: 'India',
        description: this.generateCityDescription(nearbyCity.city, nearbyCity.state, nearbyPlaces),
        highlights: nearbyPlaces,
        bestFor: this.getCityBestFor(nearbyPlaces, interests),
        searchTerm: `${nearbyCity.city} ${nearbyCity.state} tourism`
      });
    });
    
    return suggestions;
  }

  private convertToTravelSuggestions(
    interestSuggestions: Array<{city: string, state: string, matchingPlaces: string[]}>,
    interests: string[]
  ): TravelSuggestion[] {
    return interestSuggestions.map(suggestion => ({
      place: suggestion.city,
      country: 'India',
      description: this.generateCityDescription(suggestion.city, suggestion.state, suggestion.matchingPlaces),
      highlights: suggestion.matchingPlaces.slice(0, 3),
      bestFor: this.getCityBestFor(suggestion.matchingPlaces, interests),
      searchTerm: `${suggestion.city} ${suggestion.state} tourism`
    }));
  }

  private generateCityDescription(city: string, state: string, places: string[]): string {
    const descriptions: { [key: string]: string } = {
      'Mumbai': 'The financial capital of India offers a perfect blend of colonial architecture, modern skyscrapers, and vibrant street life along the Arabian Sea coast.',
      'Delhi': 'India\'s capital city showcases 1000 years of history with magnificent Mughal monuments, bustling markets, and diverse culinary experiences.',
      'Bangalore': 'The Silicon Valley of India combines modern IT culture with beautiful parks, palaces, and a pleasant climate year-round.',
      'Chennai': 'The cultural capital of South India features classical music, dance, beautiful beaches, and rich Tamil heritage.',
      'Hyderabad': 'The City of Pearls blends historic Nizami culture with modern IT industry, famous for biryani and architectural marvels.',
      'Kolkata': 'The cultural capital of India offers rich literary heritage, colonial architecture, and vibrant festivals.',
      'Jaipur': 'The Pink City showcases royal Rajasthani architecture, vibrant markets, and majestic palaces.',
      'Pune': 'The cultural capital of Maharashtra combines rich history, pleasant weather, and modern education hubs.',
      'Ahmedabad': 'The first UNESCO World Heritage City of India features stunning architecture, textile heritage, and Gujarati culture.',
      'Visakhapatnam': 'The Jewel of the East Coast offers beautiful beaches, scenic hills, and rich maritime heritage.'
    };

    if (descriptions[city]) {
      return descriptions[city];
    }

    // Generate description based on places
    const categories = places.map(place => placesDataService.getPlaceInfo(place, city).category);
    const uniqueCategories = [...new Set(categories)];
    
    return `${city} in ${state} offers diverse experiences including ${uniqueCategories.join(', ').toLowerCase()} attractions, making it perfect for cultural exploration and memorable travel experiences.`;
  }

  private getCityBestFor(places: string[], interests: string[]): string[] {
    const categories = places.map(place => {
      const info = placesDataService.getPlaceInfo(place, '');
      return info.category;
    });
    
    const uniqueCategories = [...new Set(categories)];
    const bestFor: string[] = [];
    
    // Map categories to interests
    uniqueCategories.forEach(category => {
      switch (category.toLowerCase()) {
        case 'historical':
          bestFor.push('History', 'Culture');
          break;
        case 'religious':
          bestFor.push('Culture', 'Spiritual');
          break;
        case 'nature':
          bestFor.push('Nature', 'Photography');
          break;
        case 'shopping':
          bestFor.push('Shopping', 'Culture');
          break;
        case 'entertainment':
          bestFor.push('Adventure', 'Family');
          break;
        default:
          bestFor.push('Culture');
      }
    });
    
    // Add matching interests
    interests.forEach(interest => {
      if (!bestFor.includes(interest)) {
        bestFor.push(interest);
      }
    });
    
    return [...new Set(bestFor)].slice(0, 4);
  }

  private async generateDatasetBasedDayPlans(
    destination: string,
    budget: string,
    travelType: string,
    interests: string[],
    duration: number
  ): Promise<DayPlan[]> {
    const cityData = placesDataService.findCityData(destination);
    
    if (!cityData) {
      return this.generateIntelligentDayPlans(destination, budget, travelType, interests, duration);
    }
    
    const days: DayPlan[] = [];
    const availablePlaces = cityData.popular_places;
    
    for (let i = 0; i < duration; i++) {
      const dayPlan = this.generateDatasetBasedSingleDay(
        i + 1,
        cityData,
        availablePlaces,
        budget,
        travelType,
        interests
      );
      days.push(dayPlan);
    }
    
    return days;
  }

  private generateDatasetBasedSingleDay(
    dayNumber: number,
    cityData: any,
    availablePlaces: string[],
    budget: string,
    travelType: string,
    interests: string[]
  ): DayPlan {
    const themes = [
      "Cultural Heritage & Historical Exploration",
      "Local Cuisine & Market Discovery", 
      "Nature & Scenic Beauty",
      "Shopping & Local Crafts",
      "Adventure & Unique Experiences"
    ];

    const theme = themes[(dayNumber - 1) % themes.length];
    
    // Select places based on theme and interests
    const dayPlaces = this.selectPlacesForDay(availablePlaces, theme, interests, dayNumber);
    
    // Generate activities using selected places
    const activities = this.generateActivitiesFromPlaces(dayPlaces, cityData.city, budget);
    
    const estimatedCost = this.calculateDayCost(activities, budget);
    const tips = this.generateLocationSpecificTips(cityData.city, theme, travelType);

    return {
      day: dayNumber,
      date: this.getDateString(dayNumber),
      theme,
      activities,
      estimatedCost,
      tips
    };
  }

  private selectPlacesForDay(places: string[], theme: string, interests: string[], dayNumber: number): string[] {
    const selectedPlaces: string[] = [];
    
    // Filter places based on theme
    const filteredPlaces = places.filter(place => {
      const category = placesDataService.getPlaceInfo(place, '').category.toLowerCase();
      
      if (theme.includes('Cultural') || theme.includes('Historical')) {
        return category.includes('historical') || category.includes('religious');
      }
      if (theme.includes('Nature') || theme.includes('Scenic')) {
        return category.includes('nature');
      }
      if (theme.includes('Shopping')) {
        return category.includes('shopping');
      }
      if (theme.includes('Adventure')) {
        return category.includes('entertainment') || category.includes('nature');
      }
      
      return true; // Include all for cuisine day
    });
    
    // Select 2-3 places for the day
    const placesToSelect = Math.min(3, filteredPlaces.length);
    const startIndex = ((dayNumber - 1) * 2) % filteredPlaces.length;
    
    for (let i = 0; i < placesToSelect; i++) {
      const index = (startIndex + i) % filteredPlaces.length;
      selectedPlaces.push(filteredPlaces[index]);
    }
    
    // If not enough places, add from remaining
    if (selectedPlaces.length < 2 && places.length > selectedPlaces.length) {
      const remaining = places.filter(p => !selectedPlaces.includes(p));
      selectedPlaces.push(remaining[0]);
    }
    
    return selectedPlaces;
  }

  private generateActivitiesFromPlaces(places: string[], city: string, budget: string): Activity[] {
    const activities: Activity[] = [];
    const timeSlots = [
      { time: '09:00 AM', type: 'attraction' as const },
      { time: '12:30 PM', type: 'restaurant' as const },
      { time: '02:30 PM', type: 'attraction' as const },
      { time: '06:00 PM', type: 'experience' as const },
      { time: '08:00 PM', type: 'restaurant' as const }
    ];

    timeSlots.forEach((slot, index) => {
      if (slot.type === 'attraction' && places.length > 0) {
        const placeIndex = Math.floor(index / 2) % places.length;
        const place = places[placeIndex];
        const placeInfo = placesDataService.getPlaceInfo(place, city);
        
        activities.push({
          time: slot.time,
          type: slot.type,
          name: placeInfo.name,
          description: placeInfo.description,
          location: `${placeInfo.city}, ${placeInfo.state}`,
          duration: placeInfo.duration,
          cost: placeInfo.cost,
          rating: placeInfo.rating,
          image: placeInfo.image,
          tips: placeInfo.tips,
          coordinates: this.getCoordinatesForCity(city)
        });
      } else if (slot.type === 'restaurant') {
        activities.push(this.generateRestaurantActivity(slot.time, city, budget));
      } else if (slot.type === 'experience') {
        activities.push(this.generateExperienceActivity(slot.time, city, places));
      }
    });

    return activities;
  }

  private generateRestaurantActivity(time: string, city: string, budget: string): Activity {
    const restaurants: { [key: string]: any[] } = {
      mumbai: [
        {
          name: 'Trishna Restaurant',
          description: 'Award-winning seafood restaurant with contemporary Indian coastal cuisine',
          location: 'Fort, Mumbai'
        },
        {
          name: 'Britannia & Co.',
          description: 'Historic Parsi cafe serving authentic berry pulao since 1923',
          location: 'Ballard Estate, Mumbai'
        }
      ],
      delhi: [
        {
          name: 'Karim\'s Restaurant',
          description: 'Legendary Mughlai restaurant serving authentic kebabs since 1913',
          location: 'Jama Masjid, Delhi'
        },
        {
          name: 'Paranthe Wali Gali',
          description: 'Famous lane serving stuffed paranthas with traditional accompaniments',
          location: 'Chandni Chowk, Delhi'
        }
      ],
      hyderabad: [
        {
          name: 'Paradise Restaurant',
          description: 'Iconic restaurant famous for authentic Hyderabadi biryani',
          location: 'Secunderabad, Hyderabad'
        }
      ]
    };

    const cityKey = city.toLowerCase();
    const cityRestaurants = restaurants[cityKey] || restaurants.mumbai;
    const restaurant = cityRestaurants[Math.floor(Math.random() * cityRestaurants.length)];

    return {
      time,
      type: 'restaurant',
      name: restaurant.name,
      description: restaurant.description,
      location: restaurant.location,
      duration: '1-1.5 hours',
      cost: this.getBudgetCost(budget, 'restaurant'),
      rating: 4.2 + Math.random() * 0.6,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
      tips: ['Try the signature dishes', 'Book in advance during peak hours', 'Ask for local recommendations']
    };
  }

  private generateExperienceActivity(time: string, city: string, places: string[]): Activity {
    const experiences: { [key: string]: any } = {
      mumbai: {
        name: 'Marine Drive Sunset Walk',
        description: 'Stroll along the Queen\'s Necklace and watch the sunset over Arabian Sea',
        location: 'Marine Drive, Mumbai'
      },
      delhi: {
        name: 'India Gate Evening Stroll',
        description: 'Enjoy the illuminated war memorial and surrounding gardens',
        location: 'Rajpath, Delhi'
      },
      hyderabad: {
        name: 'Hussain Sagar Lake Boat Ride',
        description: 'Scenic boat ride with views of Buddha statue and city skyline',
        location: 'Hussain Sagar, Hyderabad'
      }
    };

    const cityKey = city.toLowerCase();
    const experience = experiences[cityKey] || experiences.mumbai;

    return {
      time,
      type: 'experience',
      name: experience.name,
      description: experience.description,
      location: experience.location,
      duration: '1-2 hours',
      cost: 'Free',
      rating: 4.3 + Math.random() * 0.5,
      image: 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=600',
      tips: ['Best time is during sunset', 'Carry camera for photos', 'Try local street food nearby']
    };
  }

  private getCoordinatesForCity(city: string): { lat: number; lng: number } {
    const coordinates: { [key: string]: { lat: number; lng: number } } = {
      mumbai: { lat: 19.0760, lng: 72.8777 },
      delhi: { lat: 28.6139, lng: 77.2090 },
      bangalore: { lat: 12.9716, lng: 77.5946 },
      chennai: { lat: 13.0827, lng: 80.2707 },
      hyderabad: { lat: 17.3850, lng: 78.4867 },
      kolkata: { lat: 22.5726, lng: 88.3639 },
      jaipur: { lat: 26.9124, lng: 75.7873 },
      pune: { lat: 18.5204, lng: 73.8567 },
      ahmedabad: { lat: 23.0225, lng: 72.5714 },
      visakhapatnam: { lat: 17.6868, lng: 83.2185 }
    };

    const cityKey = city.toLowerCase();
    return coordinates[cityKey] || coordinates.mumbai;
  }

  // Keep existing methods for backward compatibility
  private createSuggestionPrompt(
    destination: string,
    budget: string,
    travelType: string,
    interests: string[],
    duration: number
  ): string {
    return `
      Generate 3-5 travel destination suggestions for a ${duration}-day trip based on "${destination}" with the following preferences:
      
      Budget: ${budget}
      Travel Type: ${travelType}
      Interests: ${interests.join(', ')}
      
      If the destination is a specific city/place, suggest similar places or nearby destinations.
      If the destination is a region/country, suggest specific cities/places within that area.
      
      For each suggestion, provide:
      1. Place name and country
      2. Brief description (2-3 sentences)
      3. Top 3 highlights
      4. What it's best for (matching the interests)
      5. Why it's perfect for ${travelType} travelers
      
      Format as JSON array:
      [
        {
          "place": "City Name",
          "country": "Country",
          "description": "Description here",
          "highlights": ["Highlight 1", "Highlight 2", "Highlight 3"],
          "bestFor": ["Interest 1", "Interest 2"],
          "searchTerm": "search term for images"
        }
      ]
      
      Focus on authentic, diverse experiences that match the ${budget} budget level.
    `;
  }

  private parseGeminiSuggestions(text: string): TravelSuggestion[] {
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const suggestions = JSON.parse(jsonMatch[0]);
        return suggestions.map((s: any) => ({
          place: s.place || s.name || 'Unknown Place',
          country: s.country || 'Unknown Country',
          description: s.description || 'No description available',
          highlights: s.highlights || [],
          bestFor: s.bestFor || [],
          searchTerm: s.searchTerm || s.place || 'travel destination'
        }));
      }
    } catch (error) {
      console.error('Error parsing Gemini suggestions:', error);
    }
    return [];
  }

  private getIntelligentSuggestions(destination: string, interests: string[], budget: string): TravelSuggestion[] {
    // Use dataset-based suggestions as fallback
    const interestSuggestions = placesDataService.getSuggestionsByInterests(interests, budget);
    
    if (interestSuggestions.length > 0) {
      return this.convertToTravelSuggestions(interestSuggestions.slice(0, 4), interests);
    }
    
    // Final fallback to major cities
    const majorCities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai'];
    return majorCities.map(city => {
      const cityData = placesDataService.findCityData(city);
      if (cityData) {
        return {
          place: city,
          country: 'India',
          description: this.generateCityDescription(city, cityData.state, cityData.popular_places),
          highlights: cityData.popular_places.slice(0, 3),
          bestFor: this.getCityBestFor(cityData.popular_places, interests),
          searchTerm: `${city} tourism`
        };
      }
      return {
        place: city,
        country: 'India',
        description: `Explore the vibrant culture and attractions of ${city}`,
        highlights: ['Cultural sites', 'Local cuisine', 'Shopping'],
        bestFor: interests.slice(0, 2),
        searchTerm: `${city} tourism`
      };
    });
  }

  private generateIntelligentDayPlans(
    destination: string,
    budget: string,
    travelType: string,
    interests: string[],
    duration: number
  ): DayPlan[] {
    const days: DayPlan[] = [];
    
    for (let i = 0; i < duration; i++) {
      const dayPlan = this.generateIntelligentSingleDay(
        i + 1,
        destination,
        budget,
        travelType,
        interests
      );
      days.push(dayPlan);
    }
    
    return days;
  }

  private generateIntelligentSingleDay(
    dayNumber: number,
    destination: string,
    budget: string,
    travelType: string,
    interests: string[]
  ): DayPlan {
    const themes = [
      "Cultural Heritage & Historical Exploration",
      "Local Cuisine & Market Discovery",
      "Nature & Scenic Beauty",
      "Shopping & Local Crafts",
      "Adventure & Unique Experiences"
    ];

    const theme = themes[(dayNumber - 1) % themes.length];
    const activities = this.getLocationSpecificActivities(destination, budget, interests, dayNumber);
    const estimatedCost = this.calculateDayCost(activities, budget);
    const tips = this.generateLocationSpecificTips(destination, theme, travelType);

    return {
      day: dayNumber,
      date: this.getDateString(dayNumber),
      theme,
      activities,
      estimatedCost,
      tips
    };
  }

  private getLocationSpecificActivities(destination: string, budget: string, interests: string[], dayNumber: number): Activity[] {
    // Try to get activities from dataset first
    const cityData = placesDataService.findCityData(destination);
    
    if (cityData && cityData.popular_places.length > 0) {
      return this.generateActivitiesFromPlaces(
        cityData.popular_places.slice(0, 3),
        cityData.city,
        budget
      );
    }
    
    // Fallback to generic activities
    return this.generateGenericActivities(destination, budget);
  }

  private generateGenericActivities(destination: string, budget: string): Activity[] {
    const activities: Activity[] = [];
    const timeSlots = [
      { time: '09:00 AM', type: 'attraction' as const },
      { time: '12:30 PM', type: 'restaurant' as const },
      { time: '02:30 PM', type: 'attraction' as const },
      { time: '06:00 PM', type: 'experience' as const },
      { time: '08:00 PM', type: 'restaurant' as const }
    ];

    timeSlots.forEach(slot => {
      activities.push({
        time: slot.time,
        type: slot.type,
        name: `${destination} ${slot.type === 'attraction' ? 'Landmark' : slot.type === 'restaurant' ? 'Restaurant' : 'Experience'}`,
        description: `Explore the best ${slot.type} that ${destination} has to offer`,
        location: destination,
        duration: slot.type === 'restaurant' ? '1-1.5 hours' : '1-2 hours',
        cost: this.getBudgetCost(budget, slot.type),
        rating: 4.0 + Math.random() * 0.8,
        image: this.getDefaultImage(slot.type),
        tips: ['Plan ahead', 'Carry water', 'Enjoy the experience']
      });
    });

    return activities;
  }

  private getBudgetCost(budget: string, type: Activity['type']): string {
    const costRanges = {
      Budget: {
        restaurant: '₹300-800',
        attraction: '₹50-200',
        shopping: '₹500-1500',
        experience: '₹200-600',
        transport: '₹100-300'
      },
      'Mid-range': {
        restaurant: '₹800-2000',
        attraction: '₹200-500',
        shopping: '₹1500-4000',
        experience: '₹600-1500',
        transport: '₹300-800'
      },
      Luxury: {
        restaurant: '₹2000-6000',
        attraction: '₹500-1500',
        shopping: '₹4000-12000',
        experience: '₹1500-5000',
        transport: '₹800-2000'
      }
    };

    return costRanges[budget as keyof typeof costRanges]?.[type] || '₹500-1000';
  }

  private getDefaultImage(type: Activity['type']): string {
    const imageMap = {
      attraction: 'https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=600',
      restaurant: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
      shopping: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=600',
      experience: 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=600',
      transport: 'https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=600'
    };

    return imageMap[type];
  }

  private generateLocationSpecificTips(destination: string, theme: string, travelType: string): string[] {
    const cityData = placesDataService.findCityData(destination);
    
    if (cityData) {
      const cityKey = cityData.city.toLowerCase();
      const destinationTips: { [key: string]: string[] } = {
        mumbai: [
          "Use local trains during off-peak hours to avoid crowds",
          "Try street food from busy stalls for the freshest options",
          "Carry cash as many local vendors don't accept cards"
        ],
        delhi: [
          "Use the Delhi Metro for efficient city travel",
          "Bargain at markets like Chandni Chowk and Karol Bagh",
          "Stay hydrated and wear comfortable walking shoes"
        ],
        bangalore: [
          "Weather is pleasant year-round, perfect for outdoor activities",
          "Use ride-sharing apps for convenient transportation",
          "Explore local pubs and cafes in the evening"
        ],
        hyderabad: [
          "Don't miss the famous Hyderabadi biryani",
          "Visit Charminar area in the evening for best experience",
          "Use Hyderabad Metro for easy city navigation"
        ]
      };

      return destinationTips[cityKey] || [
        "Plan your visit during cooler hours",
        "Carry water and wear comfortable shoes",
        "Respect local customs and traditions"
      ];
    }

    return [
      "Research local customs before visiting",
      "Keep emergency contacts handy",
      "Try authentic local cuisine"
    ];
  }

  private calculateDayCost(activities: Activity[], budget: string): number {
    const budgetMultipliers = {
      'Budget': 0.7,
      'Mid-range': 1.0,
      'Luxury': 1.8
    };

    const baseCost = activities.reduce((total, activity) => {
      if (activity.cost === 'Free') return total;
      
      const costMatch = activity.cost.match(/₹(\d+)/);
      const cost = costMatch ? parseInt(costMatch[1]) : 500;
      
      return total + cost;
    }, 0);

    return Math.round(baseCost * budgetMultipliers[budget as keyof typeof budgetMultipliers]);
  }

  private getDateString(dayNumber: number): string {
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + dayNumber - 1);
    
    return targetDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private getIntelligentTravelPlan(
    destination: string,
    budget: string,
    travelType: string,
    interests: string[],
    duration: number
  ): TravelPlan {
    return {
      destination,
      budget,
      travelType,
      interests,
      duration,
      days: this.generateIntelligentDayPlans(destination, budget, travelType, interests, duration),
      suggestions: this.getIntelligentSuggestions(destination, interests, budget)
    };
  }
}

export const geminiTravelService = new GeminiTravelService();