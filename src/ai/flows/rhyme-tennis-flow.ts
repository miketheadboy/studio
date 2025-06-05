// rhyme-tennis-flow.ts
'use server';
/**
 * @fileOverview A word association game with AI that results in rhymes for brainstorming lyric ideas.
 *
 * - rhymeTennis - A function that handles the word association and rhyme generation process.
 * - RhymeTennisInput - The input type for the rhymeTennis function.
 * - RhymeTennisOutput - The return type for the rhymeTennis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RhymeTennisInputSchema = z.object({
  word: z.string().describe('The word or phrase to start the rhyme association.'),
});
export type RhymeTennisInput = z.infer<typeof RhymeTennisInputSchema>;

const RhymeTennisOutputSchema = z.object({
  rhyme: z.string().describe('A word or phrase that rhymes with the input word.'),
});
export type RhymeTennisOutput = z.infer<typeof RhymeTennisOutputSchema>;

export async function rhymeTennis(input: RhymeTennisInput): Promise<RhymeTennisOutput> {
  return rhymeTennisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rhymeTennisPrompt',
  input: {schema: RhymeTennisInputSchema},
  output: {schema: RhymeTennisOutputSchema},
  prompt: `You are a creative lyric writing assistant skilled at word association and rhyme generation.

  The user will provide a word or phrase. You will respond with a single word or short phrase that rhymes with the input.
  Keep the rhyme relevant and somewhat related to the original word to help generate lyrics.
  Input: {{{word}}}`,
});

const rhymeTennisFlow = ai.defineFlow(
  {
    name: 'rhymeTennisFlow',
    inputSchema: RhymeTennisInputSchema,
    outputSchema: RhymeTennisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
