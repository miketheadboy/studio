'use server';

/**
 * @fileOverview An AI agent for generating melodic ideas for songs.
 *
 * - generateMelodyIdea - A function that generates melodic ideas.
 * - MelodyIdeaInput - The input type for the generateMelodyIdea function.
 * - MelodyIdeaOutput - The return type for the generateMelodyIdea function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MelodyIdeaInputSchema = z.object({
  query: z
    .string()
    .optional()
    .describe('Optional context about the song to focus the melody idea.'),
});
export type MelodyIdeaInput = z.infer<typeof MelodyIdeaInputSchema>;

const MelodyIdeaOutputSchema = z.object({
  melodyIdea: z.string().describe('A creative idea for a song melody.'),
});
export type MelodyIdeaOutput = z.infer<typeof MelodyIdeaOutputSchema>;

export async function generateMelodyIdea(input: MelodyIdeaInput): Promise<MelodyIdeaOutput> {
  return melodyIdeaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'melodyIdeaPrompt',
  input: {schema: MelodyIdeaInputSchema},
  output: {schema: MelodyIdeaOutputSchema},
  prompt: `You are a songwriting assistant that helps to create interesting melodies.

  Generate a creative melody idea for a song. The melody should be interesting, but also practical to play and sing.

  {% if query %}The melody should be appropriate for a song about the following: {{{query}}}.{% endif %}
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
