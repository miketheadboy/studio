'use server';

/**
 * @fileOverview Expands a single line or idea into a full lyrical section for a song.
 *
 * @remarks
 * This flow takes a starting line or idea and generates a full lyrical section (verse, chorus, or bridge)
 * suitable for a folk, rock, or Americana song.
 *
 * @public
 * @param   input - The input to the expandSection function.
 * @returns The expanded lyrical section.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SectionExpanderInputSchema = z.object({
  idea: z.string().describe('A starting line or idea to expand.'),
  expandType: z
    .enum(['verse', 'chorus', 'bridge'])
    .describe('The type of section to expand to.'),
});
export type SectionExpanderInput = z.infer<typeof SectionExpanderInputSchema>;

const SectionExpanderOutputSchema = z.object({
  expandedSection: z
    .string()
    .describe('The expanded lyrical section (4-8 lines).'),
});
export type SectionExpanderOutput = z.infer<typeof SectionExpanderOutputSchema>;

export async function expandSection(input: SectionExpanderInput): Promise<SectionExpanderOutput> {
  return sectionExpanderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sectionExpanderPrompt',
  input: {schema: SectionExpanderInputSchema},
  output: {schema: SectionExpanderOutputSchema},
  prompt: `You are a creative songwriter specializing in Folk, Rock, and Americana styles.
Expand the following lyrical idea/line into a full {{{expandType}}} for a song.
Provide about 4-8 lines suitable for the style. Do not include section headers like [VERSE].

Idea: "{{{idea}}}"`,
});

const sectionExpanderFlow = ai.defineFlow(
  {
    name: 'sectionExpanderFlow',
    inputSchema: SectionExpanderInputSchema,
    outputSchema: SectionExpanderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {expandedSection: output!.expandedSection!};
  }
);
