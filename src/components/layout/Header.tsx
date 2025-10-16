'use client';

import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Coins, Menu, UtensilsCrossed, X, LogOut, User as UserIcon, LogIn, Shield } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useUser, useDoc, useMemoFirebase, useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCurrency, type Currency } from '@/context/CurrencyContext';

interface UserProfile {
  tokenBalance: number;
  role?: 'admin';
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading: isUserLoading } = useUser();
  const [isClient, setIsClient] = useState(false);

  const firestore = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const { currency, setCurrency } = useCurrency();

  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<UserProfile>(userDocRef);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  const handleCurrencyChange = (value: string) => {
    setCurrency(value as Currency);
  };

  const tokenBalance = userProfile?.tokenBalance;
  const isAdmin = userProfile?.role === 'admin';

  // Show admin link if user is admin
  const allNavLinks = isAdmin
    ? [...NAV_LINKS, { href: '/admin/requests', label: 'Admin' }]
    : NAV_LINKS;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
          <UtensilsCrossed className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl font-bold">Culinary Canvas</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {allNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'transition-colors hover:text-primary',
                pathname.startsWith(link.href) && link.href !== '/' || pathname === link.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {link.href === '/admin/requests' ? (
                <span className="flex items-center gap-1"><Shield size={16}/> {link.label}</span>
              ) : (
                link.label
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
           <div className="hidden sm:flex">
             <Tabs value={currency} onValueChange={handleCurrencyChange} className="w-auto">
                <TabsList>
                  <TabsTrigger value="GBP">GBP (£)</TabsTrigger>
                  <TabsTrigger value="EUR">EUR (€)</TabsTrigger>
                </TabsList>
              </Tabs>
           </div>
          {isUserLoading ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-muted"></div>
          ) : user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 rounded-full border bg-secondary/50 px-3 py-1.5 text-sm font-medium">
                <Coins className="h-5 w-5 text-primary" />
                <span>{isClient && tokenBalance !== undefined ? tokenBalance.toLocaleString() : '...'}</span>
                <span className="sr-only">Tokens</span>
              </div>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard"><UserIcon /></Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut />
              </Button>
            </>
          ) : (
            <Button asChild>
              <Link href="/login">
                <LogIn className="mr-2" /> Login
              </Link>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="container flex flex-col items-start gap-4 pb-4">
            <nav className="flex flex-col items-start gap-2 w-full">
              {allNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'w-full rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                     pathname.startsWith(link.href) && link.href !== '/' || pathname === link.href ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                  )}
                >
                   {link.href === '/admin/requests' ? (
                    <span className="flex items-center gap-2"><Shield size={16}/> {link.label}</span>
                  ) : (
                    link.label
                  )}
                </Link>
              ))}
            </nav>
            <div className="w-full flex justify-center">
              <Tabs value={currency} onValueChange={handleCurrencyChange} className="w-auto">
                  <TabsList>
                    <TabsTrigger value="GBP">GBP (£)</TabsTrigger>
                    <TabsTrigger value="EUR">EUR (€)</TabsTrigger>
                  </TabsList>
                </Tabs>
            </div>
            {user && (
                 <div className="sm:hidden flex items-center gap-2 rounded-full border bg-secondary/50 px-3 py-1.5 text-sm font-medium self-center">
                    <Coins className="h-5 w-5 text-primary" />
                    <span>{isClient && tokenBalance !== undefined ? `${tokenBalance.toLocaleString()} Tokens` : '...'}</span>
                 </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
