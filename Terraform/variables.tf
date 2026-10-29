variable "gcp_project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "gcp_region" {
  description = "GCP Region for Cloud Run"
  type        = string
  default     = "asia-south1"
}

variable "service_name" {
  description = "Name of the Cloud Run service"
  type        = string
  default     = "flash-feast"
}

variable "container_image" {
  description = "Docker image to deploy on Cloud Run"
  type        = string
  default     = "gcr.io/cloudrun/hello" # Placeholder until first CI/CD push
}

variable "database_url" {
  description = "Neon PostgreSQL DATABASE_URL connection string"
  type        = string
  sensitive   = true
  default     = ""
}