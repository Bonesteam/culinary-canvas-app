import { PageHeader } from '@/components/shared/PageHeader';
import { UtensilsCrossed } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container py-8 md:py-12">
      <PageHeader
        title="About Culinary Canvas"
        description="The story behind your next favorite meal."
      />
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <p className="lead">
          At Culinary Canvas, we believe that everyone deserves to eat well, without the stress and complexity that often comes with meal planning. Our mission is to blend the art of culinary expertise with the power of technology to bring personalized, delicious, and achievable meal plans right to your kitchen.
        </p>
        
        <div className="my-8 text-center">
            <UtensilsCrossed className="mx-auto h-12 w-12 text-primary" />
        </div>

        <h2>Our Philosophy</h2>
        <p>
          Food is more than just sustenance; it's a source of joy, a form of creative expression, and a way to connect with ourselves and our loved ones. In today's fast-paced world, finding the time to plan nutritious and exciting meals can be a challenge. That's where we come in. We offer two distinct paths to culinary inspiration: the bespoke, human touch of a professional chef, and the instant, intelligent creativity of artificial intelligence.
        </p>
        
        <h2>Our Commitment</h2>
        <p>
          We are committed to providing a flexible, user-friendly platform that adapts to your unique tastes, dietary needs, and lifestyle. Whether you're a seasoned home cook looking for new ideas or a beginner just starting your culinary journey, Culinary Canvas is your trusted partner in the kitchen.
        </p>
        
        <p>
          Thank you for joining us. Let's create something delicious together.
        </p>
      </div>
    </div>
  );
}
