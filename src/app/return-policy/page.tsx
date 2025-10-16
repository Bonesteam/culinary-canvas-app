import { PageHeader } from '@/components/shared/PageHeader';
import { COMPANY_INFO } from '@/lib/constants';

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-8 md:py-12">
      <PageHeader
        title="Privacy Policy"
        description="Your privacy is important to us."
      />
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <p>
          This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
        </p>
        <h2>Collecting and Using Your Personal Data</h2>
        <h3>Types of Data Collected</h3>
        <h4>Personal Data</h4>
        <p>
          While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:
        </p>
        <ul>
          <li>Email address</li>
          <li>First name and last name</li>
          <li>Usage Data</li>
          <li>Dietary preferences and health information provided by you</li>
        </ul>
        <h3>Use of Your Personal Data</h3>
        <p>The Company may use Personal Data for the following purposes:</p>
        <ul>
          <li><strong>To provide and maintain our Service</strong>, including to monitor the usage of our Service.</li>
          <li><strong>To manage Your Account:</strong> to manage Your registration as a user of the Service.</li>
          <li><strong>To contact You:</strong> To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication.</li>
        </ul>
        <h2>Disclosure of Your Personal Data</h2>
        <p>
          We may share your personal information in the following situations: with service providers to monitor and analyze the use of our service, and with our AI service providers (like OpenAI) to generate meal plans. The information shared is limited to what is necessary to provide the service.
        </p>
        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, You can contact us:
        </p>
        <ul>
          <li>By email: <a href={`mailto:${COMPANY_INFO.contact.email}`}>{COMPANY_INFO.contact.email}</a></li>
          <li>By phone number: {COMPANY_INFO.contact.phone}</li>
        </ul>
      </div>
    </div>
  );
}
