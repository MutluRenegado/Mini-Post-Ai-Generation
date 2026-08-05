/**
 * Database Schema Definition
 * Defines subscription pricing, monthly duration tracking fields, and video rendering projects.
 */

export interface UserSubscriptionSchema {
  id: string;
  userId: string;
  tier: 'starter' | 'pro' | 'business';
  monthlyPrice: number; // Real, default 9
  secondsUsedThisMonth: number; // Integer, default 0
  monthlyLimitSeconds: number; // Integer, default 600 (Starter)
  billingCycleResetDate: string; // ISO Text Date
  createdAt: string;
  updatedAt: string;
}

export interface VideoProjectSchema {
  id: string;
  userId: string;
  title: string;
  durationSeconds: number; // Duration of rendered video in seconds
  status: 'pending' | 'rendering' | 'completed' | 'failed';
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * SQL Schema definition (for SQLite / D1 / Postgres migrations)
 */
export const SQL_SCHEMA_DDL = `
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  tier TEXT NOT NULL DEFAULT 'starter',
  monthly_price REAL NOT NULL DEFAULT 9.0,
  seconds_used_this_month INTEGER NOT NULL DEFAULT 0,
  monthly_limit_seconds INTEGER NOT NULL DEFAULT 600,
  billing_cycle_reset_date TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS video_projects (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  video_url TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
`;
