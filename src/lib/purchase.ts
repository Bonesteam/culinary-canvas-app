'use client';

import { doc, writeBatch, collection, serverTimestamp, getDoc, Firestore } from 'firebase/firestore';
import { User } from 'firebase/auth';
import type { Currency } from '@/context/types';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface PurchaseDetails {
    tokens: number;
    amount: number;
    currency: Currency;
    details: string;
}

interface HandlePurchaseParams {
    firestore: Firestore;
    user: User | null;
    router: AppRouterInstance;
    toast: (options: {
        variant?: 'default' | 'destructive';
        title: string;
        description: string;
    }) => void;
    purchaseDetails: PurchaseDetails;
}

/**
 * Handles the logic for purchasing tokens.
 * This is the designated place for future payment gateway integration.
 */
export const handlePurchase = async ({
    firestore,
    user,
    router,
    toast,
    purchaseDetails
}: HandlePurchaseParams) => {
    const { tokens, amount, currency, details } = purchaseDetails;

    if (!user) {
        toast({
            variant: 'destructive',
            title: 'Not Logged In',
            description: 'You must be logged in to purchase tokens.',
        });
        router.push('/login');
        return;
    }

    // TODO: PAYMENT_GATEWAY_INTEGRATION
    // This is where the payment gateway logic should be added.
    // 1. Initiate payment with the gateway (e.g., Stripe, PayPal).
    // 2. Pass the 'amount' and 'currency' to the payment provider.
    // 3. On successful payment confirmation from the gateway, proceed with the logic below.
    // If payment fails, show an error toast and stop execution.
    // For now, we will simulate a successful payment and proceed directly.
    const isPaymentSuccessful = true; // This will be replaced by the payment gateway's response.

    if (!isPaymentSuccessful) {
        toast({
            variant: 'destructive',
            title: 'Payment Failed',
            description: 'Your payment could not be processed. Please try again.',
        });
        return;
    }

    try {
        const batch = writeBatch(firestore);
        const userRef = doc(firestore, 'users', user.uid);
        const transactionRef = doc(collection(firestore, 'transactions'));

        const userSnap = await getDoc(userRef);
        const currentTokenBalance = userSnap.data()?.tokenBalance || 0;

        batch.update(userRef, { tokenBalance: currentTokenBalance + tokens });

        batch.set(transactionRef, {
            userId: user.uid,
            tokens,
            amount,
            currency,
            date: serverTimestamp(),
            type: 'Purchase',
            details,
            id: transactionRef.id
        });

        await batch.commit();

        toast({
            title: 'Purchase Successful!',
            description: `You've added ${tokens.toLocaleString()} tokens to your account.`,
        });

    } catch (error) {
        console.error("Purchase failed: ", error);
        toast({
            variant: 'destructive',
            title: 'Update Failed',
            description: 'There was an error updating your account after payment. Please contact support.',
        });
    }
};
