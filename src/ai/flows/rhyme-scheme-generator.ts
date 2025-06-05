// rhyme-scheme-generator.ts
'use server';

/**
 * @fileOverview Generates rhyme schemes for songwriters.
 *
 * - generateRhymeScheme - A function that generates rhyme schemes based on input text.
 * - RhymeSchemeInput - The input type for the generateRhymeScheme function.
 * - RhymeSchemeOutput - The output type for the generateRhymeScheme function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RhymeSchemeInputSchema = z.object({
  inputText: z
    .string()
    .describe('A few lines of text or a topic for which to generate a rhyme scheme.'),
});
export type RhymeSchemeInput = z.infer<typeof RhymeSchemeInputSchema>;

const RhymeSchemeOutputSchema = z.object({
  rhymeScheme: z
    .string()
    .describe('A common rhyme scheme pattern (e.g., AABB, ABAB, ABCB) and suggestions for additional lines.'),
});
export type RhymeSchemeOutput = z.infer<typeof RhymeSchemeOutputSchema>;

export async function generateRhymeScheme(input: RhymeSchemeInput): Promise<RhymeSchemeOutput> {
  return generateRhymeSchemeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rhymeSchemePrompt',
  input: {schema: RhymeSchemeInputSchema},
  output: {schema: RhymeSchemeOutputSchema},
  prompt: `Analyze the rhyme scheme of the following lyrics or concept and provide a common rhyme scheme pattern (e.g., AABB, ABAB, ABCB). If lyrics are provided, indicate the scheme of those lines. If a concept is provided, suggest lines that fit a common scheme. Also, suggest 2-3 additional lines that would fit that scheme and topic.\n\nInput: {{{inputText}}}`,
});

const generateRhymeSchemeFlow = ai.defineFlow(
  {
    name: 'generateRhymeSchemeFlow',
    inputSchema: RhymeSchemeInputSchema,
    outputSchema: RhymeSchemeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
