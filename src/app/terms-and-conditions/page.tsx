import { PageHeader } from '@/components/shared/PageHeader';

export default function TermsAndConditionsPage() {
  return (
    <div className="container py-8 md:py-12">
      <PageHeader
        title="Terms and Conditions"
        description="Last updated: October 26, 2023"
      />
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <p>
          Please read these terms and conditions carefully before using Our Service.
        </p>
        <h2>Interpretation and Definitions</h2>
        <h3>Interpretation</h3>
        <p>
          The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
        </p>
        <h3>Definitions</h3>
        <p>For the purposes of these Terms and Conditions:</p>
        <ul>
          <li>
            <strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to RISEWYNN LIMITED.
          </li>
          <li>
            <strong>Service</strong> refers to the Culinary Canvas website.
          </li>
          <li>
            <strong>Terms and Conditions</strong> (also referred as "Terms") mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service.
          </li>
          <li>
            <strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.
          </li>
        </ul>
        <h2>Acknowledgment</h2>
        <p>
          These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.
        </p>
        <p>
          Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.
        </p>
        <h2>Token System</h2>
        <p>
          Our Service operates on a token-based system. Tokens are a virtual currency used to purchase meal plans and other services. Tokens are non-refundable and have no cash value outside of our Service. Prices for tokens and services are subject to change.
        </p>
        <h2>Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever.
        </p>
        <h2>Contact Us</h2>
        <p>
          If you have any questions about these Terms and Conditions, You can contact us by email: info@qellum.co.uk
        </p>
      </div>
    </div>
  );
}
