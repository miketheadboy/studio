
'use server';

/**
 * @fileOverview An AI agent for generating melodic ideas for songs.
 *
 * - generateMelodyIdea - A function that generates melodic ideas with detailed guidance.
 * - MelodyIdeaInput - The input type for the generateMelodyIdea function.
 * - MelodyIdeaOutput - The return type for the generateMelodyIdea function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MelodyIdeaInputSchema = z.object({
  query: z
    .string()
    .optional()
    .describe('Optional context about the song (e.g., lyrics, mood, theme) to focus the melody idea.'),
});
export type MelodyIdeaInput = z.infer<typeof MelodyIdeaInputSchema>;

const MelodyIdeaOutputSchema = z.object({
  overallConcept: z.string().describe('A creative, overarching idea or direction for a song melody.'),
  suggestedApproach: z.string().describe('Actionable steps or techniques to start developing the melody (e.g., focusing on contour, rhythm, or a specific motif).'),
  moodAndScales: z.string().optional().describe('Suggestions for scales, modes, or general harmonic language that would fit the mood of the melody idea.'),
  rhythmicIdeas: z.string().optional().describe('Ideas for rhythmic patterns or variations that could be applied to the melody.'),
  keyConsiderations: z.string().optional().describe('Important aspects to keep in mind while crafting the melody, such as lyrical phrasing, emotional peaks, or instrumental suitability.'),
});
export type MelodyIdeaOutput = z.infer<typeof MelodyIdeaOutputSchema>;

export async function generateMelodyIdea(input: MelodyIdeaInput): Promise<MelodyIdeaOutput> {
  return melodyIdeaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'melodyIdeaPrompt',
  input: {schema: MelodyIdeaInputSchema},
  output: {schema: MelodyIdeaOutputSchema},
  prompt: `You are an experienced songwriting assistant and music theory guide, specializing in helping users craft compelling melodies.

Your goal is to provide not just a simple idea, but a helpful starting point with actionable advice for developing a melody.

{% if query %}
The user is looking for a melody appropriate for a song with the following context or theme: "{{{query}}}".
{% else %}
The user is looking for a general creative melody idea.
{% endif %}

Please generate a response that includes:
1.  **Overall Concept:** A creative, overarching idea or direction for the song melody (1-2 sentences).
2.  **Suggested Approach:** Actionable steps or techniques to start developing the melody (e.g., "Try starting with a simple rhythmic motif on the tonic...", "Consider a rising contour for the chorus to build energy...").
3.  **Mood & Scales (Optional):** If applicable, suggest scales, modes (e.g., Dorian, Mixolydian), or general harmonic language that would fit the mood implied by the concept or query (e.g., "For a melancholic feel, a natural minor or Aeolian mode could work well.").
4.  **Rhythmic Ideas (Optional):** Suggest simple rhythmic patterns or variations (e.g., "Emphasize long, sustained notes for a ballad feel, or use a more syncopated rhythm for an upbeat section.").
5.  **Key Considerations (Optional):** Briefly mention 1-2 important aspects to keep in mind (e.g., "Pay attention to how the melody fits the natural rhythm of potential lyrics," or "Think about where the melodic high point (apex) might occur for maximum emotional impact.").

Ensure your response is practical, encouraging, and suitable for a songwriter looking for inspiration and guidance.
Provide each section clearly.
`,
});

const melodyIdeaFlow = ai.defineFlow(
  {
    name: 'melodyIdeaFlow',
    inputSchema: MelodyIdeaInputSchema,
    outputSchema: MelodyIdeaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
