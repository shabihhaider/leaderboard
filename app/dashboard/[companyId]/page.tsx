import { getWhopSession, fetchWhopMembers } from '@/lib/whop';
import { getAllUsers, getCategories } from '@/lib/db';
import { redirect } from 'next/navigation';
import AdminDashboard from '@/components/AdminDashboard';

export default async function AdminDashboardPage({
  params,
}: {
  params: { companyId: string };
}) {
  const session = await getWhopSession();

  if (!session || !session.isAdmin) {
    redirect('/experiences/[experienceId]');
  }

  const [users, categories, whopMembers] = await Promise.all([
    getAllUsers(),
    getCategories(params.companyId),
    fetchWhopMembers(params.companyId),
  ]);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <AdminDashboard
        users={users}
        categories={categories}
        whopMembers={whopMembers}
        companyId={params.companyId}
        adminName={session.user.username}
      />
    </div>
  );
}