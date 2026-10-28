# 🍛 FlashFeast (v1.0)

> Bringing your favorite meals to your doorstep, with a fully automated deployment behind it.

FlashFeast is a food delivery web app built with React and Vite. You can browse restaurants and dishes, build a cart, and place orders. The real point of the project is the deployment side: every push goes through an automated pipeline that tests the code, packages it in Docker, and ships it to a server on Google Cloud.

## What's Under the Hood

- **Frontend:** React (Vite)
- **Styling:** Tailwind CSS
- **Backend and data:** Firebase (Auth, Firestore, and Storage) for logins, menu data, and orders
- **Containers:** Docker, using a multi stage build (Node builds the app, Nginx serves it)
- **Hosting:** Google Cloud Platform, on a Compute Engine VM running Debian Linux
- **Automation:** GitHub Actions for CI/CD

## Features

- **Sign in:** Email or Google login
- **Menu browsing:** Smooth, easy to explore restaurants and dishes
- **Persistent cart:** Your cart stays put, even if you leave and come back
- **Live order status:** Order updates in real time through Firebase
- **Dark mode design:** A glassmorphism style look that works on phones and desktops

## How It Gets Deployed

Every push to a `version-*` branch kicks off a three stage pipeline:

1. **Test:** Installs dependencies and runs `npm test`. If tests fail, nothing else runs.
2. **Build and push:** Builds the Docker image and pushes it to Docker Hub, tagged with the branch name and the commit SHA.
3. **Deploy:** Logs in to Google Cloud with keyless authentication (Workload Identity Federation), connects to the VM with `gcloud compute ssh`, pulls the new image, replaces the running container, and cleans up old images.

Because every image is tagged with its commit SHA, each release is its own snapshot and nothing gets overwritten.

## Rolling Back

If a release breaks, you don't need to rebuild anything. Run an older image on the VM:

```bash
sudo docker stop app && sudo docker rm app
sudo docker run -d --restart unless-stopped --name app -p 80:3000 \
  <dockerhub-username>/food-delivery-app:<old-commit-sha>
```

## Running It Locally

1. **Clone the project:**
   ```bash
   git clone https://github.com/DEEPVINAY/FlashFeast.git
   cd FlashFeast
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up your environment:** Create a `.env` file and add your Firebase keys (see `.env.example`).

4. **Start it:**
   ```bash
   npm run dev
   ```

## Project Structure

```
FlashFeast/
├── .github/workflows/   # The CI/CD pipeline
├── src/                 # React components and logic
├── public/              # Icons and images
├── Dockerfile           # Multi stage build (Node, then Nginx)
├── nginx.conf           # Nginx config used in the container
├── package.json         # Project settings
└── README.md            # You are here
```

## What's Next (v2)

- **Payment gateway:** Stripe or Razorpay for real transactions
- **Live map tracking:** Watch your delivery driver move in real time
- **Restaurant dashboard:** A portal for kitchen staff to manage incoming orders
- **Backend API:** Node.js or Express, with Cloud SQL or Firestore behind it

---

Built by [Vinay](https://github.com/DEEPVINAY). Focused on cloud, containers, and good food.
