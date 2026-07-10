# 🙏 Prayer Wall — Church Prayer Network

A mobile-first web application where believers across churches and assemblies can unite in prayer, submit prayer requests, encourage one another through prayer participation, and celebrate answered prayers through shared testimonies.

---

## 📂 Project Structure

```
Prayer Wall/
├── backend/              # Node.js + Express + MongoDB API
│   ├── src/
│   │   ├── config/       # Database connection
│   │   ├── middleware/   # Auth & admin middleware
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API route handlers
│   │   ├── utils/        # Category seeder
│   │   └── server.js     # Entry point
│   ├── .env.example
│   └── package.json
├── frontend/             # React + Vite + Tailwind CSS v4
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # Auth context
│   │   ├── pages/        # Page components
│   │   ├── api.js        # API client
│   │   ├── App.jsx       # Root component
│   │   ├── index.css     # Design system
│   │   └── main.jsx      # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🚀 Prerequisites

1. **Node.js** (v18 or higher) — [Download here](https://nodejs.org/)
2. **MongoDB** — Either local installation or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier)
3. **Git** — [Download here](https://git-scm.com/)

---

## 🛠️ Local Development Setup

### Step 1: Install Node.js

Download and install from [https://nodejs.org/](https://nodejs.org/). Choose the LTS version. After installation, restart your terminal and verify:

```bash
node --version
npm --version
```

### Step 2: Clone & Install Dependencies

```bash
# Navigate to the project
cd "c:\Prayer Wall"

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 3: Set Up MongoDB

#### Option A: MongoDB Atlas (Recommended — Free Cloud Database)

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Click **"Build a Database"** → Choose **"M0 FREE"** → Pick a region close to you
4. Create a **Database User**:
   - Username: `prayerwall`
   - Password: (create a strong password, save it!)
5. Under **Network Access** → Click **"Add IP Address"** → **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
6. Go to **Database** → Click **"Connect"** → **"Drivers"**
7. Copy the connection string. It looks like:
   ```
   mongodb+srv://prayerwall:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
8. Replace `<password>` with your actual password and add the database name:
   ```
   mongodb+srv://prayerwall:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/prayer_wall?retryWrites=true&w=majority
   ```

#### Option B: Local MongoDB

Install MongoDB Community Server from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community). The connection string will be:
```
mongodb://localhost:27017/prayer_wall
```

### Step 4: Configure Environment Variables

```bash
cd backend
```

Edit the `.env` file:
```env
PORT=8080
MONGODB_URI=mongodb+srv://prayerwall:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/prayer_wall?retryWrites=true&w=majority
JWT_SECRET=generate-a-long-random-string-here-at-least-32-chars
GOOGLE_CLIENT_ID=
FRONTEND_URL=http://localhost:5173
```

### Step 5: Start the Backend

```bash
cd backend
npm run dev
```

You should see:
```
MongoDB Connected: cluster0-shard-00-xx.xxxxx.mongodb.net
Default categories seeded
🙏 Prayer Wall Backend running on port 8080
```

### Step 6: Configure & Start the Frontend

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:8080/api
```

Then start the frontend:
```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser!

---

## 🌐 Deployment Guide

### 1. Push to GitHub

First, create a GitHub repository:

```bash
cd "c:\Prayer Wall"
git init
git add .
git commit -m "Initial commit - Prayer Wall MVP"
```

Go to [https://github.com/new](https://github.com/new), create a repository named `prayer-wall`, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/prayer-wall.git
git branch -M main
git push -u origin main
```

---

### 2. Deploy Backend on Railway

1. Go to [https://railway.app](https://railway.app) and sign in with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your `prayer-wall` repository
4. In the service settings:
   - Set **Root Directory** to `backend`
   - Set **Start Command** to `npm start`
5. Go to **Variables** tab and add:

   | Variable | Value |
   |----------|-------|
   | `PORT` | `8080` |
   | `MONGODB_URI` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | A long random string (32+ characters) |
   | `GOOGLE_CLIENT_ID` | (leave empty for now) |
   | `FRONTEND_URL` | (add after Vercel deployment) |

6. Go to **Settings** → **Networking** → Click **"Generate Domain"**
7. Your backend URL will look like: `https://prayer-wall-backend-production.up.railway.app`
8. Test it by visiting: `https://YOUR-RAILWAY-URL.up.railway.app/` — you should see `{"status":"Prayer Wall Backend is running 🙏"}`

---

### 3. Deploy Frontend on Vercel

1. Go to [https://vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New"** → **"Project"**
3. Import your `prayer-wall` repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
5. Add **Environment Variables**:

   | Variable | Value |
   |----------|-------|
   | `VITE_API_URL` | `https://YOUR-RAILWAY-URL.up.railway.app/api` |

6. Click **"Deploy"**
7. Your frontend URL will look like: `https://prayer-wall.vercel.app`

---

### 4. Update CORS (Important!)

After deploying the frontend on Vercel, go back to Railway and update the `FRONTEND_URL` environment variable:

```
FRONTEND_URL=https://prayer-wall.vercel.app
```

Railway will auto-redeploy with the updated variable.

---

### 5. Create Your Admin Account

1. Visit your deployed frontend URL
2. Sign in with your email/name
3. Connect to your MongoDB database (via Atlas dashboard or MongoDB Compass)
4. Find your user in the `users` collection
5. Update the `role` field from `registered_user` to `admin`:

```javascript
// In MongoDB Atlas → Browse Collections → users
// Find your user document and update:
{ "role": "admin" }
```

Now when you log in, you'll see the Admin tab in the bottom navigation.

---

## 📱 Features

- ✅ **Splash Screen** — Bible verse, loading animation
- ✅ **Prayer Wall** — Browse active prayers, search, filter by Newest/Most Prayed/Oldest
- ✅ **I'm Praying** — Tap to show prayer support (one per user)
- ✅ **Post Prayer** — Submit prayer requests with name, category, and church
- ✅ **Anonymous Posting** — Option to hide your name
- ✅ **My Prayers** — Active and Answered tabs
- ✅ **Mark Answered** — With confirmation modal and 5-second undo toast
- ✅ **Testimonies** — Share and browse answered prayer stories
- ✅ **Admin Dashboard** — Stats, moderation, testimony approval
- ✅ **Mobile-first** — Premium design optimized for phones

---

## 🔑 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 6, Tailwind CSS v4, React Router v7 |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT tokens |
| Frontend Hosting | Vercel |
| Backend Hosting | Railway |
| Database Hosting | MongoDB Atlas |

---

## 📜 License

MIT
