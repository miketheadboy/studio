'use server';
/**
 * @fileOverview An AI agent for providing artist inspiration to songwriters.
 *
 * - getArtistInspiration - A function that handles the artist inspiration process.
 * - ArtistInspirationInput - The input type for the getArtistInspiration function.
 * - ArtistInspirationOutput - The return type for the getArtistInspiration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ArtistInspirationInputSchema = z.object({
  desiredQuality: z.string().describe('The desired songwriting quality for inspiration (e.g., poetic lyrics, unique chord changes).'),
});
export type ArtistInspirationInput = z.infer<typeof ArtistInspirationInputSchema>;

const ArtistInspirationOutputSchema = z.object({
  artistExamples: z
    .string()
    .describe(
      'A list of artist examples that exemplify the specified songwriting quality, including a brief explanation and a specific song example.'
    ),
});
export type ArtistInspirationOutput = z.infer<typeof ArtistInspirationOutputSchema>;

export async function getArtistInspiration(input: ArtistInspirationInput): Promise<ArtistInspirationOutput> {
  return artistInspirationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'artistInspirationPrompt',
  input: {schema: ArtistInspirationInputSchema},
  output: {schema: ArtistInspirationOutputSchema},
  prompt: `You are a music expert and historian with deep knowledge across various genres, including folk, Americana, indie, alt-rock, R&B, soul, and experimental music.

You will provide artist inspiration based on a desired songwriting quality.

For the songwriting quality of '{{{desiredQuality}}}', suggest 2-3 critically lauded artists who exemplify this. These artists could come from genres like folk, alt-rock, Americana, indie, R&B/soul, or other related singer-songwriter traditions. Consider artists known for their innovative songwriting, such as D'Angelo, Big Thief, Neutral Milk Hotel, Frank Ocean, The Microphones, or Sufjan Stevens, alongside others, if they fit the requested quality.

Provide a brief (1-2 sentence) explanation of how each artist exemplifies this quality and one specific, critically recognized song example for each. Ensure your suggestions are thoughtful and connect clearly to the '{{{desiredQuality}}}'.
`,
});

const artistInspirationFlow = ai.defineFlow(
  {
    name: 'artistInspirationFlow',
    inputSchema: ArtistInspirationInputSchema,
    outputSchema: ArtistInspirationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
