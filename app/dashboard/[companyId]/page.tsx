import { getWhopSession, fetchWhopMembers } from '@/lib/whop';
import { getAllUsers, getCategories } from '@/lib/db';
import { redirect } from 'next/navigation';
import AdminDashboard from '@/components/AdminDashboard';

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const session = await getWhopSession();

  if (!session || !session.isAdmin) {
    redirect('/experiences/[experienceId]');
  }

  const { companyId } = await params;

  const [users, categories, whopMembers] = await Promise.all([
    getAllUsers(),
    getCategories(companyId),
    fetchWhopMembers(companyId),
  ]);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <AdminDashboard
        users={users}
        categories={categories}
        whopMembers={whopMembers}
        companyId={companyId}
        adminName={session.user.username}
      />
    </div>
  );
}