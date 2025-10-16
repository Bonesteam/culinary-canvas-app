import { getDatabase } from './mongodb';
import { ObjectId } from 'mongodb';

// User operations
export async function createUser(userData: {
  uid: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
}) {
  const db = await getDatabase();
  const users = db.collection('users');
  
  const user = {
    ...userData,
    tokenBalance: 2000, // Free tokens on signup
    createdAt: new Date(),
    orders: [],
    purchases: []
  };
  
  await users.insertOne(user);
  return user;
}

export async function getUser(uid: string) {
  const db = await getDatabase();
  const users = db.collection('users');
  return await users.findOne({ uid });
}

export async function updateUser(uid: string, updateData: any) {
  const db = await getDatabase();
  const users = db.collection('users');
  return await users.updateOne({ uid }, { $set: updateData });
}

// Transaction operations
export async function createTransaction(transactionData: {
  userId: string;
  details: string;
  tokens: number;
  amount: number;
  currency: 'GBP' | 'EUR';
  type: 'Purchase' | 'MealPlan';
  mealPlanId?: string;
}) {
  const db = await getDatabase();
  const transactions = db.collection('transactions');
  
  const transaction = {
    ...transactionData,
    date: new Date()
  };
  
  const result = await transactions.insertOne(transaction);
  return { ...transaction, _id: result.insertedId };
}

export async function getUserTransactions(userId: string) {
  const db = await getDatabase();
  const transactions = db.collection('transactions');
  return await transactions.find({ userId }).sort({ date: -1 }).toArray();
}

// Meal plan operations
export async function createMealPlan(mealPlanData: {
  userId: string;
  type: 'AI Plan' | 'Chef Plan';
  cost: number;
  details: string;
  content: string;
  chefId?: string;
}) {
  const db = await getDatabase();
  const mealPlans = db.collection('mealPlans');
  
  const mealPlan = {
    ...mealPlanData,
    creationDate: new Date(),
    status: mealPlanData.type === 'Chef Plan' ? 'pending' : 'completed',
    completedAt: mealPlanData.type === 'AI Plan' ? new Date() : undefined
  };
  
  const result = await mealPlans.insertOne(mealPlan);
  return { ...mealPlan, _id: result.insertedId };
}

export async function getUserMealPlans(userId: string) {
  const db = await getDatabase();
  const mealPlans = db.collection('mealPlans');
  return await mealPlans.find({ userId }).sort({ creationDate: -1 }).toArray();
}

export async function getMealPlan(mealPlanId: string) {
  const db = await getDatabase();
  const mealPlans = db.collection('mealPlans');
  return await mealPlans.findOne({ _id: new ObjectId(mealPlanId) });
}

export async function updateMealPlan(mealPlanId: string, updateData: any) {
  const db = await getDatabase();
  const mealPlans = db.collection('mealPlans');
  return await mealPlans.updateOne({ _id: new ObjectId(mealPlanId) }, { $set: updateData });
}

// Admin operations
export async function getAllMealPlans() {
  const db = await getDatabase();
  const mealPlans = db.collection('mealPlans');
  return await mealPlans.find({}).sort({ creationDate: -1 }).toArray();
}

export async function getPendingMealPlans() {
  const db = await getDatabase();
  const mealPlans = db.collection('mealPlans');
  return await mealPlans.find({ status: 'pending' }).sort({ creationDate: -1 }).toArray();
}

// Token operations
export async function updateUserTokens(uid: string, tokenChange: number) {
  const db = await getDatabase();
  const users = db.collection('users');
  
  const user = await users.findOne({ uid });
  if (!user) {
    throw new Error('User not found');
  }
  
  const newBalance = user.tokenBalance + tokenChange;
  if (newBalance < 0) {
    throw new Error('Insufficient tokens');
  }
  
  await users.updateOne({ uid }, { $set: { tokenBalance: newBalance } });
  return newBalance;
}

// Purchase operations
export async function recordPurchase(userId: string, packageData: {
  id: string;
  name: string;
  tokens: number;
  priceGBP: number;
  description: string;
  bonus: string | null;
}, currency: 'GBP' | 'EUR') {
  const db = await getDatabase();
  const session = db.client.startSession();
  
  try {
    await session.withTransaction(async () => {
      // Update user tokens
      await updateUserTokens(userId, packageData.tokens);
      
      // Create transaction record
      const price = currency === 'GBP' ? packageData.priceGBP : packageData.priceGBP * 1.18;
      await createTransaction({
        userId,
        details: `Purchased ${packageData.name} package`,
        tokens: packageData.tokens,
        amount: price,
        currency,
        type: 'Purchase'
      });
    });
  } finally {
    await session.endSession();
  }
}

// Meal plan order operations
export async function recordMealPlanOrder(
  userId: string,
  type: 'AI Plan' | 'Chef Plan',
  cost: number,
  details: string,
  content: string
) {
  const db = await getDatabase();
  const session = db.client.startSession();
  
  try {
    await session.withTransaction(async () => {
      // Check and update user tokens
      await updateUserTokens(userId, -cost);
      
      // Create meal plan
      const mealPlan = await createMealPlan({
        userId,
        type,
        cost,
        details,
        content
      });
      
      // Create transaction record
      await createTransaction({
        userId,
        details: `Ordered ${type}`,
        tokens: -cost,
        amount: 0,
        currency: 'GBP', // Default currency for meal plans
        type: 'MealPlan',
        mealPlanId: mealPlan._id.toString()
      });
    });
  } finally {
    await session.endSession();
  }
}