// rhythm-architect-flow.ts
'use server';
/**
 * @fileOverview A rhythm idea generator AI agent.
 *
 * - generateRhythmIdea - A function that handles the rhythm idea generation process.
 * - RhythmIdeaInput - The input type for the generateRhythmIdea function.
 * - RhythmIdeaOutput - The return type for the generateRhythmIdea function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RhythmIdeaInputSchema = z.object({});
export type RhythmIdeaInput = z.infer<typeof RhythmIdeaInputSchema>;

const RhythmIdeaOutputSchema = z.object({
  rhythmIdea: z
    .string()
    .describe(
      'A creative rhythmic pattern or percussive idea for a song, suitable for folk, rock, or Americana genres.'
    ),
});
export type RhythmIdeaOutput = z.infer<typeof RhythmIdeaOutputSchema>;

export async function generateRhythmIdea(
  input: RhythmIdeaInput
): Promise<RhythmIdeaOutput> {
  return generateRhythmIdeaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rhythmIdeaPrompt',
  input: {schema: RhythmIdeaInputSchema},
  output: {schema: RhythmIdeaOutputSchema},
  prompt: `You are a creative rhythm architect specializing in generating rhythmic patterns and percussive ideas for songs, suitable for folk, rock, or Americana genres.

  Generate a unique rhythmic pattern or percussive idea for a song. Describe it briefly, perhaps relating to a mood or instrument (e.g., "A steady, driving kick drum on 1 and 3 with a syncopated snare on 2 and the 'and' of 4 for a rock feel").

  Output:
  {{$response.rhythmIdea}}`,
});

const generateRhythmIdeaFlow = ai.defineFlow(
  {
    name: 'generateRhythmIdeaFlow',
    inputSchema: RhythmIdeaInputSchema,
    outputSchema: RhythmIdeaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
