import express from "express";
import { createServer } from "http";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import multer from "multer";
import { Server } from "socket.io";
import "dotenv/config";

import { assertDbConnection } from "./connect.js";
import { initSocket } from "./socket.js";
import { authRequired } from "./middleware/authRequired.js";
import { notFound, errorHandler, ApiError } from "./middleware/errorHandler.js";

import authRoutes from "./routes/auth.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import postRoutes from "./routes/posts.js";
import usersRoutes from "./routes/users.js";
import relationshipRoutes from "./routes/relationships.js";
import storiesRoutes from "./routes/stories.js";
import notificationRoutes from "./routes/notifications.js";
import messageRoutes from "./routes/messages.js";

const app = express();
const server = createServer(app);
const PORT = Number(process.env.PORT || 8800);
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

if (!process.env.JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in environment.");
}

// ---- Security & core middleware ----
app.use(
  helmet({
    // Allow the frontend (different origin) to load images served from /uploads.
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Basic rate limiting. Auth routes get a stricter limit to slow brute force.
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500, standardHeaders: true, legacyHeaders: false });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false });
app.use("/api", apiLimiter);

// ---- Static files ----
app.use("/uploads", express.static("../frontend/public/uploads"));
app.use("/default", express.static("../frontend/public/default"));

// ---- File uploads (images/videos only, 10MB cap) ----
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "../frontend/public/uploads/posts"),
  filename: (_req, file, cb) => cb(null, Date.now() + file.originalname),
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^(image|video)\//.test(file.mimetype)) return cb(null, true);
    cb(new ApiError(400, "Only image and video files are allowed."));
  },
});

app.post("/api/upload", authRequired, upload.single("file"), (req, res) => {
  if (!req.file) throw new ApiError(400, "No file uploaded.");
  res.status(200).json(req.file.filename);
});

// ---- Routes ----
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/relationships", relationshipRoutes);
app.use("/api/stories", storiesRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

// ---- Socket.IO ----
const io = new Server(server, { cors: { origin: CLIENT_URL, credentials: true } });
initSocket(io);

io.on("connection", (socket) => {
  socket.on("notification:join", (userId) => {
    if (userId) socket.join(`user:${userId}`);
  });
  socket.on("notification:leave", (userId) => {
    if (userId) socket.leave(`user:${userId}`);
  });
});

// ---- Error handling (must be last) ----
app.use(notFound);
app.use(errorHandler);

// ---- Startup ----
assertDbConnection()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`MyDevify Social API is running on port ${PORT}`);
    });
  })
  .catch(() => {
    console.error("Server not started because the database is unreachable.");
    process.exit(1);
  });
