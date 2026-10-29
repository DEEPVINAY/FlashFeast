import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { query } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- Database Health Check ---
app.get("/api/health", async (req, res) => {
  try {
    const result = await query("SELECT NOW() AS current_time, current_database() AS db_name;");
    res.json({
      status: "ok",
      service: "FlashFeast API",
      database: "Neon Postgres",
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// --- API Routes for Deployments ---

// 1. View deployment history with timestamps
app.get("/api/deployments", async (req, res) => {
  try {
    const result = await query(`
      SELECT *
      FROM deployments
      ORDER BY deployed_at DESC;
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching deployments:", error);
    res.status(500).json({ error: error.message });
  }
});

// 2. Find failed deployments
app.get("/api/deployments/failures", async (req, res) => {
  try {
    const result = await query(`
      SELECT app, version, environment, duration_sec,
             deployed_at, source_account
      FROM deployments
      WHERE status = 'failure'
      ORDER BY deployed_at DESC;
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching failure records:", error);
    res.status(500).json({ error: error.message });
  }
});

// 3. Calculate actual success rate per application and environment
app.get("/api/deployments/stats", async (req, res) => {
  try {
    const result = await query(`
      SELECT
          app,
          environment,
          COUNT(*) AS total_deployments,
          COUNT(*) FILTER (
              WHERE status = 'success'
          ) AS successful_deployments,
          ROUND(
              100.0 * COUNT(*) FILTER (
                  WHERE status = 'success'
              ) / NULLIF(COUNT(*), 0),
              2
          ) AS success_rate
      FROM deployments
      WHERE status IN ('success', 'failure')
      GROUP BY app, environment;
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error calculating success rate:", error);
    res.status(500).json({ error: error.message });
  }
});

// 4. Find deployments initiated by each account
app.get("/api/deployments/by-account", async (req, res) => {
  try {
    const result = await query(`
      SELECT
          source_account,
          COUNT(*) AS total_deployments,
          COUNT(*) FILTER (
              WHERE status = 'failure'
          ) AS failed_deployments
      FROM deployments
      GROUP BY source_account
      ORDER BY total_deployments DESC;
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching account deployments:", error);
    res.status(500).json({ error: error.message });
  }
});

// 5. Record a new deployment
app.post("/api/deployments", async (req, res) => {
  try {
    const {
      app: appName = "FlashFeast",
      environment = "production",
      version,
      status,
      duration_sec,
      failures_per_release = 0,
      success_rate,
      source_account
    } = req.body;

    if (!version || !status || !source_account) {
      return res.status(400).json({
        error: "Missing required fields: version, status, source_account"
      });
    }

    const insertQuery = `
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
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const result = await query(insertQuery, [
      appName,
      environment,
      version,
      status,
      duration_sec ?? null,
      failures_per_release,
      success_rate ?? null,
      source_account
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error recording deployment:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- Serve Static Frontend in Production ---
const distPath = path.resolve(__dirname, "../dist");
app.use(express.static(distPath));

// For SPA routing: serve index.html for all other unmatched requests
app.use((req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Start listening if run directly
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 FlashFeast Unified Server listening on http://0.0.0.0:${PORT}`);
    console.log(`📦 Serving React frontend from: ${distPath}`);
    console.log(`🔌 Neon Postgres connected via node-postgres pool`);
  });
}

export default app;
