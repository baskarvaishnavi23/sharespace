import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// Gemini: Smart Resource Recommendation
app.post('/api/gemini/match-resources', async (req: Request, res: Response) => {
  const { query, availableResources } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Search query or project description is required' });
  }

  // Non-AI fallback generator
  const getFallbackMatches = () => {
    const qLower = (query || '').toLowerCase();
    const scored = (availableResources || []).map((r: any) => {
      let score = 50;
      if (r.name.toLowerCase().includes(qLower)) score += 35;
      if (r.category.toLowerCase().includes(qLower)) score += 25;
      if (r.description.toLowerCase().includes(qLower)) score += 20;
      return {
        resourceId: r.id,
        resourceName: r.name,
        confidenceScore: Math.min(score, 95),
        reason: `Matched based on keyword overlap with ${r.category} and availability in ${r.institution}.`,
        suggestedSlot: r.availableDays?.[0] ? `${r.availableDays[0]} 10:00 - 12:00` : 'Next available slot',
        safetyTip: r.safetyRules?.[0] || 'Follow standard lab operating procedures.',
      };
    });
    return scored.sort((a: any, b: any) => b.confidenceScore - a.confidenceScore).slice(0, 3);
  };

  if (!ai) {
    return res.json({
      matches: getFallbackMatches(),
      mode: 'heuristic_fallback',
      message: 'Gemini API key not configured; using smart rule-based matching.',
    });
  }

  try {
    const prompt = `You are the AI Matcher for ShareSpace, an institutional resource-sharing platform.
User project/need: "${query}"

Here is the list of available campus resources:
${JSON.stringify(
  (availableResources || []).map((r: any) => ({
    id: r.id,
    name: r.name,
    category: r.category,
    description: r.description,
    institution: r.institution,
    location: r.location,
    requiredTraining: r.requiredTraining,
    safetyRules: r.safetyRules,
    availableDays: r.availableDays,
  })),
  null,
  2
)}

Recommend the top 1 to 3 best-fit resources for the user's project.
Return ONLY valid JSON in this format:
{
  "matches": [
    {
      "resourceId": "id-here",
      "resourceName": "name-here",
      "confidenceScore": 85,
      "reason": "Detailed explanation why this resource fits their project requirements...",
      "suggestedSlot": "E.g., Tomorrow 10:00 - 12:00",
      "safetyTip": "Important safety or qualification prerequisite to keep in mind"
    }
  ],
  "advice": "General tips for preparing for this reservation"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      ...parsed,
      mode: 'gemini_ai',
    });
  } catch (err: any) {
    console.error('Gemini match error:', err);
    return res.json({
      matches: getFallbackMatches(),
      mode: 'heuristic_fallback_on_error',
      message: 'AI service temporarily unavailable; defaulted to smart local matching.',
    });
  }
});

// Gemini: Incident Summarization & Resolution Advice
app.post('/api/gemini/summarize-incident', async (req: Request, res: Response) => {
  const { incident, booking, resource } = req.body;

  const fallbackSummary = {
    summary: `Reported issue: ${incident?.description || 'Resource issue'}. Reported by ${incident?.reportedByName || 'User'} on ${incident?.createdAt ? new Date(incident.createdAt).toLocaleDateString() : 'recent booking'}.`,
    severity: incident?.category === 'damaged' || incident?.category === 'safety' ? 'High' : 'Medium',
    rootCauseGuess: 'Wear and tear or improper operating handling during checkout.',
    recommendedActions: [
      'Conduct physical inspection with laboratory technician.',
      'Review pre-use checklist photos vs return photos.',
      'Schedule maintenance before unlocking the resource for new bookings.',
    ],
  };

  if (!ai) {
    return res.json({
      analysis: fallbackSummary,
      mode: 'heuristic_fallback',
    });
  }

  try {
    const prompt = `You are an institutional lab safety and disputes advisor for ShareSpace.
Review the following incident report:
- Category: ${incident?.category}
- Description: "${incident?.description}"
- Resource: ${resource?.name} (${resource?.category})
- Institution: ${resource?.institution}
- Booking user: ${booking?.userName}
- Check-in condition: ${JSON.stringify(booking?.checkInChecklist || {})}
- Check-out condition: ${JSON.stringify(booking?.checkOutChecklist || {})}
- Return notes: "${booking?.checkOutNotes || 'None'}"

Provide an objective, fair summary for the Institution Manager. Remember: human review is required; do not penalize without evidence.
Return ONLY valid JSON:
{
  "summary": "2-3 concise sentences summarizing the incident",
  "severity": "Low" | "Medium" | "High" | "Critical",
  "rootCauseGuess": "Likely cause based on report and checklist discrepancy",
  "recommendedActions": [
    "action item 1",
    "action item 2",
    "action item 3"
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      analysis: parsed,
      mode: 'gemini_ai',
    });
  } catch (err: any) {
    console.error('Gemini summarize error:', err);
    return res.json({
      analysis: fallbackSummary,
      mode: 'heuristic_fallback_on_error',
    });
  }
});

// Gemini: Suggest Alternative Slots
app.post('/api/gemini/suggest-slots', async (req: Request, res: Response) => {
  const { requestedDate, requestedTime, resourceName, existingBookings } = req.body;

  const fallbackSlots = [
    { date: requestedDate, time: '14:00 - 16:00', label: 'Afternoon Non-Peak Slot' },
    { date: requestedDate, time: '16:30 - 18:30', label: 'Late Afternoon Slot' },
    { date: 'Next Business Day', time: '10:00 - 12:00', label: 'Morning High-Focus Slot' },
  ];

  if (!ai) {
    return res.json({
      suggestedSlots: fallbackSlots,
      mode: 'fallback',
    });
  }

  try {
    const prompt = `Resource: ${resourceName}
Requested: ${requestedDate} at ${requestedTime}
Current booked slots: ${JSON.stringify(existingBookings || [])}

Suggest 3 sensible alternative time windows where the user could reserve this equipment without conflict.
Return ONLY valid JSON:
{
  "suggestedSlots": [
    { "date": "YYYY-MM-DD", "time": "HH:MM - HH:MM", "label": "Short reason" }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      ...parsed,
      mode: 'gemini_ai',
    });
  } catch (err) {
    return res.json({
      suggestedSlots: fallbackSlots,
      mode: 'fallback',
    });
  }
});

// Mount Vite or serve static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ShareSpace full-stack server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
