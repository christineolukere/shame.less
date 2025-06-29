# shame.less

A gentle daily companion for emotional wellness, designed specifically for young women of color navigating mental health challenges.

## Features

### 🎵 Local Audio Experience
- **Local Sound Files**: Curated ambient audio files stored locally for reliable playback
- **Emotion-Aligned Audio**: Content adapts to your current emotional state
- **Simple Audio Player**: Clean, responsive HTML5 audio controls
- **Text-to-Speech Affirmations**: Multiple voice options with customizable rate and pitch
- **No External Dependencies**: All audio works offline without API calls

### 🌍 Cultural Responsiveness
- **Multi-language Support**: English, Spanish, French, Swahili
- **Culturally-Specific Content**: Resources and affirmations adapted for different cultural backgrounds
- **Intersectional Awareness**: Content that honors diverse identities and experiences

### 🛡️ Safety & Privacy
- **Content Safety Filters**: All content is filtered for appropriateness
- **Crisis Support Integration**: Direct links to crisis text lines and suicide prevention
- **Privacy-First**: User data stays local or in secure Supabase storage
- **No Tracking**: No analytics or user behavior tracking
- **Secure Storage**: Data kept secure via Supabase with RLS

### 📱 Core Features
- **Gentle Check-ins**: Mood tracking with personalized responses and matching audio
- **Win Celebrations**: Acknowledge progress with dynamic celebrations
- **Safe Journaling**: Private space for thoughts with AI letter generation
- **Daily Affirmations**: Culturally-responsive affirmations with audio playback
- **Resource Garden**: Curated mental health resources for women of color
- **Soft Landing**: Emergency comfort tools with calming audio for crisis moments

## Setup

### Prerequisites
- Node.js 18+
- Supabase account

### Environment Variables
Copy `.env.example` to `.env` and configure:

```bash
# Required: Supabase configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation
```bash
npm install
npm run dev
```

### Audio Files
Place your ambient audio files in `/public/sounds/`:
- `medium-light-rain.mp3`
- `amazon-forest-sounds-uruara-para-brazil.wav`
- `tranquil-harmony-calm-piano.mp3`
- `ocean-waves-big-lagoon.wav`

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Audio**: Web Audio API, Speech Synthesis API, Local MP3/WAV files
- **Deployment**: Netlify

## Audio Features
- **Local Files**: Reliable ambient sounds stored in `/public/sounds/`
- **Responsive Player**: HTML5 audio with custom controls
- **Voice Synthesis**: Multiple voice options for affirmation playback
- **Volume Control**: User-controlled audio levels
- **Loop Support**: Continuous playback for ambient sounds

## Security & Privacy

### User Privacy
- **Local Storage**: Guest data stored locally with option to migrate
- **Secure Database**: Authenticated user data in Supabase with RLS
- **No Tracking**: No analytics or behavioral tracking
- **Data Ownership**: Users control their data with export/delete options

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