import { getWhopSession } from '@/lib/whop';
import { getUserByWhopId, createOrUpdateUser, getPointHistory, getUserRank, getLeaderboard } from '@/lib/db';
import { redirect } from 'next/navigation';
import MemberExperience from '@/components/MemberExperience';

export default async function ExperiencePage() {
  const session = await getWhopSession();

  if (!session) {
    redirect('/');
  }

  // Create or update user in database
  let user = await getUserByWhopId(session.user.id);
  if (!user) {
    user = await createOrUpdateUser(session.user.id, {
      username: session.user.username,
      email: session.user.email,
      avatar_url: session.user.profile_pic_url,
    });
  }

  const [history, rank, leaderboard] = await Promise.all([
    getPointHistory(user.id, 20),
    getUserRank(user.id),
    getLeaderboard('all_time', 10),
  ]);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <MemberExperience
        user={user}
        rank={rank as number}
        history={history}
        leaderboard={leaderboard}
      />
    </div>
  );
}