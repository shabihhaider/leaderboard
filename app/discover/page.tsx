import { getLeaderboard } from '@/lib/db';
import LeaderboardPage from '@/components/LeaderboardPage';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function DiscoverPage() {
  const leaderboard = await getLeaderboard('all_time', 20);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <LeaderboardPage initialLeaderboard={leaderboard} />
    </div>
  );
}