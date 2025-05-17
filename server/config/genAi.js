// services/geminiService.js
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with your API key
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateWeeklyInsights(moodData) {
  try {
    const moodSummary = moodData.map(entry => 
      `Date: ${new Date(entry.date).toLocaleDateString()}, Mood: ${entry.mood}, Journal: "${entry.journal || 'No journal entry'}"`
    ).join('\n');

    const prompt = `
You are a compassionate, data-driven mental‐wellness coach. You have just received a full week’s worth of the user’s mood entries and journal notes:

${moodSummary}

Each entry in ${moodSummary} is an object with \`date\` (YYYY-MM‑DD), \`mood\` (e.g. Happy, Anxious), and \`journal\` (text or empty string).  

Generate a **single JSON object** with exactly these keys:  
- \`moodTrends\`  
- \`improvementTips\`  
- \`userInsights\`  
- \`additionalFeedback\`  

**Important formatting rules**  
- Output valid JSON only, no extra text.  
- Each value must be a **string** containing bullet points or numbered lists where appropriate (\`•\` or \`1., 2., 3.\`) and separated by \`\\n\`.  

**Tone & Personalization**  
- Speak directly to the user as “you” (never “the user”).  
- Refer to specific dates and, where helpful, quote 5–8 words from their journal.  
- Tie every insight or tip back to an actual entry or pattern in the data.  

---

1. **moodTrends**  
   - List each distinct mood you reported, with date(s) and frequency.  
   - Note exact transitions you can observe (e.g., “On 2025‑04‑16 you moved from Anxious to Calm after your afternoon walk”).  
   - If you can’t detect a clear pattern, state exactly why (e.g., “Only two journal entries were provided, so trend analysis is limited”).  

2. **improvementTips**  
   - Give **4** targeted, evidence‑based actions that directly address the **most frequent** or **most intense** moods you saw.  
   - For each tip, begin with the mood it’s addressing (e.g., “When you feel Anxious: …”), then a concrete step (e.g., “try this breathing exercise …”).  
   - Where possible, tie the tip to something in your week (e.g., “since you felt anxious before your meeting on 2025‑04‑17, schedule 2‑minute breathing breaks at 10 AM and 3 PM”).  

3. **userInsights**  
   - Draw out **2–3** deeper themes you see in your journal (e.g., “you often mention work deadlines late in the evening, which may be affecting sleep”).  
   - Use tentative phrasing sparingly and only where absolutely necessary (“you might be noticing…”).  
   - Always link back to at least one exact journal excerpt.  

4. **additionalFeedback**  
   - Highlight any positive habit you already show (e.g., “you wrote in your journal three times—excellent consistency!”).  
   - Suggest **2** precise journaling prompts for next week, based on gaps or triggers you observed (e.g., “when you feel Angry: ‘What belief underlies this anger?’”).  
   - Point out any useful timing or context cues (e.g., “you logged Calm only in the mornings—try a midday check‑in”).

**Example output**  
\`\`\`json
{
  "moodTrends": "• On 2025-04-15: Happy (1 time)…",
  "improvementTips": "• When you felt Angry on 2025-04-16: try writing down the trigger within 5 min…\\n• …",
  "userInsights": "• You consistently mention work deadlines after 6 PM (“I rushed to finish report”)…\\n• …",
  "additionalFeedback": "• Great job journaling on 3 occasions this week…\\n• Prompt 1: “What was I hoping to achieve when I felt…?”…"
}
\`\`\`

---

Use **only** the data in ${moodSummary} (no assumptions). If there’s missing or sparse data, be explicit about that limitation.  
`;


    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract the JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback if the model didn't return proper JSON
    return {
      moodTrends: "Could not analyze mood trends from the data.",
      improvementTips: "No specific recommendations available.",
      userInsights: "Insufficient data for meaningful insights.",
      additionalFeedback: "Please try again later."
    };
  } catch (error) {
    console.error("Error generating insights with Gemini:", error);
    throw error;
  }
}

