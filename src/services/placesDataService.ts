import popularPlacesDataset from '../data/popularPlacesDataset.json';

export interface CityData {
  city: string;
  state: string;
  popular_places: string[];
}

export interface PlaceInfo {
  name: string;
  city: string;
  state: string;
  category: string;
  description: string;
  rating: number;
  image: string;
  tips: string[];
  duration: string;
  cost: string;
}

export class PlacesDataService {
  private dataset: CityData[] = popularPlacesDataset;

  // Find places by city name
  getPlacesByCity(cityName: string): string[] {
    const city = this.findCityData(cityName);
    return city ? city.popular_places : [];
  }

  // Find city data by name (fuzzy matching)
  findCityData(cityName: string): CityData | null {
    const searchTerm = cityName.toLowerCase().trim();
    
    // Exact match first
    let city = this.dataset.find(c => 
      c.city.toLowerCase() === searchTerm
    );
    
    // Partial match if no exact match
    if (!city) {
      city = this.dataset.find(c => 
        c.city.toLowerCase().includes(searchTerm) || 
        searchTerm.includes(c.city.toLowerCase())
      );
    }
    
    return city || null;
  }

  // Get all cities in a state
  getCitiesInState(stateName: string): CityData[] {
    return this.dataset.filter(c => 
      c.state.toLowerCase().includes(stateName.toLowerCase())
    );
  }

  // Get nearby cities (same state)
  getNearbyCities(cityName: string): CityData[] {
    const city = this.findCityData(cityName);
    if (!city) return [];
    
    return this.dataset.filter(c => 
      c.state === city.state && c.city !== city.city
    );
  }

  // Get enhanced place information
  getPlaceInfo(placeName: string, cityName: string): PlaceInfo {
    const city = this.findCityData(cityName);
    const state = city?.state || 'India';
    
    return {
      name: placeName,
      city: cityName,
      state,
      category: this.categorizePlace(placeName),
      description: this.generatePlaceDescription(placeName, cityName),
      rating: this.generateRating(placeName),
      image: this.getPlaceImage(placeName, cityName),
      tips: this.generatePlaceTips(placeName, cityName),
      duration: this.estimateDuration(placeName),
      cost: this.estimateCost(placeName)
    };
  }

  // Categorize places based on name patterns
  private categorizePlace(placeName: string): string {
    const name = placeName.toLowerCase();
    
    if (name.includes('temple') || name.includes('mandir') || name.includes('dargah') || 
        name.includes('cathedral') || name.includes('mosque') || name.includes('ashram')) {
      return 'Religious';
    }
    if (name.includes('fort') || name.includes('palace') || name.includes('museum') || 
        name.includes('memorial') || name.includes('tomb')) {
      return 'Historical';
    }
    if (name.includes('beach') || name.includes('lake') || name.includes('park') || 
        name.includes('garden') || name.includes('valley') || name.includes('caves')) {
      return 'Nature';
    }
    if (name.includes('mall') || name.includes('market') || name.includes('road')) {
      return 'Shopping';
    }
    if (name.includes('city') || name.includes('film') || name.includes('zoo')) {
      return 'Entertainment';
    }
    if (name.includes('cafe') || name.includes('restaurant') || name.includes('cappuccino') || 
        name.includes('coffee') || name.includes('bistro') || name.includes('bean') || 
        name.includes('gallery') || name.includes('brew')) {
      return 'Food & Beverage';
    }
    
    return 'Attraction';
  }

  // Generate contextual descriptions
  private generatePlaceDescription(placeName: string, cityName: string): string {
    const descriptions: { [key: string]: string } = {
      // Mumbai
      'Gateway of India': 'Iconic arch monument built during British Raj, overlooking the Arabian Sea and serving as Mumbai\'s most recognizable landmark',
      'Marine Drive': 'Scenic 3.6-kilometer boulevard along the coast, known as Queen\'s Necklace for its sparkling night lights',
      'Elephanta Caves': 'UNESCO World Heritage rock-cut caves dating to 5th-8th centuries, featuring magnificent sculptures of Lord Shiva',
      
      // Visakhapatnam
      'Kailasagiri': 'Hilltop park offering panoramic views of Visakhapatnam city and coastline, featuring giant statues of Shiva and Parvati',
      'RK Beach': 'Popular beach destination with golden sand, perfect for evening walks and enjoying fresh sea breeze',
      'Araku Valley': 'Scenic hill station known for coffee plantations, tribal culture, and breathtaking valley views',
      'Borra Caves': 'Million-year-old limestone caves with stunning stalactite and stalagmite formations',
      'Yarada Beach': 'Pristine beach surrounded by hills, offering a secluded and peaceful coastal experience',
      'Rushikonda Beach': 'Clean golden sand beach ideal for water sports, swimming, and beach activities',
      'Simhachalam Temple': 'Ancient temple dedicated to Lord Narasimha, known for its architectural beauty and spiritual significance',
      'INS Kurusura Submarine Museum': 'Unique submarine museum offering insights into naval history and underwater warfare',
      
      // Visakhapatnam Cafes
      'Bae\'s Cappuccino': 'Trendy coffee shop in Visakhapatnam known for its artisanal cappuccinos, cozy ambiance, and quality coffee beans',
      'Brew \'n\' Bistro': 'Popular bistro and cafe offering freshly brewed coffee, light meals, and a relaxed atmosphere for coffee lovers',
      'Pastry Coffee N Conversation': 'Charming cafe specializing in fresh pastries, premium coffee, and providing a perfect spot for conversations',
      'Bean Board': 'Modern coffee house featuring specialty coffee blends, comfortable seating, and a great place to work or relax',
      'The Gallery': 'Artistic cafe combining coffee culture with art, offering unique beverages and a creative atmosphere for visitors',
      
      // Delhi
      'Red Fort': 'Magnificent Mughal fortress built by Shah Jahan, symbol of India\'s rich heritage and Independence Day celebrations',
      'India Gate': 'War memorial honoring 84,000 Indian soldiers, surrounded by lush lawns perfect for evening strolls',
      
      // Other cities
      'Charminar': 'Iconic monument and mosque built in 1591, symbol of Hyderabad with four grand arches and minarets',
      'Lalbagh Botanical Garden': '240-acre botanical garden featuring diverse flora, glass house, and peaceful walking trails'
    };

    if (descriptions[placeName]) {
      return descriptions[placeName];
    }

    // Generate description based on category and place type
    const category = this.categorizePlace(placeName);
    const name = placeName.toLowerCase();
    
    if (category === 'Food & Beverage') {
      if (name.includes('cafe') || name.includes('coffee') || name.includes('cappuccino')) {
        return `Popular coffee destination in ${cityName} known for its quality beverages, comfortable atmosphere, and excellent service`;
      }
      if (name.includes('restaurant') || name.includes('bistro')) {
        return `Well-regarded dining establishment in ${cityName} offering delicious cuisine and memorable dining experiences`;
      }
    }

    // Default description
    return `Popular ${category.toLowerCase()} destination in ${cityName}, offering unique cultural and memorable experiences for visitors`;
  }

  // Generate realistic ratings
  private generateRating(placeName: string): number {
    const name = placeName.toLowerCase();
    
    // UNESCO sites and major landmarks get higher ratings
    if (name.includes('unesco') || name.includes('gateway') || name.includes('taj') || 
        name.includes('red fort') || name.includes('qutub')) {
      return 4.5 + Math.random() * 0.4;
    }
    
    // Religious places generally well-rated
    if (name.includes('temple') || name.includes('dargah') || name.includes('cathedral')) {
      return 4.2 + Math.random() * 0.6;
    }
    
    // Parks and nature spots
    if (name.includes('park') || name.includes('garden') || name.includes('beach')) {
      return 4.0 + Math.random() * 0.7;
    }
    
    // Cafes and restaurants
    if (name.includes('cafe') || name.includes('restaurant') || name.includes('coffee') || name.includes('bistro')) {
      return 4.1 + Math.random() * 0.7;
    }
    
    // Default rating
    return 3.8 + Math.random() * 0.9;
  }

  // Get appropriate images for places
  private getPlaceImage(placeName: string, cityName: string): string {
    const imageMap: { [key: string]: string } = {
      'Gateway of India': 'https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Marine Drive': 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Red Fort': 'https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=600',
      'India Gate': 'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Charminar': 'https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Kailasagiri': 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=600',
      'RK Beach': 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Araku Valley': 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Bae\'s Cappuccino': 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Brew \'n\' Bistro': 'https://images.pexels.com/photos/1833586/pexels-photo-1833586.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Pastry Coffee N Conversation': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Bean Board': 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600',
      'The Gallery': 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=600'
    };

    if (imageMap[placeName]) {
      return imageMap[placeName];
    }

    // Category-based default images
    const category = this.categorizePlace(placeName);
    const categoryImages: { [key: string]: string } = {
      'Religious': 'https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Historical': 'https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Nature': 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Shopping': 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Entertainment': 'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=600',
      'Food & Beverage': 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600'
    };

    return categoryImages[category] || 'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=600';
  }

  // Generate place-specific tips
  private generatePlaceTips(placeName: string, cityName: string): string[] {
    const name = placeName.toLowerCase();
    const city = cityName.toLowerCase();

    const specificTips: { [key: string]: string[] } = {
      'Gateway of India': [
        'Best time to visit is early morning or evening for fewer crowds',
        'Take a boat ride to Elephanta Caves from here',
        'Try street food from nearby vendors but choose busy stalls'
      ],
      'Kailasagiri': [
        'Take the ropeway for scenic views during the ride',
        'Visit during sunset for breathtaking panoramic views',
        'Wear comfortable shoes for walking around the park'
      ],
      'RK Beach': [
        'Evening is perfect for beach walks and fresh air',
        'Try local street food from beachside vendors',
        'Be cautious of strong waves while swimming'
      ],
      'Araku Valley': [
        'Best visited during winter months for pleasant weather',
        'Try the famous Araku coffee at local plantations',
        'Book train journey in advance for scenic route'
      ],
      'Bae\'s Cappuccino': [
        'Try their signature cappuccino with latte art',
        'Perfect spot for working with free WiFi',
        'Visit during off-peak hours to avoid crowds'
      ],
      'Brew \'n\' Bistro': [
        'Great for casual meetings and conversations',
        'Try their freshly baked pastries with coffee',
        'Outdoor seating available for pleasant weather'
      ],
      'Pastry Coffee N Conversation': [
        'Known for their fresh pastries and desserts',
        'Ideal place for long conversations over coffee',
        'Try their specialty coffee blends'
      ],
      'Bean Board': [
        'Modern workspace-friendly environment',
        'Excellent coffee quality and brewing methods',
        'Good for both solo visits and group meetings'
      ],
      'The Gallery': [
        'Unique combination of art and coffee culture',
        'Browse local artwork while enjoying beverages',
        'Great for creative inspiration and relaxation'
      ]
    };

    if (specificTips[placeName]) {
      return specificTips[placeName];
    }

    // Category-based tips
    if (name.includes('temple') || name.includes('dargah')) {
      return [
        'Dress modestly and remove shoes before entering',
        'Visit during morning or evening prayers for spiritual experience',
        'Photography may be restricted in certain areas'
      ];
    }

    if (name.includes('beach')) {
      return [
        'Visit during sunset for beautiful views',
        'Try local street food but choose hygienic vendors',
        'Be cautious of strong currents while swimming'
      ];
    }

    if (name.includes('cafe') || name.includes('coffee') || name.includes('bistro')) {
      return [
        'Try their signature coffee blends and specialties',
        'Great for working or casual meetings',
        'Check opening hours before visiting'
      ];
    }

    return [
      'Plan your visit during cooler hours',
      'Carry water and wear comfortable shoes',
      'Check opening hours before visiting'
    ];
  }

  // Estimate visit duration
  private estimateDuration(placeName: string): string {
    const name = placeName.toLowerCase();

    if (name.includes('museum') || name.includes('palace') || name.includes('fort')) {
      return '2-3 hours';
    }
    if (name.includes('temple') || name.includes('dargah') || name.includes('cathedral')) {
      return '1-2 hours';
    }
    if (name.includes('park') || name.includes('garden')) {
      return '1-3 hours';
    }
    if (name.includes('beach') || name.includes('lake')) {
      return '2-4 hours';
    }
    if (name.includes('cafe') || name.includes('coffee') || name.includes('bistro')) {
      return '1-2 hours';
    }
    if (name.includes('valley') || name.includes('caves')) {
      return '3-5 hours';
    }

    return '1-2 hours';
  }

  // Estimate entry cost
  private estimateCost(placeName: string): string {
    const name = placeName.toLowerCase();

    if (name.includes('museum') || name.includes('palace') || name.includes('fort')) {
      return '₹25-100';
    }
    if (name.includes('temple') || name.includes('dargah') || name.includes('cathedral')) {
      return 'Free';
    }
    if (name.includes('park') || name.includes('garden')) {
      return '₹10-50';
    }
    if (name.includes('beach') || name.includes('lake') || name.includes('memorial')) {
      return 'Free';
    }
    if (name.includes('cafe') || name.includes('coffee') || name.includes('bistro')) {
      return '₹150-500';
    }
    if (name.includes('caves')) {
      return '₹25-75';
    }

    return '₹20-100';
  }

  // Get all available cities
  getAllCities(): string[] {
    return this.dataset.map(city => city.city);
  }

  // Get all available states
  getAllStates(): string[] {
    return [...new Set(this.dataset.map(city => city.state))];
  }

  // Search places across all cities
  searchPlaces(query: string): Array<{place: string, city: string, state: string}> {
    const results: Array<{place: string, city: string, state: string}> = [];
    const searchTerm = query.toLowerCase();

    this.dataset.forEach(cityData => {
      cityData.popular_places.forEach(place => {
        if (place.toLowerCase().includes(searchTerm)) {
          results.push({
            place,
            city: cityData.city,
            state: cityData.state
          });
        }
      });
    });

    return results;
  }

  // Get travel suggestions based on interests
  getSuggestionsByInterests(interests: string[], budget: string = 'Mid-range'): Array<{city: string, state: string, matchingPlaces: string[]}> {
    const suggestions: Array<{city: string, state: string, matchingPlaces: string[]}> = [];

    this.dataset.forEach(cityData => {
      const matchingPlaces = cityData.popular_places.filter(place => {
        const category = this.categorizePlace(place);
        return interests.some(interest => 
          category.toLowerCase().includes(interest.toLowerCase()) ||
          interest.toLowerCase().includes(category.toLowerCase()) ||
          this.matchesInterest(place, interest)
        );
      });

      if (matchingPlaces.length > 0) {
        suggestions.push({
          city: cityData.city,
          state: cityData.state,
          matchingPlaces
        });
      }
    });

    return suggestions.sort((a, b) => b.matchingPlaces.length - a.matchingPlaces.length);
  }

  private matchesInterest(placeName: string, interest: string): boolean {
    const place = placeName.toLowerCase();
    const int = interest.toLowerCase();

    const interestMap: { [key: string]: string[] } = {
      'culture': ['temple', 'palace', 'fort', 'museum', 'heritage'],
      'history': ['fort', 'palace', 'museum', 'memorial', 'tomb', 'heritage'],
      'nature': ['park', 'garden', 'beach', 'lake', 'valley', 'caves'],
      'adventure': ['caves', 'valley', 'trekking', 'safari', 'water sports'],
      'relaxation': ['beach', 'park', 'garden', 'lake', 'spa'],
      'photography': ['palace', 'fort', 'memorial', 'beach', 'sunset'],
      'food': ['market', 'bazaar', 'street', 'cafe', 'restaurant', 'coffee', 'bistro'],
      'shopping': ['market', 'bazaar', 'mall', 'road'],
      'spiritual': ['temple', 'dargah', 'cathedral', 'mosque', 'ashram'],
      'beach': ['beach', 'coast', 'marine']
    };

    const keywords = interestMap[int] || [];
    return keywords.some(keyword => place.includes(keyword));
  }
}

export const placesDataService = new PlacesDataService();