interface PixabayImage {
  id: number;
  webformatURL: string;
  largeImageURL: string;
  previewURL: string;
  tags: string;
  user: string;
  views: number;
  likes: number;
  imageWidth: number;
  imageHeight: number;
}

interface PixabayVideo {
  id: number;
  videos: {
    medium: {
      url: string;
    };
    large?: {
      url: string;
    };
  };
  tags: string;
  user: string;
  views: number;
  likes: number;
  duration: number;
}

interface PixabayResponse {
  hits: PixabayImage[] | PixabayVideo[];
  total: number;
}

export interface ProcessedMedia {
  id: number;
  url: string;
  previewUrl?: string;
  title: string;
  tags: string[];
  author: string;
  type: 'image' | 'video';
  duration?: number;
  stats: {
    views: number;
    likes: number;
  };
}

export interface MoodBasedContent {
  images: ProcessedMedia[];
  videos: ProcessedMedia[];
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
  private favoriteMedia = new Set<number>();

  constructor() {
    this.apiKey = import.meta.env.VITE_PIXABAY_API_KEY || '';
    
    // Check if API key is configured and not a placeholder
    if (!this.apiKey || this.apiKey === 'your_pixabay_api_key_here') {
      console.info('Pixabay API key not configured. Using fallback images.');
      this.isApiAvailable = false;
    }

    // Load favorites from localStorage
    this.loadFavorites();
  }

  private loadFavorites(): void {
    try {
      const saved = localStorage.getItem('pixabay_favorites');
      if (saved) {
        const favorites = JSON.parse(saved);
        this.favoriteMedia = new Set(favorites);
      }
    } catch (error) {
      console.warn('Failed to load favorites:', error);
    }
  }

  private saveFavorites(): void {
    try {
      localStorage.setItem('pixabay_favorites', JSON.stringify([...this.favoriteMedia]));
    } catch (error) {
      console.warn('Failed to save favorites:', error);
    }
  }

  public saveFavoriteMedia(media: ProcessedMedia): void {
    this.favoriteMedia.add(media.id);
    this.saveFavorites();
  }

  public removeFavoriteMedia(mediaId: number): void {
    this.favoriteMedia.delete(mediaId);
    this.saveFavorites();
  }

  public isFavorited(mediaId: number): boolean {
    return this.favoriteMedia.has(mediaId);
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
      reflective: ['quiet', 'contemplation', 'serene', 'mindful'],
      content: ['satisfaction', 'harmony', 'balance', 'contentment'],
      heavy: ['clouds', 'rain', 'contemplative', 'moody'],
      frustrated: ['storm', 'waves', 'dynamic', 'energy'],
      hopeful: ['dawn', 'light', 'hope', 'optimism'],
      tired: ['rest', 'quiet', 'soft', 'gentle']
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

  private getFallbackImages(count: number = 8): ProcessedMedia[] {
    const shuffled = [...FALLBACK_IMAGES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map((url, index) => ({
      id: 1000000 + index, // Use high IDs to avoid conflicts
      url,
      previewUrl: url,
      title: `Peaceful Nature ${index + 1}`,
      tags: ['peaceful', 'nature', 'calming', 'wellness'],
      author: 'Pexels',
      type: 'image' as const,
      stats: {
        views: Math.floor(Math.random() * 10000) + 1000,
        likes: Math.floor(Math.random() * 1000) + 100
      }
    }));
  }

  private processPixabayImage(hit: PixabayImage): ProcessedMedia {
    return {
      id: hit.id,
      url: hit.largeImageURL || hit.webformatURL,
      previewUrl: hit.previewURL || hit.webformatURL,
      title: hit.tags.split(',')[0]?.trim() || 'Peaceful Image',
      tags: hit.tags.split(',').map(tag => tag.trim()),
      author: hit.user || 'Unknown',
      type: 'image',
      stats: {
        views: hit.views || 0,
        likes: hit.likes || 0
      }
    };
  }

  private processPixabayVideo(hit: PixabayVideo): ProcessedMedia {
    return {
      id: hit.id,
      url: hit.videos?.large?.url || hit.videos?.medium?.url || '',
      previewUrl: hit.videos?.medium?.url,
      title: hit.tags.split(',')[0]?.trim() || 'Peaceful Video',
      tags: hit.tags.split(',').map(tag => tag.trim()),
      author: hit.user || 'Unknown',
      type: 'video',
      duration: hit.duration || 0,
      stats: {
        views: hit.views || 0,
        likes: hit.likes || 0
      }
    };
  }

  async searchCalmingImages(options: {
    query?: string;
    mood?: string;
    color?: string;
    safeSearch?: boolean;
  } = {}): Promise<ProcessedMedia[]> {
    // If API is not available, return fallback images immediately
    if (!this.isApiAvailable) {
      return this.getFallbackImages();
    }

    const { query, mood, color } = options;
    let searchQuery: string;

    if (query) {
      searchQuery = query;
    } else {
      const searchTerms = this.generateSearchTerms(mood, color);
      searchQuery = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    }

    const cacheKey = this.getCacheKey(searchQuery, 'image');

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data;
    }

    try {
      const response = await this.makeRequest('', {
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        min_width: 640,
        min_height: 480,
        per_page: 20
      });

      if (response.hits && response.hits.length > 0) {
        const images = (response.hits as PixabayImage[]).map(hit => this.processPixabayImage(hit));

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

  async searchCalmingVideos(options: {
    query?: string;
    mood?: string;
    color?: string;
    safeSearch?: boolean;
  } = {}): Promise<ProcessedMedia[]> {
    // If API is not available, return empty array (no video fallbacks)
    if (!this.isApiAvailable) {
      return [];
    }

    const { query, mood, color } = options;
    let searchQuery: string;

    if (query) {
      searchQuery = query;
    } else {
      const searchTerms = this.generateSearchTerms(mood, color);
      searchQuery = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    }

    const cacheKey = this.getCacheKey(searchQuery, 'video');

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data;
    }

    try {
      const response = await this.makeRequest('videos/', {
        q: searchQuery,
        category: 'nature',
        min_width: 640,
        min_height: 480,
        per_page: 10
      });

      if (response.hits && response.hits.length > 0) {
        const videos = (response.hits as PixabayVideo[])
          .filter(hit => hit.videos?.medium?.url)
          .map(hit => this.processPixabayVideo(hit));

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

  async getMoodBasedContent(
    mood?: string,
    color?: string,
    contentType: 'image' | 'video' | 'both' = 'both'
  ): Promise<MoodBasedContent> {
    const results: MoodBasedContent = {
      images: [],
      videos: []
    };

    if (contentType === 'image' || contentType === 'both') {
      results.images = await this.searchCalmingImages({ mood, color });
    }

    if (contentType === 'video' || contentType === 'both') {
      results.videos = await this.searchCalmingVideos({ mood, color });
    }

    return results;
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