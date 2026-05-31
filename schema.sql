-- Buffer Bros booking database (Cloudflare D1)
-- Apply with:  npx wrangler d1 execute bufferbros --file=./schema.sql --remote

-- Recurring weekly hours. One row per weekday (0 = Sunday ... 6 = Saturday).
-- open_min / close_min are minutes from midnight, local time.
CREATE TABLE IF NOT EXISTS weekly_hours (
  weekday   INTEGER PRIMARY KEY,   -- 0..6
  enabled   INTEGER NOT NULL DEFAULT 0,
  open_min  INTEGER NOT NULL DEFAULT 480,   -- 8:00 am
  close_min INTEGER NOT NULL DEFAULT 1080    -- 6:00 pm
);

-- One-off blocked time ranges (vacation, personal, already-busy).
-- Stored per calendar date in local minutes.
CREATE TABLE IF NOT EXISTS blocks (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  date      TEXT NOT NULL,          -- YYYY-MM-DD (local)
  start_min INTEGER NOT NULL,
  end_min   INTEGER NOT NULL,
  reason    TEXT
);
CREATE INDEX IF NOT EXISTS idx_blocks_date ON blocks(date);

-- Customer bookings. An appointment occupies start_min .. start_min+duration_min,
-- plus a buffer applied at read time.
CREATE TABLE IF NOT EXISTS bookings (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  created_ts   INTEGER NOT NULL,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT NOT NULL,
  address      TEXT NOT NULL,
  package_id   TEXT NOT NULL,
  package_name TEXT NOT NULL,
  size_id      TEXT NOT NULL,
  size_label   TEXT NOT NULL,
  addons       TEXT NOT NULL DEFAULT '[]',   -- JSON array of {id,name,price}
  date         TEXT NOT NULL,                 -- YYYY-MM-DD (local)
  start_min    INTEGER NOT NULL,
  duration_min INTEGER NOT NULL,
  price        INTEGER NOT NULL DEFAULT 0,
  notes        TEXT,
  status       TEXT NOT NULL DEFAULT 'confirmed'  -- confirmed | cancelled
);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);

-- Simple key/value settings (slot granularity, lead time, etc.).
CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Seed sensible defaults (open every day, 8am-6pm).
INSERT OR IGNORE INTO weekly_hours (weekday, enabled, open_min, close_min) VALUES
  (0, 1, 480, 1080),
  (1, 1, 480, 1080),
  (2, 1, 480, 1080),
  (3, 1, 480, 1080),
  (4, 1, 480, 1080),
  (5, 1, 480, 1080),
  (6, 1, 480, 1080);

INSERT OR IGNORE INTO settings (key, value) VALUES
  ('slot_granularity_min', '30'),   -- show start times every 30 minutes
  ('min_lead_min', '180'),          -- require booking at least 3 hours out
  ('buffer_min', '30');             -- pack-up/travel buffer after each job
