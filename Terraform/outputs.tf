output "service_name" {
  description = "Name of the Cloud Run service"
  value       = google_cloud_run_v2_service.flash_feast.name
}

output "service_url" {
  description = "Public HTTPS URL of the Cloud Run service"
  value       = google_cloud_run_v2_service.flash_feast.uri
}

output "service_location" {
  description = "GCP Region of the Cloud Run deployment"
  value       = google_cloud_run_v2_service.flash_feast.location
}