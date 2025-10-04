import { redirect } from 'next/navigation';
import { getWhopSession } from '@/lib/whop';

export default async function HomePage() {
  const session = await getWhopSession();

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center glass rounded-2xl p-12 max-w-md">
          <h1 className="text-4xl font-bold mb-4 gradient-text">
            🏆 Leaderboard
          </h1>
          <p className="text-slate-300 mb-6">
            Please access this app through your Whop community.
          </p>
        </div>
      </div>
    );
  }

  // Redirect based on user role
  if (session.isAdmin) {
    redirect('/dashboard/[companyId]');
  } else {
    redirect('/experiences/[experienceId]');
  }
}