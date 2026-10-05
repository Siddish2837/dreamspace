require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const workspaceRoutes = require("./routes/workspaceRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const dreamBuilderRoutes = require("./routes/dreamBuilderRoutes");

const { ensureWorkspacesSeeded } = require("./controllers/workspaceController");
const { ensureFeedbackSeeded } = require("./controllers/feedbackController");

const app = express();

// Database Connection
connectDB().then(async () => {
  await ensureWorkspacesSeeded();
  await ensureFeedbackSeeded();
}).catch((err) => {
  console.error("Database initialization warning:", err.message);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/workspaces", workspaceRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/dream-builders", dreamBuilderRoutes);

// Home / Health Route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "online",
    message: "DreamSpace API is running smoothly...",
    endpoints: {
      workspaces: "/workspaces",
      feedback: "/feedback",
      dreamBuilders: "/dream-builders",
    },
  });
});

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 DreamSpace Server running on port ${PORT}`);
});
