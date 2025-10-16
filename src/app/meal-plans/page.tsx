'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, Sparkles } from 'lucide-react';
import { AIPlanForm } from '@/components/meal-plans/AIPlanFrom';
import { ChefPlanForm } from '@/components/meal-plans/ChefPlanFrom';
import { useMongoDB } from '@/context/MongoDBContext';
import { placeholderImages } from '@/lib/placeholder-images';

export default function MealPlansPage() {
  const chefImage = placeholderImages.find(p => p.id === 'chef-plan');
  const aiImage = placeholderImages.find(p => p.id === 'ai-plan');
  const { user, loading } = useMongoDB();

  // Optionally, you can show a loading state here
  if (loading) {
    return <div className="container py-8 md:py-12 text-center">Loading...</div>;
  }

  // No-op handler for onResult (customize as needed)
  const handleResult = () => {};

  return (
    <div className="container py-8 md:py-12">
      <header className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-headline font-bold">Create Your Meal Plan</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Choose your desired experience: the instant creativity of AI or the bespoke touch of a personal chef.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card id="ai" className="shadow-lg">
          <CardHeader>
            {aiImage && (
              <div className="aspect-video relative w-full overflow-hidden rounded-lg mb-4">
                <Image
                  src={aiImage.imageUrl}
                  alt={aiImage.description}
                  fill
                  className="object-cover"
                  data-ai-hint={aiImage.imageHint}
                />
              </div>
            )}
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="font-headline text-2xl">AI-Powered Meal Plan</CardTitle>
                <CardDescription>Instant culinary inspiration.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {user ? (
              <AIPlanForm user={user} userData={user} onResult={handleResult} />
            ) : (
              <div className="text-center text-muted-foreground">Please log in to use the AI meal plan.</div>
            )}
          </CardContent>
        </Card>

        <Card id="chef" className="shadow-lg">
          <CardHeader>
            {chefImage && (
              <div className="aspect-video relative w-full overflow-hidden rounded-lg mb-4">
                <Image
                  src={chefImage.imageUrl}
                  alt={chefImage.description}
                  fill
                  className="object-cover"
                  data-ai-hint={chefImage.imageHint}
                />
              </div>
            )}
            <div className="flex items-center gap-3">
              <ChefHat className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="font-headline text-2xl">Personal Chef Service</CardTitle>
                <CardDescription>A plan crafted just for you (2-3 hour delivery).</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {user ? (
              <ChefPlanForm user={user} userData={user} onResult={handleResult} />
            ) : (
              <div className="text-center text-muted-foreground">Please log in to request a chef plan.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
