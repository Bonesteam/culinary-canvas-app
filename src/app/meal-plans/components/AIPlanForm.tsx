'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { TOKEN_COSTS, ACTIVITY_LEVELS, CALORIE_METHODS, PROTEIN_TARGETS, MEAL_STRUCTURES, DIET_TYPES } from '@/lib/constants';
import { useFirestore, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { generateAndSaveAiPlan } from '../actions';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Sparkles, CheckCircle, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TooltipProvider } from '@/components/ui/tooltip';

const formSchema = z.object({
  brief: z.string().optional(),
  days: z.number().min(1).max(7).default(1),
  // Goals
  sex: z.enum(['Male', 'Female']).optional(),
  age: z.coerce.number().min(18).max(100).optional(),
  height: z.coerce.number().min(100).max(250).optional(),
  weight: z.coerce.number().min(30).max(300).optional(),
  activityLevel: z.string().optional(),
  calorieMethod: z.string().optional(),
  proteinTarget: z.string().optional(),
  // Structure
  mealStructure: z.string().optional(),
  // Diet
  dietType: z.string().optional(),
});

export function AIPlanForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [optionsVisible, setOptionsVisible] = useState(false);
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
      brief: '',
      days: 1,
      sex: 'Female',
    },
  });

  const watchedFields = form.watch();

  const calculateCost = () => {
    let cost = TOKEN_COSTS.AI_PLAN_BASE;
    cost += (watchedFields.days - 1) * TOKEN_COSTS.AI_PLAN_PER_DAY;
    if (watchedFields.activityLevel) cost += TOKEN_COSTS.AI_OPTIONS.ACTIVITY_LEVEL;
    if (watchedFields.calorieMethod) cost += TOKEN_COSTS.AI_OPTIONS.CALORIE_METHOD;
    if (watchedFields.proteinTarget) cost += TOKEN_COSTS.AI_OPTIONS.PROTEIN_TARGET;
    if (watchedFields.mealStructure) cost += TOKEN_COSTS.AI_OPTIONS.MEAL_STRUCTURE;
    if (watchedFields.dietType) cost += TOKEN_COSTS.AI_OPTIONS.DIET_TYPE;
    return cost;
  };

  const totalCost = calculateCost();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Not Logged In',
        description: 'You must be logged in to generate a meal plan.',
      });
      router.push('/login');
      return;
    }

    if (tokenBalance < totalCost) {
      toast({
        variant: 'destructive',
        title: 'Insufficient Tokens',
        description: `You need ${totalCost} tokens, but you only have ${tokenBalance}.`,
      });
      return;
    }

    setIsLoading(true);

    try {
      await generateAndSaveAiPlan(values, firestore, { uid: user.uid, tokenBalance }, totalCost);

      setIsSubmitted(true);
      form.reset({ brief: '', days: 1, sex: 'Female'});
      setOptionsVisible(false);
      toast({
        title: 'Plan Generated!',
        description: `Your new meal plan is available in your Dashboard. ${totalCost} tokens have been deducted.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description:
          'Something went wrong while generating your plan. Please try again.',
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
        <CheckCircle className="h-4 w-4 !text-green-600 dark:!text-green-400" />
        <AlertTitle className="font-bold">Plan Generated Successfully!</AlertTitle>
        <AlertDescription>
          Your new AI-powered meal plan is ready. You can view it in your dashboard.
          <div className="mt-4 flex gap-4">
             <Button asChild variant="outline" size="sm">
                <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button
              variant="link"
              onClick={() => setIsSubmitted(false)}
              className="p-0 h-auto text-green-800 dark:text-green-300"
            >
              Generate another plan
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <TooltipProvider>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="brief"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Free-text brief</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Prefer quick dinners, no onion, budget €10/day"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="days"
          render={({ field }) => (
            <FormItem className="rounded-lg border p-4 bg-green-50/50 dark:bg-green-900/10">
              <div className='flex justify-between items-center'>
                 <FormLabel>Days to generate</FormLabel>
                 <span className='text-lg font-bold text-primary'>{field.value}</span>
              </div>
              <FormControl>
                <Slider
                    min={1}
                    max={7}
                    step={1}
                    value={[field.value]}
                    onValueChange={(vals: number[]) => field.onChange(vals[0])}
                  />
              </FormControl>
              <FormDescription>
                1-day free preview. Full plan available in PDF.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex items-center gap-2">
           <Button
            type="submit"
            disabled={isLoading || (user ? tokenBalance < totalCost : false)}
            className="flex-grow"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {isLoading
              ? 'Generating...'
              : `Generate Plan (${totalCost} Tokens)`}
          </Button>
           <Button type="button" variant="outline" onClick={() => setOptionsVisible(!optionsVisible)}>
              {optionsVisible ? 'Hide options' : 'Show options'}
            </Button>
        </div>
        
        <Collapsible open={optionsVisible} onOpenChange={setOptionsVisible}>
            <CollapsibleContent className="space-y-6 animate-in fade-in-0 slide-in-from-top-4 duration-300">
                <Tabs defaultValue="goals" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="goals">Goals</TabsTrigger>
                    <TabsTrigger value="structure">Structure</TabsTrigger>
                    <TabsTrigger value="diet">Diet</TabsTrigger>
                </TabsList>
                <TabsContent value="goals" className="mt-4 space-y-4">
                    <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700">
                        <Info className="h-4 w-4 !text-blue-500" />
                        <AlertDescription>
                        Specify your activity level, calorie calculation method, and protein targets for personalized recommendations.
                        </AlertDescription>
                    </Alert>
                    <div className='grid grid-cols-2 gap-4'>
                      <FormField control={form.control} name="sex" render={({field}) => (
                        <FormItem>
                          <FormLabel>Sex</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select sex..." /></SelectTrigger></FormControl>
                            <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
                          </Select>
                        </FormItem>
                      )}/>
                      <FormField control={form.control} name="age" render={({ field }) => (
                          <FormItem>
                              <FormLabel>Age</FormLabel>
                              <FormControl><Input type="number" placeholder="e.g., 30" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)}/></FormControl>
                          </FormItem>
                      )} />
                      <FormField control={form.control} name="height" render={({ field }) => (
                          <FormItem>
                              <FormLabel>Height (cm)</FormLabel>
                              <FormControl><Input type="number" placeholder="e.g., 165" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} /></FormControl>
                          </FormItem>
                      )} />
                      <FormField control={form.control} name="weight" render={({ field }) => (
                          <FormItem>
                              <FormLabel>Weight (kg)</FormLabel>
                              <FormControl><Input type="number" placeholder="e.g., 70" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} /></FormControl>
                          </FormItem>
                      )} />
                    </div>
                     <FormField control={form.control} name="activityLevel" render={({field}) => (
                        <FormItem>
                          <FormLabel>Activity Level (+{TOKEN_COSTS.AI_OPTIONS.ACTIVITY_LEVEL} tokens)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select activity level..." /></SelectTrigger></FormControl>
                            <SelectContent>{ACTIVITY_LEVELS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                          </Select>
                        </FormItem>
                      )}/>
                      <FormField control={form.control} name="calorieMethod" render={({field}) => (
                        <FormItem>
                          <FormLabel>Calorie Method (+{TOKEN_COSTS.AI_OPTIONS.CALORIE_METHOD} tokens)</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Auto calculate" /></SelectTrigger></FormControl>
                            <SelectContent>{CALORIE_METHODS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                          </Select>
                        </FormItem>
                      )}/>
                       <FormField control={form.control} name="proteinTarget" render={({field}) => (
                        <FormItem>
                          <FormLabel>Protein Target (+{TOKEN_COSTS.AI_OPTIONS.PROTEIN_TARGET} tokens)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Auto calculate" /></SelectTrigger></FormControl>
                            <SelectContent>{PROTEIN_TARGETS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                          </Select>
                        </FormItem>
                      )}/>
                </TabsContent>
                 <TabsContent value="structure" className="mt-4 space-y-4">
                    <FormField control={form.control} name="mealStructure" render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Meal Structure (+{TOKEN_COSTS.AI_OPTIONS.MEAL_STRUCTURE} tokens)</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            {MEAL_STRUCTURES.map(structure => (
                              <FormItem key={structure.value} className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value={structure.value} />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {structure.label}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                </TabsContent>
                <TabsContent value="diet" className="mt-4 space-y-4">
                    <FormField control={form.control} name="dietType" render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Specialized Diet Type (+{TOKEN_COSTS.AI_OPTIONS.DIET_TYPE} tokens)</FormLabel>
                        <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select a diet type..." /></SelectTrigger></FormControl>
                                <SelectContent>{DIET_TYPES.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                            </Select>
                        </FormControl>
                         <FormDescription>Select a specialized diet to tailor your meal plan more accurately.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                </TabsContent>
                </Tabs>
            </CollapsibleContent>
        </Collapsible>
        
        {user &&
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertTitle>Total Cost: {totalCost} Tokens</AlertTitle>
            <AlertDescription>
              Your current balance is {tokenBalance.toLocaleString()} tokens.
            </AlertDescription>
          </Alert>
        }

      </form>
    </Form>
    </TooltipProvider>
  );
}
