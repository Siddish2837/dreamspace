# 🌌 DreamSpace

> **Every Great Idea Begins With A Great Workspace.**

DreamSpace is a full-stack web application for premium workspace inspiration and planning. Browse curated desk setups crafted for students, developers, creators, and productivity enthusiasts — then build your own dream workspace.

---

## ✨ Features

- 🖼️ **Workspace Gallery** — Browse curated setups across multiple categories (Student, Developer, Creator, Gamer, Minimal, Productivity)
- 🔍 **Workspace Details** — In-depth breakdown of each setup with accessories and specs
- 🛠️ **Dream Builder** — Interactively build and save your own custom workspace configuration
- 🎧 **Accessories Section** — Explore recommended peripherals and gear
- ⭐ **Reviews / Feedback** — Real user reviews and ratings, seeded from the database
- 🎬 **Cinematic Opening Screen** — Animated splash screen on first load

---

## 🗂️ Project Structure

```
dreamspace/
├── frontend/               # Static frontend (HTML, CSS, JS)
│   ├── index.html          # Main single-page application
│   ├── style.css           # Full styling with animations & glassmorphism
│   ├── script.js           # Frontend logic & API integration
│   └── images/             # Workspace & accessory images
│
└── backend/                # Node.js REST API
    ├── server.js            # Express app entry point
    ├── config/
    │   └── db.js            # MongoDB connection
    ├── models/              # Mongoose schemas
    ├── controllers/         # Route logic & DB seeding
    ├── routes/
    │   ├── workspaceRoutes.js
    │   ├── feedbackRoutes.js
    │   └── dreamBuilderRoutes.js
    └── middleware/
        └── errorHandler.js
```

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|--------------------------------------|
| Frontend   | HTML5, CSS3 (Vanilla), JavaScript    |
| Backend    | Node.js, Express.js v5               |
| Database   | MongoDB (via Mongoose v9)            |
| Other      | CORS, dotenv                         |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

### 1. Clone the repo
```bash
git clone https://github.com/Siddish2837/dreamspace.git
cd dreamspace
```

### 2. Setup the Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
MONGO_URI=your_mongodb_connection_string
PORT=3000
```

### 3. Run the Backend Server
```bash
npm run dev
```
The API will start at `http://localhost:3000`

### 4. Open the Frontend
Open `frontend/index.html` directly in your browser, or serve it via the backend (if configured as static).

---

## 📡 API Endpoints

| Method | Endpoint              | Description                        |
|--------|-----------------------|------------------------------------|
| GET    | `/`                   | Health check                       |
| GET    | `/workspaces`         | Get all workspace setups           |
| GET    | `/workspaces/:id`     | Get a single workspace             |
| GET    | `/feedback`           | Get all reviews                    |
| POST   | `/feedback`           | Submit a new review                |
| GET    | `/dream-builders`     | Get saved dream builder configs    |
| POST   | `/dream-builders`     | Save a new dream builder config    |

---

## 📸 Screenshots

> Coming soon — the app features a cinematic opening screen, a dark-themed gallery with glassmorphism cards, and a fully interactive Dream Builder tool.

---

## 📄 License

This project is licensed under the **ISC License**.

---

<p align="center">Built with ❤️ by <a href="https://github.com/Siddish2837">Siddish2837</a></p>
