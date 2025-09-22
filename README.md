# 🌍 EcoTrack -- Footprint Logger App

EcoTrack is a fullstack carbon footprint logger that allows users to
track, visualize, and compare their daily activities' CO₂ emissions.

------------------------------------------------------------------------

## 🚀 Getting Started

Follow these steps to run the project locally:

### 1. Clone the repository

``` bash
git clone https://github.com/khaya05/footprint-logger-02.git
cd footprint-logger-02
```

### 2. Install dependencies

Install client dependencies:

``` bash
cd client
npm install
```

Install server dependencies:

``` bash
cd ../server
npm install
```

### 3. Setup environment variables

Inside the **server** folder, create a `.env` file with the following
variables:

    NODE_ENV=development
    PORT=5000
    MONGO_URL=<your-mongodb-url>
    JWT_SECRET=secret
    JWT_EXPIRES_IN=1d

👉 For testing purposes, here is a ready-made mongo url `MONGO_URL=mongodb+srv://khaya05:Qn0NbKa0TfM3J3fX@cluster0.jjunxd4.mongodb.net/FOOTPRINT_LOGGER?retryWrites=true&w=majority&appName=Cluster0`.

------------------------------------------------------------------------

## 🔑 Test Accounts

Two users are available for quick testing:

-   **Tommy (lots of logged activities)**

    ``` json
    { "email": "tommy@email.com", "password": "pass1234" }
    ```

-   **Sally (few logged activities)**

    ``` json
    { "email": "sally@email.com", "password": "pass1234" }
    ```

⚠️ Please **do not change** the profile details (name or email) of the
test accounts.

You are encouraged to **create your own account** to explore the
registration and logging flow.

------------------------------------------------------------------------

## ▶️ Running the Application

From the root of the project:

``` bash
npm run dev
```

This will start both the server (Express + MongoDB) and client (React +
Vite) concurrently.

------------------------------------------------------------------------

## 📌 Notes for Testers

-   Use the provided test accounts to explore dashboards with preloaded
    data.\
-   Try creating your own account and logging activities.\
-   Please avoid updating or deleting the provided test accounts.
