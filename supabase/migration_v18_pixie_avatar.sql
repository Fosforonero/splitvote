-- Migration v18: use_pixie_avatar flag on profiles

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS use_pixie_avatar BOOLEAN NOT NULL DEFAULT FALSE;

-- Verify
SELECT use_pixie_avatar FROM profiles LIMIT 1;
