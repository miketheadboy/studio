'use server';

/**
 * @fileOverview AI chord generator flow.
 *
 * - generateChords - A function that generates chord progressions using AI.
 * - GenerateChordsInput - The input type for the generateChords function.
 * - GenerateChordsOutput - The return type for the generateChords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateChordsInputSchema = z.object({
  mood: z.string().describe('The mood or feeling of the song.'),
  complexity: z.enum(['simple', 'complex']).describe('The complexity of the chord progression.'),
});
export type GenerateChordsInput = z.infer<typeof GenerateChordsInputSchema>;

const GenerateChordsOutputSchema = z.object({
  chordProgression: z.string().describe('The generated chord progression.'),
});
export type GenerateChordsOutput = z.infer<typeof GenerateChordsOutputSchema>;

export async function generateChords(input: GenerateChordsInput): Promise<GenerateChordsOutput> {
  return generateChordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateChordsPrompt',
  input: {schema: GenerateChordsInputSchema},
  output: {schema: GenerateChordsOutputSchema},
  prompt: `You are an expert musician and songwriter. Compose a chord progression that fits the given mood and complexity.

Mood: {{{mood}}}
Complexity: {{{complexity}}}

Return the chord progression as a string of chords separated by spaces. Use standard chord notation, such as Am, G, C, F.
Do not return any other text.`,
});

const generateChordsFlow = ai.defineFlow(
  {
    name: 'generateChordsFlow',
    inputSchema: GenerateChordsInputSchema,
    outputSchema: GenerateChordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
