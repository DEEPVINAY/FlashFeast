terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

# Enable Cloud Run API
resource "google_project_service" "cloud_run_api" {
  service                    = "run.googleapis.com"
  disable_dependent_services = false
  disable_on_destroy         = false
}

# Cloud Run Service (v2)
resource "google_cloud_run_v2_service" "flash_feast" {
  name     = var.service_name
  location = var.gcp_region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    scaling {
      min_instance_count = 0  # Scale to zero when idle ($0 idle cost)
      max_instance_count = 10 # Scale dynamically up to 10 instances
    }

    containers {
      image = var.container_image

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }

      ports {
        container_port = 8080
      }

      env {
        name  = "NODE_ENV"
        value = "production"
      }

      dynamic "env" {
        for_each = var.database_url != "" ? [var.database_url] : []
        content {
          name  = "DATABASE_URL"
          value = env.value
        }
      }
    }
  }

  depends_on = [google_project_service.cloud_run_api]
}

# Allow public unauthenticated access
resource "google_cloud_run_v2_service_iam_member" "public_access" {
  project  = google_cloud_run_v2_service.flash_feast.project
  location = google_cloud_run_v2_service.flash_feast.location
  name     = google_cloud_run_v2_service.flash_feast.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}