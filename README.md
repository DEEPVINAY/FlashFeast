# FlashFeast
Flash Feast is a responsive food delivery web application built using React and Vite, offering users a seamless experience to browse food items and place orders. The project follows modern DevOps practices including Docker containerization and CI/CD automation, enabling fast and consistent deployments.

FlashFeast Food Delivery Deployment

A production-style CI/CD pipeline for deploying a React (Vite) application using Docker, GitHub Actions, and Google Cloud Platform.

📌 Project Overview

This project demonstrates a complete DevOps workflow that automates build, containerization, and deployment processes. Every code push triggers an automated pipeline that deploys the latest version of the application to a live VM.

This project is not just about UI — it showcases how modern applications are built, shipped, and deployed automatically.

🏗️ Architecture
Git Push → GitHub Actions → Build → Docker → Docker Hub → SSH → VM → Live App
Flow Explanation
Developer pushes code to GitHub
GitHub Actions triggers CI pipeline
Application is built and containerized using Docker
Docker image is pushed to Docker Hub
SSH connection is established to GCP VM
Latest container is deployed on the VM
Application goes live
🧱 Project Lifecycle
🧪 Building Stage (Local Setup)
1. Clone Repository
git clone [https://github.com/DEEPVINAY/FlashFeast.git]
cd flashfeast
2. Install Dependencies
npm install
3. Run Development Server
npm run dev

App runs on:

http://localhost:5173
4. Production Build
npm run build

Outputs optimized files into:

dist/
▶️ Running Stage (Execution & Deployment)
1. Preview Production Build
npm run preview
2. Docker Deployment
Build Image
docker build -t flashfeast-app .
Run Container
docker run -d -p 3000:80 flashfeast-app
3. Verify Application

Open:

http://localhost:3000
⚙️ Tech Stack
Frontend: React (Vite)
Containerization: Docker
CI/CD: GitHub Actions
Cloud: Google Cloud Compute Engine
OS: Ubuntu 26 LTS
🔐 Security Improvements
Before ❌
Password-based SSH authentication
Manual deployments
After ✅
SSH Key-based authentication
Secure automated deployments
ssh -i ~/.ssh/gcp_key user@vm-ip
📦 Deployment Versioning Upgrade
Before ❌
Used latest tag (overwrites previous builds)
After ✅
Uses commit SHA-based versioning
${{ github.sha }}
Why this matters
Each deployment is immutable
Enables precise rollback
Eliminates ambiguity in releases
⚙️ CI/CD Pipeline
name: CI pipeline

on:
  push:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: 20

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
🔁 Rollback Strategy

If a deployment fails, rollback is instant:

docker run deepvinay/food-delivery-app:<old-sha>

No rebuild required. Just redeploy a previous image.

🧠 Lessons Learned
SSH keys are mandatory for secure automation
Docker guarantees environment consistency
Versioning is critical for safe deployments
CI/CD debugging requires isolating each step
Small misconfigurations can break entire pipelines
🎯 Outcome
Fully automated deployment pipeline
Secure cloud infrastructure
Version-controlled releases
Instant rollback capability
Real-world DevOps workflow implementation
🧭 Architecture (Application Level)
User → React Frontend → (Future API Layer) → Backend → Database
Currently frontend-driven
Designed to scale into full-stack architecture
Ready for backend integration
📦 Project Structure
FlashFeast/
│── src/
│   ├── assets/
│   ├── components/
│   ├── main.jsx
│
│── .github/workflows/
│   └── ci.yaml
│
│── dockerfile
│── index.html
│── package.json
🔮 Future Enhancements
UI Upgrades
Authentication Animation 
Hosting it on Google cloud Vm instance IP
📌 Final Note

FlashFeast is built as a DevOps-first project, demonstrating how modern applications move from code → container → cloud → production with minimal manual intervention.
