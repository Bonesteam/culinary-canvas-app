'use client';

import { useState } from 'react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

interface MealPlanRequest {
  userId: string;
  type: 'Chef Plan';
  status: 'pending' | 'completed';
  cost: number;
  details: string;
  content: string;
  creationDate: { toDate: () => Date };
}

export default function RequestDetailPage() {
  const { id } = useParams();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const [responseContent, setResponseContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const requestDocRef = useMemoFirebase(
    () => (id ? doc(firestore, 'mealPlans', id as string) : null),
    [firestore, id]
  );

  const { data: request, isLoading: isRequestLoading } = useDoc<MealPlanRequest>(requestDocRef);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseContent || !requestDocRef) return;

    setIsLoading(true);
    try {
      await updateDoc(requestDocRef, {
        content: responseContent,
        status: 'completed',
        completionDate: serverTimestamp(),
      });
      toast({
        title: 'Plan Sent!',
        description: 'The user has been notified and can view their new meal plan.',
      });
      router.push('/admin/requests');
    } catch (error) {
      console.error('Error sending plan:', error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'Could not send the meal plan. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isRequestLoading) {
    return (
      <div className="container py-8 md:py-12">
        <PageHeader title="Loading Request..." />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!request) {
    return (
       <div className="container py-8 md:py-12 text-center">
        <PageHeader title="Request Not Found" description="This request could not be found."/>
         <Button asChild>
            <Link href="/admin/requests">Back to all requests</Link>
         </Button>
      </div>
    );
  }
  
  return (
    <div className="container py-8 md:py-12">
      <PageHeader
        title={`Request from ${request.userId.substring(0, 8)}...`}
        description={`Submitted on: ${request.creationDate.toDate().toLocaleDateString()}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>User's Request Details</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
            {request.content}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Craft Your Response</CardTitle>
            <CardDescription>
                Create the personalized meal plan below. Use markdown for formatting. Once sent, the user will be able to see it in their dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {request.status === 'completed' ? (
                <Alert variant="default" className="border-green-500 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700">
                    <AlertTitle>Already Completed</AlertTitle>
                    <AlertDescription>You have already responded to this request.</AlertDescription>
                </Alert>
            ) : (
                 <form onSubmit={handleSubmit} className="space-y-4">
                  <Textarea
                    rows={15}
                    placeholder="## Your 3-Day Meal Plan..."
                    value={responseContent}
                    onChange={(e) => setResponseContent(e.target.value)}
                    required
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    Send Plan to User
                  </Button>
                </form>
            )}
           
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
