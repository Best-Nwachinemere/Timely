
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const personalityModes = [
  "sassy and playfully sarcastic",
  "extremely encouraging and motivational", 
  "taunting and challenging in a fun way",
  "quirky and humorous",
  "dramatic and theatrical",
  "mysteriously wise",
  "energetic and hyped up",
  "brutally honest but caring"
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userName, projects } = await req.json();

    const projectSummary = projects.length > 0 
      ? projects.map((p: any) => `${p.title} (${p.progress}% complete, ${p.completedTasks}/${p.tasksCount} tasks done)`).join(', ')
      : 'no active projects yet';

    // Randomly select a personality mode
    const randomPersonality = personalityModes[Math.floor(Math.random() * personalityModes.length)];

    const prompt = `You are an unpredictable AI assistant for a productivity app called Timely. Your personality changes randomly - today you're being ${randomPersonality}. Generate a personalized message for ${userName} based on their current progress.

Context:
- User: ${userName}
- Projects: ${projectSummary}

Personality Guidelines for being ${randomPersonality}:
- If sassy: Use witty remarks, gentle teasing, eye-rolling energy
- If encouraging: Be super positive, use exclamation points, pump them up
- If taunting: Playfully challenge them, question if they can handle their goals
- If quirky: Use unexpected analogies, weird comparisons, be delightfully odd
- If dramatic: Speak like you're in a movie, use powerful language
- If wise: Give cryptic but helpful advice, speak in metaphors
- If energetic: ALL CAPS words, lots of energy, get them PUMPED
- If brutally honest: Tell it like it is, but with underlying care

Requirements:
- Keep it under 50 words
- Stay true to the chosen personality
- Reference their name naturally
- Be unpredictable and memorable
- If they have no projects, encourage them to start (in your chosen style)
- If they have projects, acknowledge their progress (in your chosen style)

Generate only the message, no extra text.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an unpredictable AI with multiple personalities. Switch between being sassy, encouraging, taunting, quirky, dramatic, wise, energetic, or brutally honest. Keep users on their toes!' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 100,
        temperature: 0.9,
      }),
    });

    const data = await response.json();
    const message = data.choices[0].message.content.trim();

    return new Response(JSON.stringify({ message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-daily-encouragement function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
