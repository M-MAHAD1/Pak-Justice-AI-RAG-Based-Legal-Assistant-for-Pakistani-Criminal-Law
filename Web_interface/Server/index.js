import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";
import contactRoutes from "./routes/contact.js";
import postsRoutes from "./routes/posts.js";

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 3000;

function getAllowedOrigins() {
    const raw = process.env.CORS_ORIGINS;
    if (!raw) return null;

    const parts = String(raw)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    return parts.length ? parts : null;
}

function getMongoUri() {
    const raw = process.env.DB_URL || process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!raw) return null;

    let uri = String(raw).trim();
    uri = uri.replace(/^['"]/, "");
    uri = uri.replace(/['"];?$/, "");
    uri = uri.trim();

    const isValidScheme = uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://");
    return isValidScheme ? uri : null;
}

const corsOptions = {
    origin: (origin, cb) => {
        // Allow non-browser tools (no Origin header)
        if (!origin) return cb(null, true);

        const envAllowed = getAllowedOrigins();
        if (envAllowed) {
            return cb(null, envAllowed.includes(origin));
        }

        const allowed = /^http:\/\/(localhost|127\.0\.0\.1):(5173|5174|5175|5176|5177|5178|5179)$/.test(origin);
        return cb(null, allowed);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoUri = getMongoUri();

if (mongoUri) {
    mongoose
        .connect(mongoUri)
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch((error) => {
            console.error("Error connecting to MongoDB", error);
        });
} else {
    console.warn("DB_URL is not set. Server will run without database connection.");
}

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/posts", postsRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

