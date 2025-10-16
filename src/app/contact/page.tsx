import { PageHeader } from '@/components/shared/PageHeader';
import { COMPANY_INFO } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, Building } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container py-8 md:py-12">
      <PageHeader
        title="Contact Us"
        description="We'd love to hear from you."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Our Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div className="flex items-start gap-4">
                <Building className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">{COMPANY_INFO.name}</h3>
                  <p>{COMPANY_INFO.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">Email</h3>
                  <a href={`mailto:${COMPANY_INFO.contact.email}`} className="hover:text-primary transition-colors">
                    {COMPANY_INFO.contact.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">Phone</h3>
                  <p>{COMPANY_INFO.contact.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="prose prose-lg dark:prose-invert">
            <h2>Get in Touch</h2>
            <p>
                Whether you have a question about our services, need assistance with your account, or just want to share your culinary creations, our team is here to help.
            </p>
            <p>
                For general inquiries and support, the best way to reach us is by email. We aim to respond to all messages within 24 business hours.
            </p>
        </div>
      </div>
    </div>
  );
}
