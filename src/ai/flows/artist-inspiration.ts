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
  prompt: `You are a music expert specializing in folk, Americana, and related singer-songwriter genres.

You will provide artist inspiration based on a desired songwriting quality.

For the songwriting quality of '{{{desiredQuality}}}', suggest 2-3 critically lauded artists primarily in the folk, alt-rock, Americana, indie, or related singer-songwriter genres. Provide a brief (1-2 sentence) explanation of how they exemplify this quality and one specific, critically recognized song example for each artist.
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
