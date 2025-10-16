import { NextRequest, NextResponse } from 'next/server';
import { createMealPlan, getUserMealPlans, getAllMealPlans } from '@/lib/mongodb-api';

export async function POST(request: NextRequest) {
  try {
    const { userId, type, cost, details, content, chefId } = await request.json();

    if (!userId || !type || !cost || !details || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const mealPlan = await createMealPlan({
      userId,
      type,
      cost,
      details,
      content,
      chefId
    });

    return NextResponse.json({ mealPlan });
  } catch (error) {
    console.error('Create meal plan error:', error);
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
    const admin = searchParams.get('admin') === 'true';

    let mealPlans;
    
    if (admin) {
      mealPlans = await getAllMealPlans();
    } else if (userId) {
      mealPlans = await getUserMealPlans(userId);
    } else {
      return NextResponse.json(
        { error: 'userId or admin parameter required' },
        { status: 400 }
      );
    }

    return NextResponse.json({ mealPlans });
  } catch (error) {
    console.error('Get meal plans error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}