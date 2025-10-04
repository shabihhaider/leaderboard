import { NextRequest, NextResponse } from 'next/server';
import { getWhopSession } from '@/lib/whop';
import { getAllUsers } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getWhopSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all users from database
    const users = await getAllUsers();

    return NextResponse.json({ 
      users,
      companyId: session.companyId 
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}