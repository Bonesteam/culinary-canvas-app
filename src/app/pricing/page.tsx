'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GBP_TO_EUR_RATE, TOKEN_PACKAGES } from '@/lib/constants';
import { CheckCircle, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useFirestore, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useCurrency, type Currency } from '@/context/CurrencyContext';
import { handlePurchase } from '@/lib/purchase';

export default function PricingPage() {
  const [customAmount, setCustomAmount] = useState('');
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { currency } = useCurrency();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getPrice = (priceGBP: number) => {
    const price = currency === 'EUR' ? priceGBP * GBP_TO_EUR_RATE : priceGBP;
    return new Intl.NumberFormat(currency === 'GBP' ? 'en-GB' : 'de-DE', { style: 'currency', currency }).format(price);
  };
  
  const customTokens = useMemo(() => {
    const amount = parseFloat(customAmount);
    return isNaN(amount) || amount <= 0 ? 0 : Math.floor(amount * 100);
  }, [customAmount]);

  const getCustomPrice = () => {
    const amount = parseFloat(customAmount)
    return isNaN(amount) || amount <= 0 ? 0 : amount;
  }
  
  const onPurchase = async (tokens: number, amount: number, currency: Currency, details: string) => {
     await handlePurchase({
        firestore,
        user,
        router,
        toast,
        purchaseDetails: {
            tokens,
            amount,
            currency,
            details
        }
     });

     if (details === 'Custom Amount') {
        setCustomAmount('');
     }
  };

  return (
    <div className="container py-8 md:py-12">
      <header className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-headline font-bold">Flexible Pricing</h1>
        <p className="text-muted-foreground mt-2 text-lg">Choose the perfect token package to fuel your culinary adventures. 1.00 GBP = 100 tokens.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {TOKEN_PACKAGES.map((pkg, index) => (
          <Card key={pkg.name} className={cn(
            "flex flex-col",
            index === 1 && "border-primary shadow-lg"
          )}>
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-2xl">{pkg.name}</CardTitle>
              <CardDescription>{pkg.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 text-center">
              <div className="my-4">
                <span className="text-4xl font-bold">{isClient ? pkg.tokens.toLocaleString() : pkg.tokens}</span>
                <span className="text-muted-foreground"> Tokens</span>
              </div>
              <div className="text-2xl font-semibold text-primary">{getPrice(pkg.priceGBP)}</div>
              {pkg.bonus && <p className="text-sm text-accent-foreground font-semibold mt-2">{pkg.bonus}</p>}
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => onPurchase(pkg.tokens, pkg.priceGBP, currency, `Token Package: ${pkg.name}`)}>
                <CheckCircle className="mr-2 h-4 w-4" /> Buy Now
              </Button>
            </CardFooter>
          </Card>
        ))}

        <Card className="flex flex-col">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl">Custom Amount</CardTitle>
            <CardDescription>Top up exactly what you need.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-2">
              <Label htmlFor="custom-amount">Amount ({currency})</Label>
              <Input
                id="custom-amount"
                type="number"
                placeholder="e.g., 15"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
              />
            </div>
            <div className="mt-4 text-center">
              <span className="text-4xl font-bold">{isClient ? customTokens.toLocaleString() : customTokens}</span>
              <span className="text-muted-foreground"> Tokens</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled={customTokens <= 0} onClick={() => onPurchase(customTokens, getCustomPrice(), currency, 'Custom Amount')}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Tokens
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}