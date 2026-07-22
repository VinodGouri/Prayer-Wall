# 🙏 Prayer Wall — Sacred Stillness

A vibrant, mobile-first web application where believers across churches and assemblies unite in communal prayer, submit prayer requests, track prayer participation, celebrate answered prayers through shared testimonies, and manage community moderation.

---

## 🏗️ System Architecture

The application is built using a decoupled **Client-Server-Database Architecture** tailored for high performance, mobile responsiveness, and fluid real-time interactions.

```mermaid
graph TD
    subgraph Client Tier ["Client Tier (Frontend)"]
        React["React (Vite)"]
        FM["Framer Motion Engine"]
        Context["Auth & Language Context"]
        Theme["Light/Dark Mode Theme Manager"]
        GoogleOAuth["Google OAuth 2.0 Client"]
    end

    subgraph Application Tier ["Application Tier (Backend API)"]
        Express["Express.js Server"]
        AuthMW["JWT Auth Middleware"]
        AdminMW["Admin Role Guard"]
        Routes["REST API Routes (/api/prayers, /api/testimonies, /api/auth)"]
    end

    subgraph Data Tier ["Data Tier (Persistence)"]
        MongoDB[("MongoDB Atlas Database")]
        Models["Mongoose ODM Models (User, Prayer, Testimony)"]
    end

    subgraph External Services ["External Services"]
        GTranslate["Google Translation API"]
        GVendor["Google Auth Identity Provider"]
    end

    React -->|HTTP / REST API| Routes
    React -->|Direct Translation Requests| GTranslate
    GoogleOAuth -->|Token Exchange| GVendor
    Routes --> AuthMW
    Routes --> AdminMW
    AuthMW --> Models
    AdminMW --> Models
    Models --> MongoDB
```

---

## 🔄 Core Data Flow & System Design

```mermaid
sequenceDiagram
    autonumber
    actor User as Believer / Guest
    participant FE as React Frontend
    participant BE as Express API
    participant DB as MongoDB Atlas

    %% Prayer Posting Flow
    rect rgb(238, 242, 255)
    Note over User, DB: 1. Prayer Request Submission & Guest Local Tracking
    User->>FE: Fill Prayer Form (Category, Request, Assembly)
    FE->>BE: POST /api/prayers
    BE->>DB: Save Prayer Document
    DB-->>BE: Saved Prayer Record
    BE-->>FE: Return Created Prayer
    FE->>FE: Store ID in localStorage (if Guest)
    end

    %% Prayer Support Flow
    rect rgb(254, 243, 199)
    Note over User, DB: 2. "I'm Praying" Atomic Support Flow
    User->>FE: Click "I'm Praying"
    FE->>FE: Trigger Heart Burst Animation & Lock Button State
    FE->>BE: POST /api/prayers/:id/pray
    BE->>DB: $inc prayerCount & record userId
    DB-->>BE: Updated Counter
    BE-->>FE: Success Response
    end

    %% Answered Prayer & Undo Flow
    rect rgb(236, 253, 245)
    Note over User, DB: 3. Answered Prayer & 5-Second Undo Toast
    User->>FE: Mark as Answered
    FE->>FE: Show Celebration Glow & Start 5s Countdown Toast
    FE->>BE: PUT /api/prayers/:id/answered
    BE->>DB: Update status to 'answered' & set answeredAt
    User->>FE: Click "Undo" (within 5 seconds)
    FE->>BE: PUT /api/prayers/:id/undo-answered
    BE->>DB: Revert status to 'active'
    end
```

---

## 📂 Project Structure

```text
Prayer-Wall/
├── backend/                        # Node.js + Express + MongoDB Backend Server
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # MongoDB Atlas Mongoose connection setup
│   │   ├── middleware/
│   │   │   ├── auth.js             # JWT authentication & guest request validation
│   │   │   └── admin.js            # Admin role authorization guard
│   │   ├── models/
│   │   │   ├── User.js             # User account schema (Auth, Google ID, Admin flag)
│   │   │   ├── Prayer.js           # Prayer request schema (Category, Assembly, Count, Status)
│   │   │   └── Testimony.js        # Answered prayer testimony schema (Approval status)
│   │   ├── routes/
│   │   │   ├── auth.js             # Sign in, register, Google OAuth, password endpoints
│   │   │   ├── prayers.js          # Prayer CRUD, "I'm Praying", Mark Answered endpoints
│   │   │   ├── testimonies.js     # Public testimonies & submission endpoints
│   │   │   └── admin.js            # Admin stats, testimony approval & moderation routes
│   │   ├── utils/
│   │   │   └── seeder.js           # Database initialization & default categories
│   │   └── server.js               # Express application entry point
│   ├── .env.example                # Backend environment variable template
│   └── package.json                # Node backend dependencies
│
├── frontend/                       # React + Vite + Framer Motion Frontend App
│   ├── public/                     # Static assets & favicon
│   ├── src/
│   │   ├── components/             # Reusable UI presentation components
│   │   │   ├── BottomNav.jsx       # Sliding indicator bottom navigation bar
│   │   │   ├── ConfirmModal.jsx    # Glassmorphic celebratory confirmation modal
│   │   │   ├── PrayerCard.jsx      # Prayer card with category colors & heart burst
│   │   │   ├── SearchOverlay.jsx   # Animated full-screen search modal
│   │   │   ├── SkeletonLoader.jsx  # Pulse skeleton loaders for loading states
│   │   │   ├── TestimonyCard.jsx   # Celebratory gold testimony card
│   │   │   ├── TopHeader.jsx       # Header with Theme (Dark/Light) & Language toggles
│   │   │   └── UndoToast.jsx       # Toast with 5-second countdown progress bar
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # User authentication, token & guest session provider
│   │   │   └── LanguageContext.jsx # English / Telugu translation dictionary provider
│   │   ├── pages/                  # Route views
│   │   │   ├── AdminDashboard.jsx  # Admin stats count-up & testimony moderation feed
│   │   │   ├── CelebratePage.jsx   # Sacred Stories testimony celebration feed
│   │   │   ├── ChangePasswordPage.jsx # User security & password reset view
│   │   │   ├── LoginPage.jsx       # Auth view with Google Login & tab switcher
│   │   │   ├── MyPrayersPage.jsx   # User active/answered prayer management
│   │   │   ├── OnboardingPage.jsx  # Church assembly onboarding configuration
│   │   │   ├── PostPrayerPage.jsx  # Prayer request submission with category picker
│   │   │   ├── PrayerWallPage.jsx  # Main Prayer Wall feed with sort & filter chips
│   │   │   └── SplashScreen.jsx    # Animated sunrise splash screen with verse
│   │   ├── api.js                  # Axios/Fetch API client wrapper for backend routes
│   │   ├── App.jsx                 # Main React router container with Framer Motion transitions
│   │   ├── index.css               # Design system, CSS tokens, dark mode & mesh gradients
│   │   └── main.jsx                # React application entry point
│   ├── index.html                  # HTML template with Google Fonts imports
│   ├── vite.config.js              # Vite build tool setup & Tailwind CSS v4 plugin
│   └── package.json                # Frontend React dependencies
│
└── README.md                       # Comprehensive documentation
```

---

## ⚙️ Key Technical Specifications

| Layer | Technologies & Design Decisions |
| :--- | :--- |
| **Frontend Framework** | React 19, Vite 6 |
| **Styling & Theme** | Tailwind CSS v4, Vanilla CSS Design System, Glassmorphic UI, Dark/Light Mode, Sunset Mesh Gradients |
| **Animations** | Framer Motion (Page route transitions, sliding tab pills, heart burst particles, countdown toast) |
| **State & Auth** | React Context API, Google OAuth 2.0 (`@react-oauth/google`), JWT Bearer Tokens, LocalStorage persistence for Guests |
| **Backend API** | Node.js, Express.js REST API, CORS security, JWT Auth Middleware |
| **Database** | MongoDB Atlas, Mongoose ODM Schema validation, Atomic updates (`$inc`, `$addToSet`) |
| **Multi-Language** | Dynamic English / Telugu dictionary crossfade, Google Translate Client Bridge for requests |
