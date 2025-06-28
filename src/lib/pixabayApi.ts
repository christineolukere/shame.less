// Pixabay API integration for dynamic audio and visual content
interface PixabayConfig {
  apiKey: string;
  baseUrl: string;
}

interface PixabayImageResult {
  id: number;
  webformatURL: string;
  largeImageURL: string;
  tags: string;
  user: string;
  views: number;
  downloads: number;
  likes: number;
  previewURL: string;
}

interface PixabayVideoResult {
  id: number;
  url: string;
  tags: string;
  duration: number;
  user: string;
  views: number;
  downloads: number;
  likes: number;
  picture_id: string;
  videos: {
    large: { url: string; size: number };
    medium: { url: string; size: number };
    small: { url: string; size: number };
    tiny: { url: string; size: number };
  };
}

interface PixabayResponse<T> {
  total: number;
  totalHits: number;
  hits: T[];
}

interface MediaSearchParams {
  query: string;
  category?: string;
  mood?: string;
  color?: string;
  orientation?: 'horizontal' | 'vertical' | 'all';
  minWidth?: number;
  minHeight?: number;
  safeSearch?: boolean;
}

interface ProcessedMedia {
  id: string;
  url: string;
  previewUrl?: string;
  tags: string[];
  title: string;
  author: string;
  stats: {
    views: number;
    downloads: number;
    likes: number;
  };
  type: 'image' | 'video' | 'audio';
  duration?: number;
  metadata?: any;
}

class PixabayAPI {
  private config: PixabayConfig;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_PIXABAY_API_KEY || 'demo-key',
      baseUrl: 'https://pixabay.com/api/'
    };
  }

  private getCacheKey(endpoint: string, params: any): string {
    return `${endpoint}_${JSON.stringify(params)}`;
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, any>): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint, params);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const url = new URL(endpoint, this.config.baseUrl);
    url.searchParams.append('key', this.config.apiKey);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Pixabay API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Pixabay API request failed:', error);
      throw error;
    }
  }

  // Generate mood-based search terms
  private getMoodSearchTerms(mood: string, color?: string): string[] {
    const moodTerms: Record<string, string[]> = {
      peaceful: ['zen', 'calm', 'serene', 'tranquil', 'meditation', 'peaceful'],
      content: ['happy', 'satisfied', 'comfortable', 'cozy', 'warm'],
      tender: ['gentle', 'soft', 'delicate', 'caring', 'nurturing'],
      heavy: ['contemplative', 'thoughtful', 'introspective', 'quiet'],
      frustrated: ['storm', 'release', 'movement', 'energy'],
      growing: ['growth', 'nature', 'plants', 'sunrise', 'journey'],
      hopeful: ['light', 'dawn', 'bright', 'optimistic', 'future'],
      tired: ['rest', 'sleep', 'comfort', 'cozy', 'relaxation']
    };

    const colorTerms: Record<string, string[]> = {
      'soft pink': ['pink', 'rose', 'blush', 'gentle'],
      'warm sage': ['green', 'sage', 'nature', 'earth'],
      'gentle lavender': ['purple', 'lavender', 'violet', 'calm'],
      'sunset orange': ['orange', 'sunset', 'warm', 'golden'],
      'golden cream': ['cream', 'beige', 'warm', 'soft'],
      'ocean blue': ['blue', 'ocean', 'water', 'sky']
    };

    let terms = moodTerms[mood.toLowerCase()] || ['peaceful', 'calm'];
    
    if (color) {
      const colorTermsArray = colorTerms[color.toLowerCase()] || [];
      terms = [...terms, ...colorTermsArray];
    }

    return terms;
  }

  // Search for calming images based on mood and color
  async searchCalmingImages(params: MediaSearchParams): Promise<ProcessedMedia[]> {
    try {
      const searchTerms = this.getMoodSearchTerms(params.mood || 'peaceful', params.color);
      const query = params.query || searchTerms.join(' OR ');

      const response = await this.makeRequest<PixabayResponse<PixabayImageResult>>('', {
        q: query,
        image_type: 'photo',
        orientation: params.orientation || 'horizontal',
        category: params.category || 'nature',
        min_width: params.minWidth || 640,
        min_height: params.minHeight || 480,
        safesearch: params.safeSearch !== false ? 'true' : 'false',
        per_page: 20,
        order: 'popular'
      });

      return response.hits.map(hit => ({
        id: hit.id.toString(),
        url: hit.largeImageURL,
        previewUrl: hit.webformatURL,
        tags: hit.tags.split(', '),
        title: hit.tags.split(', ')[0] || 'Calming Image',
        author: hit.user,
        stats: {
          views: hit.views,
          downloads: hit.downloads,
          likes: hit.likes
        },
        type: 'image' as const
      }));
    } catch (error) {
      console.error('Error searching calming images:', error);
      return this.getFallbackImages(params.mood, params.color);
    }
  }

  // Search for ambient videos
  async searchAmbientVideos(params: MediaSearchParams): Promise<ProcessedMedia[]> {
    try {
      const searchTerms = this.getMoodSearchTerms(params.mood || 'peaceful', params.color);
      const query = params.query || searchTerms.join(' OR ');

      const response = await this.makeRequest<PixabayResponse<PixabayVideoResult>>('videos/', {
        q: query,
        category: params.category || 'nature',
        min_width: params.minWidth || 640,
        min_height: params.minHeight || 480,
        safesearch: params.safeSearch !== false ? 'true' : 'false',
        per_page: 10,
        order: 'popular'
      });

      return response.hits.map(hit => ({
        id: hit.id.toString(),
        url: hit.videos.medium.url,
        previewUrl: `https://i.vimeocdn.com/video/${hit.picture_id}_640x360.jpg`,
        tags: hit.tags.split(', '),
        title: hit.tags.split(', ')[0] || 'Ambient Video',
        author: hit.user,
        stats: {
          views: hit.views,
          downloads: hit.downloads,
          likes: hit.likes
        },
        type: 'video' as const,
        duration: hit.duration
      }));
    } catch (error) {
      console.error('Error searching ambient videos:', error);
      return [];
    }
  }

  // Get mood-specific content recommendations
  async getMoodBasedContent(mood: string, color?: string, contentType: 'image' | 'video' | 'both' = 'both'): Promise<{
    images: ProcessedMedia[];
    videos: ProcessedMedia[];
  }> {
    const params: MediaSearchParams = {
      query: '',
      mood,
      color,
      safeSearch: true
    };

    const results = {
      images: [] as ProcessedMedia[],
      videos: [] as ProcessedMedia[]
    };

    try {
      if (contentType === 'image' || contentType === 'both') {
        results.images = await this.searchCalmingImages(params);
      }

      if (contentType === 'video' || contentType === 'both') {
        results.videos = await this.searchAmbientVideos(params);
      }
    } catch (error) {
      console.error('Error getting mood-based content:', error);
    }

    return results;
  }

  // Fallback images when API fails
  private getFallbackImages(mood?: string, color?: string): ProcessedMedia[] {
    const fallbackImages = [
      {
        id: 'fallback-1',
        url: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        previewUrl: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=640&h=480&dpr=1',
        tags: ['nature', 'peaceful', 'water'],
        title: 'Peaceful Water',
        author: 'Pexels',
        stats: { views: 0, downloads: 0, likes: 0 },
        type: 'image' as const
      },
      {
        id: 'fallback-2',
        url: 'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        previewUrl: 'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg?auto=compress&cs=tinysrgb&w=640&h=480&dpr=1',
        tags: ['forest', 'calm', 'green'],
        title: 'Forest Path',
        author: 'Pexels',
        stats: { views: 0, downloads: 0, likes: 0 },
        type: 'image' as const
      },
      {
        id: 'fallback-3',
        url: 'https://images.pexels.com/photos/1366630/pexels-photo-1366630.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        previewUrl: 'https://images.pexels.com/photos/1366630/pexels-photo-1366630.jpeg?auto=compress&cs=tinysrgb&w=640&h=480&dpr=1',
        tags: ['sunset', 'warm', 'peaceful'],
        title: 'Gentle Sunset',
        author: 'Pexels',
        stats: { views: 0, downloads: 0, likes: 0 },
        type: 'image' as const
      }
    ];

    return fallbackImages;
  }

  // Save user's favorite media
  saveFavoriteMedia(media: ProcessedMedia): void {
    try {
      const favorites = this.getFavoriteMedia();
      const exists = favorites.find(fav => fav.id === media.id);
      
      if (!exists) {
        favorites.unshift({ ...media, savedAt: new Date().toISOString() });
        localStorage.setItem('shameless_favorite_media', JSON.stringify(favorites.slice(0, 50))); // Limit to 50
      }
    } catch (error) {
      console.error('Error saving favorite media:', error);
    }
  }

  // Get user's favorite media
  getFavoriteMedia(): (ProcessedMedia & { savedAt: string })[] {
    try {
      const favorites = localStorage.getItem('shameless_favorite_media');
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error loading favorite media:', error);
      return [];
    }
  }

  // Remove from favorites
  removeFavoriteMedia(mediaId: string): void {
    try {
      const favorites = this.getFavoriteMedia();
      const updated = favorites.filter(fav => fav.id !== mediaId);
      localStorage.setItem('shameless_favorite_media', JSON.stringify(updated));
    } catch (error) {
      console.error('Error removing favorite media:', error);
    }
  }

  // Check if media is favorited
  isFavorited(mediaId: string): boolean {
    const favorites = this.getFavoriteMedia();
    return favorites.some(fav => fav.id === mediaId);
  }

  // Clear cache (useful for testing or memory management)
  clearCache(): void {
    this.cache.clear();
  }
}

// Singleton instance
export const pixabayAPI = new PixabayAPI();

// Export types for use in components
export type { ProcessedMedia, MediaSearchParams };