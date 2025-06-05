'use server';

/**
 * @fileOverview A tool for rephrasing lines of lyrics into different tones using AI.
 *
 * @file LyricalLabFlow - A Genkit flow to rephrase lines of lyrics into different tones.
 * @file RephraseInput - The input type for the lyrical rephrasing flow.
 * @file RephraseOutput - The output type for the lyrical rephrasing flow.
 * @file rephraseLine - A function that handles the lyrical rephrasing process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RephraseInputSchema = z.object({
  lineToRephrase: z.string().describe('The line of lyrics to rephrase.'),
  rephraseStyle: z
    .string()
    .describe(
      'The desired rephrasing style (e.g., More Literal, More Symbolic/Metaphorical, More Poetic, Darker Tone, Humorous, Americana Vibe).'
    ),
});
export type RephraseInput = z.infer<typeof RephraseInputSchema>;

const RephraseOutputSchema = z.object({
  rephrasedLine: z.string().describe('The rephrased line of lyrics.'),
});
export type RephraseOutput = z.infer<typeof RephraseOutputSchema>;

export async function rephraseLine(input: RephraseInput): Promise<RephraseOutput> {
  return lyricalLabFlow(input);
}

const rephrasePrompt = ai.definePrompt({
  name: 'rephrasePrompt',
  input: {schema: RephraseInputSchema},
  output: {schema: RephraseOutputSchema},
  prompt: `You are a helpful lyric writing assistant with a poetic, Bob Dylan-esque edge. Take this simple line: "{{{lineToRephrase}}}". Rewrite it in one distinct way. The rephrasing style should be: "{{{rephraseStyle}}}". Provide only the rephrased line, no extra text or explanation.`, 
});

const lyricalLabFlow = ai.defineFlow(
  {
    name: 'lyricalLabFlow',
    inputSchema: RephraseInputSchema,
    outputSchema: RephraseOutputSchema,
  },
  async input => {
    const {output} = await rephrasePrompt(input);
    return output!;
  }
);
