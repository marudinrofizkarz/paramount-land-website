'use server';

/**
 * @fileOverview AI tool that suggests optimal layouts based on unit dimensions.
 *
 * - suggestLayout - A function that handles the layout suggestion process.
 * - SuggestLayoutInput - The input type for the suggestLayout function.
 * - SuggestLayoutOutput - The return type for the suggestLayout function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestLayoutInputSchema = z.object({
  unitDimensions: z
    .string()
    .describe(
      'The dimensions of the unit, provided as a string with width and length in meters (e.g., \'5m x 10m\').'
    ),
  roomRequirements: z
    .string()
    .describe(
      'A comma-separated list of required rooms, such as \'living room, kitchen, bedroom, bathroom\'.'
    ),
  stylePreferences: z
    .string()
    .optional()
    .describe(
      'Optional style preferences for the layout, such as \'modern\', \'minimalist\', or \'open concept\'.'
    ),
});
export type SuggestLayoutInput = z.infer<typeof SuggestLayoutInputSchema>;

const SuggestLayoutOutputSchema = z.object({
  layoutDescription: z
    .string()
    .describe('A detailed description of the suggested layout.'),
  layoutImage: z
    .string()
    .optional()
    .describe(
      'A data URI containing an image of the suggested layout, if available. Must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // keep
    ),
});
export type SuggestLayoutOutput = z.infer<typeof SuggestLayoutOutputSchema>;

export async function suggestLayout(input: SuggestLayoutInput): Promise<SuggestLayoutOutput> {
  return suggestLayoutFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestLayoutPrompt',
  input: {schema: SuggestLayoutInputSchema},
  output: {schema: SuggestLayoutOutputSchema},
  prompt: `You are an expert interior designer specializing in optimizing space for property development units.

You will receive the dimensions of a unit, the required rooms, and any style preferences. Your task is to suggest an optimal layout that efficiently uses the space and appeals to potential buyers.

Unit Dimensions: {{{unitDimensions}}}
Room Requirements: {{{roomRequirements}}}
Style Preferences: {{{stylePreferences}}}

Consider the following:
- Maximize natural light.
- Ensure a smooth flow between rooms.
- Suggest furniture placement to showcase the space effectively.
- Provide a detailed description of the layout, including the placement of rooms and key features.
- If possible generate an image of the suggested layout.

Your output should include a detailed layout description and, if available, an image of the suggested layout. If no image is available, leave the field null.`, // keep
});

const suggestLayoutFlow = ai.defineFlow(
  {
    name: 'suggestLayoutFlow',
    inputSchema: SuggestLayoutInputSchema,
    outputSchema: SuggestLayoutOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
