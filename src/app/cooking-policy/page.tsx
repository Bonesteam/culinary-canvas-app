import { PageHeader } from '@/components/shared/PageHeader';
import { COMPANY_INFO } from '@/lib/constants';

export default function CookingPolicyPage() {
  return (
    <div className="container py-8 md:py-12">
      <PageHeader
        title="Cooking & Safety Policy"
        description="Important guidelines for using our recipes."
      />
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <h2>Your Responsibility</h2>
        <p>
          Culinary Canvas provides recipes and meal plans for informational and inspirational purposes only. You, the user, are solely responsible for ensuring the safety and appropriateness of the food you prepare and consume.
        </p>
        <h3>Food Safety</h3>
        <p>
          You are responsible for following standard food safety practices, including but not limited to:
        </p>
        <ul>
          <li>Properly washing hands, surfaces, and produce.</li>
          <li>Cooking foods to safe internal temperatures.</li>
          <li>Avoiding cross-contamination between raw and cooked foods.</li>
          <li>Storing food at appropriate temperatures.</li>
        </ul>
        <p>
          We are not liable for any illness or injury resulting from failure to follow safe food handling practices.
        </p>
        <h3>Allergies and Dietary Restrictions</h3>
        <p>
          While our service allows you to specify dietary requirements and allergies, it is your ultimate responsibility to review all recipes and ingredient lists to ensure they are safe for you and anyone you are cooking for.
        </p>
        <p>
          Our AI and chefs make recommendations based on the information you provide, but we cannot guarantee that any recipe will be free of allergens or other ingredients you wish to avoid. Always double-check ingredient labels and be mindful of potential cross-contamination in your kitchen and from your ingredient suppliers.
        </p>
        <h2>Disclaimer</h2>
        <p>
          The information provided by Culinary Canvas is not a substitute for professional medical or nutritional advice. Consult with a qualified healthcare professional before making any significant changes to your diet.
        </p>
        <h2>Contact Us</h2>
        <p>
          If you have any questions about this policy, please contact us at <a href={`mailto:${COMPANY_INFO.contact.email}`}>{COMPANY_INFO.contact.email}</a>.
        </p>
      </div>
    </div>
  );
}
