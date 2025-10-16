'use server';

/**
 * @fileOverview AI-powered meal plan generator flow.
 *
 * - generateAiMealPlan - A function that generates a meal plan based on user preferences.
 * - GenerateAiMealPlanInput - The input type for the generateAiMealPlan function.
 * - GenerateAiMealPlanOutput - The return type for the generateAiMealPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAiMealPlanInputSchema = z.object({
  brief: z.string().optional().describe('General user preferences, like budget, cooking time, or ingredient dislikes.'),
  days: z.number().min(1).max(7).default(1).describe('The number of days to generate the meal plan for.'),
  // Goals
  sex: z.enum(['Male', 'Female']).optional().describe('The biological sex of the user for calorie calculations.'),
  age: z.number().min(18).max(100).optional().describe('The age of the user.'),
  height: z.number().min(100).max(250).optional().describe('The height of the user in centimeters.'),
  weight: z.number().min(30).max(300).optional().describe('The weight of the user in kilograms.'),
  activityLevel: z.string().optional().describe('The user\'s physical activity level (e.g., Sedentary, Lightly Active).'),
  calorieMethod: z.string().optional().describe('The method for calculating daily calories (e.g., Auto, Manual).'),
  proteinTarget: z.string().optional().describe('The target for daily protein intake (e.g., Standard, High).'),
  // Structure
  mealStructure: z.string().optional().describe('The desired meal structure (e.g., 3 meals, 3 meals + 2 snacks).'),
  // Diet
  dietType: z.string().optional().describe('A specific diet type to follow (e.g., Keto, Paleo, Mediterranean).'),
});

export type GenerateAiMealPlanInput = z.infer<typeof GenerateAiMealPlanInputSchema>;

const GenerateAiMealPlanOutputSchema = z.object({
  mealPlan: z.string().describe('The generated meal plan, formatted as a markdown string. It should be well-structured, easy to read, and include recipes and a shopping list if requested in the brief.'),
});

export type GenerateAiMealPlanOutput = z.infer<typeof GenerateAiMealPlanOutputSchema>;

export async function generateAiMealPlan(
  input: GenerateAiMealPlanInput
): Promise<GenerateAiMealPlanOutput> {
  return generateAiMealPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAiMealPlanPrompt',
  input: {schema: GenerateAiMealPlanInputSchema},
  output: {schema: GenerateAiMealPlanOutputSchema},
  prompt: `You are an expert nutritionist and chef. Generate a detailed meal plan for {{{days}}} day(s) based on the following user profile and preferences. The output should be a single, well-formatted markdown string.

**User Profile & Goals:**
{{#if sex}}- Sex: {{{sex}}}{{/if}}
{{#if age}}- Age: {{{age}}} years{{/if}}
{{#if height}}- Height: {{{height}}} cm{{/if}}
{{#if weight}}- Weight: {{{weight}}} kg{{/if}}
{{#if activityLevel}}- Activity Level: {{{activityLevel}}}{{/if}}
{{#if calorieMethod}}- Calorie Method: {{{calorieMethod}}}{{/if}}
{{#if proteinTarget}}- Protein Target: {{{proteinTarget}}}{{/if}}

**Plan Structure & Diet:**
{{#if mealStructure}}- Meal Structure: {{{mealStructure}}}{{/if}}
{{#if dietType}}- Specialized Diet: {{{dietType}}}{{/if}}

**User's General Brief:**
{{#if brief}}{{{brief}}}{{else}}No specific brief provided.{{/if}}

**Instructions:**
1.  **Analyze Profile:** If provided, use the user's goals (age, weight, activity level, etc.) to estimate their daily caloric and macronutrient needs. Adjust the meal plan to meet these targets.
2.  **Follow Diet & Structure:** Adhere strictly to the specified diet type and meal structure.
3.  **Incorporate Brief:** Pay close attention to the user's free-text brief for specific likes, dislikes, budget, or time constraints.
4.  **Create the Plan:** For each day, provide a plan for Breakfast, Lunch, and Dinner (and snacks, if requested). Include simple, clear recipes for each meal.
5.  **Shopping List:** If the user mentions a shopping list in their brief, generate a consolidated shopping list for all ingredients needed for the entire plan.
6.  **Formatting:** Use markdown for clear headings, bullet points, and bold text to make the plan easy to read.

Generate the meal plan now.`,
});

const generateAiMealPlanFlow = ai.defineFlow(
  {
    name: 'generateAiMealPlanFlow',
    inputSchema: GenerateAiMealPlanInputSchema,
    outputSchema: GenerateAiMealPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
