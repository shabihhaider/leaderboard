import { NextRequest, NextResponse } from 'next/server';
import { createOrUpdateUser } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    // Handle different webhook events from Whop
    switch (type) {
      case 'user.joined':
        await createOrUpdateUser(data.user_id, {
          username: data.username || 'User',
          email: data.email,
          avatar_url: data.avatar_url,
        });
        break;

      case 'user.updated':
        await createOrUpdateUser(data.user_id, {
          username: data.username,
          email: data.email,
          avatar_url: data.avatar_url,
        });
        break;

      default:
        console.log('Unhandled webhook type:', type);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}