'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { TOKEN_COSTS } from '@/lib/constants';
import { useFirestore, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { submitChefPlanRequest } from '../actions';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ChefHat, Loader2, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const formSchema = z.object({
  dietaryRequirements: z.string().min(1, {
    message: 'Please specify dietary requirements (e.g., vegetarian, none).',
  }),
  preferences: z.string().min(1, {
    message: 'Please provide detailed preferences for the chef.',
  }),
  goals: z.string().optional(),
});

export function ChefPlanForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  const { data: userProfile } = useDoc<{ tokenBalance: number }>(userDocRef);
  const tokenBalance = userProfile?.tokenBalance ?? 0;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dietaryRequirements: '',
      preferences: '',
      goals: '',
    },
  });

  const totalCost = TOKEN_COSTS.CHEF_PLAN;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Not Logged In',
        description: 'You must be logged in to request a chef plan.',
      });
      router.push('/login');
      return;
    }

    if (tokenBalance < totalCost) {
      toast({
        variant: 'destructive',
        title: 'Insufficient Tokens',
        description: `You need ${totalCost} tokens for a chef plan, but you only have ${tokenBalance}.`,
      });
      return;
    }

    setIsLoading(true);
      
    try {
      await submitChefPlanRequest(values, firestore, { uid: user.uid, tokenBalance }, totalCost);

      toast({
        title: 'Request Sent!',
        description:
          'Your request is now visible in your Dashboard. Our chef will review it and deliver your plan in 2-3 business hours.',
      });

      setIsSubmitted(true);
      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description:
          'Something went wrong while submitting your request. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
    return (
      <Alert
        variant="default"
        className="border-green-500 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700"
      >
        <ChefHat className="h-4 w-4 !text-green-600 dark:!text-green-400" />
        <AlertTitle className="font-bold">Request Received!</AlertTitle>
        <AlertDescription>
          Our chef is on it! Your personalized plan will be delivered to your dashboard within 2-3 business hours.
          <div className="mt-4 flex gap-4">
            <Button asChild variant="outline" size="sm">
                <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button
              variant="link"
              onClick={() => setIsSubmitted(false)}
              className="p-0 h-auto text-green-800 dark:text-green-300"
            >
              Submit another request
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="dietaryRequirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key Dietary Requirements</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Celiac, Vegan, Lactose Intolerant"
                  {...field}
                />
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
              <FormLabel>Detailed Preferences & Dislikes</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="Be specific! e.g., 'I love Mediterranean flavors, especially olives and feta. I can't stand mushrooms. I have about 45 minutes to cook on weeknights.'"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="goals"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Health or Fitness Goals (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Weight loss, muscle gain, general wellness"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Alert>
          <ChefHat className="h-4 w-4" />
          <AlertTitle>Total Cost: {totalCost} Tokens</AlertTitle>
          <AlertDescription>
            Your current balance is {tokenBalance.toLocaleString()} tokens.
          </AlertDescription>
        </Alert>

        <Button
          type="submit"
          disabled={isLoading || (user ? tokenBalance < totalCost : false)}
          className="w-full"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          {isLoading
            ? 'Submitting...'
            : `Request Chef Plan (${totalCost} Tokens)`}
        </Button>
      </form>
    </Form>
  );
}