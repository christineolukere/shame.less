# shame.less

A gentle daily companion for emotional wellness, designed specifically for young women of color navigating mental health challenges.

## Features

### 🎨 Dynamic Visual Content
- **Pixabay Integration**: Automatically pulls calming images and ambient videos based on user mood and emotions
- **Mood-Based Visuals**: Content adapts to your current emotional state (peaceful, tender, growing, etc.)
- **Color-Responsive**: Visuals match your selected color energy (warm sage, soft pink, gentle lavender, etc.)
- **Fallback Content**: Curated Pexels images ensure content is always available

### 🔊 Enhanced Audio Experience
- **Text-to-Speech Affirmations**: Multiple voice options with customizable rate and pitch
- **Ambient Sound Generation**: Clean, generated audio tones for relaxation
- **Crisis Support Audio**: Calming sounds for the Soft Landing feature
- **No Autoplay**: All audio is user-initiated for a respectful experience

### 🌍 Cultural Responsiveness
- **Multi-language Support**: English, Spanish, French, Swahili
- **Culturally-Specific Content**: Resources and affirmations adapted for different cultural backgrounds
- **Intersectional Awareness**: Content that honors diverse identities and experiences

### 🛡️ Safety & Privacy
- **Content Safety Filters**: All external content is filtered for appropriateness
- **Crisis Support Integration**: Direct links to crisis text lines and suicide prevention
- **Privacy-First**: User data stays local or in secure Supabase storage
- **No Tracking**: No analytics or user behavior tracking

### 📱 Core Features
- **Gentle Check-ins**: Mood tracking with personalized responses
- **Win Celebrations**: Acknowledge progress with dynamic celebrations
- **Safe Journaling**: Private space for thoughts with AI letter generation
- **Daily Affirmations**: Culturally-responsive affirmations with audio
- **Resource Garden**: Curated mental health resources for women of color
- **Soft Landing**: Emergency comfort tools for crisis moments

## Setup

### Prerequisites
- Node.js 18+
- Supabase account
- Pixabay API key (optional, fallback content available)

### Environment Variables
Copy `.env.example` to `.env` and configure:

```bash
# Optional: Pixabay API for dynamic content
VITE_PIXABAY_API_KEY=your_pixabay_api_key_here

# Required: Supabase configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation
```bash
npm install
npm run dev
```

### Pixabay API Setup (Optional)
1. Create a free account at [Pixabay](https://pixabay.com/accounts/register/)
2. Get your API key from [Pixabay API](https://pixabay.com/api/docs/)
3. Add the key to your `.env` file as `VITE_PIXABAY_API_KEY`

Without a Pixabay API key, the app will use curated fallback images from Pexels.

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Audio**: Web Audio API, Speech Synthesis API
- **Media**: Pixabay API with Pexels fallbacks
- **Deployment**: Netlify

## API Integration

### Pixabay Features
- **Smart Search**: Automatically generates search terms based on user mood and color preferences
- **Content Filtering**: Safe search enabled by default
- **Caching**: 5-minute cache to reduce API calls and improve performance
- **Fallback System**: Graceful degradation to curated content when API is unavailable

### Audio Features
- **Generated Tones**: Clean sine, triangle, and sawtooth waves for meditation
- **Natural Sounds**: Algorithmically generated ocean, rain, and forest sounds
- **Voice Synthesis**: Multiple voice options for affirmation playback
- **Volume Control**: User-controlled audio levels with smooth transitions

## Contributing

This project is designed to be a safe, supportive space. Contributions should align with our values of:
- Cultural sensitivity and inclusivity
- Trauma-informed design
- Privacy and safety first
- Accessibility for all users

## License

MIT License - see LICENSE file for details.

## Support

If you're in crisis, please reach out for professional help:
- Crisis Text Line: Text HOME to 741741
- Suicide Prevention: Call or text 988
- Emergency: Call 911

This app is not a replacement for professional mental health care.