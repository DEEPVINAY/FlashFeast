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
  zone    = var.gcp_zone
}
# Reserved static external IP
resource "google_compute_address" "flash_feast_ip" {
  name   = "${var.vm_name}-ip"
  region = var.gcp_region
}
# Firewall: allow HTTP/HTTPS from anywhere
resource "google_compute_firewall" "allow_http_https" {
  name    = "${var.vm_name}-allow-web"
  network = "default"
  allow {
    protocol = "tcp"
    ports    = ["80", "443"]
  }
  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["flash-feast"]
}
# Firewall: allow SSH (restrict source_ranges to your own IP in production)
resource "google_compute_firewall" "allow_ssh" {
  name    = "${var.vm_name}-allow-ssh"
  network = "default"
  allow {
    protocol = "tcp"
    ports    = ["22"]
  }
  source_ranges = var.ssh_source_ranges
  target_tags   = ["flash-feast"]
}
resource "google_compute_instance" "flash_feast" {
  name         = var.vm_name
  machine_type = var.machine_type
  zone         = var.gcp_zone
  tags         = ["flash-feast"]
  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2204-lts"
      type  = "pd-standard"
      size  = 10
    }
  }
  network_interface {
    network = "default"
    access_config {
      nat_ip = google_compute_address.flash_feast_ip.address
    }
  }

  metadata_startup_script = <<-EOF
    #!/bin/bash
    set -e

    # Update package index and install prerequisites
    apt-get update
    apt-get install -y ca-certificates curl gnupg

    # Add Docker's official GPG key
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    chmod a+r /etc/apt/keyrings/docker.asc

    # Add the Docker repository
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null

    # Install Docker
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    # Enable and start Docker
    systemctl enable docker
    systemctl start docker

    # Let the default GCP user run docker without sudo
    usermod -aG docker $(logname 2>/dev/null || echo ubuntu) || true
  EOF
}