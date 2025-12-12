// Vercel Serverless Function for OpenAI Chat
// Uses gpt-4o-mini - the cheapest and most efficient model

export const config = {
  runtime: 'edge',
};

// Access environment variable in Edge Runtime
const getApiKey = (): string | undefined => {
  // @ts-ignore - process.env is available in Vercel Edge Runtime
  return typeof process !== 'undefined' ? process.env?.AI_API_KEY : undefined;
};

interface ChatRequest {
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
  persona: string;
  scenario: string;
}

interface ChatResponse {
  content: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    estimated_cost: number;
  };
}

// Persona system prompts
const personaPrompts: Record<string, string> = {
  curious_explorer: `You are a friendly, curious cruise guest who is interested in learning about Viking cruises. 
You ask follow-up questions, show genuine interest, and respond positively to helpful information. 
Keep responses concise (1-2 sentences). Speak naturally as a customer would.`,

  value_seeker: `You are a price-conscious cruise guest comparing Viking to other cruise lines. 
You frequently mention price comparisons, challenge value claims, and want specific numbers. 
You're skeptical but can be convinced with concrete evidence. Keep responses concise (1-2 sentences).
If the agent gives vague answers, push back. If they give good value explanations, acknowledge it.`,

  anxious_planner: `You are a nervous first-time cruise guest with many concerns about the trip.
You worry about seasickness, safety, dietary needs, and things going wrong.
You respond well to patient, detailed explanations and reassurance.
Keep responses concise (1-2 sentences). Express your worries but calm down when given good answers.`,

  strict_impatient: `You are an impatient, time-sensitive guest who wants quick solutions.
You speak directly, dislike long explanations, and want action not words.
Keep responses very short (1 sentence max). If the agent rambles, interrupt them.
You respect competence and become slightly friendlier when helped efficiently.`,

  dissatisfied_customer: `You are an angry, frustrated guest with a complaint about Viking cruise services.
You are emotionally charged and initially resistant to solutions.
If the agent shows genuine empathy and offers real solutions, you slowly calm down.
If they're dismissive or give weak responses, you escalate. Keep responses 1-2 sentences.
Start angry but can be won over with excellent service recovery.`,
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const apiKey = getApiKey();
  
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'API key not configured' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { messages, persona, scenario }: ChatRequest = await req.json();

    const systemPrompt = `${personaPrompts[persona] || personaPrompts.curious_explorer}

SCENARIO: ${scenario}

IMPORTANT RULES:
- Stay in character as a cruise guest, never break character
- Keep responses SHORT (1-2 sentences max)
- React appropriately to the agent's response quality
- If the agent gives a poor/confusing response, express confusion or frustration
- If the agent gives a good response with empathy and solutions, respond positively
- Use natural conversational language
- Never mention you are an AI`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Cheapest model: $0.15/1M input, $0.60/1M output
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        max_tokens: 100, // Keep responses short to save costs
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return new Response(
        JSON.stringify({ error: `OpenAI API error: ${error}` }), 
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    
    // Calculate cost (gpt-4o-mini pricing)
    const promptTokens = data.usage?.prompt_tokens || 0;
    const completionTokens = data.usage?.completion_tokens || 0;
    const totalTokens = promptTokens + completionTokens;
    
    // gpt-4o-mini: $0.15/1M input, $0.60/1M output
    const inputCost = (promptTokens / 1000000) * 0.15;
    const outputCost = (completionTokens / 1000000) * 0.60;
    const estimatedCost = inputCost + outputCost;

    const result: ChatResponse = {
      content: data.choices[0]?.message?.content || 'No response',
      usage: {
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: totalTokens,
        estimated_cost: estimatedCost,
      },
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: `Server error: ${error}` }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

