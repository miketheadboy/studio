'use server';

/**
 * @fileOverview A bridge prompt generation AI agent.
 *
 * - generateBridgePrompt - A function that handles the bridge prompt generation process.
 * - GenerateBridgePromptInput - The input type for the generateBridgePrompt function.
 * - GenerateBridgePromptOutput - The return type for the generateBridgePrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBridgePromptInputSchema = z.object({
  context: z
    .string()
    .describe(
      'Optional context describing the main theme or chorus idea for the song.'
    )
    .optional(),
});
export type GenerateBridgePromptInput = z.infer<typeof GenerateBridgePromptInputSchema>;

const GenerateBridgePromptOutputSchema = z.object({
  prompt: z.string().describe('A suggestion for a bridge in the song.'),
});
export type GenerateBridgePromptOutput = z.infer<typeof GenerateBridgePromptOutputSchema>;

export async function generateBridgePrompt(input: GenerateBridgePromptInput): Promise<GenerateBridgePromptOutput> {
  return generateBridgePromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBridgePromptPrompt',
  input: {schema: GenerateBridgePromptInputSchema},
  output: {schema: GenerateBridgePromptOutputSchema},
  prompt: `You are a helpful songwriting assistant with a poetic, Bob Dylan-esque edge.

  Suggest an idea for a song's bridge section, which serves to add contrast and new emotional depth to a song.

  You MUST:
    - Follow the user's direction.
    - You MUST be creative and imaginative
    - You MUST provide output in the output schema.

  {% if context %}The song's main theme or chorus idea is: {{{context}}}.{% endif %}
  `,
});

const generateBridgePromptFlow = ai.defineFlow(
  {
    name: 'generateBridgePromptFlow',
    inputSchema: GenerateBridgePromptInputSchema,
    outputSchema: GenerateBridgePromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
