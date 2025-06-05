'use server';

/**
 * @fileOverview An AI agent that reharmonizes chord progressions.
 *
 * - reharmonizeChords - A function that handles the chord reharmonization process.
 * - ReharmonizeChordsInput - The input type for the reharmonizeChords function.
 * - ReharmonizeChordsOutput - The return type for the reharmonizeChords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReharmonizeChordsInputSchema = z.object({
  chords: z.string().describe('The original chord progression to reharmonize.'),
  style: z.string().describe('The reharmonization style (e.g., Jazzier, Simpler).'),
  intensity: z.string().describe('The intensity of reharmonization (e.g., Subtle, Adventurous).'),
});
export type ReharmonizeChordsInput = z.infer<typeof ReharmonizeChordsInputSchema>;

const ReharmonizeChordsOutputSchema = z.object({
  reharmonizedChords: z.string().describe('The reharmonized chord progression.'),
});
export type ReharmonizeChordsOutput = z.infer<typeof ReharmonizeChordsOutputSchema>;

export async function reharmonizeChords(input: ReharmonizeChordsInput): Promise<ReharmonizeChordsOutput> {
  return reharmonizeChordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reharmonizeChordsPrompt',
  input: {schema: ReharmonizeChordsInputSchema},
  output: {schema: ReharmonizeChordsOutputSchema},
  prompt: `You are a helpful AI music assistant that reharmonizes chord progressions.

  Reharmonize the given chord progression in the specified style and intensity.
  Respond with the reharmonized chord progression, using standard chord notation (e.g., Cmaj7, G7, Am7, Fmaj7).

  Original Chords: {{{chords}}}
  Style: {{{style}}}
  Intensity: {{{intensity}}}

  Reharmonized Chords: `,
});

const reharmonizeChordsFlow = ai.defineFlow(
  {
    name: 'reharmonizeChordsFlow',
    inputSchema: ReharmonizeChordsInputSchema,
    outputSchema: ReharmonizeChordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
