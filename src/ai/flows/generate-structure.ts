'use server';

/**
 * @fileOverview Generates a song structure using AI.
 *
 * - generateSongStructure - A function that generates a song structure based on the provided input.
 * - GenerateSongStructureInput - The input type for the generateSongStructure function.
 * - GenerateSongStructureOutput - The return type for the generateSongStructure function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSongStructureInputSchema = z.object({
  songIdea: z.string().describe('A brief description of the song idea or theme.'),
  selectedStructure: z.string().describe('The desired song structure (e.g., Verse-Chorus-Verse-Chorus-Bridge-Chorus).'),
});
export type GenerateSongStructureInput = z.infer<typeof GenerateSongStructureInputSchema>;

const GenerateSongStructureOutputSchema = z.object({
  structure: z.string().describe('The generated song structure with placeholders for lyrics.'),
});
export type GenerateSongStructureOutput = z.infer<typeof GenerateSongStructureOutputSchema>;

export async function generateSongStructure(input: GenerateSongStructureInput): Promise<GenerateSongStructureOutput> {
  return generateSongStructureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSongStructurePrompt',
  input: {schema: GenerateSongStructureInputSchema},
  output: {schema: GenerateSongStructureOutputSchema},
  prompt: `You are a helpful AI assistant for songwriters, skilled at generating song structures.

  Based on the song idea: "{{songIdea}}", and the desired structure: "{{selectedStructure}}", create a song structure with clear section headers (e.g., [VERSE 1], [CHORUS]) and brief placeholders (e.g., (lyrics here...)) to guide the songwriter.
  Ensure that the structure is musically sound and lyrically fitting for the song idea.  Respond with the structure, placeholders, and section headers only, with two newlines between each section.

  Example Output:
  [VERSE 1]
  (lyrics about setting the scene...)

  [CHORUS]
  (the main hook and emotional core...)

  [VERSE 2]
  (develop the story or idea further...)

  [CHORUS]
  (repeat the main hook...)

  [BRIDGE]
  (a contrasting section with a different perspective...)

  [CHORUS]
  (final repetition of the main hook...)
  `,
});

const generateSongStructureFlow = ai.defineFlow(
  {
    name: 'generateSongStructureFlow',
    inputSchema: GenerateSongStructureInputSchema,
    outputSchema: GenerateSongStructureOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {structure: output!.structure!};
  }
);
