import pg from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Use DATABASE_URL
const migrationConn = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;

if (!migrationConn) {
  console.error("❌ No database connection string found in .env.local or .env");
  process.exit(1);
}

const client = new Client({
  connectionString: migrationConn,
  ssl: {
    rejectUnauthorized: false
  }
});

async function runMigration() {
  console.log("🚀 Starting database migration on Neon Postgres (Direct Connection)...");
  await client.connect();

  try {
    // 1. Create table
    await client.query(`
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
    `);
    console.log("✅ Table 'deployments' ensured.");

    // 2. Create indices
    await client.query(`CREATE INDEX IF NOT EXISTS idx_deployments_deployed_at ON deployments(deployed_at DESC);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_deployments_status ON deployments(status);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_deployments_app_env ON deployments(app, environment);`);
    console.log("✅ Indices created.");

    // 3. Seed sample data if empty
    const countRes = await client.query(`SELECT COUNT(*)::int AS count FROM deployments;`);
    const count = countRes.rows[0].count;

    if (count === 0) {
      await client.query(`
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
      `);
      console.log("✅ Sample deployment records seeded.");
    } else {
      console.log(`ℹ️ Table 'deployments' already contains ${count} records.`);
    }

    console.log("🎉 Migration completed successfully!");
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
