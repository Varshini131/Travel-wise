// Location service for accessing device location
export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  city?: string;
  state?: string;
  country?: string;
}

export interface LocationError {
  code: number;
  message: string;
}

export class LocationService {
  private watchId: number | null = null;

  async getCurrentLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject({
          code: 0,
          message: 'Geolocation is not supported by this browser'
        });
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };

          // Try to get city/state information using reverse geocoding
          try {
            const cityInfo = await this.reverseGeocode(locationData.latitude, locationData.longitude);
            Object.assign(locationData, cityInfo);
          } catch (error) {
            console.warn('Could not get city information:', error);
          }

          resolve(locationData);
        },
        (error) => {
          reject({
            code: error.code,
            message: this.getErrorMessage(error.code)
          });
        },
        options
      );
    });
  }

  async requestLocationPermission(): Promise<boolean> {
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      
      if (result.state === 'granted') {
        return true;
      } else if (result.state === 'prompt') {
        // Try to get location to trigger permission prompt
        try {
          await this.getCurrentLocation();
          return true;
        } catch (error) {
          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
      // Fallback for browsers that don't support permissions API
      try {
        await this.getCurrentLocation();
        return true;
      } catch (locationError) {
        return false;
      }
    }
  }

  watchLocation(callback: (location: LocationData) => void, errorCallback: (error: LocationError) => void): void {
    if (!navigator.geolocation) {
      errorCallback({
        code: 0,
        message: 'Geolocation is not supported by this browser'
      });
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000 // 1 minute
    };

    this.watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };

        try {
          const cityInfo = await this.reverseGeocode(locationData.latitude, locationData.longitude);
          Object.assign(locationData, cityInfo);
        } catch (error) {
          console.warn('Could not get city information:', error);
        }

        callback(locationData);
      },
      (error) => {
        errorCallback({
          code: error.code,
          message: this.getErrorMessage(error.code)
        });
      },
      options
    );
  }

  stopWatchingLocation(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  private async reverseGeocode(lat: number, lng: number): Promise<{ city?: string; state?: string; country?: string }> {
    // Try to use a free geocoding service or fallback to known city coordinates
    const knownCities = [
      { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, radius: 50 },
      { name: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090, radius: 50 },
      { name: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946, radius: 50 },
      { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, radius: 50 },
      { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867, radius: 50 },
      { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, radius: 50 },
      { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, radius: 50 },
      { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714, radius: 50 },
      { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, radius: 50 },
      { name: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185, radius: 50 }
    ];

    // Find the closest city
    for (const city of knownCities) {
      const distance = this.calculateDistance(lat, lng, city.lat, city.lng);
      if (distance <= city.radius) {
        return {
          city: city.name,
          state: city.state,
          country: 'India'
        };
      }
    }

    // If no known city found, return country only
    return {
      country: 'India'
    };
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  private getErrorMessage(code: number): string {
    switch (code) {
      case 1:
        return 'Location access denied by user';
      case 2:
        return 'Location information is unavailable';
      case 3:
        return 'Location request timed out';
      default:
        return 'An unknown error occurred while retrieving location';
    }
  }

  // Get user-friendly location string
  getLocationString(location: LocationData): string {
    if (location.city && location.state) {
      return `${location.city}, ${location.state}`;
    } else if (location.city) {
      return location.city;
    } else if (location.state) {
      return location.state;
    } else if (location.country) {
      return location.country;
    } else {
      return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
    }
  }

  // Check if location services are available
  isLocationAvailable(): boolean {
    return 'geolocation' in navigator;
  }

  // Get location permission status
  async getLocationPermissionStatus(): Promise<'granted' | 'denied' | 'prompt' | 'unknown'> {
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      return result.state;
    } catch (error) {
      return 'unknown';
    }
  }
}

export const locationService = new LocationService();