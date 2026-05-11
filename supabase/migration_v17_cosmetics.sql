-- Migration v17: cosmetics columns — equipped_glow + name_color

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS equipped_glow TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS name_color    TEXT DEFAULT NULL;

-- Verify
SELECT equipped_glow, name_color FROM profiles LIMIT 1;
