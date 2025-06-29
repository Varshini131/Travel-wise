// Accurate Image Service with place-specific image mapping
export interface PlaceImageMapping {
  [key: string]: {
    primary: string;
    gallery: string[];
    category: string;
  };
}

export class AccurateImageService {
  private placeImageMap: PlaceImageMapping;

  constructor() {
    this.placeImageMap = this.initializePlaceImageMap();
  }

  getPlaceImages(placeName: string, cityName: string, count: number = 1): string[] {
    const searchKey = this.createSearchKey(placeName, cityName);
    
    // Try exact match first
    if (this.placeImageMap[searchKey]) {
      const mapping = this.placeImageMap[searchKey];
      const images = [mapping.primary, ...mapping.gallery];
      return images.slice(0, count);
    }

    // Try partial matches
    const partialMatch = this.findPartialMatch(placeName, cityName);
    if (partialMatch) {
      const images = [partialMatch.primary, ...partialMatch.gallery];
      return images.slice(0, count);
    }

    // Fallback to category-based images
    return this.getCategoryImages(placeName, count);
  }

  private createSearchKey(placeName: string, cityName: string): string {
    return `${placeName.toLowerCase().trim()}_${cityName.toLowerCase().trim()}`;
  }

  private findPartialMatch(placeName: string, cityName: string): any {
    const placeNameLower = placeName.toLowerCase();
    const cityNameLower = cityName.toLowerCase();

    // Check for place name matches across all cities
    for (const [key, mapping] of Object.entries(this.placeImageMap)) {
      if (key.includes(placeNameLower) || placeNameLower.includes(key.split('_')[0])) {
        return mapping;
      }
    }

    // Check for city-specific matches
    for (const [key, mapping] of Object.entries(this.placeImageMap)) {
      if (key.includes(cityNameLower)) {
        return mapping;
      }
    }

    return null;
  }

  private getCategoryImages(placeName: string, count: number): string[] {
    const name = placeName.toLowerCase();
    
    if (name.includes('temple') || name.includes('mandir') || name.includes('dargah')) {
      return this.getRandomImages('religious', count);
    }
    if (name.includes('fort') || name.includes('palace') || name.includes('museum')) {
      return this.getRandomImages('historical', count);
    }
    if (name.includes('beach') || name.includes('lake') || name.includes('park')) {
      return this.getRandomImages('nature', count);
    }
    if (name.includes('market') || name.includes('mall') || name.includes('bazaar')) {
      return this.getRandomImages('shopping', count);
    }
    if (name.includes('restaurant') || name.includes('cafe') || name.includes('cappuccino') || name.includes('coffee') || name.includes('bistro') || name.includes('bean') || name.includes('gallery')) {
      return this.getRandomImages('food', count);
    }

    return this.getRandomImages('general', count);
  }

  private getRandomImages(category: string, count: number): string[] {
    const categoryImages = {
      religious: [
        'https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2850287/pexels-photo-2850287.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      historical: [
        'https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      nature: [
        'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      shopping: [
        'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      food: [
        'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1833586/pexels-photo-1833586.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      general: [
        'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    };

    const images = categoryImages[category as keyof typeof categoryImages] || categoryImages.general;
    return images.slice(0, count);
  }

  private selectRandomImages(images: string[], count: number): string[] {
    const shuffled = [...images].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  private initializePlaceImageMap(): PlaceImageMapping {
    return {
      // Mumbai Places
      'gateway of india_mumbai': {
        primary: 'https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=800',
        gallery: [
          'https://images.pexels.com/photos/2850287/pexels-photo-2850287.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'historical'
      },
      'marine drive_mumbai': {
        primary: 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=800',
        gallery: [
          'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'nature'
      },

      // Visakhapatnam Places
      'kailasagiri_visakhapatnam': {
        primary: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=800',
        gallery: [
          'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'nature'
      },
      'rk beach_visakhapatnam': {
        primary: 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=800',
        gallery: [
          'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'nature'
      },
      'araku valley_visakhapatnam': {
        primary: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=800',
        gallery: [
          'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'nature'
      },
      'borra caves_visakhapatnam': {
        primary: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800',
        gallery: [
          'https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'nature'
      },
      'yarada beach_visakhapatnam': {
        primary: 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=800',
        gallery: [
          'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'nature'
      },
      'rushikonda beach_visakhapatnam': {
        primary: 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=800',
        gallery: [
          'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'nature'
      },
      'simhachalam temple_visakhapatnam': {
        primary: 'https://images.pexels.com/photos/2850287/pexels-photo-2850287.jpeg?auto=compress&cs=tinysrgb&w=800',
        gallery: [
          'https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'religious'
      },
      'ins kurusura submarine museum_visakhapatnam': {
        primary: 'https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=800',
        gallery: [
          'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'historical'
      },

      // Visakhapatnam Cafes
      'bae\'s cappuccino_visakhapatnam': {
        primary: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
        gallery: [
          'https://images.pexels.com/photos/1833586/pexels-photo-1833586.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'food'
      },
      'brew \'n\' bistro_visakhapatnam': {
        primary: 'https://images.pexels.com/photos/1833586/pexels-photo-1833586.jpeg?auto=compress&cs=tinysrgb&w=800',
        gallery: [
          'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'food'
      },
      'pastry coffee n conversation_visakhapatnam': {
        primary: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
        gallery: [
          'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1833586/pexels-photo-1833586.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'food'
      },
      'bean board_visakhapatnam': {
        primary: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
        gallery: [
          'https://images.pexels.com/photos/1833586/pexels-photo-1833586.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'food'
      },
      'the gallery_visakhapatnam': {
        primary: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=800',
        gallery: [
          'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'food'
      },

      // Delhi Places
      'red fort_delhi': {
        primary: 'https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=800',
        gallery: [
          'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'historical'
      },
      'india gate_delhi': {
        primary: 'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800',
        gallery: [
          'https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'historical'
      },

      // Bangalore Places
      'lalbagh botanical garden_bangalore': {
        primary: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=800',
        gallery: [
          'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'nature'
      },
      'cubbon park_bangalore': {
        primary: 'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800',
        gallery: [
          'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'nature'
      },

      // Chennai Places
      'marina beach_chennai': {
        primary: 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=800',
        gallery: [
          'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'nature'
      },

      // Hyderabad Places
      'charminar_hyderabad': {
        primary: 'https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=800',
        gallery: [
          'https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'historical'
      },
      'golconda fort_hyderabad': {
        primary: 'https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=800',
        gallery: [
          'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'historical'
      },

      // Restaurant Images
      'trishna restaurant_mumbai': {
        primary: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=800',
        gallery: [
          'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'food'
      },
      'leopold cafe_mumbai': {
        primary: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
        gallery: [
          'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'food'
      }
    };
  }
}

export const accurateImageService = new AccurateImageService();