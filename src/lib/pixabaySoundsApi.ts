// Pixabay Sounds API integration for emotion-aligned audio
interface PixabaySound {
  id: number;
  url: string;
  preview_url: string;
  tags: string;
  user: string;
  duration: number;
  downloads: number;
}

interface PixabaySoundsResponse {
  hits: PixabaySound[];
  total: number;
}

export interface ProcessedSound {
  id: number;
  url: string;
  previewUrl: string;
  title: string;
  tags: string[];
  author: string;
  duration: number;
  downloads: number;
}

// Fallback sounds - clean, generated audio for when API is unavailable
const FALLBACK_SOUNDS = [
  {
    id: 9000001,
    title: "Gentle Ocean Waves",
    description: "Soft ocean sounds for relaxation",
    type: "ocean",
    duration: 300
  },
  {
    id: 9000002,
    title: "Soft Rain",
    description: "Gentle rainfall for peace",
    type: "rain",
    duration: 300
  },
  {
    id: 9000003,
    title: "Calm Piano",
    description: "Soothing piano tones",
    type: "piano",
    duration: 300
  },
  {
    id: 9000004,
    title: "Forest Ambience",
    description: "Peaceful nature sounds",
    type: "forest",
    duration: 300
  }
];

class PixabaySoundsAPI {
  private apiKey: string;
  private baseUrl = 'https://pixabay.com/api/sounds/';
  private cache = new Map<string, { data: ProcessedSound[]; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  private isApiAvailable = true;

  constructor() {
    this.apiKey = import.meta.env.VITE_PIXABAY_API_KEY || '';
    
    // Check if API key is configured
    if (!this.apiKey || this.apiKey === 'your_pixabay_api_key_here') {
      console.info('Pixabay API key not configured. Using fallback audio generation.');
      this.isApiAvailable = false;
    }
  }

  // Emotion + Color to search term mapping
  private getSearchTerms(emotion?: string, color?: string): string[] {
    const emotionMapping: Record<string, string[]> = {
      tender: ["soft ambient", "gentle", "warm tones"],
      heavy: ["slow piano", "contemplative", "deep"],
      peaceful: ["calm nature", "meditation", "zen"],
      frustrated: ["calm rain", "soothing", "release"],
      joyful: ["light harp", "uplifting", "bright"],
      content: ["harmony", "peaceful", "satisfied"],
      growing: ["inspiring", "hopeful", "progress"],
      tired: ["rest", "sleep", "gentle"],
      hopeful: ["uplifting", "dawn", "optimistic"]
    };

    const colorMapping: Record<string, string[]> = {
      "soft pink": ["warm", "gentle", "nurturing"],
      "warm sage": ["nature", "grounding", "earth"],
      "gentle lavender": ["calm", "peaceful", "serene"],
      "sunset orange": ["warm", "energizing", "comfort"],
      "golden cream": ["soft", "warm", "golden"],
      "ocean blue": ["water", "flowing", "deep"]
    };

    let terms = ["calm", "peaceful", "gentle", "ambient"];

    if (emotion && emotionMapping[emotion.toLowerCase()]) {
      terms = [...terms, ...emotionMapping[emotion.toLowerCase()]];
    }

    if (color && colorMapping[color.toLowerCase()]) {
      terms = [...terms, ...colorMapping[color.toLowerCase()]];
    }

    return terms;
  }

  // Generate fallback audio using our audio engine
  private async generateFallbackAudio(soundType: string): Promise<ProcessedSound[]> {
    const { audioEngine } = await import('./audioEngine');
    
    return FALLBACK_SOUNDS.map(sound => ({
      id: sound.id,
      url: `generated://${sound.type}`, // Special URL to indicate generated audio
      previewUrl: `generated://${sound.type}`,
      title: sound.title,
      tags: [sound.type, "generated", "calming"],
      author: "Audio Engine",
      duration: sound.duration,
      downloads: 0
    }));
  }

  private async makeRequest(params: Record<string, any>): Promise<PixabaySoundsResponse> {
    if (!this.isApiAvailable) {
      throw new Error('Pixabay Sounds API not available');
    }

    const url = new URL(this.baseUrl);
    url.searchParams.append('key', this.apiKey);
    url.searchParams.append('safesearch', 'true');
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        if (response.status === 400) {
          console.warn('Pixabay Sounds API key appears to be invalid. Using fallback audio.');
          this.isApiAvailable = false;
          throw new Error('Invalid API key');
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn('Pixabay Sounds API request failed:', error);
      this.isApiAvailable = false;
      throw error;
    }
  }

  private processPixabaySound(hit: PixabaySound): ProcessedSound {
    return {
      id: hit.id,
      url: hit.url,
      previewUrl: hit.preview_url || hit.url,
      title: hit.tags.split(',')[0]?.trim() || 'Calming Sound',
      tags: hit.tags.split(',').map(tag => tag.trim()),
      author: hit.user || 'Unknown',
      duration: hit.duration || 0,
      downloads: hit.downloads || 0
    };
  }

  async searchEmotionAlignedSounds(options: {
    emotion?: string;
    color?: string;
    query?: string;
  } = {}): Promise<ProcessedSound[]> {
    const { emotion, color, query } = options;
    
    // If API is not available, return fallback sounds
    if (!this.isApiAvailable) {
      return this.generateFallbackAudio(emotion || 'calm');
    }

    let searchQuery: string;
    
    if (query) {
      searchQuery = query;
    } else {
      const searchTerms = this.getSearchTerms(emotion, color);
      searchQuery = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    }

    const cacheKey = `${searchQuery}_${emotion}_${color}`;

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data;
    }

    try {
      const response = await this.makeRequest({
        q: searchQuery,
        category: 'music',
        min_duration: 30,
        max_duration: 600, // 10 minutes max
        per_page: 10
      });

      if (response.hits && response.hits.length > 0) {
        const sounds = response.hits.map(hit => this.processPixabaySound(hit));

        // Cache the results
        this.cache.set(cacheKey, {
          data: sounds,
          timestamp: Date.now()
        });

        return sounds;
      } else {
        // No results from API, use fallbacks
        return this.generateFallbackAudio(emotion || 'calm');
      }
    } catch (error) {
      console.warn('Failed to fetch sounds from Pixabay, using fallback audio:', error);
      return this.generateFallbackAudio(emotion || 'calm');
    }
  }

  // Get randomized variants for "Try a New Sound" feature
  async getRandomizedSounds(baseEmotion?: string): Promise<ProcessedSound[]> {
    const variants = ["gentle", "calming", "healing", "soft", "peaceful", "ambient"];
    const randomVariant = variants[Math.floor(Math.random() * variants.length)];
    
    return this.searchEmotionAlignedSounds({
      emotion: baseEmotion,
      query: randomVariant
    });
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheTimeout;
  }

  // Check if API is available
  isAvailable(): boolean {
    return this.isApiAvailable;
  }

  // Reset API availability for retry
  resetAvailability(): void {
    if (this.apiKey && this.apiKey !== 'your_pixabay_api_key_here') {
      this.isApiAvailable = true;
    }
  }
}

export const pixabaySoundsAPI = new PixabaySoundsAPI();