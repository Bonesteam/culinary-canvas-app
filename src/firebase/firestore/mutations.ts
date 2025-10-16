
import { Firestore, doc, runTransaction, serverTimestamp, Timestamp, collection } from 'firebase/firestore';
import { TOKEN_PACKAGES } from '@/lib/constants';

// Define the type for a single token package based on the structure in constants.ts
export type TokenPackage = {
    id: string;
    name: string;
    tokens: number;
    priceGBP: number;
    description: string;
    bonus: string | null;
};

export type UserData = {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
    tokenBalance: number;
    createdAt: Timestamp;
    orders?: any[];
    purchases?: any[];
}

export const recordPurchase = async (db: Firestore, userId: string, pkg: TokenPackage, currency: 'GBP' | 'EUR') => {
    const userRef = doc(db, "users", userId);
    // Use the root 'transactions' collection as defined in backend.json
    const purchaseRef = doc(collection(db, "transactions")); 

    try {
        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists()) {
                throw "User document does not exist!";
            }
            
            const newBalance = (userDoc.data().tokenBalance || 0) + pkg.tokens;
            
            transaction.update(userRef, { tokenBalance: newBalance });

            const price = currency === 'GBP' ? pkg.priceGBP : pkg.priceGBP * 1.18; // Use real rate in production

            transaction.set(purchaseRef, {
                id: purchaseRef.id,
                userId: userId,
                date: serverTimestamp(),
                details: `Purchased ${pkg.name} package`,
                tokens: pkg.tokens,
                amount: price,
                currency: currency,
                type: 'Purchase',
            });
        });
    } catch (e) {
        console.error("Transaction failed: ", e);
        throw e;
    }
};

export const recordMealPlanOrder = async (db: Firestore, userId: string, type: 'AI Plan' | 'Chef Plan', cost: number, details: string, content: string) => {
    const userRef = doc(db, "users", userId);
    // Use the root 'mealPlans' collection
    const orderRef = doc(collection(db, "mealPlans"));

    try {
        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists()) {
                throw "User document does not exist!";
            }

            const currentBalance = userDoc.data().tokenBalance || 0;
            if (currentBalance < cost) {
                throw "Insufficient tokens.";
            }
            
            const newBalance = currentBalance - cost;
            
            transaction.update(userRef, { tokenBalance: newBalance });

            transaction.set(orderRef, {
                id: orderRef.id,
                userId: userId,
                creationDate: serverTimestamp(),
                type: type,
                cost: cost,
                details: details,
                content: content,
                status: type === 'Chef Plan' ? 'pending' : 'completed',
            });
        });
    } catch (e) {
        console.error("Transaction failed: ", e);
        throw e;
    }
}
