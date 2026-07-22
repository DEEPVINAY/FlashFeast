variable "gcp_project_id" {
  description = "GCP project ID"
  type        = string
}

variable "gcp_region" {
  description = "Default GCP region for the provider"
  type        = string
  default     = "us-central1"
}

variable "gcp_zone" {
  description = "GCP zone to deploy the VM into"
  type        = string
  default     = "us-central1-a"
}

variable "region" {
  description = "Region for the reserved static IP"
  type        = string
  default     = "us-central1"
}

variable "vm_name" {
  description = "Base name for the VM and related resources"
  type        = string
  default     = "flash-feast"
}

variable "machine_type" {
  description = "Machine type for the VM"
  type        = string
  default     = "e2-medium"
}

variable "ssh_source_ranges" {
  description = "CIDR ranges allowed to SSH into the VM (restrict this to your own IP in production)"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}