import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUser } from '@/lib/mongodb-api';

export async function POST(request: NextRequest) {
  try {
    const { uid, displayName, email, photoURL } = await request.json();

    if (!uid) {
      return NextResponse.json({ error: 'UID is required' }, { status: 400 });
    }

    // Check if user exists
    let user = await getUser(uid);
    
    if (!user) {
      // Create new user
      user = await createUser({
        uid,
        displayName,
        email,
        photoURL
      });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}