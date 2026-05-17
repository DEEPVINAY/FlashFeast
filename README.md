# FlashFeast Version-01
Flash Feast is a responsive food delivery web application built using React and Vite, offering users a seamless experience to browse food items and place orders. The project follows modern DevOps practices including Docker containerization and CI/CD automation, enabling fast and consistent deployments.

## ⚙️ Running it Locally

Want to see how it works on your machine? Follow these steps:

1.  **Clone the project:**
    ```bash
    git clone [https://github.com/DEEPVINAY/FlashFeast.git](https://github.com/DEEPVINAY/FlashFeast.git)
    cd flashfeast
    ```

2.  **Install everything:**
    ```bash
    npm install
    ```

3.  **Set up your environment:**
    Create a `.env` file and add your Firebase keys (see `.env.example`).

4.  **Launch:**
    ```bash
    npm run dev
    ```

---

## 🛤 What's Next? (v2)

While Version 1 covers the essentials, here is what we are looking at for the next release:
*   **Payment Gateway:** Integrating Stripe or Razorpay for real transactions.
*   **Live Map Tracking:** Watching your delivery driver move in real-time.
*   **Restaurant Dashboard:** A dedicated portal for kitchen staff to manage incoming orders.

---

**Developed by [Vinay](https://github.com/DEEPVINAY)**
*Focusing on cloud, containers, and great food.*# 🍕 FlashFeast (v1.0)
> **Bringing your favorite meals to your doorstep with cloud-speed efficiency.**

FlashFeast is a streamlined food delivery web application built to demonstrate a modern, automated deployment pipeline. This project serves as a practical showcase of how a React application moves from a local development environment to a containerized production server on Google Cloud[cite: 2].

---

## 🌐 Live Demo
The application is currently hosted and accessible at:
👉 **[http://34.93.58.31/](http://34.93.58.31/)**[cite: 2]
# Proof of Evidence of Whole Web application
---

## 🛠 What's Under the Hood?

We used a modern stack to ensure the app is fast, responsive, and easy to manage[cite: 1, 2]:

*   **Frontend:** React (Vite) & TypeScript for a snappy user interface[cite: 1, 2].
*   **Styling:** Tailwind CSS for a clean, modern look[cite: 1].
*   **Backend & Data:** Firebase (Auth, Firestore, and Storage) handling everything from user logins to menu data[cite: 1, 2].
*   **Containerization:** Docker to package the app so it runs the same way everywhere[cite: 2].
*   **Cloud Hosting:** Google Cloud Platform (GCP) running on a Debian Linux VM[cite: 2].
*   **Automation:** GitHub Actions for our CI/CD pipeline[cite: 2].

---

## ✨ Key Features (v1)

*   **Smart Authentication:** Users can sign in securely using Email or Google[cite: 1, 2].
*   **Menu Browsing:** A smooth, interactive interface to explore restaurants and dishes[cite: 1, 2].
*   **Persistent Cart:** Add items and manage your order without losing progress[cite: 1, 2].
*   **Real-Time Updates:** Live order status tracking powered by Firebase[cite: 1, 2].
*   **Modern Design:** A "Glassmorphism" inspired dark mode that looks great on mobile and desktop[cite: 1].

---

## 🚀 The Deployment Journey

This project isn't just about the code; it's about the process[cite: 2]:



1.  **Code & Push:** Changes are pushed to GitHub.
2.  **Automated Build:** GitHub Actions automatically triggers a Docker build[cite: 2].
3.  **Docker Hub:** The new image is tagged with a unique commit SHA and pushed to the registry[cite: 2].
4.  **Cloud Sync:** The pipeline securely SSHes into our Google Cloud VM, pulls the fresh image, and restarts the container[cite: 2].

---

##📂 Project Structure
```bash
FlashFeast/
├── .github/workflows/   # The "brain" of our automation pipeline
├── src/                 # All React components and logic
├── public/              # Icons and images
├── Dockerfile           # Instructions for packaging the app
├── package.json         # Project settings
└── README.md            # You are here!

## Future Enhancements
1. User Authentication (Firebase Auth)
2. Backend (Node.js or Express)
3. Database (Cloud Sql or Firestore)
4. Responsive UI/UX (Tailwind CSS)
5. Payement Gateway (Razorpay)