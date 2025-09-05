'use server';

/**
 * @fileOverview An AI-powered route optimization flow.
 *
 * - optimizeRouteWithAI - A function that suggests the optimal route between multiple cities.
 * - OptimizeRouteWithAIInput - The input type for the optimizeRouteWithAI function.
 * - OptimizeRouteWithAIOutput - The return type for the optimizeRouteWithAI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeRouteWithAIInputSchema = z.object({
  cities: z
    .array(
      z.string().describe('A city to include in the route. Ex: Sao Paulo, Brasil.')
    )
    .describe('The list of cities to optimize the route for.'),
  optimizeFor: z
    .enum(['distance', 'time'])
    .default('distance')
    .describe('Whether to optimize for shortest distance or travel time.'),
});
export type OptimizeRouteWithAIInput = z.infer<typeof OptimizeRouteWithAIInputSchema>;

const OptimizeRouteWithAIOutputSchema = z.object({
  optimizedRoute: z
    .array(z.string().describe('A city in the optimized route.'))
    .describe('The optimized route between the cities.'),
  totalDistanceKm: z
    .number()
    .optional()
    .describe('The total distance of the optimized route in kilometers.'),
  totalTimeHours: z
    .number()
    .optional()
    .describe('The total travel time of the optimized route in hours.'),
  explanation: z
    .string()
    .describe('Explanation of why this is the best route'),
});
export type OptimizeRouteWithAIOutput = z.infer<typeof OptimizeRouteWithAIOutputSchema>;

export async function optimizeRouteWithAI(
  input: OptimizeRouteWithAIInput
): Promise<OptimizeRouteWithAIOutput> {
  return optimizeRouteWithAIFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeRoutePrompt',
  input: {schema: OptimizeRouteWithAIInputSchema},
  output: {schema: OptimizeRouteWithAIOutputSchema},
  prompt: `You are a route optimization expert. Given a list of cities, you will determine the optimal route to minimize {{{optimizeFor}}}. Provide total distance in KM and total time in hours.

Cities: {{{cities}}}

Output the optimized route, total distance in KM, total time in hours, and an explanation of why this is the best route.`,
});

const optimizeRouteWithAIFlow = ai.defineFlow(
  {
    name: 'optimizeRouteWithAIFlow',
    inputSchema: OptimizeRouteWithAIInputSchema,
    outputSchema: OptimizeRouteWithAIOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
