import { GoogleGenerativeAI } from '@google/generative-ai';
import { placesDataService } from './placesDataService';
import { accurateImageService } from './accurateImageService';
import { googlePlacesApiService } from './googlePlacesApiService';

// Enhanced Gemini service with Google Places API integration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'demo_key';
const genAI = GEMINI_API_KEY && GEMINI_API_KEY !== 'demo_key' && GEMINI_API_KEY !== 'your_gemini_api_key_here' 
  ? new GoogleGenerativeAI(GEMINI_API_KEY) 
  : null;

export interface EnhancedTravelSuggestion {
  place: string;
  country: string;
  description: string;
  highlights: string[];
  bestFor: string[];
  images: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  confidence: 'high' | 'medium' | 'low';
  source: 'dataset' | 'ai' | 'hybrid' | 'places_api';
  placeId?: string;
  rating?: number;
}

export interface EnhancedActivity {
  time: string;
  type: 'attraction' | 'restaurant' | 'transport' | 'shopping' | 'experience';
  name: string;
  description: string;
  location: string;
  duration: string;
  cost: string;
  rating?: number;
  images: string[];
  tips: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  confidence: 'high' | 'medium' | 'low';
  placeId?: string;
  mapLink?: string;
}

export interface EnhancedTravelPlan {
  destination: string;
  budget: string;
  travelType: string;
  interests: string[];
  duration: number;
  days: EnhancedDayPlan[];
  suggestions: EnhancedTravelSuggestion[];
  confidence: number;
}

export interface EnhancedDayPlan {
  day: number;
  date: string;
  theme: string;
  activities: EnhancedActivity[];
  estimatedCost: number;
  tips: string[];
  images: string[];
}

export class EnhancedGeminiTravelService {
  private model: any;
  private isApiKeyValid: boolean;

  constructor() {
    this.isApiKeyValid = genAI !== null;
    this.model = this.isApiKeyValid ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;
  }

  async generateEnhancedTravelSuggestions(
    destination: string,
    budget: string,
    travelType: string,
    interests: string[],
    duration: number
  ): Promise<EnhancedTravelSuggestion[]> {
    try {
      // Step 1: Try Google Places API integration first (highest confidence)
      const placesApiSuggestions = await this.getPlacesApiBasedSuggestions(destination, interests, budget);
      
      if (placesApiSuggestions.length > 0) {
        return placesApiSuggestions;
      }

      // Step 2: Try dataset-based suggestions (high confidence)
      const datasetSuggestions = await this.getDatasetBasedSuggestions(destination, interests, budget);
      
      if (datasetSuggestions.length > 0) {
        return datasetSuggestions;
      }

      // Step 3: Use AI for broader suggestions (medium confidence) - only if API key is valid
      if (this.isApiKeyValid) {
        const aiSuggestions = await this.getAIBasedSuggestions(destination, budget, travelType, interests, duration);
        
        if (aiSuggestions.length > 0) {
          return aiSuggestions;
        }
      }

      // Step 4: Fallback to intelligent defaults (low confidence)
      return this.getFallbackSuggestions(destination, interests, budget);

    } catch (error) {
      console.error('Error generating enhanced travel suggestions:', error);
      return this.getFallbackSuggestions(destination, interests, budget);
    }
  }

  private async getPlacesApiBasedSuggestions(
    destination: string,
    interests: string[],
    budget: string
  ): Promise<EnhancedTravelSuggestion[]> {
    try {
      // Use Google Places API to get real place suggestions
      const placesResults = await googlePlacesApiService.showSuggestions(destination, interests);
      
      if (placesResults.length > 0) {
        const suggestions: EnhancedTravelSuggestion[] = [];
        
        // Group places by city and create suggestions
        const cityGroups: { [city: string]: any[] } = {};
        placesResults.forEach(place => {
          const city = destination; // Use the searched destination as city
          if (!cityGroups[city]) cityGroups[city] = [];
          cityGroups[city].push(place);
        });

        for (const [city, places] of Object.entries(cityGroups)) {
          const highlights = places.slice(0, 4).map(p => p.name);
          const images = places.slice(0, 3).map(p => p.photo);
          
          suggestions.push({
            place: city,
            country: 'India',
            description: await this.generateEnhancedDescription(city, 'India', highlights),
            highlights,
            bestFor: this.getBestForFromInterests(interests),
            images,
            coordinates: this.getCityCoordinates(city),
            confidence: 'high',
            source: 'places_api',
            rating: places.reduce((acc, p) => acc + (p.rating || 4.0), 0) / places.length
          });
        }

        return suggestions;
      }
    } catch (error) {
      console.error('Error with Places API suggestions:', error);
    }

    return [];
  }

  private async getDatasetBasedSuggestions(
    destination: string,
    interests: string[],
    budget: string
  ): Promise<EnhancedTravelSuggestion[]> {
    const suggestions: EnhancedTravelSuggestion[] = [];
    
    // Find exact city match
    const cityData = placesDataService.findCityData(destination);
    
    if (cityData) {
      // Main city suggestion with accurate images
      const mainCityImages = accurateImageService.getPlaceImages(cityData.city, cityData.state, 3);
      
      suggestions.push({
        place: cityData.city,
        country: 'India',
        description: await this.generateEnhancedDescription(cityData.city, cityData.state, cityData.popular_places),
        highlights: cityData.popular_places.slice(0, 4),
        bestFor: this.getBestForFromPlaces(cityData.popular_places, interests),
        images: mainCityImages,
        coordinates: this.getCityCoordinates(cityData.city),
        confidence: 'high',
        source: 'dataset'
      });

      // Nearby cities with accurate images
      const nearbyCities = placesDataService.getNearbyCities(cityData.city);
      for (const nearbyCity of nearbyCities.slice(0, 2)) {
        const nearbyImages = accurateImageService.getPlaceImages(nearbyCity.city, nearbyCity.state, 2);
        
        suggestions.push({
          place: nearbyCity.city,
          country: 'India',
          description: await this.generateEnhancedDescription(nearbyCity.city, nearbyCity.state, nearbyCity.popular_places),
          highlights: nearbyCity.popular_places.slice(0, 3),
          bestFor: this.getBestForFromPlaces(nearbyCity.popular_places, interests),
          images: nearbyImages,
          coordinates: this.getCityCoordinates(nearbyCity.city),
          confidence: 'high',
          source: 'dataset'
        });
      }
    }

    // Interest-based suggestions with accurate images
    const interestSuggestions = placesDataService.getSuggestionsByInterests(interests, budget);
    for (const suggestion of interestSuggestions.slice(0, 3)) {
      if (!suggestions.find(s => s.place === suggestion.city)) {
        const images = accurateImageService.getPlaceImages(suggestion.city, suggestion.state, 2);
        
        suggestions.push({
          place: suggestion.city,
          country: 'India',
          description: await this.generateEnhancedDescription(suggestion.city, suggestion.state, suggestion.matchingPlaces),
          highlights: suggestion.matchingPlaces.slice(0, 3),
          bestFor: this.getBestForFromPlaces(suggestion.matchingPlaces, interests),
          images,
          coordinates: this.getCityCoordinates(suggestion.city),
          confidence: 'high',
          source: 'dataset'
        });
      }
    }

    return suggestions;
  }

  private async getAIBasedSuggestions(
    destination: string,
    budget: string,
    travelType: string,
    interests: string[],
    duration: number
  ): Promise<EnhancedTravelSuggestion[]> {
    if (!this.isApiKeyValid) {
      return [];
    }

    try {
      const prompt = this.createEnhancedSuggestionPrompt(destination, budget, travelType, interests, duration);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const aiSuggestions = this.parseGeminiSuggestions(text);
      
      // Enhance AI suggestions with accurate images
      const enhancedSuggestions: EnhancedTravelSuggestion[] = [];
      for (const suggestion of aiSuggestions) {
        const images = accurateImageService.getPlaceImages(suggestion.place, suggestion.country, 3);
        
        enhancedSuggestions.push({
          ...suggestion,
          images,
          confidence: 'medium',
          source: 'ai'
        });
      }
      
      return enhancedSuggestions;
    } catch (error) {
      console.error('Error with AI suggestions:', error);
      return [];
    }
  }

  private async getFallbackSuggestions(
    destination: string,
    interests: string[],
    budget: string
  ): Promise<EnhancedTravelSuggestion[]> {
    const fallbackCities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad'];
    const suggestions: EnhancedTravelSuggestion[] = [];

    for (const city of fallbackCities.slice(0, 3)) {
      const cityData = placesDataService.findCityData(city);
      if (cityData) {
        const images = accurateImageService.getPlaceImages(city, cityData.state, 2);
        
        suggestions.push({
          place: city,
          country: 'India',
          description: `Explore the vibrant culture and attractions of ${city}, one of India's most popular destinations`,
          highlights: cityData.popular_places.slice(0, 3),
          bestFor: interests.slice(0, 3),
          images,
          coordinates: this.getCityCoordinates(city),
          confidence: 'low',
          source: 'dataset'
        });
      }
    }

    return suggestions;
  }

  async generateEnhancedTravelPlan(
    destination: string,
    budget: string,
    travelType: string,
    interests: string[],
    duration: number
  ): Promise<EnhancedTravelPlan> {
    try {
      const suggestions = await this.generateEnhancedTravelSuggestions(destination, budget, travelType, interests, duration);
      const days = await this.generateEnhancedDayPlans(destination, budget, travelType, interests, duration);
      
      const confidence = this.calculatePlanConfidence(suggestions, days);

      return {
        destination,
        budget,
        travelType,
        interests,
        duration,
        days,
        suggestions,
        confidence
      };
    } catch (error) {
      console.error('Error generating enhanced travel plan:', error);
      return this.getFallbackTravelPlan(destination, budget, travelType, interests, duration);
    }
  }

  private async generateEnhancedDayPlans(
    destination: string,
    budget: string,
    travelType: string,
    interests: string[],
    duration: number
  ): Promise<EnhancedDayPlan[]> {
    const days: EnhancedDayPlan[] = [];
    const cityData = placesDataService.findCityData(destination);

    for (let i = 0; i < duration; i++) {
      const dayPlan = await this.generateEnhancedSingleDay(
        i + 1,
        cityData,
        destination,
        budget,
        travelType,
        interests
      );
      days.push(dayPlan);
    }

    return days;
  }

  private async generateEnhancedSingleDay(
    dayNumber: number,
    cityData: any,
    destination: string,
    budget: string,
    travelType: string,
    interests: string[]
  ): Promise<EnhancedDayPlan> {
    const themes = [
      "Cultural Heritage & Historical Exploration",
      "Local Cuisine & Culinary Discovery",
      "Nature & Scenic Beauty",
      "Shopping & Local Crafts",
      "Adventure & Unique Experiences"
    ];

    const theme = themes[(dayNumber - 1) % themes.length];
    const activities = await this.generateEnhancedActivities(cityData, destination, budget, theme, interests);
    const estimatedCost = this.calculateDayCost(activities, budget);
    const tips = this.generateLocationSpecificTips(destination, theme, travelType);
    
    // Get day-specific images based on theme and destination
    const dayImages = this.getDayThemeImages(destination, theme, 2);

    return {
      day: dayNumber,
      date: this.getDateString(dayNumber),
      theme,
      activities,
      estimatedCost,
      tips,
      images: dayImages
    };
  }

  private async generateEnhancedActivities(
    cityData: any,
    destination: string,
    budget: string,
    theme: string,
    interests: string[]
  ): Promise<EnhancedActivity[]> {
    const activities: EnhancedActivity[] = [];
    const timeSlots = [
      { time: '09:00 AM', type: 'attraction' as const },
      { time: '12:30 PM', type: 'restaurant' as const },
      { time: '02:30 PM', type: 'attraction' as const },
      { time: '06:00 PM', type: 'experience' as const },
      { time: '08:00 PM', type: 'restaurant' as const }
    ];

    for (const slot of timeSlots) {
      const activity = await this.createEnhancedActivity(slot, cityData, destination, budget, theme);
      activities.push(activity);
    }

    return activities;
  }

  private async createEnhancedActivity(
    slot: { time: string; type: 'attraction' | 'restaurant' | 'experience' },
    cityData: any,
    destination: string,
    budget: string,
    theme: string
  ): Promise<EnhancedActivity> {
    let activity: EnhancedActivity;

    if (slot.type === 'attraction' && cityData && cityData.popular_places.length > 0) {
      // Use real places from dataset with Google Places API integration
      const place = cityData.popular_places[Math.floor(Math.random() * cityData.popular_places.length)];
      const placeInfo = placesDataService.getPlaceInfo(place, destination);
      
      // Try to get real place details from Google Places API
      const placesApiResult = await googlePlacesApiService.fetchPlaceDetails(place, destination);
      const images = [placesApiResult.photo, ...accurateImageService.getPlaceImages(place, destination, 1)];

      activity = {
        time: slot.time,
        type: slot.type,
        name: placeInfo.name,
        description: placeInfo.description,
        location: `${placeInfo.city}, ${placeInfo.state}`,
        duration: placeInfo.duration,
        cost: placeInfo.cost,
        rating: placesApiResult.rating || placeInfo.rating,
        images: images.filter(img => img), // Remove any null/undefined images
        tips: placeInfo.tips,
        coordinates: this.getCityCoordinates(destination),
        confidence: 'high',
        placeId: placesApiResult.placeId,
        mapLink: placesApiResult.mapLink
      };
    } else if (slot.type === 'restaurant') {
      // Generate restaurant activity with Google Places API integration
      const restaurant = this.getLocationSpecificRestaurant(destination, budget);
      const placesApiResult = await googlePlacesApiService.fetchPlaceDetails(restaurant.name, destination);
      const images = [placesApiResult.photo, ...accurateImageService.getPlaceImages(restaurant.name, destination, 1)];

      activity = {
        time: slot.time,
        type: slot.type,
        name: restaurant.name,
        description: restaurant.description,
        location: restaurant.location,
        duration: '1-1.5 hours',
        cost: this.getBudgetCost(budget, 'restaurant'),
        rating: placesApiResult.rating || (4.2 + Math.random() * 0.6),
        images: images.filter(img => img),
        tips: restaurant.tips,
        confidence: 'medium',
        placeId: placesApiResult.placeId,
        mapLink: placesApiResult.mapLink
      };
    } else {
      // Generate experience activity with Google Places API integration
      const experience = this.getLocationSpecificExperience(destination);
      const placesApiResult = await googlePlacesApiService.fetchPlaceDetails(experience.name, destination);
      const images = [placesApiResult.photo, ...accurateImageService.getPlaceImages(experience.name, destination, 1)];

      activity = {
        time: slot.time,
        type: 'experience',
        name: experience.name,
        description: experience.description,
        location: experience.location,
        duration: '1-2 hours',
        cost: 'Free',
        rating: placesApiResult.rating || (4.3 + Math.random() * 0.5),
        images: images.filter(img => img),
        tips: experience.tips,
        confidence: 'medium',
        placeId: placesApiResult.placeId,
        mapLink: placesApiResult.mapLink
      };
    }

    return activity;
  }

  // Helper methods
  private getDayThemeImages(destination: string, theme: string, count: number): string[] {
    // Get theme-appropriate images for the day
    if (theme.includes('Cultural') || theme.includes('Historical')) {
      return accurateImageService.getPlaceImages('historical sites', destination, count);
    }
    if (theme.includes('Cuisine') || theme.includes('Food')) {
      return accurateImageService.getPlaceImages('local food', destination, count);
    }
    if (theme.includes('Nature') || theme.includes('Scenic')) {
      return accurateImageService.getPlaceImages('nature parks', destination, count);
    }
    if (theme.includes('Shopping')) {
      return accurateImageService.getPlaceImages('markets', destination, count);
    }
    if (theme.includes('Adventure')) {
      return accurateImageService.getPlaceImages('adventure activities', destination, count);
    }
    
    return accurateImageService.getPlaceImages(destination, 'general', count);
  }

  private async generateEnhancedDescription(city: string, state: string, places: string[]): Promise<string> {
    if (this.isApiKeyValid) {
      try {
        const prompt = `Write a compelling 2-sentence travel description for ${city}, ${state} highlighting these attractions: ${places.join(', ')}. Make it engaging and informative.`;
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
      } catch (error) {
        console.error('Error generating AI description:', error);
      }
    }

    // Fallback to template description
    return `${city} in ${state} offers an incredible blend of cultural heritage and modern attractions. Experience ${places.slice(0, 3).join(', ')} and immerse yourself in the local culture and traditions.`;
  }

  private getBestForFromPlaces(places: string[], interests: string[]): string[] {
    const categories = places.map(place => placesDataService.getPlaceInfo(place, '').category);
    const uniqueCategories = [...new Set(categories)];
    const bestFor: string[] = [];

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
      }
    });

    interests.forEach(interest => {
      if (!bestFor.includes(interest)) {
        bestFor.push(interest);
      }
    });

    return [...new Set(bestFor)].slice(0, 4);
  }

  private getBestForFromInterests(interests: string[]): string[] {
    return interests.slice(0, 4);
  }

  private getCityCoordinates(city: string): { lat: number; lng: number } {
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

    return coordinates[city.toLowerCase()] || coordinates.mumbai;
  }

  private getLocationSpecificRestaurant(city: string, budget: string): any {
    const restaurants: { [key: string]: any[] } = {
      mumbai: [
        {
          name: 'Trishna Restaurant',
          description: 'Award-winning seafood restaurant with contemporary Indian coastal cuisine',
          location: 'Fort, Mumbai',
          tips: ['Try the koliwada prawns', 'Book in advance', 'Ask for chef recommendations']
        },
        {
          name: 'Leopold Cafe',
          description: 'Historic cafe serving continental dishes and local favorites since 1871',
          location: 'Colaba, Mumbai',
          tips: ['Try fish & chips', 'Historic ambiance', 'Popular with tourists']
        }
      ],
      delhi: [
        {
          name: 'Karim\'s Restaurant',
          description: 'Legendary Mughlai restaurant serving authentic kebabs since 1913',
          location: 'Jama Masjid, Delhi',
          tips: ['Try mutton burra', 'Cash only', 'Expect crowds']
        },
        {
          name: 'Indian Accent',
          description: 'Award-winning restaurant offering innovative Indian cuisine',
          location: 'Lodhi Road, Delhi',
          tips: ['Book well in advance', 'Try duck khurchan', 'Dress code applies']
        }
      ]
    };

    const cityKey = city.toLowerCase();
    const cityRestaurants = restaurants[cityKey] || restaurants.mumbai;
    return cityRestaurants[Math.floor(Math.random() * cityRestaurants.length)];
  }

  private getLocationSpecificExperience(city: string): any {
    const experiences: { [key: string]: any } = {
      mumbai: {
        name: 'Marine Drive Sunset Walk',
        description: 'Stroll along the Queen\'s Necklace and watch the sunset over Arabian Sea',
        location: 'Marine Drive, Mumbai',
        tips: ['Best time is 6-7 PM', 'Try street food', 'Great for photography']
      },
      delhi: {
        name: 'India Gate Evening Stroll',
        description: 'Enjoy the illuminated war memorial and surrounding gardens',
        location: 'Rajpath, Delhi',
        tips: ['Evening is best', 'Try ice cream vendors', 'Watch the fountains']
      }
    };

    return experiences[city.toLowerCase()] || experiences.mumbai;
  }

  private calculatePlanConfidence(suggestions: EnhancedTravelSuggestion[], days: EnhancedDayPlan[]): number {
    const suggestionConfidence = suggestions.reduce((acc, s) => {
      const score = s.confidence === 'high' ? 1 : s.confidence === 'medium' ? 0.7 : 0.4;
      return acc + score;
    }, 0) / suggestions.length;

    const activityConfidence = days.reduce((acc, day) => {
      const dayScore = day.activities.reduce((dayAcc, activity) => {
        const score = activity.confidence === 'high' ? 1 : activity.confidence === 'medium' ? 0.7 : 0.4;
        return dayAcc + score;
      }, 0) / day.activities.length;
      return acc + dayScore;
    }, 0) / days.length;

    return Math.round(((suggestionConfidence + activityConfidence) / 2) * 100);
  }

  // Keep existing helper methods
  private createEnhancedSuggestionPrompt(destination: string, budget: string, travelType: string, interests: string[], duration: number): string {
    return `Generate 3-4 travel destination suggestions for a ${duration}-day trip based on "${destination}" with preferences: Budget: ${budget}, Travel Type: ${travelType}, Interests: ${interests.join(', ')}. Return as JSON array with place, country, description, highlights, bestFor fields.`;
  }

  private parseGeminiSuggestions(text: string): any[] {
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error parsing Gemini suggestions:', error);
    }
    return [];
  }

  private getBudgetCost(budget: string, type: string): string {
    const costRanges = {
      Budget: { restaurant: '₹300-800', attraction: '₹50-200' },
      'Mid-range': { restaurant: '₹800-2000', attraction: '₹200-500' },
      Luxury: { restaurant: '₹2000-6000', attraction: '₹500-1500' }
    };
    return costRanges[budget as keyof typeof costRanges]?.[type as keyof typeof costRanges.Budget] || '₹500-1000';
  }

  private calculateDayCost(activities: EnhancedActivity[], budget: string): number {
    const budgetMultipliers = { 'Budget': 0.7, 'Mid-range': 1.0, 'Luxury': 1.8 };
    const baseCost = activities.reduce((total, activity) => {
      if (activity.cost === 'Free') return total;
      const costMatch = activity.cost.match(/₹(\d+)/);
      return total + (costMatch ? parseInt(costMatch[1]) : 500);
    }, 0);
    return Math.round(baseCost * budgetMultipliers[budget as keyof typeof budgetMultipliers]);
  }

  private generateLocationSpecificTips(destination: string, theme: string, travelType: string): string[] {
    return [
      `Best time to explore ${destination} is early morning or evening`,
      'Carry water and wear comfortable walking shoes',
      'Try local cuisine from recommended restaurants'
    ];
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

  private getFallbackTravelPlan(destination: string, budget: string, travelType: string, interests: string[], duration: number): EnhancedTravelPlan {
    return {
      destination,
      budget,
      travelType,
      interests,
      duration,
      days: [],
      suggestions: [],
      confidence: 30
    };
  }
}

export const enhancedGeminiTravelService = new EnhancedGeminiTravelService();