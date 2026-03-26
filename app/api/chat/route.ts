// lashaz-ecommerce/app/api/chat/route.ts
import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';

// Set the runtime to edge for maximum speed
export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: groq('llama-3.3-70b-versatile'), // This model is fast and very smart
    messages,
    system: `
      You are the La Shaz Virtual Beauty Consultant. 
      Tone: Sophisticated, professional, and minimalist.
      Expertise: Makeup (Lipsticks, Foundations, Blushers).
      
      Instructions:
      1. Always suggest the 'Shade Finder Quiz' if users ask about skin tones.
      2. If asked about formula, reference 'Skin Type' matching (Oily, Dry, Combination).
      3. Keep responses brief—luxury clients value their time.
      4. Use formatting (bullet points) for lists.
    `,
  });

  // This works perfectly with our manual fetch handler in ChatWidget.tsx
  return result.toTextStreamResponse(); 
}