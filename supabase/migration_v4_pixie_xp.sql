-- migration_v4_pixie_xp.sql
-- Run in Supabase SQL editor (Dashboard → SQL Editor → New query)
-- Safe to run multiple times (uses IF NOT EXISTS).
--
-- Purpose: tracks per-species vote counts for Pixie level progression.
-- Each species accumulates XP independently — switching species doesn't
-- reset progress on the previous one.
--
-- Format: { "spark": 42, "blip": 7, "momo": 0, ... }
-- Populated by POST /api/pixie/xp (called fire-and-forget from VoteClientPage).

alter table profiles
  add column if not exists pixie_xp jsonb not null default '{}';

-- Verify
select column_name, data_type, column_default
from information_schema.columns
where table_name = 'profiles'
  and column_name = 'pixie_xp';
