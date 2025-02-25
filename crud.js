const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  author: { type: String, default: 'Anonymous' },
  createdAt: { type: Date, default: Date.now }
});

const Blog = mongoose.model('Blog', BlogSchema);

router.post("/blogs", async (req, res) => {
    try {
        const { title, body, author } = req.body;
        if (!title || !body) return res.status(400).json({ error: "Title and Body are required" });
        const newBlog = new Blog({ title, body, author: author?.trim() || "Anonymous" });
        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (error) {
        res.status(500).json({ error: "Error creating blog post" });
    }
});

router.get("/blogs", async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: "Error fetching blogs" });
    }
});

router.get("/blogs/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid blog ID format" });
        }
        const blog = await Blog.findById(id);
        if (!blog) return res.status(404).json({ error: "Blog post not found" });
        res.json(blog);
    } catch (error) {
        res.status(500).json({ error: "Error fetching blog post" });
    }
});

router.put("/blogs/:id", async (req, res) => {
    try {
        const { title, body, author } = req.body;
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, { title, body, author: author?.trim() || "Anonymous" }, { new: true });
        if (!updatedBlog) return res.status(404).json({ error: "Blog post not found" });
        res.json(updatedBlog);
    } catch (error) {
        res.status(500).json({ error: "Error updating blog post" });
    }
});

router.delete("/blogs/:id", async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) return res.status(404).json({ error: "Blog post not found" });
        res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting blog post" });
    }
});

module.exports = router;
