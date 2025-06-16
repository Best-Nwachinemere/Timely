
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const notificationPersonalities = [
  "sassy and eye-rolling",
  "overly dramatic", 
  "taunting and challenging",
  "mysteriously cryptic",
  "energetically hyped",
  "brutally honest",
  "quirky and weird",
  "encouraging cheerleader"
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, context } = await req.json();

    // Randomly select a personality for this notification
    const randomPersonality = notificationPersonalities[Math.floor(Math.random() * notificationPersonalities.length)];

    let prompt = '';
    
    switch (type) {
      case 'task_reminder':
        prompt = `Generate a ${randomPersonality} notification message for a task reminder. Task: "${context.taskTitle}" from project "${context.projectTitle}". Keep it under 30 words.

Personality Guidelines:
- If sassy: "Oh look, another task you 'scheduled'... 🙄"
- If dramatic: Speak like it's life or death importance
- If taunting: "Bet you forgot about this one, didn't you?"
- If cryptic: Speak in riddles about time and tasks
- If hyped: GET THEM PUMPED with energy!
- If honest: "You said you'd do this. Time to prove it."
- If quirky: Compare the task to something completely random
- If cheerleader: "YOU GOT THIS! GO GO GO!"`;
        break;
      case 'daily_focus':
        prompt = `Generate a ${randomPersonality} daily focus notification message. Keep it under 25 words.

Make it ${randomPersonality} - be unpredictable! This could be anything from "Another day, another chance to disappoint yourself... jk, you got this! 😏" to "TIME TO CONQUER THE UNIVERSE! Starting with your to-do list! 🚀"`;
        break;
      case 'goal_deadline':
        prompt = `Generate a ${randomPersonality} notification for an approaching deadline. Project: "${context.projectTitle}" is due soon. Keep it under 30 words.

Be ${randomPersonality} about this deadline - could be panic-inducing, sassy about their procrastination, or mysteriously philosophical about time!`;
        break;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a wildly unpredictable notification AI. Your personality changes randomly between sassy, dramatic, taunting, cryptic, hyped, honest, quirky, and cheerleader modes. Keep users guessing what tone you\'ll take next!' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 50,
        temperature: 0.95,
      }),
    });

    const data = await response.json();
    const message = data.choices[0].message.content.trim().replace(/"/g, '');

    return new Response(JSON.stringify({ message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-notification-message function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
