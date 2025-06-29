// Image service for fetching accurate pictures using Google Custom Search API
export interface ImageResult {
  url: string;
  title: string;
  contextLink: string;
  thumbnailUrl: string;
  width: number;
  height: number;
}

export interface ImageSearchOptions {
  searchType: 'place' | 'food' | 'activity' | 'general';
  location?: string;
  quality: 'high' | 'medium' | 'low';
  count: number;
}

export class ImageService {
  private apiKey: string;
  private searchEngineId: string;
  private fallbackImages: { [key: string]: string[] };

  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_CUSTOM_SEARCH_API_KEY || 'demo_key';
    this.searchEngineId = import.meta.env.VITE_GOOGLE_CUSTOM_SEARCH_ENGINE_ID || 'demo_cx';
    this.fallbackImages = this.initializeFallbackImages();
  }

  async searchImages(query: string, options: ImageSearchOptions): Promise<string[]> {
    try {
      // Try Google Custom Search API first
      if (this.apiKey !== 'demo_key' && this.searchEngineId !== 'demo_cx') {
        const images = await this.fetchFromGoogleAPI(query, options);
        if (images.length > 0) {
          return images;
        }
      }

      // Fallback to curated high-quality images
      return this.getFallbackImages(query, options);
    } catch (error) {
      console.error('Error fetching images:', error);
      return this.getFallbackImages(query, options);
    }
  }

  private async fetchFromGoogleAPI(query: string, options: ImageSearchOptions): Promise<string[]> {
    const enhancedQuery = this.enhanceSearchQuery(query, options);
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(enhancedQuery)}&searchType=image&key=${this.apiKey}&cx=${this.searchEngineId}&num=${options.count}&imgSize=large&imgType=photo&safe=active`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      return data.items
        .filter((item: any) => this.isValidImage(item.link))
        .map((item: any) => item.link)
        .slice(0, options.count);
    }

    return [];
  }

  private enhanceSearchQuery(query: string, options: ImageSearchOptions): string {
    let enhancedQuery = query;

    // Add location context
    if (options.location) {
      enhancedQuery += ` ${options.location}`;
    }

    // Add search type specific terms
    switch (options.searchType) {
      case 'place':
        enhancedQuery += ' tourist attraction landmark architecture';
        break;
      case 'food':
        enhancedQuery += ' restaurant cuisine dish food photography';
        break;
      case 'activity':
        enhancedQuery += ' activity experience tourism';
        break;
    }

    // Add quality terms
    if (options.quality === 'high') {
      enhancedQuery += ' high quality professional photography';
    }

    return enhancedQuery;
  }

  private isValidImage(url: string): boolean {
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const invalidDomains = ['wikipedia.org', 'wikimedia.org'];
    
    const hasValidExtension = validExtensions.some(ext => 
      url.toLowerCase().includes(ext)
    );
    
    const hasInvalidDomain = invalidDomains.some(domain => 
      url.toLowerCase().includes(domain)
    );

    return hasValidExtension && !hasInvalidDomain && url.startsWith('https://');
  }

  private getFallbackImages(query: string, options: ImageSearchOptions): string[] {
    const queryLower = query.toLowerCase();
    
    // Try to match specific places/items first
    for (const [key, images] of Object.entries(this.fallbackImages)) {
      if (queryLower.includes(key.toLowerCase())) {
        return this.selectRandomImages(images, options.count);
      }
    }

    // Fallback to category-based images
    return this.getCategoryImages(options.searchType, options.count);
  }

  private selectRandomImages(images: string[], count: number): string[] {
    const shuffled = [...images].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  private getCategoryImages(searchType: string, count: number): string[] {
    const categoryImages = {
      place: this.fallbackImages.attractions,
      food: this.fallbackImages.restaurants,
      activity: this.fallbackImages.activities,
      general: this.fallbackImages.general
    };

    const images = categoryImages[searchType as keyof typeof categoryImages] || categoryImages.general;
    return this.selectRandomImages(images, count);
  }

  private initializeFallbackImages(): { [key: string]: string[] } {
    return {
      // Mumbai specific
      'gateway of india': [
        'https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2850287/pexels-photo-2850287.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'marine drive': [
        'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'mumbai': [
        'https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],

      // Delhi specific
      'red fort': [
        'https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'india gate': [
        'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'delhi': [
        'https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],

      // Bangalore specific
      'lalbagh': [
        'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'bangalore palace': [
        'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'bangalore': [
        'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],

      // Food specific
      'trishna restaurant': [
        'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'seafood': [
        'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'biryani': [
        'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      'street food': [
        'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],

      // Categories
      attractions: [
        'https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      restaurants: [
        'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      activities: [
        'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      general: [
        'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=800'
      ]
    };
  }

  // Get place-specific image
  async getPlaceImage(placeName: string, cityName: string): Promise<string> {
    const searchQuery = `${placeName} ${cityName}`;
    const images = await this.searchImages(searchQuery, {
      searchType: 'place',
      location: cityName,
      quality: 'high',
      count: 1
    });
    
    return images[0] || this.fallbackImages.attractions[0];
  }

  // Get food-specific image
  async getFoodImage(restaurantName: string, cityName: string, cuisine?: string): Promise<string> {
    const searchQuery = cuisine ? `${restaurantName} ${cuisine} ${cityName}` : `${restaurantName} ${cityName}`;
    const images = await this.searchImages(searchQuery, {
      searchType: 'food',
      location: cityName,
      quality: 'high',
      count: 1
    });
    
    return images[0] || this.fallbackImages.restaurants[0];
  }

  // Get activity-specific image
  async getActivityImage(activityName: string, cityName: string): Promise<string> {
    const searchQuery = `${activityName} ${cityName}`;
    const images = await this.searchImages(searchQuery, {
      searchType: 'activity',
      location: cityName,
      quality: 'high',
      count: 1
    });
    
    return images[0] || this.fallbackImages.activities[0];
  }
}

export const imageService = new ImageService();