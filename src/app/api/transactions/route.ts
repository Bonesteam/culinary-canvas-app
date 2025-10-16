import { NextRequest, NextResponse } from 'next/server';
import { createTransaction, getUserTransactions, recordPurchase } from '@/lib/mongodb-api';

export async function POST(request: NextRequest) {
  try {
    const { userId, details, tokens, amount, currency, type, mealPlanId } = await request.json();

    if (!userId || !details || tokens === undefined || !amount || !currency || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const transaction = await createTransaction({
      userId,
      details,
      tokens,
      amount,
      currency,
      type,
      mealPlanId
    });

    return NextResponse.json({ transaction });
  } catch (error) {
    console.error('Create transaction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter required' },
        { status: 400 }
      );
    }

    const transactions = await getUserTransactions(userId);
    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('Get transactions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}