'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
// import { AIPlanInput, generateAIPlan } from '@/ai/flows/meal-plan-flow';
import { TOKEN_COSTS } from '@/lib/constants';
import { useMongoDB } from '@/context/MongoDBContext';
import { Loader2, Sparkles } from 'lucide-react';

const formSchema = z.object({
  dietaryNeeds: z.string().min(1, 'Please specify your dietary needs.'),
  preferences: z.string().min(1, 'Please specify your food preferences.'),
});

type AIPlanFormValues = z.infer<typeof formSchema>;

export type AIPlanResult = {
  planName: string;
  shoppingList: string;
  recipes: string;
};

interface AIPlanFormProps {
  user: any;
  userData: any;
  onResult: (result: AIPlanResult) => void;
}

export function AIPlanForm({ user, userData, onResult }: AIPlanFormProps) {
  const { toast } = useToast();
  const { updateTokenBalance } = useMongoDB();
  const form = useForm<AIPlanFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dietaryNeeds: '',
      preferences: '',
    },
  });

  const onSubmit = async (values: AIPlanFormValues) => {
    try {
      // 1. Call the AI flow to generate the plan
      // const result = await generateAIPlan(values as AIPlanInput);
      const result = {
        planName: "Sample AI Meal Plan",
        shoppingList: "Sample shopping list",
        recipes: "Sample recipes"
      };

      // 2. Record the transaction in MongoDB
      const response = await fetch('/api/meal-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          type: 'AI Plan',
          cost: TOKEN_COSTS.AI_PLAN_BASE,
          details: 'AI meal plan generated',
          content: JSON.stringify(result)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to record meal plan');
      }

      // 3. Update token balance
      updateTokenBalance(userData.tokenBalance - TOKEN_COSTS.AI_PLAN_BASE);

      // 4. Show a success toast
      toast({
        title: 'Plan Generated!',
        description: `${TOKEN_COSTS.AI_PLAN_BASE} tokens have been deducted from your account.`,
      });

      // 5. Pass the result to the parent component
      onResult(result);

    } catch (error: any) {
      console.error('AI Plan Generation Error:', error);
      toast({
        variant: 'destructive',
        title: 'Oh no! Something went wrong.',
        description: error.message || 'Failed to generate AI meal plan. Please try again.',
      });
    }
  };

  const hasEnoughTokens = (userData?.tokenBalance ?? 0) >= TOKEN_COSTS.AI_PLAN_BASE;
  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="dietaryNeeds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dietary Needs</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Vegetarian, Gluten-Free, Low-Carb" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="preferences"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferences & Dislikes</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Love spicy food, dislike mushrooms" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting || !hasEnoughTokens}>
            {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Sparkles className="mr-2 h-4 w-4" />
            )}
            {isSubmitting ? 'Generating...' : `Generate Plan (${TOKEN_COSTS.AI_PLAN_BASE} tokens)`}
        </Button>
        {!hasEnoughTokens && (
            <p className="text-sm text-destructive text-center">
                Not enough tokens. Please purchase a token package.
            </p>
        )}
      </form>
    </Form>
  );
}
