const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Store blogs in memory
let blogs = [];

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Home Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// =========================
// GET All Blogs
// =========================
app.get("/blogs", (req, res) => {
    res.json(blogs);
});

// =========================
// GET Single Blog
// =========================
app.get("/blogs/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const blog = blogs.find(blog => blog.id === id);

    if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);

});

// =========================
// Add Blog
// =========================
app.post("/blogs", (req, res) => {

    const { title, author, content } = req.body;

    const blog = {
        id: blogs.length + 1,
        title,
        author,
        content
    };

    blogs.push(blog);

    console.log("Blogs:", blogs);

    res.redirect("/");

});

// =========================
// Update Blog
// =========================
app.put("/blogs/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const { title, author, content } = req.body;

    const blog = blogs.find(blog => blog.id === id);

    if (!blog) {
        return res.status(404).json({
            message: "Blog not found"
        });
    }

    blog.title = title;
    blog.author = author;
    blog.content = content;

    console.log("Updated Blogs:", blogs);

    res.json({
        message: "Blog updated successfully",
        blog
    });

});

// =========================
// Delete Blog
// =========================

app.delete("/blogs/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const index = blogs.findIndex(blog => blog.id === id);

    if (index === -1) {

        return res.status(404).json({
            message: "Blog not found"
        });

    }

    blogs.splice(index, 1);

    console.log("Remaining Blogs:", blogs);

    res.json({
        message: "Blog deleted successfully"
    });

});

// =========================
// Start Server
// =========================
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});