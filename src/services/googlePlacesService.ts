// Google Places API service for fetching real location data
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
  opening_hours?: {
    open_now: boolean;
    weekday_text: string[];
  };
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

// Mock Google Places API responses with real Mumbai data
const mockPlacesData: { [key: string]: PlaceDetails[] } = {
  mumbai: [
    {
      place_id: "ChIJwe1EZjDG5zsRaYxkjY_tpF0",
      name: "Gateway of India",
      formatted_address: "Apollo Bandar, Colaba, Mumbai, Maharashtra 400001, India",
      rating: 4.5,
      price_level: 0,
      types: ["tourist_attraction", "point_of_interest", "establishment"],
      geometry: {
        location: { lat: 18.9220, lng: 72.8347 }
      },
      photos: [{
        photo_reference: "gateway_of_india_ref",
        height: 400,
        width: 600
      }]
    },
    {
      place_id: "ChIJ5dZjl0LG5zsRMrVkjY_tpF0",
      name: "Marine Drive",
      formatted_address: "Marine Drive, Mumbai, Maharashtra, India",
      rating: 4.3,
      price_level: 0,
      types: ["route", "tourist_attraction"],
      geometry: {
        location: { lat: 18.9439, lng: 72.8234 }
      }
    },
    {
      place_id: "ChIJ3dZjl0LG5zsRMrVkjY_tpF0",
      name: "Trishna Restaurant",
      formatted_address: "7, Sai Baba Marg, Fort, Mumbai, Maharashtra 400001",
      rating: 4.8,
      price_level: 3,
      types: ["restaurant", "food", "point_of_interest"],
      geometry: {
        location: { lat: 18.9354, lng: 72.8365 }
      }
    },
    {
      place_id: "ChIJ4dZjl0LG5zsRMrVkjY_tpF0",
      name: "Chhatrapati Shivaji Terminus",
      formatted_address: "Chhatrapati Shivaji Terminus Area, Fort, Mumbai, Maharashtra 400001",
      rating: 4.6,
      price_level: 0,
      types: ["train_station", "tourist_attraction", "point_of_interest"],
      geometry: {
        location: { lat: 18.9401, lng: 72.8352 }
      }
    },
    {
      place_id: "ChIJ5dZjl0LG5zsRMrVkjY_tpF0",
      name: "Elephanta Caves",
      formatted_address: "Elephanta Island, Mumbai, Maharashtra 400094",
      rating: 4.4,
      price_level: 1,
      types: ["tourist_attraction", "point_of_interest", "establishment"],
      geometry: {
        location: { lat: 18.9633, lng: 72.9315 }
      }
    }
  ]
};

// Image mapping for different types of places
const getPlaceImage = (placeName: string, types: string[]): string => {
  const imageMap: { [key: string]: string } = {
    "Gateway of India": "https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=600",
    "Marine Drive": "https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=600",
    "Trishna Restaurant": "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=600",
    "Chhatrapati Shivaji Terminus": "https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=600",
    "Elephanta Caves": "https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=600",
    "Juhu Beach": "https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=600",
    "Crawford Market": "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=600",
    "Haji Ali Dargah": "https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=600"
  };

  if (imageMap[placeName]) {
    return imageMap[placeName];
  }

  // Default images based on place types
  if (types.includes('restaurant') || types.includes('food')) {
    return "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600";
  }
  if (types.includes('tourist_attraction')) {
    return "https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=600";
  }
  if (types.includes('shopping_mall') || types.includes('store')) {
    return "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=600";
  }
  
  return "https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=600";
};

export class GooglePlacesService {
  private apiKey: string;

  constructor(apiKey: string = 'demo_key') {
    this.apiKey = apiKey;
  }

  async searchPlaces(destination: string, type?: string): Promise<PlaceDetails[]> {
    // In a real implementation, this would make actual API calls
    // For demo purposes, we'll return mock data
    const cityKey = destination.toLowerCase().replace(/[^a-z]/g, '');
    return mockPlacesData[cityKey] || mockPlacesData.mumbai;
  }

  async generateTravelPlan(
    destination: string,
    budget: string,
    travelType: string,
    interests: string[],
    duration: number = 3
  ): Promise<TravelPlan> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const places = await this.searchPlaces(destination);
    const days: DayPlan[] = [];

    for (let i = 0; i < duration; i++) {
      const dayPlan = this.generateDayPlan(i + 1, places, budget, travelType, interests, destination);
      days.push(dayPlan);
    }

    return {
      destination,
      budget,
      travelType,
      interests,
      duration,
      days
    };
  }

  private generateDayPlan(
    dayNumber: number,
    places: PlaceDetails[],
    budget: string,
    travelType: string,
    interests: string[],
    destination: string
  ): DayPlan {
    const themes = [
      "Historical & Cultural Exploration",
      "Local Food & Markets",
      "Nature & Relaxation",
      "Shopping & Entertainment",
      "Adventure & Experiences"
    ];

    const activities: Activity[] = [];
    const theme = themes[(dayNumber - 1) % themes.length];

    // Morning activity
    activities.push(this.createActivity(
      "09:00 AM",
      "attraction",
      places,
      budget,
      interests,
      "morning"
    ));

    // Lunch
    activities.push(this.createActivity(
      "12:30 PM",
      "restaurant",
      places,
      budget,
      interests,
      "lunch"
    ));

    // Afternoon activity
    activities.push(this.createActivity(
      "02:30 PM",
      interests.includes('Shopping') ? "shopping" : "attraction",
      places,
      budget,
      interests,
      "afternoon"
    ));

    // Evening activity
    activities.push(this.createActivity(
      "06:00 PM",
      "experience",
      places,
      budget,
      interests,
      "evening"
    ));

    // Dinner
    activities.push(this.createActivity(
      "08:00 PM",
      "restaurant",
      places,
      budget,
      interests,
      "dinner"
    ));

    const estimatedCost = this.calculateDayCost(activities, budget);
    const tips = this.generateDayTips(theme, destination, travelType);

    return {
      day: dayNumber,
      date: this.getDateString(dayNumber),
      theme,
      activities,
      estimatedCost,
      tips
    };
  }

  private createActivity(
    time: string,
    type: Activity['type'],
    places: PlaceDetails[],
    budget: string,
    interests: string[],
    timeOfDay: string
  ): Activity {
    const activityTemplates = {
      morning: {
        attraction: [
          {
            name: "Gateway of India",
            description: "Start your day at Mumbai's iconic arch monument overlooking the Arabian Sea",
            location: "Apollo Bandar, Colaba",
            duration: "1-2 hours",
            cost: "Free",
            tips: ["Best time for photos is early morning", "Combine with nearby Taj Hotel visit"]
          },
          {
            name: "Chhatrapati Shivaji Terminus",
            description: "Marvel at this UNESCO World Heritage Victorian Gothic architecture",
            location: "Fort District",
            duration: "45 minutes",
            cost: "Free",
            tips: ["Great for architecture photography", "Visit the heritage gallery inside"]
          }
        ]
      },
      lunch: {
        restaurant: [
          {
            name: "Trishna Restaurant",
            description: "Award-winning seafood restaurant with contemporary Indian coastal cuisine",
            location: "Fort, Mumbai",
            duration: "1-1.5 hours",
            cost: budget === 'Budget' ? "₹800-1200" : budget === 'Mid-range' ? "₹1500-2500" : "₹3000-5000",
            tips: ["Try the koliwada prawns", "Book in advance", "Ask for chef's recommendations"]
          },
          {
            name: "Britannia & Co.",
            description: "Historic Parsi cafe serving authentic berry pulao and traditional dishes",
            location: "Ballard Estate",
            duration: "1 hour",
            cost: budget === 'Budget' ? "₹400-600" : budget === 'Mid-range' ? "₹600-1000" : "₹1000-1500",
            tips: ["Try the berry pulao", "Cash only", "Expect a wait during peak hours"]
          }
        ]
      },
      afternoon: {
        attraction: [
          {
            name: "Elephanta Caves",
            description: "Ancient rock-cut caves dedicated to Lord Shiva on Elephanta Island",
            location: "Elephanta Island",
            duration: "3-4 hours",
            cost: "₹40 + Ferry ₹150",
            tips: ["Take the ferry from Gateway of India", "Wear comfortable shoes", "Carry water"]
          },
          {
            name: "Crawford Market",
            description: "Bustling market for fresh produce, spices, and local goods",
            location: "Fort District",
            duration: "1-2 hours",
            cost: "Free entry",
            tips: ["Bargain for better prices", "Try fresh fruit juices", "Watch your belongings"]
          }
        ],
        shopping: [
          {
            name: "Colaba Causeway",
            description: "Popular shopping street for clothes, accessories, and souvenirs",
            location: "Colaba",
            duration: "2-3 hours",
            cost: budget === 'Budget' ? "₹500-1500" : budget === 'Mid-range' ? "₹1500-3000" : "₹3000-8000",
            tips: ["Bargain hard", "Check quality before buying", "Try street food"]
          }
        ]
      },
      evening: {
        experience: [
          {
            name: "Marine Drive Sunset Walk",
            description: "Stroll along the Queen's Necklace and watch the sunset over the Arabian Sea",
            location: "Marine Drive",
            duration: "1-2 hours",
            cost: "Free",
            tips: ["Best sunset views from 6-7 PM", "Try bhel puri from street vendors", "Great for photography"]
          },
          {
            name: "Juhu Beach",
            description: "Popular beach known for street food and Bollywood celebrity spotting",
            location: "Juhu",
            duration: "2 hours",
            cost: "Free",
            tips: ["Try pav bhaji and bhel puri", "Evening is best time to visit", "Watch for high tide"]
          }
        ]
      },
      dinner: {
        restaurant: [
          {
            name: "Leopold Cafe",
            description: "Historic cafe serving continental dishes and local favorites since 1871",
            location: "Colaba",
            duration: "1-1.5 hours",
            cost: budget === 'Budget' ? "₹600-1000" : budget === 'Mid-range' ? "₹1000-1800" : "₹1800-3000",
            tips: ["Try the fish and chips", "Historic ambiance", "Popular with tourists"]
          },
          {
            name: "Khyber Restaurant",
            description: "Upscale North Indian restaurant with rich Mughlai cuisine",
            location: "Fort",
            duration: "1.5-2 hours",
            cost: budget === 'Budget' ? "₹1200-2000" : budget === 'Mid-range' ? "₹2000-3500" : "₹3500-6000",
            tips: ["Try the dal khyber", "Elegant ambiance", "Good for special occasions"]
          }
        ]
      }
    };

    const templates = activityTemplates[timeOfDay as keyof typeof activityTemplates]?.[type] || 
                     activityTemplates.morning.attraction;
    
    const template = templates[Math.floor(Math.random() * templates.length)];
    const place = places.find(p => p.name === template.name) || places[0];

    return {
      time,
      type,
      name: template.name,
      description: template.description,
      location: template.location,
      duration: template.duration,
      cost: template.cost,
      rating: place?.rating,
      image: getPlaceImage(template.name, place?.types || []),
      tips: template.tips,
      coordinates: place?.geometry?.location
    };
  }

  private calculateDayCost(activities: Activity[], budget: string): number {
    const budgetMultipliers = {
      'Budget': 0.7,
      'Mid-range': 1.0,
      'Luxury': 1.8
    };

    const baseCost = activities.reduce((total, activity) => {
      if (activity.cost === 'Free') return total;
      
      // Extract numeric value from cost string
      const costMatch = activity.cost.match(/₹(\d+)/);
      const cost = costMatch ? parseInt(costMatch[1]) : 500;
      
      return total + cost;
    }, 0);

    return Math.round(baseCost * budgetMultipliers[budget as keyof typeof budgetMultipliers]);
  }

  private generateDayTips(theme: string, destination: string, travelType: string): string[] {
    const tipsByTheme: { [key: string]: string[] } = {
      "Historical & Cultural Exploration": [
        "Start early to avoid crowds at popular monuments",
        "Hire a local guide for deeper historical insights",
        "Carry water and wear comfortable walking shoes"
      ],
      "Local Food & Markets": [
        "Try street food from busy stalls for freshness",
        "Carry hand sanitizer and tissues",
        "Ask locals for their favorite food recommendations"
      ],
      "Nature & Relaxation": [
        "Check weather conditions before outdoor activities",
        "Bring sunscreen and a hat",
        "Stay hydrated throughout the day"
      ],
      "Shopping & Entertainment": [
        "Bargain at local markets but be respectful",
        "Keep your valuables secure in crowded areas",
        "Try to pay in cash for better deals"
      ],
      "Adventure & Experiences": [
        "Book activities in advance during peak season",
        "Follow safety guidelines for all activities",
        "Capture memories but also enjoy the moment"
      ]
    };

    return tipsByTheme[theme] || tipsByTheme["Historical & Cultural Exploration"];
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
}

export const googlePlacesService = new GooglePlacesService();