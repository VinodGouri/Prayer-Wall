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

Now when you log in, you'll see the Admin tab in the bottom navigation.


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
