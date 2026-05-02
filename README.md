# FlashFeast
Flash Feast is a responsive food delivery web application built using React and Vite, offering users a seamless experience to browse food items and place orders. The project follows modern DevOps practices including Docker containerization and CI/CD automation, enabling fast and consistent deployments.

FlashFeast Food Delivery Deployment

A production-style CI/CD pipeline for deploying a React (Vite) application using Docker, GitHub Actions, and Google Cloud Platform.

📌 Project Overview

This project demonstrates a complete DevOps workflow that automates build, containerization, and deployment processes. Every code push triggers an automated pipeline that deploys the latest version of the application to a live VM.

🏗 Architecture
Git Push → GitHub Actions → Build → Docker → Docker Hub → SSH → VM → Live App
⚙️ Tech Stack
React (Vite)
Docker
GitHub Actions
Google Cloud Compute Engine
Debian/Linux
🔐 Security Improvements
Before
Password-based authentication ❌
After
SSH Key-based authentication ✅
ssh -i ~/.ssh/gcp_key
📦 Deployment Versioning Upgrade
Before
latest (overwrites)
After
commit SHA (immutable versions)
${{ github.sha }}

👉 Enables safe rollback

⚙️ Final CI/CD Pipeline
name: CI pipeline

on:
  push:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 18

      - run: npm install
      - run: npm run build

      - run: docker build -t food-delivery-app .

      - run: echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin

      - run: |
          docker tag food-delivery-app ${{ secrets.DOCKER_USERNAME }}/food-delivery-app:latest
          docker tag food-delivery-app ${{ secrets.DOCKER_USERNAME }}/food-delivery-app:${{ github.sha }}

          docker push ${{ secrets.DOCKER_USERNAME }}/food-delivery-app:latest
          docker push ${{ secrets.DOCKER_USERNAME }}/food-delivery-app:${{ github.sha }}

      - run: |
          mkdir -p ~/.ssh
          cat <<EOF > ~/.ssh/gcp_key
${{ secrets.SSH_KEY }}
EOF
          chmod 600 ~/.ssh/gcp_key

      - run: |
          ssh -i ~/.ssh/gcp_key -o StrictHostKeyChecking=no ${{ secrets.VM_USER }}@${{ secrets.VM_IP }} << 'EOF'
            docker pull ${{ secrets.DOCKER_USERNAME }}/food-delivery-app:${{ github.sha }}

            docker stop app || true
            docker rm app || true

            docker image prune -f

            docker run -d -p 80:3000 --name app \
            ${{ secrets.DOCKER_USERNAME }}/food-delivery-app:${{ github.sha }}
          EOF
🧠 Lessons Learned
SSH keys are essential for secure automation
Docker ensures environment consistency
Versioning is critical for rollback
CI/CD debugging requires step-by-step isolation
Small misconfigurations can break entire pipelines
🔁 Rollback Example
docker run deepvinay/food-delivery-app:<old-sha>
🎯 Outcome
Automated deployment pipeline
Secure infrastructure
Version-controlled releases
Instant rollback capability
