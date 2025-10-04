import { createPool } from '@vercel/postgres';

const pool = createPool({
  connectionString: process.env.POSTGRES_URL,
});

const sql = pool.sql;

export interface User {
  id: string;
  whop_user_id: string;
  username: string;
  email?: string;
  avatar_url?: string;
  total_points: number;
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  company_id: string;
  is_default: boolean;
  created_at: Date;
}

export interface PointTransaction {
  id: string;
  user_id: string;
  amount: number;
  category_id?: string;
  reason?: string;
  created_by: string;
  created_at: Date;
  category_name?: string;
  category_color?: string;
}

export interface LeaderboardEntry extends User {
  rank: number;
}

// User operations
export async function createOrUpdateUser(whopUserId: string, data: Partial<User>) {
  const result = await sql`
    INSERT INTO users (whop_user_id, username, email, avatar_url)
    VALUES (${whopUserId}, ${data.username || 'User'}, ${data.email || ''}, ${data.avatar_url || ''})
    ON CONFLICT (whop_user_id) 
    DO UPDATE SET 
      username = EXCLUDED.username,
      email = EXCLUDED.email,
      avatar_url = EXCLUDED.avatar_url,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *
  `;
  return result.rows[0] as User;
}

export async function getUserByWhopId(whopUserId: string) {
  const result = await sql`SELECT * FROM users WHERE whop_user_id = ${whopUserId}`;
  return result.rows[0] as User | undefined;
}

export async function getAllUsers() {
  const result = await sql`
    SELECT * FROM users 
    ORDER BY total_points DESC, username ASC
  `;
  return result.rows as User[];
}

// Point operations
export async function addPoints(
  userId: string,
  amount: number,
  categoryId: string,
  reason: string,
  createdBy: string
) {
  // Add transaction
  await sql`
    INSERT INTO point_transactions (user_id, amount, category_id, reason, created_by)
    VALUES (${userId}, ${amount}, ${categoryId}, ${reason}, ${createdBy})
  `;

  // Update user total
  await sql`
    UPDATE users 
    SET total_points = total_points + ${amount}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${userId}
  `;

  // Update leaderboard stats
  await updateLeaderboardStats(userId);
}

export async function subtractPoints(
  userId: string,
  amount: number,
  categoryId: string,
  reason: string,
  createdBy: string
) {
  // Add transaction
  await sql`
    INSERT INTO point_transactions (user_id, amount, category_id, reason, created_by)
    VALUES (${userId}, ${-amount}, ${categoryId}, ${reason}, ${createdBy})
  `;

  // Update user total
  await sql`
    UPDATE users 
    SET total_points = GREATEST(0, total_points - ${amount}), updated_at = CURRENT_TIMESTAMP
    WHERE id = ${userId}
  `;

  // Update leaderboard stats
  await updateLeaderboardStats(userId);
}

export async function getPointHistory(userId: string, limit = 50) {
  const result = await sql`
    SELECT 
      pt.*,
      c.name as category_name,
      c.color as category_color
    FROM point_transactions pt
    LEFT JOIN categories c ON pt.category_id = c.id
    WHERE pt.user_id = ${userId}
    ORDER BY pt.created_at DESC
    LIMIT ${limit}
  `;
  return result.rows as PointTransaction[];
}

// Category operations
export async function getCategories(companyId: string) {
  const result = await sql`
    SELECT * FROM categories 
    WHERE company_id = ${companyId} OR is_default = true
    ORDER BY is_default DESC, created_at DESC
  `;
  return result.rows as Category[];
}

export async function createCategory(name: string, color: string, companyId: string) {
  const result = await sql`
    INSERT INTO categories (name, color, company_id, is_default)
    VALUES (${name}, ${color}, ${companyId}, false)
    RETURNING *
  `;
  return result.rows[0] as Category;
}

export async function deleteCategory(categoryId: string) {
  await sql`DELETE FROM categories WHERE id = ${categoryId} AND is_default = false`;
}

// Leaderboard operations
export async function getLeaderboard(period: 'all_time' | 'monthly' | 'weekly' = 'all_time', limit = 20) {
  if (period === 'all_time') {
    const result = await sql`
      SELECT 
        u.*,
        ROW_NUMBER() OVER (ORDER BY u.total_points DESC, u.username ASC) as rank
      FROM users u
      WHERE u.total_points > 0
      ORDER BY u.total_points DESC, u.username ASC
      LIMIT ${limit}
    `;
    return result.rows as LeaderboardEntry[];
  }

  const result = await sql`
    SELECT 
      u.*,
      ls.rank
    FROM leaderboard_stats ls
    JOIN users u ON ls.user_id = u.id
    WHERE ls.period = ${period}
    ORDER BY ls.rank ASC
    LIMIT ${limit}
  `;
  return result.rows as LeaderboardEntry[];
}

export async function getUserRank(userId: string) {
  const result = await sql`
    SELECT COUNT(*) + 1 as rank
    FROM users
    WHERE total_points > (SELECT total_points FROM users WHERE id = ${userId})
  `;
  return result.rows[0]?.rank || 0;
}

async function updateLeaderboardStats(userId: string) {
  // Update all-time stats
  await sql`
    INSERT INTO leaderboard_stats (user_id, period, points, rank)
    SELECT 
      id,
      'all_time',
      total_points,
      ROW_NUMBER() OVER (ORDER BY total_points DESC)
    FROM users
    WHERE id = ${userId}
    ON CONFLICT (user_id, period)
    DO UPDATE SET 
      points = EXCLUDED.points,
      rank = EXCLUDED.rank,
      updated_at = CURRENT_TIMESTAMP
  `;
}