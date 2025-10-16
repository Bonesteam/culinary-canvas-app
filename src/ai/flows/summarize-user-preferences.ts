'use server';

/**
 * @fileOverview Summarizes user dietary requirements and preferences using GenAI.
 *
 * - summarizeUserPreferences - A function that summarizes user preferences.
 * - SummarizeUserPreferencesInput - The input type for the summarizeUserPreferences function.
 * - SummarizeUserPreferencesOutput - The return type for the summarizeUserPreferences function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeUserPreferencesInputSchema = z.object({
  preferences: z
    .string()
    .describe('A string containing the user\u2019s dietary requirements and preferences.'),
});
export type SummarizeUserPreferencesInput = z.infer<typeof SummarizeUserPreferencesInputSchema>;

const SummarizeUserPreferencesOutputSchema = z.object({
  summary: z
    .string()
    .describe('A summary of the user\u2019s dietary requirements and preferences.'),
});
export type SummarizeUserPreferencesOutput = z.infer<typeof SummarizeUserPreferencesOutputSchema>;

export async function summarizeUserPreferences(
  input: SummarizeUserPreferencesInput
): Promise<SummarizeUserPreferencesOutput> {
  return summarizeUserPreferencesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeUserPreferencesPrompt',
  input: {schema: SummarizeUserPreferencesInputSchema},
  output: {schema: SummarizeUserPreferencesOutputSchema},
  prompt: `Summarize the following user dietary requirements and preferences:

{{{preferences}}}`,
});

const summarizeUserPreferencesFlow = ai.defineFlow(
  {
    name: 'summarizeUserPreferencesFlow',
    inputSchema: SummarizeUserPreferencesInputSchema,
    outputSchema: SummarizeUserPreferencesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
