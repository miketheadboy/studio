'use server';

/**
 * @fileOverview An AI agent that generates a complete song draft.
 *
 * - generateFullSong - A function that handles the song draft generation process.
 * - GenerateFullSongInput - The input type for the generateFullSong function.
 * - GenerateFullSongOutput - The return type for the generateFullSong function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFullSongInputSchema = z.object({
  theme: z.string().describe('The theme or topic of the song.'),
  songStyle: z.string().describe('The musical style or mood of the song.'),
  structure: z.string().describe('The desired song structure (e.g., VCVCBC, AABA).'),
  keywords: z.string().describe('Key lyrical phrases or keywords (optional, comma-separated).').optional(),
  verseCount: z.number().describe('Approximate number of verses (e.g., 2-3).').default(3),
});
export type GenerateFullSongInput = z.infer<typeof GenerateFullSongInputSchema>;

const GenerateFullSongOutputSchema = z.string().describe('The AI-generated song draft, including lyrics and chord suggestions.');
export type GenerateFullSongOutput = z.infer<typeof GenerateFullSongOutputSchema>;

export async function generateFullSong(input: GenerateFullSongInput): Promise<GenerateFullSongOutput> {
  return generateFullSongFlow(input);
}

const generateFullSongPrompt = ai.definePrompt({
  name: 'generateFullSongPrompt',
  input: {schema: GenerateFullSongInputSchema},
  output: {schema: GenerateFullSongOutputSchema},
  prompt: `You are a creative songwriter specializing in Folk, Americana, and Alt-Country styles. Compose a complete song draft.\nTheme: {{{theme}}}.\nStyle/Mood: {{{songStyle}}}.\nStructure: {{{structure}}}.\nKey lyrical phrases/keywords to try and include (if any): {{{keywords}}}.\nAim for about {{{verseCount}}} verses.\nFor each section ([VERSE 1], [CHORUS], [BRIDGE], etc.), provide evocative lyrics.\nAlso, suggest a simple, fitting chord progression for each section using standard notation (e.g., Am - G - C - F).\nEnsure clear section headers.\n`,
});

const generateFullSongFlow = ai.defineFlow(
  {
    name: 'generateFullSongFlow',
    inputSchema: GenerateFullSongInputSchema,
    outputSchema: GenerateFullSongOutputSchema,
  },
  async input => {
    const {output} = await generateFullSongPrompt(input);
    return output!;
  }
);
