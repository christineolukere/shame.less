interface PixabayImage {
  id: number;
  webformatURL: string;
  tags: string;
  user: string;
}

interface PixabayVideo {
  id: number;
  videos: {
    medium: {
      url: string;
    };
  };
  tags: string;
  user: string;
}

interface PixabayResponse {
  hits: PixabayImage[] | PixabayVideo[];
  total: number;
}

// Fallback images from Pexels (curated for mental wellness)
const FALLBACK_IMAGES = [
  'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1366630/pexels-photo-1366630.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800'
];

class PixabayAPI {
  private apiKey: string;
  private baseUrl = 'https://pixabay.com/api/';
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  private isApiAvailable = true;

  constructor() {
    this.apiKey = import.meta.env.VITE_PIXABAY_API_KEY || '';
    
    // Check if API key is configured and not a placeholder
    if (!this.apiKey || this.apiKey === 'your_pixabay_api_key_here') {
      console.info('Pixabay API key not configured. Using fallback images.');
      this.isApiAvailable = false;
    }
  }

  private getCacheKey(query: string, type: 'image' | 'video'): string {
    return `${type}_${query}`;
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheTimeout;
  }

  private async makeRequest(endpoint: string, params: Record<string, any>): Promise<PixabayResponse> {
    if (!this.isApiAvailable) {
      throw new Error('Pixabay API not available');
    }

    const url = new URL(endpoint, this.baseUrl);
    url.searchParams.append('key', this.apiKey);
    url.searchParams.append('safesearch', 'true');
    url.searchParams.append('category', 'nature');
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        // If we get a 400 error, it's likely an API key issue
        if (response.status === 400) {
          console.warn('Pixabay API key appears to be invalid. Disabling API and using fallbacks.');
          this.isApiAvailable = false;
          throw new Error('Invalid API key');
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Pixabay API request failed:', error);
      this.isApiAvailable = false;
      throw error;
    }
  }

  private generateSearchTerms(mood?: string, color?: string): string[] {
    const moodTerms: Record<string, string[]> = {
      peaceful: ['zen', 'meditation', 'calm water', 'peaceful nature'],
      tender: ['soft light', 'gentle', 'warm colors', 'comfort'],
      growing: ['sunrise', 'plants', 'growth', 'new beginnings'],
      joyful: ['bright', 'flowers', 'sunshine', 'happiness'],
      reflective: ['quiet', 'contemplation', 'serene', 'mindful']
    };

    const colorTerms: Record<string, string[]> = {
      sage: ['green nature', 'forest', 'leaves'],
      pink: ['soft pink', 'gentle', 'warm'],
      lavender: ['purple flowers', 'calming', 'peaceful'],
      blue: ['sky', 'water', 'ocean', 'calm blue']
    };

    let terms = ['nature', 'peaceful', 'calm', 'serene'];

    if (mood && moodTerms[mood]) {
      terms = [...terms, ...moodTerms[mood]];
    }

    if (color && colorTerms[color]) {
      terms = [...terms, ...colorTerms[color]];
    }

    return terms;
  }

  private getFallbackImages(count: number = 8): Array<{ url: string; tags: string }> {
    const shuffled = [...FALLBACK_IMAGES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map((url, index) => ({
      url,
      tags: `peaceful nature calming wellness ${index}`
    }));
  }

  async searchCalmingImages(mood?: string, color?: string): Promise<Array<{ url: string; tags: string }>> {
    // If API is not available, return fallback images immediately
    if (!this.isApiAvailable) {
      return this.getFallbackImages();
    }

    const searchTerms = this.generateSearchTerms(mood, color);
    const query = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    const cacheKey = this.getCacheKey(query, 'image');

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data;
    }

    try {
      const response = await this.makeRequest('', {
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        min_width: 640,
        min_height: 480,
        per_page: 20
      });

      if (response.hits && response.hits.length > 0) {
        const images = (response.hits as PixabayImage[]).map(hit => ({
          url: hit.webformatURL,
          tags: hit.tags
        }));

        // Cache the results
        this.cache.set(cacheKey, {
          data: images,
          timestamp: Date.now()
        });

        return images;
      } else {
        // No results from API, use fallbacks
        return this.getFallbackImages();
      }
    } catch (error) {
      console.warn('Failed to fetch from Pixabay, using fallback images:', error);
      return this.getFallbackImages();
    }
  }

  async searchCalmingVideos(mood?: string, color?: string): Promise<Array<{ url: string; tags: string }>> {
    // If API is not available, return empty array (no video fallbacks)
    if (!this.isApiAvailable) {
      return [];
    }

    const searchTerms = this.generateSearchTerms(mood, color);
    const query = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    const cacheKey = this.getCacheKey(query, 'video');

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data;
    }

    try {
      const response = await this.makeRequest('videos/', {
        q: query,
        category: 'nature',
        min_width: 640,
        min_height: 480,
        per_page: 10
      });

      if (response.hits && response.hits.length > 0) {
        const videos = (response.hits as PixabayVideo[])
          .filter(hit => hit.videos?.medium?.url)
          .map(hit => ({
            url: hit.videos.medium.url,
            tags: hit.tags
          }));

        // Cache the results
        this.cache.set(cacheKey, {
          data: videos,
          timestamp: Date.now()
        });

        return videos;
      }
    } catch (error) {
      console.warn('Failed to fetch videos from Pixabay:', error);
    }

    return [];
  }

  // Method to check if API is available
  isAvailable(): boolean {
    return this.isApiAvailable;
  }

  // Method to reset API availability (for retry scenarios)
  resetAvailability(): void {
    if (this.apiKey && this.apiKey !== 'your_pixabay_api_key_here') {
      this.isApiAvailable = true;
    }
  }
}

export const pixabayAPI = new PixabayAPI();