'use server';
/**
 * @fileOverview A flow to suggest instruments for a song based on its vibe and style.
 *
 * - suggestInstruments - A function that suggests instruments based on vibe and style.
 * - SuggestInstrumentsInput - The input type for the suggestInstruments function.
 * - SuggestInstrumentsOutput - The return type for the suggestInstruments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestInstrumentsInputSchema = z.object({
  vibe: z.string().describe('The vibe or genre of the song (e.g., Dusty Americana).'),
  styleEra: z.string().describe('The musical style or era (e.g., General Folk/Americana).'),
});
export type SuggestInstrumentsInput = z.infer<typeof SuggestInstrumentsInputSchema>;

const SuggestInstrumentsOutputSchema = z.object({
  instruments: z.string().describe('A list of suggested instruments for the song.'),
});
export type SuggestInstrumentsOutput = z.infer<typeof SuggestInstrumentsOutputSchema>;

export async function suggestInstruments(input: SuggestInstrumentsInput): Promise<SuggestInstrumentsOutput> {
  return suggestInstrumentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestInstrumentsPrompt',
  input: {schema: SuggestInstrumentsInputSchema},
  output: {schema: SuggestInstrumentsOutputSchema},
  prompt: `Suggest 4-6 key instruments or sonic textures suitable for a song with a "{{{vibe}}}" vibe and a "{{{styleEra}}}" style/era (focusing on alternative folk, rock, or Americana styles). For each, briefly describe its potential role, feel, or a classic example of its use in these genres. List them clearly, one per line.`,
});

const suggestInstrumentsFlow = ai.defineFlow(
  {
    name: 'suggestInstrumentsFlow',
    inputSchema: SuggestInstrumentsInputSchema,
    outputSchema: SuggestInstrumentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
