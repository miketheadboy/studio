'use server';

/**
 * @fileOverview Generates album titles using AI.
 *
 * - generateAlbumTitle - A function that generates an album title.
 * - AlbumTitleInput - The input type for the generateAlbumTitle function.
 * - AlbumTitleOutput - The return type for the generateAlbumTitle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AlbumTitleInputSchema = z.object({
  /* No input required */
});
export type AlbumTitleInput = z.infer<typeof AlbumTitleInputSchema>;

const AlbumTitleOutputSchema = z.object({
  title: z.string().describe('The generated album title.'),
});
export type AlbumTitleOutput = z.infer<typeof AlbumTitleOutputSchema>;

export async function generateAlbumTitle(): Promise<AlbumTitleOutput> {
  return albumTitleFlow({});
}

const prompt = ai.definePrompt({
  name: 'albumTitlePrompt',
  input: {schema: AlbumTitleInputSchema},
  output: {schema: AlbumTitleOutputSchema},
  prompt: `Generate a creative and intriguing album title idea. It should be short, impactful, and suitable for a folk, rock, or indie album. Provide only the title, no extra text.`,
});

const albumTitleFlow = ai.defineFlow(
  {
    name: 'albumTitleFlow',
    inputSchema: AlbumTitleInputSchema,
    outputSchema: AlbumTitleOutputSchema,
  },
  async () => {
    const {output} = await prompt({});
    return output!;
  }
);
