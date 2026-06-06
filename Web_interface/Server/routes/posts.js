import express from "express";
import { createPost, deletePost, getPost, listPosts, updatePost } from "../controller/posts.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public
router.get("/", listPosts);
router.get("/:idOrSlug", getPost);

// Admin
router.post("/", requireAdmin, createPost);
router.patch("/:id", requireAdmin, updatePost);
router.delete("/:id", requireAdmin, deletePost);

export default router;
