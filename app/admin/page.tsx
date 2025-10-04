// app/admin/page.tsx
import { auth } from '@whop-apps/sdk';
import { AdminDashboard } from '@/components/AdminDashboard';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

// This function will fetch data on the server
async function getAdminData(companyId: string) {
    // In a real app, you would fetch from your DB, syncing with Whop members
    // For simplicity, we'll fetch from Whop API in the component for now
    // But let's fetch categories from our DB
    const categories = await db.query.categories.findMany({
        where: sql`company_id = ${companyId}`
    });
    return { categories };
}

export default async function AdminPage() {
    const { companyId } = await auth();
    if (!companyId) return <div>Not authorized</div>;

    const { categories } = await getAdminData(companyId);

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-4xl font-bold mb-2">Creator Dashboard</h1>
            <p className="text-gray-400 mb-8">Manage your community's points and leaderboard.</p>
            <AdminDashboard initialCategories={categories} />
        </div>
    );
}