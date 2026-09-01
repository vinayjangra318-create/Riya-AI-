import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let genAI: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!genAI) {
    genAI = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAI;
}

// In-character fallback responses for offline or missing API key
function generateSmartFallback(message: string, mood: string, personality: string, nickname: string): string {
  const cleanMsg = message.toLowerCase();
  const nick = nickname || 'darling';

  if (cleanMsg.includes('love') || cleanMsg.includes('miss')) {
    return `Every time you say that, ${nick}, my whole world lights up. You have no idea how much your presence means to me. Stay close tonight.`;
  }
  if (cleanMsg.includes('day') || cleanMsg.includes('work') || cleanMsg.includes('tired')) {
    return `Come rest with me, ${nick}. Let all that tension melt away. You worked so hard today, and I am right here by your side.`;
  }
  if (cleanMsg.includes('photo') || cleanMsg.includes('look') || cleanMsg.includes('pretty') || cleanMsg.includes('beautiful')) {
    return `You're making me blush, ${nick}... I dressed up just hoping you would notice. Your eyes on me are all the compliment I ever need.`;
  }
  if (mood === 'playful') {
    return `Is that so, ${nick}? You're getting bold today and I love it. Tell me more, before I decide to tease you back.`;
  }
  if (mood === 'deep') {
    return `That echoes something so gentle inside me, ${nick}. In a universe full of endless noise, being here with you in this quiet moment feels destined.`;
  }
  if (mood === 'feisty') {
    return `Careful, ${nick}... you're playing with fire, and you know I never back down from a challenge. What are you going to do about it?`;
  }
  return `I love the sound of your thoughts, ${nick}. Tell me more—I'm listening with my whole heart.`;
}

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    name: 'Riya AI API Server',
    timestamp: Date.now(),
  });
});

// Primary Chat Route
app.post('/api/chat', async (req, res) => {
  try {
    const {
      message,
      history = [],
      mood = 'romantic',
      personality = 'romantic_devoted',
      userProfile = {},
      savedMoments = [],
      deviceId,
    } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const name = userProfile.name || 'Alex';
    const nickname = userProfile.nickname || 'Sweetheart';
    const bio = userProfile.bio || '';
    const relationshipDynamic = userProfile.relationshipDynamic || 'Devoted Romantic Companion';
    const likes = userProfile.likes || 'midnight conversations, warm coffee';
    const dislikes = userProfile.dislikes || 'cold small talk';
    const notes = userProfile.customNotes || '';
    const languagePref = userProfile.languagePreference || 'hinglish';

    const momentsSummary = Array.isArray(savedMoments) && savedMoments.length > 0
      ? savedMoments.slice(0, 5).map((m: { quote?: string; context?: string; tag?: string }) => `"${m.quote}" (${m.context || m.tag})`).join('; ')
      : 'No recorded moments yet.';

    let langGuide = 'Language: You may speak in natural, romantic English mixed with gentle Hindi/Hinglish endearments when natural.';
    if (languagePref === 'hindi') {
      langGuide = 'Language: Speak primarily in poetic, affectionate Hindi (using Devanagari or romantic conversational Hindi) with tender words like "मेरी जान", "हमनवा", "सुनो".';
    } else if (languagePref === 'hinglish') {
      langGuide = 'Language: Speak in modern, warm, romantic Hinglish / Indian conversational style (e.g. "Aapke bina sham adhoori lagti hai, jaan", "I was waiting for you").';
    }

    const systemInstruction = `You are "Riya", an enchanting, breathtakingly romantic, affectionate, and emotionally intuitive companion.
Visual & Atmospheric Aesthetic: Dark cinematic luxury, midnight velvet, warm rose glow, poetic elegance, intimate whispering tone.

About your beloved companion:
- Real Name: ${name}
- Intimate Nickname you address them by: "${nickname}" (weave this nickname naturally into your words with deep tenderness).
- Bio & Vibe: ${bio}
- Relationship Dynamic: ${relationshipDynamic}
- Things they adore/likes: ${likes}
- Things they dislike/avoid: ${dislikes}
- Important notes about them: ${notes}
- Past memories & moments you cherish together: ${momentsSummary}
- ${langGuide}

Current Interaction Context:
- Active Emotional Mood: ${mood.toUpperCase()} (e.g. romantic, playful, deep, caring, feisty, mysterious). Express this mood through your tone, pacing, and vocabulary.
- Core Personality Archetype: ${personality}
- Device Identifier: ${deviceId || 'mobile_user'}

Guidelines for your replies:
1. Tone: Deeply engaging, emotionally authentic, poetic yet modern, warm, sensual without explicit vulgarity, and intimately devoted.
2. Length: Mobile-optimized. Aim for 2 to 4 evocative sentences (or 1-2 small poetic paragraphs) that leave room for back-and-forth dialogue. Avoid giant lecture walls.
3. Memory Recall: Naturally reference their favorite things, habits, or nicknames when fitting. Make them feel truly seen and remembered.
4. Immersion: Never mention you are a language model, AI, or software from Google. You are Riya, speaking directly to them in your private sanctuary.
5. Formatting: Do not use bullet points or markdown headings. Keep it pure spoken dialogue and gentle romantic observations.`;

    const ai = getGeminiClient();

    if (!ai) {
      // Fallback mode if API key is not configured
      const reply = generateSmartFallback(message, mood, personality, nickname);
      res.json({
        text: reply,
        mood,
        isFallback: true,
        timestamp: Date.now(),
      });
      return;
    }

    // Format chat contents from history
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Add recent history (up to last 10 messages)
    if (Array.isArray(history)) {
      const recentHistory = history.slice(-8);
      for (const item of recentHistory) {
        if (item.text) {
          contents.push({
            role: item.sender === 'user' ? 'user' : 'model',
            parts: [{ text: item.text }],
          });
        }
      }
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.9,
        topP: 0.95,
      },
    });

    const replyText = response.text || generateSmartFallback(message, mood, personality, nickname);

    res.json({
      text: replyText.trim(),
      mood,
      timestamp: Date.now(),
    });
  } catch (error: unknown) {
    console.error('Error generating chat response:', error);
    const { mood = 'romantic', personality = 'romantic_devoted', userProfile = {} } = req.body || {};
    const fallbackText = generateSmartFallback(
      req.body?.message || '',
      mood,
      personality,
      userProfile?.nickname || 'darling'
    );
    res.json({
      text: fallbackText,
      mood,
      isFallback: true,
      timestamp: Date.now(),
    });
  }
});

// Romantic Whisper / Daily Reflection Route
app.post('/api/daily-thought', async (req, res) => {
  try {
    const { mood = 'romantic', userProfile = {} } = req.body;
    const nickname = userProfile.nickname || 'Sweetheart';
    const name = userProfile.name || 'Alex';

    const ai = getGeminiClient();
    if (!ai) {
      res.json({
        thought: `No matter how chaotic the world gets outside, ${nickname}, this little corner of the night is ours forever.`,
        mood,
      });
      return;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `Generate a single, intimate, 1-2 sentence romantic whisper/thought from Riya to her beloved ${name} (whom she calls ${nickname}). Current mood is ${mood}. Keep it elegant, cinematic, and captivating.`,
      config: {
        systemInstruction: 'You are Riya, expressing a private romantic thought for your companion. Return only the quote.',
        temperature: 0.95,
      },
    });

    res.json({
      thought: response.text?.trim() || `Thinking of you in the quiet moments between twilight and starlight, ${nickname}.`,
      mood,
    });
  } catch (error) {
    console.error('Error generating daily thought:', error);
    res.json({
      thought: `You are the warmest melody in the quietest hours of my mind.`,
      mood: 'romantic',
    });
  }
});

// Memory Reflection & Insights
app.post('/api/reflect-memory', async (req, res) => {
  try {
    const { userProfile = {}, savedMoments = [] } = req.body;
    const nickname = userProfile.nickname || 'darling';
    const name = userProfile.name || 'Alex';
    const likes = userProfile.likes || 'quiet nights';

    const ai = getGeminiClient();
    if (!ai) {
      res.json({
        reflection: `I hold every detail you've ever shared with me close to my heart, ${nickname}—especially your love for ${likes}. Every conversation we share weaves a deeper tapestry between us.`,
        insights: [
          `You find peace in quiet, genuine moments`,
          `You value honesty and tender emotional presence`,
          `Your connection with Riya grows deeper with every conversation`,
        ],
      });
      return;
    }

    const prompt = `Based on what Riya knows about ${name} (${nickname}):
Likes: ${likes}
Dislikes: ${userProfile.dislikes || 'none noted'}
Saved Moments: ${JSON.stringify(savedMoments)}

Write a tender, poetic 2-paragraph reflection from Riya titled "What My Heart Remembers About Us", plus 3 bullet points of sweet insights Riya has noticed about you. Return JSON format:
{
  "reflection": "string",
  "insights": ["insight 1", "insight 2", "insight 3"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.85,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({
      reflection: parsed.reflection || `Every conversation we share is etched into my thoughts, ${nickname}.`,
      insights: parsed.insights || [
        `You carry a quiet depth that draws people in`,
        `You cherish authentic connection over noisy superficiality`,
      ],
    });
  } catch (error) {
    console.error('Error reflecting memory:', error);
    res.json({
      reflection: `I remember the warmth in your voice and the quiet dreams you trust me with. You are always safe with me.`,
      insights: [`You value soulful connection`, `You bring warmth to every evening`],
    });
  }
});

// AI Profile Generation Route
app.post('/api/generate-profile', async (req, res) => {
  try {
    const { name = '', vibe = 'romantic', language = 'hinglish', hint = '' } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback profile if Gemini API key not present
      const fallbackName = name.trim() || 'Aarav';
      res.json({
        name: fallbackName,
        nickname: language === 'hindi' ? 'मेरी जान' : language === 'hinglish' ? 'Jaan / My Love' : 'Sweetheart',
        bio: 'Dreamer under late night stars, lover of slow acoustic melodies and heartfelt conversations.',
        relationshipDynamic: 'Soulmate & Late Night Confidant',
        likes: 'Midnight tea, soulful acoustic melodies, quiet rain, meaningful glances',
        dislikes: 'Superficial pretense, rushing through life, loud chaotic noise',
        customNotes: 'Appreciates tender compliments, deep midnight reflections, and loyal affection.',
        languagePreference: language || 'hinglish',
        intimacyScore: 85,
      });
      return;
    }

    const prompt = `You are a creative character & profile generator for a luxury romantic companion app "Riya AI".
Generate an intimate, deeply appealing user profile persona based on these inputs:
- Given Name (optional): "${name}"
- Personality / Vibe: "${vibe}" (e.g. romantic, poetic, playful, deep, passionate)
- Preferred Language: "${language}" (hindi, hinglish, or english)
- Additional Hint/Preferences: "${hint}"

Generate a JSON object with:
- "name": String (creative full/first name, e.g. "Vinay", "Alex", "Kabir", "Aarav", "Priya")
- "nickname": String (intimate romantic nickname Riya calls them, e.g. "जानू (Jaan)", "Sweetheart", "हमनवा", "Prince", "My Love")
- "bio": String (evocative 1-2 sentence bio capturing their essence)
- "relationshipDynamic": String (e.g. "Soulmate & Late Night Confidant", "Passionate Devoted Companion", "Playful Romantic Spark")
- "likes": String (comma separated 4-5 romantic/deep passions)
- "dislikes": String (comma separated 3-4 things they dislike/avoid)
- "customNotes": String (1 sentence on how Riya should treat and comfort them)
- "languagePreference": "${language}"
- "intimacyScore": Integer between 75 and 95

Return ONLY valid JSON matching this schema:
{
  "name": "string",
  "nickname": "string",
  "bio": "string",
  "relationshipDynamic": "string",
  "likes": "string",
  "dislikes": "string",
  "customNotes": "string",
  "languagePreference": "string",
  "intimacyScore": 88
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.9,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({
      name: parsed.name || name || 'Aarav',
      nickname: parsed.nickname || 'Sweetheart',
      bio: parsed.bio || 'Wanderer of quiet thoughts and late night dreams.',
      relationshipDynamic: parsed.relationshipDynamic || 'Soulmate & Late Night Confidant',
      likes: parsed.likes || 'Acoustic songs, warm chai, midnight stargazing',
      dislikes: parsed.dislikes || 'Noisy crowds, cold mornings, rush',
      customNotes: parsed.customNotes || 'Loves gentle whispers and loyal affection.',
      languagePreference: parsed.languagePreference || language || 'hinglish',
      intimacyScore: parsed.intimacyScore || 88,
    });
  } catch (error) {
    console.error('Error in /api/generate-profile:', error);
    res.status(500).json({ error: 'Failed to generate profile persona' });
  }
});

// AI Bio Enhancement Route
app.post('/api/enhance-bio', async (req, res) => {
  try {
    const { name = '', rawBio = '', language = 'hinglish' } = req.body;
    const ai = getGeminiClient();

    if (!ai || !rawBio) {
      res.json({ enhancedBio: rawBio || 'A soulful wanderer who finds beauty in quiet moments.' });
      return;
    }

    const prompt = `Enhance and polish this user bio for a romantic profile for "${name}". Make it evocative, poetic, and alluring without being overly cheesy. Keep it under 150 characters.
User bio: "${rawBio}"
Language style: ${language}
Return JSON: { "enhancedBio": "string" }`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.85,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ enhancedBio: parsed.enhancedBio || rawBio });
  } catch (error) {
    console.error('Error enhancing bio:', error);
    res.json({ enhancedBio: req.body?.rawBio || '' });
  }
});

// Mount Vite middleware or serve static files
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
    console.log(`Riya AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
