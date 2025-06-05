'use server';

/**
 * @fileOverview This flow suggests songs to study for songwriting improvement.
 *
 * - studySong - A function that takes a query and returns a song suggestion and study plan.
 * - StudySongInput - The input type for the studySong function.
 * - StudySongOutput - The return type for the studySong function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudySongInputSchema = z.object({
  query: z.string().describe('The type of song or technique to study.'),
});
export type StudySongInput = z.infer<typeof StudySongInputSchema>;

const StudySongOutputSchema = z.object({
  songSuggestion: z.string().describe('A song suggestion based on the query.'),
  studyPlan: z.string().describe('A brief study plan for the suggested song.'),
  keyTakeaways: z.string().describe('Key songwriting takeaways from the song.'),
});
export type StudySongOutput = z.infer<typeof StudySongOutputSchema>;

export async function studySong(input: StudySongInput): Promise<StudySongOutput> {
  return studySongFlow(input);
}

const prompt = ai.definePrompt({
  name: 'studySongPrompt',
  input: {schema: StudySongInputSchema},
  output: {schema: StudySongOutputSchema},
  prompt: `I am a songwriter looking to study songs to improve my craft, focusing on alternative folk, Americana, and related genres.

{% if query %}
  I want to study songs related to: {{query}}
{% else %}
  I want you to suggest one influential song that offers significant songwriting lessons.
{% endif %}

Provide your response in the following format:

Song Suggestion: (Artist - Song Title)
How to Study It: (Actionable steps, e.g., "1. Transcribe the lyrics.")
Key Takeaways: (2-3 bullet points of key lessons learned.)`,
});

const studySongFlow = ai.defineFlow(
  {
    name: 'studySongFlow',
    inputSchema: StudySongInputSchema,
    outputSchema: StudySongOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
