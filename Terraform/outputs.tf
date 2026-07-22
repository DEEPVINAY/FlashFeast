output "vm_name" {
  description = "Name of the created VM instance"
  value       = google_compute_instance.flash_feast.name
}

output "vm_external_ip" {
  description = "Reserved static external IP address of the VM"
  value       = google_compute_address.flash_feast_ip.address
}

output "vm_internal_ip" {
  description = "Internal (private) IP address of the VM"
  value       = google_compute_instance.flash_feast.network_interface[0].network_ip
}

output "vm_self_link" {
  description = "Self link (fully qualified resource URL) of the VM instance"
  value       = google_compute_instance.flash_feast.self_link
}

output "vm_zone" {
  description = "Zone the VM was deployed into"
  value       = google_compute_instance.flash_feast.zone
}

output "ssh_command" {
  description = "Convenience gcloud command to SSH into the VM"
  value       = "gcloud compute ssh ${google_compute_instance.flash_feast.name} --zone=${google_compute_instance.flash_feast.zone} --project=${var.gcp_project_id}"
}