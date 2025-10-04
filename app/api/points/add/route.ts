import { NextRequest, NextResponse } from 'next/server';
import { getWhopSession } from '@/lib/whop';
import { addPoints, getUserByWhopId } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getWhopSession();

    if (!session || !session.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { whopUserId, amount, categoryId, reason } = body;

    if (!whopUserId || !amount || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const user = await getUserByWhopId(whopUserId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    await addPoints(
      user.id,
      parseInt(amount),
      categoryId,
      reason || 'Points added by admin',
      session.user.id
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding points:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}