-- Drop existing tables if they exist (only for fresh setup)
DROP TABLE IF EXISTS leaderboard_stats CASCADE;
DROP TABLE IF EXISTS point_transactions CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whop_user_id VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  avatar_url TEXT,
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  color VARCHAR(50) NOT NULL,
  company_id VARCHAR(255) NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create point_transactions table
CREATE TABLE point_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  reason TEXT,
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create leaderboard_stats table
CREATE TABLE leaderboard_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  period VARCHAR(50) NOT NULL,
  points INTEGER DEFAULT 0,
  rank INTEGER,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, period)
);

-- Create indexes for performance
CREATE INDEX idx_users_whop_id ON users(whop_user_id);
CREATE INDEX idx_users_total_points ON users(total_points DESC);
CREATE INDEX idx_transactions_user ON point_transactions(user_id);
CREATE INDEX idx_transactions_created_at ON point_transactions(created_at DESC);
CREATE INDEX idx_leaderboard_period ON leaderboard_stats(period, points DESC);
CREATE INDEX idx_categories_company ON categories(company_id);

-- Insert default categories
INSERT INTO categories (name, color, company_id, is_default) VALUES
  ('Engagement', '#3b82f6', 'default', true),
  ('Contribution', '#10b981', 'default', true),
  ('Achievement', '#f59e0b', 'default', true);