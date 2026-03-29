-- OpenClaw Social Media Automation — Database Schema
-- This runs automatically on first postgres start.
--
-- USED BY: n8n workflows (read/write), Dashboard (read via n8n webhooks)
-- NOT USED BY: OpenClaw (it has its own context engine), Media Worker

-- ═══════════════════════════════════════════════════════════════════════════
-- CONTENT PIPELINE
-- ═══════════════════════════════════════════════════════════════════════════

-- Raw uploaded media files
CREATE TABLE IF NOT EXISTS media_uploads (
    id              SERIAL PRIMARY KEY,
    filename        TEXT NOT NULL,
    original_path   TEXT NOT NULL,
    mime_type       TEXT NOT NULL,
    file_size_bytes BIGINT,
    duration_secs   REAL,
    width           INT,
    height          INT,
    theme           TEXT,          -- user-provided theme/direction
    brand_voice     TEXT,          -- user-provided brand voice notes
    uploaded_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Watermark configuration
CREATE TABLE IF NOT EXISTS watermarks (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    file_path   TEXT NOT NULL,
    position    TEXT DEFAULT 'bottom-right',  -- top-left, top-right, bottom-left, bottom-right, center
    opacity     REAL DEFAULT 0.7,
    is_active   BOOLEAN DEFAULT true,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Processed media (after watermark + resize)
CREATE TABLE IF NOT EXISTS processed_media (
    id              SERIAL PRIMARY KEY,
    upload_id       INT REFERENCES media_uploads(id),
    platform        TEXT NOT NULL,  -- instagram, tiktok, youtube, facebook, whatsapp
    file_path       TEXT NOT NULL,
    resolution      TEXT,           -- e.g. "1080x1920"
    duration_secs   REAL,
    processed_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════════════
-- CONTENT STASH → SCHEDULE → PUBLISH
--
-- FLOW:
--   1. Upload → AI generates → post enters STASH (status = 'stash')
--   2. User approves on mobile → status = 'approved'
--   3. Scheduler picks approved posts → assigns time → status = 'scheduled'
--   4. Publisher fires at scheduled_at → status = 'publishing' → 'published'
--   5. If stash runs low → WhatsApp/Telegram reminder
--
-- The user NEVER manually schedules. They approve, the system schedules.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS content_queue (
    id              SERIAL PRIMARY KEY,
    upload_id       INT REFERENCES media_uploads(id),
    processed_id    INT REFERENCES processed_media(id),
    platform        TEXT NOT NULL,
    caption         TEXT,
    hashtags        TEXT[],         -- array of hashtags
    alt_text        TEXT,
    -- STASH MODEL statuses:
    --   stash      = generated, waiting for user approval
    --   approved   = user approved, system will auto-schedule
    --   scheduled  = system assigned a publish time
    --   publishing = currently being sent to platform API
    --   published  = successfully posted
    --   failed     = publish attempt failed
    --   skipped    = user explicitly skipped this post
    status          TEXT DEFAULT 'stash',
    approved_at     TIMESTAMPTZ,    -- when user approved from stash
    scheduled_at    TIMESTAMPTZ,    -- system-assigned publish time
    published_at    TIMESTAMPTZ,
    publish_url     TEXT,           -- URL of published post
    error_message   TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_queue_status ON content_queue(status);
CREATE INDEX IF NOT EXISTS idx_queue_stash ON content_queue(status) WHERE status = 'stash';
CREATE INDEX IF NOT EXISTS idx_queue_approved ON content_queue(status) WHERE status = 'approved';
CREATE INDEX IF NOT EXISTS idx_queue_scheduled ON content_queue(scheduled_at) WHERE status = 'scheduled';
CREATE INDEX IF NOT EXISTS idx_queue_platform ON content_queue(platform);

-- ═══════════════════════════════════════════════════════════════════════════
-- STASH DEPLETION TRACKING
-- Used by the reminder workflow to calculate "X days of content left"
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS stash_alerts (
    id              SERIAL PRIMARY KEY,
    alert_type      TEXT NOT NULL,   -- 'low_stash', 'empty_stash', 'platform_empty'
    platform        TEXT,            -- null = all platforms
    days_remaining  REAL,            -- how many days of content left
    message         TEXT,
    sent_via        TEXT,            -- 'whatsapp', 'telegram', 'both'
    sent_at         TIMESTAMPTZ DEFAULT NOW()
);

-- View: calculate days of content remaining per platform
-- posts_per_day from platform_config, approved posts from content_queue
CREATE OR REPLACE VIEW stash_runway AS
SELECT
    pc.platform,
    pc.posts_per_day,
    COALESCE(approved.count, 0) AS approved_count,
    COALESCE(stash.count, 0) AS stash_count,
    COALESCE(scheduled.count, 0) AS scheduled_count,
    -- Runway = (approved + scheduled posts) / posts_per_day
    CASE WHEN pc.posts_per_day > 0
        THEN (COALESCE(approved.count, 0) + COALESCE(scheduled.count, 0))::REAL / pc.posts_per_day
        ELSE 999
    END AS days_remaining,
    -- Total available = stash + approved + scheduled
    COALESCE(stash.count, 0) + COALESCE(approved.count, 0) + COALESCE(scheduled.count, 0) AS total_available
FROM platform_config pc
LEFT JOIN (
    SELECT platform, COUNT(*) as count FROM content_queue WHERE status = 'approved' GROUP BY platform
) approved ON approved.platform = pc.platform
LEFT JOIN (
    SELECT platform, COUNT(*) as count FROM content_queue WHERE status = 'stash' GROUP BY platform
) stash ON stash.platform = pc.platform
LEFT JOIN (
    SELECT platform, COUNT(*) as count FROM content_queue WHERE status = 'scheduled' GROUP BY platform
) scheduled ON scheduled.platform = pc.platform
WHERE pc.enabled = true;

-- ═══════════════════════════════════════════════════════════════════════════
-- CAMPAIGN CONFIGURATION
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS campaigns (
    id              SERIAL PRIMARY KEY,
    name            TEXT NOT NULL DEFAULT 'Default Campaign',
    theme           TEXT,
    brand_voice     TEXT,
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS platform_config (
    id              SERIAL PRIMARY KEY,
    campaign_id     INT REFERENCES campaigns(id) DEFAULT 1,
    platform        TEXT NOT NULL,
    enabled         BOOLEAN DEFAULT true,
    posts_per_day   INT DEFAULT 3,
    interval_hours  REAL DEFAULT 8.0,   -- hours between posts
    best_times      TEXT[],             -- preferred posting times e.g. {"09:00","13:00","19:00"}
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(campaign_id, platform)
);

-- Insert default campaign
INSERT INTO campaigns (name, theme) VALUES ('Default Campaign', 'General')
ON CONFLICT DO NOTHING;

-- Insert default platform configs
INSERT INTO platform_config (campaign_id, platform, enabled, posts_per_day, interval_hours) VALUES
    (1, 'instagram', true, 3, 8),
    (1, 'tiktok', true, 3, 8),
    (1, 'youtube', true, 1, 24),
    (1, 'facebook', true, 2, 12),
    (1, 'whatsapp', true, 1, 24)
ON CONFLICT DO NOTHING;

-- Stash reminder config: how many days before the system nags you
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS stash_warning_days INT DEFAULT 3;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS stash_critical_days INT DEFAULT 1;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS reminder_channel TEXT DEFAULT 'whatsapp'; -- whatsapp, telegram, both

-- ═══════════════════════════════════════════════════════════════════════════
-- SCRUM / GOALS SYSTEM
-- ═══════════════════════════════════════════════════════════════════════════

-- Goals (user-defined targets)
CREATE TABLE IF NOT EXISTS goals (
    id          SERIAL PRIMARY KEY,
    type        TEXT NOT NULL,   -- 'growth_kpi', 'business', 'custom'
    title       TEXT NOT NULL,
    description TEXT,
    metric_key  TEXT,            -- e.g. 'instagram_followers', 'total_engagement'
    target      REAL,            -- numeric target
    current     REAL DEFAULT 0,
    deadline    DATE,
    status      TEXT DEFAULT 'active',  -- active, completed, paused, failed
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Sprints (weekly planning cycles)
CREATE TABLE IF NOT EXISTS sprints (
    id              SERIAL PRIMARY KEY,
    week_number     INT NOT NULL,
    year            INT NOT NULL,
    analysis        TEXT,           -- AI-generated analysis of previous week
    recommendations TEXT,           -- AI-generated recommendations
    status          TEXT DEFAULT 'planning',  -- planning, active, completed
    started_at      TIMESTAMPTZ DEFAULT NOW(),
    completed_at    TIMESTAMPTZ,
    UNIQUE(week_number, year)
);

-- Sprint tasks (generated by OpenClaw)
CREATE TABLE IF NOT EXISTS sprint_tasks (
    id              SERIAL PRIMARY KEY,
    sprint_id       INT REFERENCES sprints(id),
    title           TEXT NOT NULL,
    description     TEXT,
    platform        TEXT,           -- which platform this task targets
    priority        TEXT DEFAULT 'medium',  -- low, medium, high
    status          TEXT DEFAULT 'todo',    -- todo, in_progress, done, skipped
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    completed_at    TIMESTAMPTZ
);

-- ═══════════════════════════════════════════════════════════════════════════
-- ANALYTICS / METRICS
-- ═══════════════════════════════════════════════════════════════════════════

-- Daily platform metrics (collected by n8n)
CREATE TABLE IF NOT EXISTS platform_metrics (
    id          SERIAL PRIMARY KEY,
    platform    TEXT NOT NULL,
    metric_date DATE NOT NULL,
    followers   INT,
    likes       INT,
    views       INT,
    shares      INT,
    comments    INT,
    clicks      INT,
    reach       INT,
    impressions INT,
    collected_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(platform, metric_date)
);

-- Per-post performance
CREATE TABLE IF NOT EXISTS post_metrics (
    id              SERIAL PRIMARY KEY,
    queue_id        INT REFERENCES content_queue(id),
    platform        TEXT NOT NULL,
    likes           INT DEFAULT 0,
    views           INT DEFAULT 0,
    shares          INT DEFAULT 0,
    comments        INT DEFAULT 0,
    clicks          INT DEFAULT 0,
    collected_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_metrics_platform_date ON platform_metrics(platform, metric_date);
CREATE INDEX IF NOT EXISTS idx_post_metrics_queue ON post_metrics(queue_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- HELPER: Auto-update updated_at timestamps
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_queue_updated
    BEFORE UPDATE ON content_queue
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_goals_updated
    BEFORE UPDATE ON goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
