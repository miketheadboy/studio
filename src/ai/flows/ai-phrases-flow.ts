'use server';
/**
 * @fileOverview A flow for generating adjective-noun phrases.
 *
 * - generatePhrases - A function that generates adjective-noun phrases.
 * - GeneratePhrasesInput - The input type for the generatePhrases function.
 * - GeneratePhrasesOutput - The return type for the generatePhrases function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePhrasesInputSchema = z.object({
  count: z
    .number()
    .default(10)
    .describe('The number of adjective-noun phrases to generate.'),
});
export type GeneratePhrasesInput = z.infer<typeof GeneratePhrasesInputSchema>;

const GeneratePhrasesOutputSchema = z.object({
  phrases: z.array(z.string()).describe('An array of adjective-noun phrases.'),
});
export type GeneratePhrasesOutput = z.infer<typeof GeneratePhrasesOutputSchema>;

export async function generatePhrases(input: GeneratePhrasesInput): Promise<GeneratePhrasesOutput> {
  return generatePhrasesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePhrasesPrompt',
  input: {schema: GeneratePhrasesInputSchema},
  output: {schema: GeneratePhrasesOutputSchema},
  prompt: `You are a creative songwriter specializing in Folk, Americana, and Alt-Country styles. Generate {{count}} adjective-noun phrases suitable for song lyrics. Format as a simple list, one phrase per line.`,
});

const generatePhrasesFlow = ai.defineFlow(
  {
    name: 'generatePhrasesFlow',
    inputSchema: GeneratePhrasesInputSchema,
    outputSchema: GeneratePhrasesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
