import { type ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  description?: string | ReactNode;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="mb-8 md:mb-12">
      <h1 className="text-4xl font-headline font-bold">{title}</h1>
      {description && <p className="text-muted-foreground mt-2 text-lg">{description}</p>}
    </header>
  );
}