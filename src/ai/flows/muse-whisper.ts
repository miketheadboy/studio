'use server';

/**
 * @fileOverview A muse whisper AI agent that generates songwriting prompts.
 *
 * - summonMuse - A function that summons the muse and returns a songwriting prompt.
 * - SummonMuseOutput - The output type for the summonMuse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummonMuseOutputSchema = z.object({
  prompt: z.string().describe('A unique, evocative songwriting prompt or theme idea.'),
});
export type SummonMuseOutput = z.infer<typeof SummonMuseOutputSchema>;

export async function summonMuse(): Promise<SummonMuseOutput> {
  return summonMuseFlow();
}

const prompt = ai.definePrompt({
  name: 'summonMusePrompt',
  output: {schema: SummonMuseOutputSchema},
  prompt: `You are a muse that specializes in assisting songwriters. Generate a unique, evocative songwriting prompt or theme idea (1-2 sentences). Focus on abstract concepts, emotions, or unusual scenarios suitable for folk/rock lyrics.`,
});

const summonMuseFlow = ai.defineFlow(
  {
    name: 'summonMuseFlow',
    outputSchema: SummonMuseOutputSchema,
  },
  async () => {
    const {output} = await prompt({});
    return output!;
  }
);
