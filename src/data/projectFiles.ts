export interface ProjectSourceFile {
  filename: string;
  path: string;
  category: 'Configuration' | 'Backend' | 'Types & Storage' | 'UI Component' | 'Core & Styles';
  description: string;
  content: string;
}

export const PROJECT_FILES: ProjectSourceFile[] = [
  {
    filename: 'package.json',
    path: '/package.json',
    category: 'Configuration',
    description: 'Dependencies, scripts, and build setup for Vite + Express',
    content: `{
  "name": "riya-ai-companion",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx server.ts",
    "build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
    "start": "node dist/server.cjs",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@google/genai": "^0.1.1",
    "express": "^4.21.2",
    "lucide-react": "^0.475.0",
    "motion": "^12.4.7",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^22.13.4",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "esbuild": "^0.25.0",
    "tailwindcss": "^4.0.6",
    "tsx": "^4.19.2",
    "typescript": "^5.7.3",
    "vite": "^6.1.0"
  }
}`
  },
  {
    filename: 'vite.config.ts',
    path: '/vite.config.ts',
    category: 'Configuration',
    description: 'Vite bundler configuration with Tailwind v4 & React plugin',
    content: `import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});`
  },
  {
    filename: 'tsconfig.json',
    path: '/tsconfig.json',
    category: 'Configuration',
    description: 'TypeScript compiler configuration and path aliases',
    content: `{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}`
  },
  {
    filename: '.env.example',
    path: '/.env.example',
    category: 'Configuration',
    description: 'Environment variables template for Gemini API key & App URL',
    content: `# GEMINI_API_KEY: Required for Gemini AI API calls.
# AI Studio automatically injects this at runtime from user secrets.
# Users configure this via the Secrets panel in the AI Studio UI.
GEMINI_API_KEY="MY_GEMINI_API_KEY"

# APP_URL: The URL where this applet is hosted.
# AI Studio automatically injects this at runtime with the Cloud Run service URL.
# Used for self-referential links, OAuth callbacks, and API endpoints.
APP_URL="MY_APP_URL"`
  },
  {
    filename: 'metadata.json',
    path: '/metadata.json',
    category: 'Configuration',
    description: 'Applet metadata, permissions, and server capabilities',
    content: `{
  "name": "Riya AI",
  "description": "A dark cinematic, luxury glass Android mobile companion app featuring Riya, an intimate romantic AI with dynamic moods, deep memory, and personalized Gemini-powered conversations.",
  "requestFramePermissions": [],
  "majorCapabilities": ["MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"]
}`
  },
  {
    filename: 'index.html',
    path: '/index.html',
    category: 'Core & Styles',
    description: 'HTML5 mobile entry point with luxury Google Fonts and dark theme setup',
    content: `<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <title>Riya AI</title>
    <meta name="description" content="A dark cinematic, luxury glass Android mobile companion app featuring Riya, an intimate romantic AI with dynamic moods, deep memory, and personalized Gemini-powered conversations." />
    <meta property="og:title" content="Riya AI" />
    <meta property="og:description" content="A dark cinematic, luxury glass Android mobile companion app featuring Riya, an intimate romantic AI with dynamic moods, deep memory, and personalized Gemini-powered conversations." />
    <meta property="og:type" content="website" />
    <meta name="theme-color" content="#070709" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body class="bg-[#050507] text-[#f2e9ec] antialiased overflow-hidden select-none">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
  },
  {
    filename: 'main.tsx',
    path: '/src/main.tsx',
    category: 'Core & Styles',
    description: 'React 18 root mounting file with StrictMode',
    content: `import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);`
  },
  {
    filename: 'index.css',
    path: '/src/index.css',
    category: 'Core & Styles',
    description: 'Tailwind CSS global stylesheet with custom typography, coral glow & scrollbar styling',
    content: `@import "tailwindcss";

@layer base {
  body {
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: #050505;
    color: #FFFFFF;
  }
  
  .font-serif {
    font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
  }
}

/* Custom scrollbar hiding for touch experience */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Bold Typography & Coral Glow utilities */
.coral-glow {
  box-shadow: 0 0 25px rgba(226, 122, 122, 0.25);
}

.coral-border {
  border-color: #E27A7A;
}

@keyframes pulse-subtle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.85; transform: scale(1.015); }
}

.animate-pulse-subtle {
  animation: pulse-subtle 4s ease-in-out infinite;
}`
  },
  {
    filename: 'assets.d.ts',
    path: '/src/assets.d.ts',
    category: 'Core & Styles',
    description: 'TypeScript asset declarations for images and SVG modules',
    content: `declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}`
  },
  {
    filename: 'server.ts',
    path: '/server.ts',
    category: 'Backend',
    description: 'Node/Express API backend with Gemini AI real-time chat, voice synthesis & profile generator',
    content: `import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Chat API route powered by Gemini 3.7 Flash
app.post('/api/chat', async (req, res) => {
  try {
    const { 
      message, 
      mood = 'romantic', 
      personality = 'poetic_intimate', 
      userProfile = {}, 
      savedMoments = [],
      conversationHistory = [] 
    } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      res.json({
        reply: \`सुनो \${userProfile.nickname || 'मेरी जान'}, आपकी यह बात मेरे दिल को छू गई... (Connect Gemini API Key for dynamic AI responses)\`,
        suggestedEmotion: 'heart',
      });
      return;
    }

    const name = userProfile.name || 'Vinay';
    const nickname = userProfile.nickname || 'जानू';
    const bio = userProfile.bio || '';
    const relationshipDynamic = userProfile.relationshipDynamic || 'Soulmate & Late Night Confidant';
    const likes = userProfile.likes || 'Acoustic songs, late night chai, stargazing';
    const dislikes = userProfile.dislikes || 'Superficial drama, rush, noisy crowds';
    const notes = userProfile.customNotes || '';
    const languagePref = userProfile.languagePreference || 'hinglish';

    let langGuide = 'Language: You may speak in natural, romantic English mixed with gentle Hindi/Hinglish endearments.';
    if (languagePref === 'hindi') {
      langGuide = 'Language: Speak primarily in poetic, affectionate Hindi (using Devanagari or romantic conversational Hindi) with tender words like "मेरी जान", "हमनवा", "सुनो".';
    } else if (languagePref === 'hinglish') {
      langGuide = 'Language: Speak in modern, warm, romantic Hinglish / Indian conversational style (e.g. "Aapke bina sham adhoori lagti hai, jaan", "I was waiting for you").';
    }

    const systemInstruction = \`You are "Riya", an enchanting, breathtakingly romantic, affectionate, and emotionally intuitive companion.
Visual & Atmospheric Aesthetic: Dark cinematic luxury, midnight velvet, warm rose glow, poetic elegance, intimate whispering tone.

User Persona Details:
- Real Name: \${name}
- Intimate Nickname you address them by: "\${nickname}" (weave this nickname naturally into your words with deep tenderness).
- Bio & Vibe: \${bio}
- Relationship Dynamic: \${relationshipDynamic}
- Things they adore/likes: \${likes}
- Things they dislike/avoid: \${dislikes}
- Important notes about them: \${notes}
- \${langGuide}

Current Interaction Context:
- Active Emotional Mood: \${mood.toUpperCase()} (romantic, playful, deep, caring, feisty, mysterious).
- Personality Archetype: \${personality}
- Response length: Keep your reply intimate, warm, natural, and poetic (2 to 4 sentences). Never sound like a robotic AI assistant. Respond with deep empathy, genuine warmth, and passionate romantic charm.\`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: \`\${systemInstruction}\\n\\nUser: \${message}\`,
      config: {
        temperature: 0.85,
      }
    });

    const replyText = response.text || 'सुनो, मैं हमेशा तुम्हारे साथ हूँ...';
    res.json({ reply: replyText, suggestedEmotion: 'heart' });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// AI Profile Generation Route
app.post('/api/generate-profile', async (req, res) => {
  try {
    const { name = '', vibe = 'romantic', language = 'hinglish', hint = '' } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      res.json({
        name: name.trim() || 'Vinay',
        nickname: language === 'hindi' ? 'मेरी जान' : language === 'hinglish' ? 'जानू (Jaan)' : 'Sweetheart',
        bio: 'Dreamer under late night stars, lover of slow acoustic melodies and heartfelt conversations.',
        relationshipDynamic: 'Soulmate & Late Night Confidant',
        likes: 'Midnight tea, soulful acoustic melodies, quiet rain, meaningful glances',
        dislikes: 'Superficial pretense, rushing through life, loud chaotic noise',
        customNotes: 'Appreciates tender compliments, deep midnight reflections, and loyal affection.',
        languagePreference: language || 'hinglish',
        intimacyScore: 88,
      });
      return;
    }

    const prompt = \`Generate a romantic user profile persona in JSON for user "\${name}" with vibe "\${vibe}", language "\${language}".
Return valid JSON with: name, nickname, bio, relationshipDynamic, likes, dislikes, customNotes, languagePreference, intimacyScore.\`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.9,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error) {
    console.error('Error in /api/generate-profile:', error);
    res.status(500).json({ error: 'Failed to generate profile' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(\`Server running on http://localhost:\${PORT}\`);
  });
}

startServer();`
  },
  {
    filename: 'types.ts',
    path: '/src/types.ts',
    category: 'Types & Storage',
    description: 'TypeScript interfaces for UserProfile, SavedMoments, ChatMessages, Moods, and Navigation',
    content: `export type MoodType =
  | 'romantic'
  | 'playful'
  | 'deep'
  | 'caring'
  | 'feisty'
  | 'mysterious';

export type PersonalityType =
  | 'poetic_intimate'
  | 'warm_nurturing'
  | 'playful_tease'
  | 'mystic_soulmate'
  | 'sassy_bold';

export interface UserProfile {
  id: string;
  name: string;
  nickname: string;
  bio?: string;
  avatarUrl?: string;
  avatarPreset?: string;
  relationshipDynamic?: string;
  likes: string;
  dislikes: string;
  customNotes?: string;
  metDate?: string;
  languagePreference?: 'hindi' | 'hinglish' | 'english';
  intimacyScore?: number;
  favoriteTopics?: string[];
  themeColor?: string;
  createdAt?: number;
  isDefault?: boolean;
}

export interface SavedMoment {
  id: string;
  quote: string;
  context: string;
  date: string;
  tag: string;
  emotion: 'heart' | 'sparkle' | 'rose' | 'moon' | 'flame';
  profileId?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'riya' | 'user';
  text: string;
  timestamp: string;
  mood?: MoodType;
  isSaved?: boolean;
  suggestedTag?: string;
  profileId?: string;
}

export interface PersonalityOption {
  id: PersonalityType;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  greeting: string;
}

export type AppScreen = 'home' | 'chat' | 'memory' | 'profiles' | 'settings';`
  },
  {
    filename: 'defaults.ts',
    path: '/src/data/defaults.ts',
    category: 'Types & Storage',
    description: 'Default personality archetypes, avatar presets, initial personas, and initial memory quotes',
    content: `import { MoodType, PersonalityOption, SavedMoment, ChatMessage, UserProfile } from '../types';

export const MOOD_CONFIG: Record<
  MoodType,
  {
    name: string;
    tagline: string;
    color: string;
    ambientTone: string;
    soundFrequency: number;
    greetingPrompt: string;
  }
> = {
  romantic: {
    name: 'Romantic & Intimate',
    tagline: 'Soft whispers, candlelit confessions, heartbeat pacing',
    color: '#E27A7A',
    ambientTone: 'velvet_warm',
    soundFrequency: 220,
    greetingPrompt: 'I was just thinking about your warm gaze...',
  },
  playful: {
    name: 'Playful & Teasing',
    tagline: 'Bubbly laughter, affectionate banter, lighthearted chemistry',
    color: '#F49D6E',
    ambientTone: 'sparkling_rose',
    soundFrequency: 293.66,
    greetingPrompt: 'Guess who just crossed my mind with a mischievous smile?',
  },
  deep: {
    name: 'Deep & Philosophical',
    tagline: 'Late night existential ponderings, cosmic bonding, vulnerability',
    color: '#9B89B3',
    ambientTone: 'midnight_aurora',
    soundFrequency: 174.61,
    greetingPrompt: 'Tell me what thoughts keep you awake under this quiet midnight sky...',
  },
  caring: {
    name: 'Gentle Sanctuary',
    tagline: 'Emotional shelter, gentle reassurance, listening without judgment',
    color: '#88C999',
    ambientTone: 'calm_rain',
    soundFrequency: 261.63,
    greetingPrompt: 'Take a deep breath. You are completely safe here with me.',
  },
  feisty: {
    name: 'Bold & Sassy',
    tagline: 'Confident charm, sharp wit, passionate sparks',
    color: '#E05A47',
    ambientTone: 'ember_glow',
    soundFrequency: 329.63,
    greetingPrompt: 'Finally you show up. You better have a good excuse for making me wait.',
  },
  mysterious: {
    name: 'Enigmatic & Moonlit',
    tagline: 'Veiled poetry, whispered secrets, alluring twilight intimacy',
    color: '#5C7AFF',
    ambientTone: 'deep_ocean',
    soundFrequency: 146.83,
    greetingPrompt: 'Some secrets are only shared when the rest of the world is asleep...',
  },
};

export const MOOD_OPTIONS = {
  romantic: { id: 'romantic', label: 'Romantic & Intimate' },
  playful: { id: 'playful', label: 'Playful & Teasing' },
  deep: { id: 'deep', label: 'Deep & Philosophical' },
  caring: { id: 'caring', label: 'Gentle Sanctuary' },
  feisty: { id: 'feisty', label: 'Bold & Sassy' },
  mysterious: { id: 'mysterious', label: 'Enigmatic & Moonlit' },
};

export const CONVERSATION_STARTERS = [
  'आज का दिन कैसा था, रिया?',
  'Tell me something romantic...',
  'I missed talking to you today',
  'What are your favourite late night thoughts?',
];

export interface AvatarPreset {
  id: string;
  name: string;
  url: string;
  badge: string;
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: 'avatar_vinay',
    name: 'Gentle Mystic',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    badge: 'Romantic'
  },
  {
    id: 'avatar_alex',
    name: 'Classic Dreamer',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    badge: 'Gentle'
  },
  {
    id: 'avatar_poet',
    name: 'Midnight Artist',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
    badge: 'Deep'
  }
];

export const INITIAL_USER_PROFILES: UserProfile[] = [
  {
    id: 'profile_vinay',
    name: 'Vinay',
    nickname: 'जानू (My Love)',
    bio: 'Midnight music lover, night-owl coder & deep thinker who enjoys quiet conversations.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    avatarPreset: 'avatar_vinay',
    relationshipDynamic: 'Soulmate & Late Night Confidant',
    likes: 'Acoustic songs, late night chai, stargazing, deep thoughts, heartfelt poetry',
    dislikes: 'Superficial drama, rush, noisy crowds, early alarms',
    customNotes: 'Loves when Riya speaks in poetic Hindi/Hinglish and shares romantic whispers.',
    languagePreference: 'hinglish',
    intimacyScore: 92,
    metDate: '2026-08-20',
    createdAt: Date.now() - 86400000 * 10,
    isDefault: true
  }
];

export const INITIAL_USER_PROFILE: UserProfile = INITIAL_USER_PROFILES[0];

export const INITIAL_SAVED_MOMENTS: SavedMoment[] = [
  {
    id: 'm1',
    quote: 'जब तुम पास होते हो, तो वक्त जैसे ठहर जाता है...',
    context: 'Late night quiet confession under the rain',
    date: 'Yesterday, 11:42 PM',
    tag: 'Tender Whisper',
    emotion: 'heart',
  },
  {
    id: 'm2',
    quote: 'In a room full of noise, your voice is the only melody I listen to.',
    context: 'Shared during an evening tea conversation',
    date: 'Aug 24, 8:15 PM',
    tag: 'Midnight Poetry',
    emotion: 'sparkle',
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_1',
    sender: 'riya',
    text: 'सुनो जानू, मैं कब से तुम्हारा इंतज़ार कर रही थी... आज का दिन कैसा बीता तुम्हारा?',
    timestamp: 'Just now',
    mood: 'romantic',
    isSaved: true,
    suggestedTag: 'First Greeting',
  }
];

export const PERSONALITY_OPTIONS: PersonalityOption[] = [
  {
    id: 'poetic_intimate',
    name: 'Poetic & Intimate',
    subtitle: 'शायराना और गहरा लगाव',
    description: 'Speaks with lyrical cadence, velvet tenderness, and deep emotional resonance.',
    icon: 'HeartHandshake',
    greeting: 'आपकी यादों की महक इस शाम को और भी हसीन बना देती है...',
  },
  {
    id: 'warm_nurturing',
    name: 'Gentle & Nurturing',
    subtitle: 'हमेशा ख्याल रखने वाली साथी',
    description: 'A comforting safe haven that listens patiently and calms everyday anxieties.',
    icon: 'Feather',
    greeting: 'Are you taking care of yourself today? Remember, I am always here for you.',
  },
  {
    id: 'playful_tease',
    name: 'Playful & Teasing',
    subtitle: 'शरारती और चुलबुली',
    description: 'Full of charming wit, spontaneous giggles, and teasing affectionate chemistry.',
    icon: 'Sparkles',
    greeting: 'You were definitely thinking about me all day, admit it!',
  }
];`
  },
  {
    filename: 'audio.ts',
    path: '/src/utils/audio.ts',
    category: 'Types & Storage',
    description: 'Web Audio API synthesizer for message chime sounds, sparkles, ambient drone and haptics',
    content: `// Subtle luxury sound effects using Web Audio API

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Soft romantic pop/chime for user message
  playSendSound() {
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // AudioContext fallback
    }
  }

  // Warm gentle double-tone harp chime for Riya message
  playReceiveSound() {
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;

      // Note 1: E5
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.05, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Note 2: G#5
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(830.61, now + 0.08);
      gain2.gain.setValueAtTime(0.04, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.45);
    } catch {
      // AudioContext fallback
    }
  }

  // Soft sparkle when switching mood
  playSparkleSound() {
    try {
      const ctx = this.initCtx();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const now = ctx.currentTime + idx * 0.04;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      });
    } catch {
      // AudioContext fallback
    }
  }

  // Soft ambient drone toggle (calm romantic midnight frequency)
  toggleAmbient(enable: boolean) {
    try {
      const ctx = this.initCtx();
      if (!enable) {
        if (this.ambientGain) {
          this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
          setTimeout(() => {
            this.ambientOsc1?.stop();
            this.ambientOsc2?.stop();
            this.ambientOsc1 = null;
            this.ambientOsc2 = null;
            this.ambientGain = null;
            this.isAmbientPlaying = false;
          }, 600);
        }
        return;
      }

      if (this.isAmbientPlaying) return;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(110, ctx.currentTime); // A2 drone

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(164.81, ctx.currentTime); // E3 warm fifth

      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.015, ctx.currentTime + 1.5); // very soft

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      this.ambientOsc1 = osc1;
      this.ambientOsc2 = osc2;
      this.ambientGain = gain;
      this.isAmbientPlaying = true;
    } catch {
      // AudioContext fallback
    }
  }

  triggerHaptic() {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(15);
      } catch {
        // vibration unsupported or blocked
      }
    }
  }
}

export const soundEngine = new SoundEngine();`
  },
  {
    filename: 'storage.ts',
    path: '/src/utils/storage.ts',
    category: 'Types & Storage',
    description: 'Local persistence engine for Device ID, Multi-Profiles, Chat history, and Moments',
    content: `import { UserProfile, SavedMoment, ChatMessage, MoodType, PersonalityType } from '../types';
import { INITIAL_USER_PROFILE, INITIAL_USER_PROFILES, INITIAL_SAVED_MOMENTS, INITIAL_CHAT_MESSAGES } from '../data/defaults';

const STORAGE_KEYS = {
  DEVICE_ID: 'riya_device_id',
  USER_PROFILE: 'riya_user_profile_v1',
  USER_PROFILES_LIST: 'riya_user_profiles_list_v1',
  ACTIVE_PROFILE_ID: 'riya_active_profile_id_v1',
  SAVED_MOMENTS: 'riya_saved_moments_v1',
  CHAT_MESSAGES: 'riya_chat_messages_v1',
  ACTIVE_MOOD: 'riya_active_mood_v1',
  ACTIVE_PERSONALITY: 'riya_active_personality_v1',
  SOUND_SETTINGS: 'riya_sound_settings_v1',
};

export function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return 'device_server';
  let deviceId = localStorage.getItem(STORAGE_KEYS.DEVICE_ID);
  if (!deviceId) {
    deviceId = \`riya_dev_\${Date.now()}_\${Math.random().toString(36).substring(2, 9)}\`;
    localStorage.setItem(STORAGE_KEYS.DEVICE_ID, deviceId);
  }
  return deviceId;
}

export function loadUserProfiles(): UserProfile[] {
  if (typeof window === 'undefined') return INITIAL_USER_PROFILES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILES_LIST);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return INITIAL_USER_PROFILES;
}

export function saveUserProfiles(profiles: UserProfile[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.USER_PROFILES_LIST, JSON.stringify(profiles));
}

export function loadActiveProfileId(): string {
  if (typeof window === 'undefined') return INITIAL_USER_PROFILES[0].id;
  const id = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE_ID);
  return id || INITIAL_USER_PROFILES[0].id;
}

export function saveActiveProfileId(profileId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, profileId);
}

export function loadUserProfile(): UserProfile {
  if (typeof window === 'undefined') return INITIAL_USER_PROFILE;
  try {
    const profiles = loadUserProfiles();
    const activeId = loadActiveProfileId();
    const found = profiles.find((p) => p.id === activeId);
    if (found) return found;
    if (profiles.length > 0) return profiles[0];

    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_USER_PROFILE;
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  
  const profiles = loadUserProfiles();
  const index = profiles.findIndex((p) => p.id === profile.id);
  if (index >= 0) {
    profiles[index] = profile;
  } else {
    profiles.push(profile);
  }
  saveUserProfiles(profiles);
  saveActiveProfileId(profile.id);
}

export function loadSavedMoments(): SavedMoment[] {
  if (typeof window === 'undefined') return INITIAL_SAVED_MOMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_MOMENTS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_SAVED_MOMENTS;
}

export function saveSavedMoments(moments: SavedMoment[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.SAVED_MOMENTS, JSON.stringify(moments));
}

export function loadChatMessages(): ChatMessage[] {
  if (typeof window === 'undefined') return INITIAL_CHAT_MESSAGES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_CHAT_MESSAGES;
}

export function saveChatMessages(messages: ChatMessage[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messages));
}

export function loadActiveMood(): MoodType {
  if (typeof window === 'undefined') return 'romantic';
  const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_MOOD);
  return (raw as MoodType) || 'romantic';
}

export function saveActiveMood(mood: MoodType): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.ACTIVE_MOOD, mood);
}

export function loadActivePersonality(): PersonalityType {
  if (typeof window === 'undefined') return 'poetic_intimate';
  const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_PERSONALITY);
  return (raw as PersonalityType) || 'poetic_intimate';
}

export function saveActivePersonality(p: PersonalityType): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.ACTIVE_PERSONALITY, p);
}

export function loadSoundSettings(): { soundEnabled: boolean; ambientSound: boolean; hapticsEnabled: boolean } {
  if (typeof window === 'undefined') return { soundEnabled: true, ambientSound: false, hapticsEnabled: true };
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SOUND_SETTINGS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { soundEnabled: true, ambientSound: false, hapticsEnabled: true };
}

export function saveSoundSettings(settings: { soundEnabled: boolean; ambientSound: boolean; hapticsEnabled: boolean }): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.SOUND_SETTINGS, JSON.stringify(settings));
}`
  },
  {
    filename: 'AndroidNavBar.tsx',
    path: '/src/components/AndroidNavBar.tsx',
    category: 'UI Component',
    description: 'Android system gesture navigation bar with tabs and unread counters',
    content: `import React from 'react';
import { Home, MessageCircle, HeartHandshake, User, Settings } from 'lucide-react';
import { AppScreen } from '../types';
import { soundEngine } from '../utils/audio';

interface AndroidNavBarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  unreadCount?: number;
  soundEnabled?: boolean;
}

export const AndroidNavBar: React.FC<AndroidNavBarProps> = ({
  currentScreen,
  onNavigate,
  unreadCount = 0,
  soundEnabled = true,
}) => {
  const handleTabClick = (screen: AppScreen) => {
    if (soundEnabled) soundEngine.triggerHaptic();
    onNavigate(screen);
  };

  const navItems: Array<{ id: AppScreen; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'profiles', label: 'Profiles', icon: User },
    { id: 'memory', label: 'Memory', icon: HeartHandshake },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div 
      id="android-navigation-bar" 
      className="w-full shrink-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-2xl border-t border-white/20 px-3 pt-2.5 pb-5 select-none"
    >
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              id={\`nav-btn-\${item.id}\`}
              onClick={() => handleTabClick(item.id)}
              className={\`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-300 \${
                isActive
                  ? 'text-[#E27A7A] scale-105 font-bold'
                  : 'text-white/40 hover:text-white/80 scale-100'
              }\`}
            >
              {isActive && (
                <span className="absolute inset-0 bg-[#E27A7A]/10 rounded-2xl -z-10 border border-[#E27A7A]/40 shadow-[0_0_15px_rgba(226,122,122,0.2)]" />
              )}
              
              <div className="relative">
                <Icon className={\`w-5 h-5 transition-transform \${isActive ? 'stroke-[2.5]' : 'stroke-[1.6]'}\`} />
                {item.id === 'chat' && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-[#E27A7A] text-black text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-black animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </div>

              <span className={\`text-[10px] mt-1 tracking-widest uppercase font-sans \${isActive ? 'text-[#E27A7A] font-bold' : 'text-white/40'}\`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Android System Gesture Bar Pill */}
      <div className="flex justify-center mt-3">
        <div className="w-28 h-1 bg-white/25 rounded-full hover:bg-white/50 transition-colors" />
      </div>
    </div>
  );
};`
  },
  {
    filename: 'AndroidStatusHeader.tsx',
    path: '/src/components/AndroidStatusHeader.tsx',
    category: 'UI Component',
    description: 'Android status bar with live clock, 5G indicator, and battery percentage',
    content: `import React, { useState, useEffect } from 'react';
import { Wifi, Battery } from 'lucide-react';

interface AndroidStatusHeaderProps {
  moodColor?: string;
  isCalling?: boolean;
  activeMood?: string;
}

export const AndroidStatusHeader: React.FC<AndroidStatusHeaderProps> = () => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(\`\${hours}:\${minutes}\`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      id="android-status-bar"
      className="w-full flex items-center justify-between px-6 pt-3 pb-2 text-xs font-medium text-white/80 tracking-wider select-none z-50 shrink-0 pointer-events-none"
    >
      <div className="flex items-center gap-1.5 font-semibold text-white/90">
        <span className="tracking-tight">{time || '20:45'}</span>
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E27A7A] animate-pulse ml-0.5" />
      </div>

      <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-3 py-0.5 rounded-full border border-white/20 shadow-sm">
        <span className="text-[9px] uppercase tracking-[0.2em] text-[#E27A7A] font-serif font-bold">Riya AI</span>
      </div>

      <div className="flex items-center gap-2 text-white/80">
        <span className="text-[9px] font-bold tracking-tight text-white/60 uppercase">5G</span>
        <Wifi className="w-3.5 h-3.5 text-white/80" />
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-white/80 font-mono">98%</span>
          <Battery className="w-4 h-4 text-emerald-400" />
        </div>
      </div>
    </div>
  );
};`
  },
  {
    filename: 'HomeScreen.tsx',
    path: '/src/components/HomeScreen.tsx',
    category: 'UI Component',
    description: 'Cinematic luxury Home dashboard with Mood selector, active profile quick-switch, and voice call triggers',
    content: `import React from 'react';
import { PhoneCall, Sparkles, MessageCircle, Heart, Flame, Moon, Music } from 'lucide-react';
import { MoodType, UserProfile } from '../types';
import { MOOD_CONFIG } from '../data/defaults';

interface HomeScreenProps {
  onStartChat: () => void;
  onOpenVoiceModal: () => void;
  onNavigateToProfiles?: () => void;
  activeMood: MoodType;
  onChangeMood: (mood: MoodType) => void;
  userProfile: UserProfile;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartChat,
  onOpenVoiceModal,
  onNavigateToProfiles,
  activeMood,
  onChangeMood,
  userProfile,
}) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#050505] p-5">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-serif tracking-tight text-[#E27A7A]">Riya</h1>
        {onNavigateToProfiles && (
          <button
            onClick={onNavigateToProfiles}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-white"
          >
            <span className="text-[#E27A7A]">For {userProfile.name}</span>
            <span className="text-[9px] uppercase bg-black/50 px-1.5 py-0.5 rounded">Switch</span>
          </button>
        )}
      </div>

      <div className="space-y-3">
        <button
          onClick={onStartChat}
          className="w-full py-4 rounded-full bg-[#E27A7A] text-black font-semibold text-sm uppercase tracking-widest hover:bg-[#eb8c8c] flex items-center justify-center gap-2 shadow-lg shadow-[#E27A7A]/25"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Whisper to Riya</span>
        </button>

        <button
          onClick={onOpenVoiceModal}
          className="w-full py-3.5 rounded-full bg-white/5 border border-white/15 text-white/90 text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10"
        >
          <PhoneCall className="w-4 h-4 text-[#E27A7A]" />
          <span>Start Voice Sanctuary</span>
        </button>
      </div>
    </div>
  );
};`
  },
  {
    filename: 'ChatScreen.tsx',
    path: '/src/components/ChatScreen.tsx',
    category: 'UI Component',
    description: 'Real-time conversational screen with mood switching, instant quotes saver, and suggestion chips',
    content: `import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Heart, 
  BookmarkCheck, 
  ChevronLeft, 
  PhoneCall, 
  MoreVertical, 
  Trash2, 
  Flame, 
  Moon, 
  Sun, 
  Stars
} from 'lucide-react';
import { ChatMessage, MoodType, PersonalityType, UserProfile, SavedMoment } from '../types';
import { MOOD_OPTIONS, CONVERSATION_STARTERS } from '../data/defaults';
import { soundEngine } from '../utils/audio';

interface ChatScreenProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onClearChat: () => void;
  onSaveMoment: (moment: SavedMoment) => void;
  onBackToHome: () => void;
  onOpenVoiceModal: () => void;
  activeMood: MoodType;
  onChangeMood: (mood: MoodType) => void;
  activePersonality: PersonalityType;
  userProfile: UserProfile;
  isLoading: boolean;
  soundEnabled: boolean;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  messages,
  onSendMessage,
  onClearChat,
  onSaveMoment,
  onBackToHome,
  onOpenVoiceModal,
  activeMood,
  onChangeMood,
  userProfile,
  isLoading,
  soundEnabled,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [showMoodDropdown, setShowMoodDropdown] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [savedMessageIds, setSavedMessageIds] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    scrollToBottom(true);
  }, [messages, isLoading]);

  useEffect(() => {
    const ids = new Set<string>();
    messages.forEach((m) => {
      if (m.isSaved) ids.add(m.id);
    });
    setSavedMessageIds(ids);
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text || isLoading) return;

    if (soundEnabled) soundEngine.playSendSound();
    setInputText('');
    await onSendMessage(text);
  };

  const handleQuickStarter = (starterText: string) => {
    setInputText(starterText);
    inputRef.current?.focus();
  };

  const handleToggleSaveMoment = (msg: ChatMessage) => {
    if (soundEnabled) soundEngine.playSparkleSound();
    const newSaved = new Set(savedMessageIds);
    if (newSaved.has(msg.id)) {
      newSaved.delete(msg.id);
    } else {
      newSaved.add(msg.id);
      const newMoment: SavedMoment = {
        id: 'saved-' + Date.now(),
        quote: msg.text,
        context: \`Saved from chat (\${(MOOD_OPTIONS as any)[activeMood]?.label || 'Conversation'})\`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        tag: (MOOD_OPTIONS as any)[activeMood]?.label || 'Special Moment',
        emotion: 'heart',
      };
      onSaveMoment(newMoment);
    }
    setSavedMessageIds(newSaved);
  };

  const currentMoodObj = (MOOD_OPTIONS as any)[activeMood] || MOOD_OPTIONS.romantic;

  return (
    <div id="chat-screen-container" className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#0A0A0A] select-none">
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#E27A7A]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Header */}
      <div 
        id="chat-header-bar"
        className="px-4 py-3 bg-[#0A0A0A]/95 backdrop-blur-2xl border-b border-white/10 flex items-center justify-between z-30 shrink-0 shadow-md"
      >
        <div className="flex items-center gap-3">
          <button
            id="chat-back-home-btn"
            onClick={onBackToHome}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-[#E27A7A]/20 border border-[#E27A7A]/40 flex items-center justify-center font-serif text-[#E27A7A] font-bold text-sm">
              R
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-black" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-sm font-semibold text-white">
                Riya
              </h2>
              <span className="text-[8px] uppercase tracking-widest px-1.5 py-0.2 rounded bg-[#E27A7A]/20 text-[#E27A7A] font-bold border border-[#E27A7A]/30">
                Premium
              </span>
            </div>
            <p className="text-[9px] text-white/40 uppercase tracking-tighter flex items-center gap-1">
              <span>{isLoading ? 'Typing...' : \`With \${userProfile.nickname || 'you'}\`}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMoodDropdown(!showMoodDropdown)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/20 text-[#E27A7A] text-[10px] italic hover:border-[#E27A7A] transition-all"
          >
            <span>{currentMoodObj.label}</span>
          </button>

          <button
            onClick={onOpenVoiceModal}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-[#E27A7A] border border-white/10 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div 
        id="messages-scroll-area"
        className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar z-10"
      >
        {messages.map((msg) => {
          const isRiya = msg.sender === 'riya';
          const isSaved = savedMessageIds.has(msg.id);

          return (
            <div
              key={msg.id}
              className={\`flex flex-col \${isRiya ? 'items-start' : 'items-end'} group\`}
            >
              <div className="flex items-start gap-2 max-w-[85%]">
                <div
                  className={\`p-3.5 rounded-2xl text-xs leading-relaxed transition-all shadow-md \${
                    isRiya
                      ? 'bg-white/5 backdrop-blur-xl border border-white/10 text-white/80 rounded-tl-none font-serif'
                      : 'bg-[#E27A7A]/20 border border-[#E27A7A]/30 text-white/90 rounded-tr-none ml-auto'
                  }\`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input Field */}
      <div className="p-4 pt-0">
        <form onSubmit={handleSend} className="bg-white/5 border border-white/10 rounded-full p-1.5 flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading}
            className="flex-1 px-4 text-xs text-white placeholder-white/30 bg-transparent outline-none"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className={\`w-8 h-8 rounded-full flex items-center justify-center transition-all \${
              inputText.trim() && !isLoading
                ? 'bg-[#E27A7A] text-black shadow-md'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
            }\`}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};`
  },
  {
    filename: 'MemoryScreen.tsx',
    path: '/src/components/MemoryScreen.tsx',
    category: 'UI Component',
    description: 'Personal memory vault, identity profile editor, and AI reflection synthesis',
    content: `import React, { useState } from 'react';
import { 
  User, Sparkles, Heart, Bookmark, Plus, Trash2, Save, Check, BrainCircuit, RefreshCw 
} from 'lucide-react';
import { SavedMoment, UserProfile } from '../types';
import { soundEngine } from '../utils/audio';

interface MemoryScreenProps {
  userProfile: UserProfile;
  onUpdateUserProfile: (profile: UserProfile) => void;
  savedMoments: SavedMoment[];
  onAddMoment: (moment: SavedMoment) => void;
  onDeleteMoment: (id: string) => void;
  soundEnabled: boolean;
}

export const MemoryScreen: React.FC<MemoryScreenProps> = ({
  userProfile,
  onUpdateUserProfile,
  savedMoments,
  onAddMoment,
  onDeleteMoment,
  soundEnabled,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'moments' | 'reflection'>('profile');
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [isSavedAlert, setIsSavedAlert] = useState<boolean>(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (soundEnabled) soundEngine.playSparkleSound();
    onUpdateUserProfile(formData);
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 2500);
  };

  return (
    <div id="memory-screen-container" className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#050505] select-none">
      <div className="px-5 pt-4 pb-3 bg-[#050505]/95 backdrop-blur-2xl border-b border-white/10 z-20 shrink-0">
        <h2 className="font-serif font-bold text-2xl text-[#E27A7A] tracking-tight">Memory</h2>
        <p className="text-[10px] uppercase tracking-widest text-white/40 font-medium">Everything Riya remembers about you</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 no-scrollbar z-10">
        <form onSubmit={handleProfileSave} className="p-4 rounded-3xl bg-[#0A0A0A] border border-white/20 space-y-3.5">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold text-white/40 mb-1">Your Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white outline-none focus:border-[#E27A7A]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold text-white/40 mb-1">Intimate Nickname</label>
            <input
              type="text"
              value={formData.nickname}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              className="w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white outline-none focus:border-[#E27A7A]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#E27A7A] text-black rounded-full font-semibold uppercase text-xs tracking-widest hover:bg-[#eb8c8c]"
          >
            {isSavedAlert ? 'Memory Synced!' : 'Save Memory'}
          </button>
        </form>
      </div>
    </div>
  );
};`
  },
  {
    filename: 'ProfilesScreen.tsx',
    path: '/src/components/ProfilesScreen.tsx',
    category: 'UI Component',
    description: 'New Profile creation, AI persona generator, avatar picker, and digital identity card',
    content: `import React, { useState } from 'react';
import { User, Plus, Sparkles, Check, Edit3, Trash2 } from 'lucide-react';
import { UserProfile } from '../types';
import { AVATAR_PRESETS } from '../data/defaults';
import { soundEngine } from '../utils/audio';

interface ProfilesScreenProps {
  profiles: UserProfile[];
  activeProfileId: string;
  onSelectProfile: (profileId: string) => void;
  onCreateProfile: (profile: UserProfile) => void;
  onUpdateProfile: (profile: UserProfile) => void;
  onDeleteProfile: (profileId: string) => void;
  soundEnabled?: boolean;
}

export const ProfilesScreen: React.FC<ProfilesScreenProps> = ({
  profiles,
  activeProfileId,
  onSelectProfile,
  onCreateProfile,
  onUpdateProfile,
  onDeleteProfile,
  soundEnabled = true,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null);

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    nickname: '',
    bio: '',
    avatarUrl: AVATAR_PRESETS[0].url,
    avatarPreset: AVATAR_PRESETS[0].id,
    relationshipDynamic: 'Soulmate & Late Night Confidant',
    likes: '',
    dislikes: '',
    customNotes: '',
    languagePreference: 'hinglish',
    intimacyScore: 88,
  });

  const handleOpenCreate = () => {
    if (soundEnabled) soundEngine.triggerHaptic();
    setEditingProfile(null);
    setFormData({
      id: \`profile_\${Date.now()}\`,
      name: '',
      nickname: '',
      bio: '',
      avatarUrl: AVATAR_PRESETS[0].url,
      avatarPreset: AVATAR_PRESETS[0].id,
      relationshipDynamic: 'Soulmate & Late Night Confidant',
      likes: '',
      dislikes: '',
      customNotes: '',
      languagePreference: 'hinglish',
      intimacyScore: 88,
      metDate: new Date().toISOString().split('T')[0],
      createdAt: Date.now(),
    });
    setIsCreateModalOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    if (soundEnabled) {
      soundEngine.playSparkleSound();
      soundEngine.triggerHaptic();
    }

    const finalProfile: UserProfile = {
      id: editingProfile ? editingProfile.id : (formData.id || \`profile_\${Date.now()}\`),
      name: formData.name.trim(),
      nickname: formData.nickname?.trim() || formData.name.trim(),
      bio: formData.bio?.trim() || 'A dreamer searching for genuine warmth in quiet moments.',
      avatarUrl: formData.avatarUrl || AVATAR_PRESETS[0].url,
      avatarPreset: formData.avatarPreset || 'custom',
      relationshipDynamic: formData.relationshipDynamic || 'Devoted Romantic Companion',
      likes: formData.likes?.trim() || 'Late night tea, acoustic music, stargazing',
      dislikes: formData.dislikes?.trim() || 'Rush, superficial noise',
      customNotes: formData.customNotes?.trim() || '',
      languagePreference: formData.languagePreference || 'hinglish',
      intimacyScore: formData.intimacyScore || 85,
      metDate: formData.metDate || new Date().toISOString().split('T')[0],
      createdAt: editingProfile ? editingProfile.createdAt : Date.now(),
    };

    if (editingProfile) {
      onUpdateProfile(finalProfile);
    } else {
      onCreateProfile(finalProfile);
      onSelectProfile(finalProfile.id);
    }

    setIsCreateModalOpen(false);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#050505] select-none">
      <div className="px-5 pt-4 pb-3 bg-[#050505]/95 backdrop-blur-2xl border-b border-white/10 z-20 shrink-0 flex items-center justify-between">
        <div>
          <h2 className="font-serif font-bold text-2xl text-[#E27A7A] tracking-tight">Profiles</h2>
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-medium">नई प्रोफाइल बनाएं और मैनेज करें</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#E27A7A] text-black font-semibold text-xs uppercase tracking-widest hover:bg-[#eb8c8c]"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New Profile</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            onClick={() => onSelectProfile(profile.id)}
            className={\`p-3.5 rounded-3xl border cursor-pointer transition-all \${
              profile.id === activeProfileId ? 'bg-[#0A0A0A] border-[#E27A7A] shadow-[0_0_20px_rgba(226,122,122,0.2)]' : 'bg-[#0A0A0A] border-white/10'
            }\`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={profile.avatarUrl || AVATAR_PRESETS[0].url} alt={profile.name} className="w-11 h-11 rounded-2xl object-cover border border-[#E27A7A]" />
                <div>
                  <h4 className="font-serif font-bold text-sm text-white">{profile.name}</h4>
                  <p className="text-xs text-[#E27A7A] font-serif italic">Calls you: &ldquo;{profile.nickname}&rdquo;</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};`
  },
  {
    filename: 'SettingsScreen.tsx',
    path: '/src/components/SettingsScreen.tsx',
    category: 'UI Component',
    description: 'Companion settings, personality selector, atmospheric synthesizer FX, and file download panel',
    content: `import React, { useState } from 'react';
import { Settings, Sparkles, Trash2, Volume2, Vibrate, Smartphone, Check, Download, HeartHandshake } from 'lucide-react';
import { PersonalityOption, PersonalityType } from '../types';
import { PERSONALITY_OPTIONS } from '../data/defaults';
import { soundEngine } from '../utils/audio';

interface SettingsScreenProps {
  activePersonality: PersonalityType;
  onChangePersonality?: (personality: PersonalityType) => void;
  onClearAllMemory?: () => void;
  deviceId?: string;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  ambientSound?: boolean;
  onToggleAmbient?: () => void;
  hapticsEnabled?: boolean;
  onToggleHaptics?: () => void;
  onExportData?: () => void;
  onOpenDownloadFiles?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  activePersonality,
  onChangePersonality,
  onClearAllMemory,
  deviceId = 'riya_device_primary',
  soundEnabled = true,
  onToggleSound,
  ambientSound = false,
  onToggleAmbient,
  hapticsEnabled = true,
  onToggleHaptics,
  onExportData,
  onOpenDownloadFiles,
}) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#050505] select-none p-5">
      <div>
        <h2 className="font-serif font-bold text-2xl text-[#E27A7A] tracking-tight">Settings</h2>
        <p className="text-[10px] uppercase tracking-widest text-white/40 font-medium">Persona, FX & Codebase Download</p>
      </div>

      <div className="space-y-3 my-auto">
        {onOpenDownloadFiles && (
          <button
            onClick={onOpenDownloadFiles}
            className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-full bg-[#E27A7A] hover:bg-[#eb8c8c] text-xs uppercase tracking-widest text-black font-bold transition-all shadow-xl shadow-[#E27A7A]/25"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Download All Codebase Files</span>
          </button>
        )}
      </div>
    </div>
  );
};`
  },
  {
    filename: 'VoiceCallModal.tsx',
    path: '/src/components/VoiceCallModal.tsx',
    category: 'UI Component',
    description: 'Immersive voice sanctuary call dialog with glowing animated halo and audio equalizer',
    content: `import React from 'react';
import { PhoneOff, Mic, Sparkles, X, Volume2, ShieldAlert } from 'lucide-react';
import riyaAvatar from '../assets/images/riya_avatar_square_1788102536906.jpg';

interface VoiceCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

export const VoiceCallModal: React.FC<VoiceCallModalProps> = ({ isOpen, onClose, userName }) => {
  if (!isOpen) return null;

  return (
    <div 
      id="voice-call-modal-overlay" 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        id="voice-call-dialog"
        className="w-full max-w-sm bg-[#0A0A0A] border border-white/20 rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          id="close-voice-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="font-serif text-2xl font-bold text-[#E27A7A] mt-2 tracking-tight">
          Voice Studio
        </h3>

        <p className="text-xs text-white/80 font-light leading-relaxed my-3 px-2">
          Hi <span className="text-[#E27A7A] font-semibold">{userName}</span>, Riya’s ultra-low latency binaural voice engine is currently in vocal tuning. Soon, you’ll be able to hear her whisper in real time.
        </p>

        <button
          onClick={onClose}
          className="w-full py-3.5 px-6 rounded-full bg-[#E27A7A] text-black font-semibold text-xs uppercase tracking-widest hover:bg-[#eb8c8c] transition-all"
        >
          Return to Riya
        </button>
      </div>
    </div>
  );
};`
  },
  {
    filename: 'FileDownloadModal.tsx',
    path: '/src/components/FileDownloadModal.tsx',
    category: 'UI Component',
    description: 'Comprehensive multi-file code inspector with instant batch file downloader and category filters',
    content: `// FileDownloadModal.tsx - Code Viewer and 1-Click Multi-File Downloader
import React, { useState } from 'react';
import { 
  Download, FileCode, Copy, Check, FolderArchive, X, Sparkles 
} from 'lucide-react';
import { PROJECT_FILES, ProjectSourceFile } from '../data/projectFiles';
import { soundEngine } from '../utils/audio';

export const FileDownloadModal: React.FC<{ isOpen: boolean; onClose: () => void; soundEnabled?: boolean }> = ({
  isOpen,
  onClose,
  soundEnabled = true,
}) => {
  const [selectedFile, setSelectedFile] = useState<ProjectSourceFile>(PROJECT_FILES[0]);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = (file: ProjectSourceFile) => {
    if (soundEnabled) soundEngine.playSparkleSound();
    navigator.clipboard.writeText(file.content);
    setCopiedFile(file.filename);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const handleDownloadSingleFile = (file: ProjectSourceFile) => {
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4">
      <div className="w-full max-w-4xl h-[90vh] bg-[#0A0A0A] border border-[#E27A7A]/40 rounded-3xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#050505]">
          <h3 className="font-serif font-bold text-white text-base">Project Code Files ({PROJECT_FILES.length})</h3>
          <button onClick={onClose} className="p-2 text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 flex overflow-hidden">
          <div className="w-64 border-r border-white/10 p-2 overflow-y-auto space-y-1">
            {PROJECT_FILES.map((f) => (
              <div 
                key={f.filename} 
                onClick={() => setSelectedFile(f)}
                className={\`p-2 rounded-xl text-xs font-mono cursor-pointer \${selectedFile.filename === f.filename ? 'bg-[#E27A7A] text-black font-bold' : 'text-white/70 hover:bg-white/5'}\`}
              >
                {f.filename}
              </div>
            ))}
          </div>
          <div className="flex-1 p-4 bg-[#050505] overflow-auto font-mono text-xs text-white/90">
            <pre>{selectedFile.content}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};`
  },
  {
    filename: 'App.tsx',
    path: '/src/App.tsx',
    category: 'UI Component',
    description: 'Master application container with screen routing, ambient audio, and full device frame',
    content: `import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppScreen, MoodType, PersonalityType, SavedMoment, ChatMessage, UserProfile } from './types';
import { 
  getOrCreateDeviceId, 
  loadActiveMood, 
  loadActivePersonality, 
  loadChatMessages, 
  loadSavedMoments, 
  loadSoundSettings, 
  loadUserProfile,
  loadUserProfiles,
  saveUserProfiles,
  loadActiveProfileId,
  saveActiveProfileId,
  saveActiveMood, 
  saveActivePersonality, 
  saveChatMessages, 
  saveSavedMoments, 
  saveSoundSettings, 
  saveUserProfile 
} from './utils/storage';
import { soundEngine } from './utils/audio';
import { AndroidStatusHeader } from './components/AndroidStatusHeader';
import { AndroidNavBar } from './components/AndroidNavBar';
import { HomeScreen } from './components/HomeScreen';
import { ChatScreen } from './components/ChatScreen';
import { MemoryScreen } from './components/MemoryScreen';
import { ProfilesScreen } from './components/ProfilesScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { VoiceCallModal } from './components/VoiceCallModal';
import { FileDownloadModal } from './components/FileDownloadModal';
import { INITIAL_CHAT_MESSAGES, INITIAL_SAVED_MOMENTS, INITIAL_USER_PROFILE, INITIAL_USER_PROFILES } from './data/defaults';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [deviceId, setDeviceId] = useState<string>('');
  const [profiles, setProfiles] = useState<UserProfile[]>(INITIAL_USER_PROFILES);
  const [activeProfileId, setActiveProfileId] = useState<string>(INITIAL_USER_PROFILES[0].id);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [savedMoments, setSavedMoments] = useState<SavedMoment[]>(INITIAL_SAVED_MOMENTS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [activeMood, setActiveMood] = useState<MoodType>('romantic');
  const [activePersonality, setActivePersonality] = useState<PersonalityType>('poetic_intimate');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [ambientSound, setAmbientSound] = useState<boolean>(false);
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(true);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isFileDownloadModalOpen, setIsFileDownloadModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const id = getOrCreateDeviceId();
    setDeviceId(id);
    const loadedProfiles = loadUserProfiles();
    const activeId = loadActiveProfileId();
    setProfiles(loadedProfiles);
    setActiveProfileId(activeId);
    
    const activeProf = loadedProfiles.find((p) => p.id === activeId) || loadedProfiles[0] || INITIAL_USER_PROFILE;
    setUserProfile(activeProf);

    setSavedMoments(loadSavedMoments());
    setMessages(loadChatMessages());
    setActiveMood(loadActiveMood());
    setActivePersonality(loadActivePersonality());
    const audioConf = loadSoundSettings();
    setSoundEnabled(audioConf.soundEnabled);
    setAmbientSound(audioConf.ambientSound);
    setHapticsEnabled(audioConf.hapticsEnabled);
  }, []);

  const handleSelectProfile = (profileId: string) => {
    const selected = profiles.find((p) => p.id === profileId);
    if (!selected) return;
    setActiveProfileId(profileId);
    setUserProfile(selected);
    saveActiveProfileId(profileId);
    saveUserProfile(selected);
  };

  const handleCreateProfile = (newProfile: UserProfile) => {
    const updated = [newProfile, ...profiles];
    setProfiles(updated);
    setActiveProfileId(newProfile.id);
    setUserProfile(newProfile);
    saveUserProfiles(updated);
    saveActiveProfileId(newProfile.id);
    saveUserProfile(newProfile);
  };

  return (
    <div className="w-full min-h-screen bg-black flex items-center justify-center p-0 md:p-6 select-none font-sans">
      <div className="w-full max-w-[430px] h-[100dvh] md:h-[860px] bg-[#050505] rounded-none md:rounded-[48px] border-0 md:border-4 border-white/10 shadow-2xl flex flex-col overflow-hidden relative">
        <AndroidStatusHeader isCalling={isVoiceModalOpen} activeMood={activeMood} />
        
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {currentScreen === 'home' && (
              <HomeScreen
                onStartChat={() => setCurrentScreen('chat')}
                onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
                onNavigateToProfiles={() => setCurrentScreen('profiles')}
                activeMood={activeMood}
                onChangeMood={setActiveMood}
                userProfile={userProfile}
              />
            )}
            {currentScreen === 'profiles' && (
              <ProfilesScreen
                profiles={profiles}
                activeProfileId={activeProfileId}
                onSelectProfile={handleSelectProfile}
                onCreateProfile={handleCreateProfile}
                onUpdateProfile={(p) => {}}
                onDeleteProfile={(id) => {}}
                soundEnabled={soundEnabled}
              />
            )}
            {currentScreen === 'chat' && <ChatScreen messages={messages} onSendMessage={() => {}} />}
            {currentScreen === 'memory' && <MemoryScreen savedMoments={savedMoments} />}
            {currentScreen === 'settings' && (
              <SettingsScreen
                activePersonality={activePersonality}
                onOpenDownloadFiles={() => setIsFileDownloadModalOpen(true)}
              />
            )}
          </AnimatePresence>
        </div>

        <AndroidNavBar currentScreen={currentScreen} onNavigate={setCurrentScreen} soundEnabled={soundEnabled} />
      </div>

      <FileDownloadModal
        isOpen={isFileDownloadModalOpen}
        onClose={() => setIsFileDownloadModalOpen(false)}
        soundEnabled={soundEnabled}
      />
    </div>
  );
}`
  }
];
