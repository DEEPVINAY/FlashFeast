-- ====================================================================
-- FLASHFEAST DEVOPS & DEPLOYMENTS SCHEMA (NEON POSTGRESQL)
-- ====================================================================

-- 1. Create Deployments Table
CREATE TABLE IF NOT EXISTS deployments (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    app VARCHAR(100) NOT NULL,
    environment VARCHAR(30) NOT NULL,
    version VARCHAR(100) NOT NULL,

    status VARCHAR(20) NOT NULL
        CHECK (status IN ('success', 'failure', 'in_progress')),

    duration_sec INTEGER
        CHECK (duration_sec IS NULL OR duration_sec >= 0),

    failures_per_release INTEGER NOT NULL DEFAULT 0
        CHECK (failures_per_release >= 0),

    success_rate NUMERIC(5,2)
        CHECK (success_rate IS NULL OR
               (success_rate >= 0 AND success_rate <= 100)),

    deployed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    source_account VARCHAR(255) NOT NULL
);

-- Index for fast time-series queries and status filtering
CREATE INDEX IF NOT EXISTS idx_deployments_deployed_at ON deployments(deployed_at DESC);
CREATE INDEX IF NOT EXISTS idx_deployments_status ON deployments(status);
CREATE INDEX IF NOT EXISTS idx_deployments_app_env ON deployments(app, environment);

-- 2. Insert Sample Records
INSERT INTO deployments (
    app,
    environment,
    version,
    status,
    duration_sec,
    failures_per_release,
    success_rate,
    source_account
)
VALUES
(
    'FlashFeast', 'production', 'v1.0.0',
    'success', 85, 0, 100.00,
    'github-actions'
),
(
    'FlashFeast', 'production', 'v1.0.1',
    'failure', 42, 1, 90.00,
    'vinay-github'
),
(
    'FlashFeast', 'development', 'v1.1.0',
    'success', 64, 0, 95.00,
    'github-actions'
);
