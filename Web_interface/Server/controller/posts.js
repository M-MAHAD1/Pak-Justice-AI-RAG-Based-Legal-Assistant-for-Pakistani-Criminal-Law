import mongoose from "mongoose";
import Post from "../models/post.model.js";

function slugify(text) {
  return String(text ?? "")
    .toLowerCase()
    .trim()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function ensureUniqueSlug(baseSlug, excludeId = null) {
  const base = baseSlug || "post";

  // Fast path.
  const existing = await Post.findOne({
    slug: base,
    ...(excludeId ? { _id: { $ne: excludeId } } : {}),
  }).select("_id");
  if (!existing) return base;

  for (let i = 1; i <= 50; i += 1) {
    const candidate = `${base}-${i}`;
    const hit = await Post.findOne({
      slug: candidate,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    }).select("_id");
    if (!hit) return candidate;
  }

  // Last resort: timestamp suffix.
  return `${base}-${Date.now()}`;
}

export const listPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    return res.status(200).json({ posts });
  } catch {
    return res.status(500).json({ message: "Failed to load posts" });
  }
};

export const getPost = async (req, res) => {
  try {
    const { idOrSlug } = req.params ?? {};
    const value = String(idOrSlug ?? "").trim();
    if (!value) return res.status(400).json({ message: "Missing post id/slug" });

    let post = null;
    if (mongoose.isValidObjectId(value)) {
      post = await Post.findById(value);
    }
    if (!post) {
      post = await Post.findOne({ slug: value.toLowerCase() });
    }

    if (!post) return res.status(404).json({ message: "Post not found" });
    return res.status(200).json({ post });
  } catch {
    return res.status(500).json({ message: "Failed to load post" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, summary, content, slug } = req.body ?? {};
    const normalizedTitle = String(title ?? "").trim();
    const normalizedSummary = String(summary ?? "").trim();
    const normalizedContent = String(content ?? "").trim();

    if (!normalizedTitle || !normalizedSummary || !normalizedContent) {
      return res.status(400).json({ message: "title, summary, and content are required" });
    }

    const baseSlug = slugify(slug || normalizedTitle) || "post";
    const uniqueSlug = await ensureUniqueSlug(baseSlug);

    const post = await Post.create({
      title: normalizedTitle,
      slug: uniqueSlug,
      summary: normalizedSummary,
      content: normalizedContent,
    });

    return res.status(201).json({ post });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: "A post with this slug already exists" });
    }
    return res.status(500).json({ message: "Failed to create post" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params ?? {};
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const existing = await Post.findById(id);
    if (!existing) return res.status(404).json({ message: "Post not found" });

    const { title, summary, content, slug } = req.body ?? {};

    if (title != null) existing.title = String(title).trim();
    if (summary != null) existing.summary = String(summary).trim();
    if (content != null) existing.content = String(content).trim();

    // If the title/slug changes, update slug.
    const wantsSlug = slug != null ? String(slug).trim() : "";
    const nextBaseSlug = slugify(wantsSlug || existing.title) || "post";

    // Only recompute if caller changed title or provided slug explicitly.
    const shouldRecomputeSlug = slug != null || title != null;
    if (shouldRecomputeSlug) {
      existing.slug = await ensureUniqueSlug(nextBaseSlug, existing._id);
    }

    await existing.save();
    return res.status(200).json({ post: existing });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: "A post with this slug already exists" });
    }
    return res.status(500).json({ message: "Failed to update post" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params ?? {};
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const deleted = await Post.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Post not found" });
    return res.status(200).json({ message: "Post deleted" });
  } catch {
    return res.status(500).json({ message: "Failed to delete post" });
  }
};
