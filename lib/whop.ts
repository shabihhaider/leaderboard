import { headers } from 'next/headers';

export interface WhopUser {
  id: string;
  username: string;
  email?: string;
  profile_pic_url?: string;
}

export interface WhopSession {
  user: WhopUser;
  companyId: string;
  isAdmin: boolean;
}

export async function getWhopSession(): Promise<WhopSession | null> {
  try {
    const headersList = await headers();
    const whopUserId = headersList.get('x-whop-user-id');
    const whopCompanyId = headersList.get('x-whop-company-id');
    const whopUsername = headersList.get('x-whop-username');
    const whopEmail = headersList.get('x-whop-email');
    const whopRole = headersList.get('x-whop-role');

    if (!whopUserId || !whopCompanyId) {
      return null;
    }

    return {
      user: {
        id: whopUserId,
        username: whopUsername || 'User',
        email: whopEmail || undefined,
        profile_pic_url: undefined,
      },
      companyId: whopCompanyId,
      isAdmin: whopRole === 'admin' || whopRole === 'owner',
    };
  } catch (error) {
    console.error('Error getting Whop session:', error);
    return null;
  }
}

export async function fetchWhopMembers(companyId: string): Promise<WhopUser[]> {
  try {
    const response = await fetch(
      `https://api.whop.com/api/v2/companies/${companyId}/members`,
      {
        headers: {
          Authorization: `Bearer ${process.env.WHOP_API_KEY}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch members');
    }

    const data = await response.json();
    return data.members || [];
  } catch (error) {
    console.error('Error fetching Whop members:', error);
    return [];
  }
}