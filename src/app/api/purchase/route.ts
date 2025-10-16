import { NextRequest, NextResponse } from 'next/server';
import { recordPurchase } from '@/lib/mongodb-api';
import { TOKEN_PACKAGES } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const { userId, packageId, currency } = await request.json();

    if (!userId || !packageId || !currency) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const packageData = TOKEN_PACKAGES.find(pkg => pkg.id === packageId);
    if (!packageData) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }

    await recordPurchase(userId, packageData, currency);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}