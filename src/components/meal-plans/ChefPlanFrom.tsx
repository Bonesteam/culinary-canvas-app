'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
// import { submitChefRequest } from '@/ai/flows/meal-plan-flow';
import { TOKEN_COSTS } from '@/lib/constants';
import { useMongoDB } from '@/context/MongoDBContext';
import { ChefHat, Loader2 } from 'lucide-react';

const formSchema = z.object({
  dietaryNeeds: z.string().min(1, 'Please specify your dietary needs.'),
  preferences: z.string().min(1, 'Please specify your food preferences.'),
  notes: z.string().optional(),
});

type ChefPlanFormValues = z.infer<typeof formSchema>;

export type ChefPlanResult = {
  success: boolean;
  message: string;
};

interface ChefPlanFormProps {
  user: any;
  userData: any;
  onResult: (result: ChefPlanResult) => void;
}

export function ChefPlanForm({ user, userData, onResult }: ChefPlanFormProps) {
  const { toast } = useToast();
  const { updateTokenBalance } = useMongoDB();
  const form = useForm<ChefPlanFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dietaryNeeds: '',
      preferences: '',
      notes: '',
    },
  });

  const onSubmit = async (values: ChefPlanFormValues) => {
    try {
      // 1. Call the placeholder flow for submitting the request
      // const result = await submitChefRequest({
      //   userId: user.uid,
      //   ...values,
      // });
      const result = {
        success: true,
        message: "Chef request submitted successfully"
      };

      if (result.success) {
        // 2. Record the transaction in MongoDB
        const response = await fetch('/api/meal-plans', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.uid,
            type: 'Chef Plan',
            cost: TOKEN_COSTS.CHEF_PLAN,
            details: 'Chef plan request submitted',
            content: JSON.stringify(values)
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to record meal plan');
        }

        // 3. Update token balance
        updateTokenBalance(userData.tokenBalance - TOKEN_COSTS.CHEF_PLAN);

        // 4. Show a success toast
        toast({
          title: 'Request Submitted!',
          description: `${TOKEN_COSTS.CHEF_PLAN} tokens have been deducted. A chef will contact you shortly.`,
        });

        // 5. Pass the result to the parent component
        onResult(result);
      } else {
        throw new Error(result.message || 'Failed to submit request.');
      }

    } catch (error: any) {
      console.error('Chef Plan Request Error:', error);
      toast({
        variant: 'destructive',
        title: 'Oh no! Something went wrong.',
        description: error.message || 'Failed to submit your request. Please try again.',
      });
    }
  };
  
  const hasEnoughTokens = (userData?.tokenBalance ?? 0) >= TOKEN_COSTS.CHEF_PLAN;
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
                <Input placeholder="e.g., Pescatarian, nut allergy" {...field} />
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
              <FormLabel>Preferences, Dislikes & Lifestyle</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., I love seafood, hate cilantro, and I only have 30 mins to cook on weekdays." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Any specific goals? Special occasion coming up?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting || !hasEnoughTokens}>
          {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
              <ChefHat className="mr-2 h-4 w-4" />
          )}
          {isSubmitting ? 'Submitting...' : `Request Chef (${TOKEN_COSTS.CHEF_PLAN} tokens)`}
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
