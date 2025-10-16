import { COMPANY_INFO, FOOTER_LINKS } from '@/lib/constants';
import { UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-secondary/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <UtensilsCrossed className="h-7 w-7 text-primary" />
              <span className="font-headline text-2xl font-bold">Culinary Canvas</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} {COMPANY_INFO.name}. All Rights Reserved.
            </p>
          </div>
          
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-headline text-lg font-semibold mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
             <h3 className="font-headline text-lg font-semibold mb-4">Company Information</h3>
             <div className="text-sm text-muted-foreground space-y-2">
                <p><strong>{COMPANY_INFO.name}</strong></p>
                <p>Company number: {COMPANY_INFO.number}</p>
                <p>{COMPANY_INFO.address}</p>
                <p>Contact: <a href={`mailto:${COMPANY_INFO.contact.email}`} className="hover:text-primary transition-colors">{COMPANY_INFO.contact.email}</a></p>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}