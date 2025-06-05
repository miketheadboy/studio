// This file is machine-generated - DO NOT EDIT.

'use server';

/**
 * @fileOverview An AI agent for analyzing the mood of song lyrics.
 *
 * - analyzeLyricalMood - A function that handles the mood analysis process.
 * - LyricalMoodInput - The input type for the analyzeLyricalMood function.
 * - LyricalMoodOutput - The return type for the analyzeLyricalMood function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LyricalMoodInputSchema = z.object({
  lyrics: z.string().describe('The lyrics to analyze.'),
});
export type LyricalMoodInput = z.infer<typeof LyricalMoodInputSchema>;

const LyricalMoodOutputSchema = z.object({
  moodAnalysis: z
    .string()
    .describe('A concise summary of the overall mood and emotional tone of the lyrics.'),
});
export type LyricalMoodOutput = z.infer<typeof LyricalMoodOutputSchema>;

export async function analyzeLyricalMood(input: LyricalMoodInput): Promise<LyricalMoodOutput> {
  return lyricalMoodFlow(input);
}

const prompt = ai.definePrompt({
  name: 'lyricalMoodPrompt',
  input: {schema: LyricalMoodInputSchema},
  output: {schema: LyricalMoodOutputSchema},
  prompt: `Analyze the overall mood and emotional tone of the following lyrics. Provide a concise summary (1-2 sentences) of the dominant mood(s) and perhaps a few key descriptive words.\n\nLyrics: {{{lyrics}}}`,
});

const lyricalMoodFlow = ai.defineFlow(
  {
    name: 'lyricalMoodFlow',
    inputSchema: LyricalMoodInputSchema,
    outputSchema: LyricalMoodOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
