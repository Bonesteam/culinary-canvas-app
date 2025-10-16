import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, Sparkles, UtensilsCrossed } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import { placeholderImages } from "@/lib/placeholder-images";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const features = [
  {
    icon: <ChefHat className="h-10 w-10 text-primary" />,
    title: "Personal Chef Service",
    description: "Receive a bespoke meal plan crafted by a professional chef, tailored to your unique tastes and dietary needs. Delivered within 2-3 hours.",
    link: "/meal-plans#chef",
    linkText: "Request a Chef",
  },
  {
    icon: <Sparkles className="h-10 w-10 text-primary" />,
    title: "AI-Powered Meal Plans",
    description: "Instantly generate a creative and delicious meal plan with our advanced AI. Perfect for when you need inspiration right away.",
    link: "/meal-plans#ai",
    linkText: "Generate with AI",
  },
];

const benefits = [
  {
    image: placeholderImages.find(p => p.id === 'benefit-1'),
    title: "Endless Variety",
    description: "From timeless classics to modern culinary creations, discover recipes that excite your palate and fit your lifestyle."
  },
  {
    image: placeholderImages.find(p => p.id === 'benefit-2'),
    title: "Nourish Your Body",
    description: "Our focus on fresh, whole ingredients means every meal is not just delicious, but also packed with nutrients to fuel your day."
  },
  {
    image: placeholderImages.find(p => p.id === 'benefit-3'),
    title: "Save Time & Effort",
    description: "Say goodbye to meal planning stress. We provide the recipes and shopping lists, so you can focus on the joy of cooking."
  },
];

const faqItems = [
  {
    question: "How does the token system work?",
    answer: "You purchase tokens which can then be spent on generating AI meal plans or requesting a plan from a personal chef. Each service has a different token cost. You get 2,000 free tokens upon signing up!"
  },
  {
    question: "What's the difference between an AI plan and a chef plan?",
    answer: "An AI plan is generated instantly based on your inputs, offering quick and creative ideas. A chef plan is a bespoke service where a professional chef creates a highly personalized plan for you, which takes 2-3 hours."
  },
  {
    question: "Can I specify allergies and dietary restrictions?",
    answer: "Yes! Both the AI and chef services allow you to input detailed dietary needs, including allergies, intolerances, and preferences, to ensure your meal plan is safe and enjoyable for you."
  },
  {
    question: "What if I don't like a meal in my plan?",
    answer: "With the AI plan, you can easily generate a new one with slightly different preferences. For chef plans, we encourage detailed initial requests, but our support team is available if you're unsatisfied."
  }
];


export default function Home() {
  const heroImage = placeholderImages.find(p => p.id === 'hero-home');

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[60vh] md:h-[70vh]">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <UtensilsCrossed className="h-16 w-16 mb-4 text-primary" />
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight">
            Your Culinary Journey Begins Here
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-primary-foreground/90">
            Craft personalized meal plans with expert chefs or intelligent AI. Taste the future of home cooking.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="font-bold">
              <Link href="/meal-plans">Create Your Plan</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="font-bold">
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Two Paths to Delicious</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Whether you crave the masterful touch of a personal chef or the instant creativity of AI, we have the perfect meal planning solution for you.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {features.map((feature) => (
              <Card key={feature.title} className="flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="items-center">
                  {feature.icon}
                  <CardTitle className="mt-4 font-headline text-2xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button asChild>
                    <Link href={feature.link}>{feature.linkText}</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Cook with Confidence & Joy</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Transform your kitchen into a source of inspiration and wellness.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map(benefit => (
              <Card key={benefit.title} className="overflow-hidden group">
                {benefit.image &&
                  <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                    <Image
                      src={benefit.image.imageUrl}
                      alt={benefit.image.description}
                      width={400}
                      height={225}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      data-ai-hint={benefit.image.imageHint}
                    />
                  </div>
                }
                <CardHeader>
                  <CardTitle className="font-headline">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Have questions? We've got answers. Here are some of the most common things we get asked.
            </p>
          </div>
          <div className="mt-12 max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem value={`item-${index + 1}`} key={index}>
                  <AccordionTrigger className="text-lg text-left">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Ready to Start Cooking?</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">Join Culinary Canvas today and unlock a world of flavor, tailored just for you.</p>
            <div className="mt-8">
                <Button asChild size="lg">
                    <Link href="/pricing">Get Your Tokens</Link>
                </Button>
            </div>
        </div>
      </section>
    </div>
  );
}
