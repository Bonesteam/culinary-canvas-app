'use server';

import { generateAiMealPlan, type GenerateAiMealPlanInput } from '@/ai/flows/generate-ai-meal-plan';
import { doc, writeBatch, serverTimestamp, collection, Firestore } from 'firebase/firestore';

// This is a server-only function.
export async function generateAndSaveAiPlan(
  values: GenerateAiMealPlanInput,
  firestore: Firestore,
  user: { uid: string; tokenBalance: number },
  totalCost: number
) {
  const result = await generateAiMealPlan(values);

  const batch = writeBatch(firestore);
  const userRef = doc(firestore, 'users', user.uid);
  const mealPlanRef = doc(collection(firestore, 'mealPlans'));

  batch.update(userRef, { tokenBalance: user.tokenBalance - totalCost });

  const detailsSummary = `AI Plan for ${values.days} day(s). Brief: ${
    values.brief?.substring(0, 50) || 'none'
  }`;

  batch.set(mealPlanRef, {
    userId: user.uid,
    type: 'AI Plan',
    cost: totalCost,
    details: detailsSummary,
    content: result.mealPlan,
    creationDate: serverTimestamp(),
  });

  await batch.commit();

  return { success: true, mealPlanId: mealPlanRef.id };
}


interface SubmitChefPlanRequestInput {
    dietaryRequirements: string;
    preferences: string;
    goals?: string;
}

export async function submitChefPlanRequest(
    values: SubmitChefPlanRequestInput,
    firestore: Firestore,
    user: { uid: string; tokenBalance: number },
    totalCost: number
) {
    const preferencesSummary = `Dietary: ${values.dietaryRequirements}. Prefs: ${values.preferences}. Goals: ${values.goals || 'none'}`;

    const batch = writeBatch(firestore);
    const userRef = doc(firestore, 'users', user.uid);
    const mealPlanRef = doc(collection(firestore, 'mealPlans'));

    batch.update(userRef, { tokenBalance: user.tokenBalance - totalCost });

    const requestContent = `
================================================================
CHEF INSTRUCTIONS:
This is a new meal plan request.
1. Review the user's request details below.
2. Create a personalized meal plan in markdown format.
3. Replace the ENTIRE content of this field with the final meal plan.
4. Change the 'status' field from 'pending' to 'completed'.
================================================================

STATUS: PENDING
A personalized plan will be crafted by our chef and will appear here within 2-3 business hours.

--- USER REQUEST DETAILS ---

**Dietary Requirements:**
${values.dietaryRequirements}

**Preferences & Dislikes:**
${values.preferences}

**Health/Fitness Goals:**
${values.goals || 'Not specified'}
`;

    batch.set(mealPlanRef, {
        userId: user.uid,
        type: 'Chef Plan',
        status: 'pending',
        cost: totalCost,
        details: preferencesSummary.substring(0, 100),
        content: requestContent,
        creationDate: serverTimestamp(),
    });

    await batch.commit();

    return { success: true, mealPlanId: mealPlanRef.id };
}