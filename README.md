# 🍛 FlashFeast (v1.0) — Cloud Run & Neon PostgreSQL Edition

Bringing your favorite meals to your doorstep, powered by **Google Cloud Run**, **Neon Serverless PostgreSQL**, and a fully automated **GitHub Actions CI/CD** pipeline.

---

## 🏗️ Architecture Overview

FlashFeast uses a unified serverless architecture:
* **Frontend:** React 19 + Vite 7, featuring glassmorphism dark-mode UI and interactive particle canvas animations.
* **Backend:** Unified Node.js & Express server serving both REST API endpoints and the compiled React SPA.
* **Database:** **Neon Serverless PostgreSQL** for DevOps deployment metrics, tracking, and analytics.
* **Platform Auth/Orders:** Firebase for authentication and real-time client state.
* **Hosting:** **Google Cloud Run** with automatic scale-to-zero ($0 idle cost) and horizontal scaling.
* **Infrastructure as Code:** **Terraform** managing the Cloud Run service, public IAM invoker role, and container specs.
* **CI/CD:** **GitHub Actions** with Workload Identity Federation (keyless OIDC authentication), automated Docker Hub builds, zero-downtime Cloud Run deployments, and live database deployment recording.

---

## 🚀 How CI/CD Works (GitHub Actions ➔ Cloud Run)

Every push to `main` or a `version-*` branch executes an automated four-stage pipeline in [`.github/workflows/ci.yaml`](.github/workflows/ci.yaml):

1. **Test:** Installs dependencies and runs automated test suites.
2. **Build & Push:** Uses Docker Buildx to build the unified multi-stage container and publishes images to Docker Hub tagged with both the branch name and the commit SHA.
3. **Deploy to Cloud Run:** 
   * Authenticates keylessly to Google Cloud using **Workload Identity Federation**.
   * Executes `gcloud run deploy` to roll out a new revision with zero downtime.
   * Injects the `DATABASE_URL` secret.
4. **Record Deployment to Neon Postgres:** Automatically records deployment status, duration, version, commit, and author into the Neon `deployments` table.

---

## 🗄️ Neon PostgreSQL Schema & API

* **Schema & Migrations:** Located in [`db/schema.sql`](db/schema.sql) and executed via `npm run migrate`.
* **API Endpoints:**
  * `GET /api/health` — Database and server health check
  * `GET /api/deployments` — Deployment history with timestamps
  * `GET /api/deployments/failures` — Filter failed deployment records
  * `GET /api/deployments/stats` — Calculated deployment success rate by app and environment
  * `GET /api/deployments/by-account` — Deployments grouped by trigger account
  * `POST /api/deployments` — Ingest new deployment records

---

## 🛠️ Infrastructure with Terraform

The serverless environment is provisioned via [Terraform/](Terraform):

```bash
cd Terraform
terraform init
terraform apply -var="gcp_project_id=<your-project-id>" -var="database_url=<your-neon-database-url>"
```

Resources created:
* `google_cloud_run_v2_service` with min instances = 0 (scale-to-zero) and max instances = 10.
* `google_cloud_run_v2_service_iam_member` allowing public web access (`roles/run.invoker` for `allUsers`).

---

## 💻 Running Locally

1. **Clone & Install Dependencies:**
   ```bash
   git clone https://github.com/DEEPVINAY/FlashFeast.git
   cd FlashFeast
   npm install
   ```

2. **Configure Environment:**
   Run `neon deploy` or pull environment variables into `.env.local` / `.env`:
   ```bash
   DATABASE_URL="postgresql://neondb_owner:***@ep-***-pooler.***.neon.tech/neondb?sslmode=require"
   ```

3. **Run Migrations:**
   ```bash
   npm run migrate
   ```

4. **Build & Start Server:**
   ```bash
   npm run build
   npm start
   ```
   Open `http://localhost:3000` to view the application.
