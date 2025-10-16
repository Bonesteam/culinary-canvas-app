'use client';

import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Coins, Menu, UtensilsCrossed, X, LogOut, User as UserIcon, LogIn, Shield } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useMongoDB } from '@/context/MongoDBContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCurrency, type Currency } from '@/context/CurrencyContext';

interface UserProfile {
  tokenBalance: number;
  role?: 'admin';
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading: isUserLoading, logout } = useMongoDB();
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();
  const { currency, setCurrency } = useCurrency();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSignOut = async () => {
    logout();
    router.push('/');
  };

  const handleCurrencyChange = (value: string) => {
    setCurrency(value as Currency);
  };

  const tokenBalance = user?.tokenBalance;
  const isAdmin = user?.role === 'admin';

  // Show admin link if user is admin
  const allNavLinks = isAdmin
    ? [...NAV_LINKS, { href: '/admin/requests', label: 'Admin' }]
    : NAV_LINKS;

  return (
    <header className="header">
      <div className="header__content">
        <Link href="/" className="header__logo" onClick={() => setIsOpen(false)}>
          <UtensilsCrossed className="h-6 w-6 text-primary" />
          <span className="header__brand">Culinary Canvas</span>
        </Link>
        
        <nav className="header__nav">
          {allNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`header__nav-link ${
                pathname.startsWith(link.href) && link.href !== '/' || pathname === link.href ? 'header__nav-link--active' : ''
              }`}
            >
              {link.href === '/admin/requests' ? (
                <span className="flex items-center gap-1"><Shield size={16}/> {link.label}</span>
              ) : (
                link.label
              )}
            </Link>
          ))}
        </nav>

        <div className="header__actions">
           <div className="hidden sm:flex">
             <Tabs value={currency} onValueChange={handleCurrencyChange} className="w-auto">
                <TabsList>
                  <TabsTrigger value="GBP">GBP (£)</TabsTrigger>
                  <TabsTrigger value="EUR">EUR (€)</TabsTrigger>
                </TabsList>
              </Tabs>
           </div>
          {isUserLoading ? (
            <div className="h-9 w-24 skeleton rounded-full"></div>
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
            className="header__mobile-menu"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className={`header__mobile-nav ${isOpen ? 'header__mobile-nav--open' : ''}`}>
          <div className="header__mobile-nav-content">
            <nav className="header__mobile-nav-links">
              {allNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`header__mobile-nav-link ${
                    pathname.startsWith(link.href) && link.href !== '/' || pathname === link.href ? 'header__mobile-nav-link--active' : ''
                  }`}
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
