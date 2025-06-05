'use server';
/**
 * @fileOverview Chord voicing suggestion AI agent.
 *
 * - getChordVoicingSuggestions - A function that suggests chord voicings.
 * - ChordVoicingInput - The input type for the getChordVoicingSuggestions function.
 * - ChordVoicingOutput - The return type for the getChordVoicingSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChordVoicingInputSchema = z.object({
  chords: z
    .string()
    .describe('The chord progression to get voicing ideas for (e.g., C G Am F)'),
});
export type ChordVoicingInput = z.infer<typeof ChordVoicingInputSchema>;

const ChordVoicingOutputSchema = z.object({
  suggestions: z
    .string()
    .describe('Suggested voicings for the provided chords.'),
});
export type ChordVoicingOutput = z.infer<typeof ChordVoicingOutputSchema>;

export async function getChordVoicingSuggestions(
  input: ChordVoicingInput
): Promise<ChordVoicingOutput> {
  return chordVoicingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chordVoicingPrompt',
  input: {schema: ChordVoicingInputSchema},
  output: {schema: ChordVoicingOutputSchema},
  prompt: `You are a helpful AI assistant for songwriters. Your goal is to provide interesting and practical voicing ideas for chords that a songwriter provides.

  Provide 2-3 voicing suggestions for a few key chords, suitable for an acoustic guitar in a folk/Americana style. For example, "For Am, try Am7 (A-C-E-G) or Am(add9) (A-C-E-B)". Keep suggestions brief and focused on adding color.

  The chords to generate voicings for are: {{{chords}}}`,
});

const chordVoicingFlow = ai.defineFlow(
  {
    name: 'chordVoicingFlow',
    inputSchema: ChordVoicingInputSchema,
    outputSchema: ChordVoicingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
