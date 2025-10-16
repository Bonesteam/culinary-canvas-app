// This module defines AI flows and exports schemas and helper functions.
// It intentionally does not use the `use server` directive so it can export
// non-function values like Zod schemas which are reused across contexts.
import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define input schema for the AI meal plan
export const AIPlanInputSchema = z.object({
    dietaryNeeds: z.string().describe("User's dietary needs (e.g., vegetarian, gluten-free)"),
    preferences: z.string().describe("User's food preferences and dislikes"),
});
export type AIPlanInput = z.infer<typeof AIPlanInputSchema>;

// Define output schema for the AI meal plan
export const AIPlanOutputSchema = z.object({
    planName: z.string().describe("A creative name for the meal plan."),
    shoppingList: z.string().describe("A formatted shopping list for all the ingredients needed."),
    recipes: z.string().describe("Formatted recipes for the meals."),
});
export type AIPlanOutput = z.infer<typeof AIPlanOutputSchema>;


const mealPlanPrompt = ai.definePrompt({
    name: 'mealPlanPrompt',
    input: { schema: AIPlanInputSchema },
    output: { schema: AIPlanOutputSchema },
    prompt: `You are a culinary expert. Generate a 3-day meal plan based on the user's dietary needs and preferences.

Dietary Needs: {{{dietaryNeeds}}}
Preferences: {{{preferences}}}

For the output, provide a creative name for the plan, a detailed shopping list formatted as a string, and the recipes for each meal, also formatted as a single string.
Ensure the shopping list and recipes are well-structured and easy to read.
`,
});

const generateAIPlanFlow = ai.defineFlow(
    {
        name: 'generateAIPlanFlow',
        inputSchema: AIPlanInputSchema,
        outputSchema: AIPlanOutputSchema,
    },
    async (input) => {
        const { output } = await mealPlanPrompt(input);
        return output!;
    }
);

// Wrapper function to be called from the frontend
export async function generateAIPlan(input: AIPlanInput): Promise<AIPlanOutput> {
    return generateAIPlanFlow(input);
}


// Schema for submitting a request to a human chef
export const ChefRequestInputSchema = z.object({
    userId: z.string(),
    dietaryNeeds: z.string(),
    preferences: z.string(),
    notes: z.string().optional(),
});
export type ChefRequestInput = z.infer<typeof ChefRequestInputSchema>;

// This is a placeholder flow. In a real application, this would trigger a workflow,
// send an email, or create a task in a project management tool for the chef.
const submitChefRequestFlow = ai.defineFlow(
    {
        name: 'submitChefRequestFlow',
        inputSchema: ChefRequestInputSchema,
        outputSchema: z.object({ success: z.boolean(), message: z.string() }),
    },
    async (input) => {
        console.log('Received chef request for user:', input.userId);
        console.log('Details:', input);
        // Here you would add logic to notify the chef.
        // For now, we just simulate a successful submission.
        return { success: true, message: 'Request submitted successfully.' };
    }
);

// Wrapper function for chef request
export async function submitChefRequest(input: ChefRequestInput): Promise<{ success: boolean, message: string }> {
    return submitChefRequestFlow(input);
}
