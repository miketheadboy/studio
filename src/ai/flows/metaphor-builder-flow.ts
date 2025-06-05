// metaphor-builder-flow.ts
'use server';
/**
 * @fileOverview A metaphor generator AI agent.
 *
 * - generateMetaphor - A function that handles the metaphor generation process.
 * - MetaphorInput - The input type for the generateMetaphor function.
 * - MetaphorOutput - The return type for the generateMetaphor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MetaphorInputSchema = z.object({
  concept: z.string().describe('The concept or object for which to generate metaphors.'),
  feeling: z.string().optional().describe('Optional: The desired feeling or comparison for the metaphor.'),
});
export type MetaphorInput = z.infer<typeof MetaphorInputSchema>;

const MetaphorOutputSchema = z.object({
  metaphor: z.string().describe('A metaphor for the given concept, evoking the specified feeling if provided.'),
});
export type MetaphorOutput = z.infer<typeof MetaphorOutputSchema>;

export async function generateMetaphor(input: MetaphorInput): Promise<MetaphorOutput> {
  return metaphorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'metaphorPrompt',
  input: {schema: MetaphorInputSchema},
  output: {schema: MetaphorOutputSchema},
  prompt: `You are a creative AI specializing in generating metaphors. Given a concept and an optional feeling, you will generate a metaphor that captures the essence of the concept, evoking the specified feeling if provided.

Concept: {{{concept}}}
Feeling: {{{feeling}}}

Metaphor:`,
});

const metaphorFlow = ai.defineFlow(
  {
    name: 'metaphorFlow',
    inputSchema: MetaphorInputSchema,
    outputSchema: MetaphorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
