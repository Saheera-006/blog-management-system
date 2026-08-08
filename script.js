// ----------------------------
// Form Validation
// ----------------------------

function validateForm() {

    const title = document.getElementById("title");
    const author = document.getElementById("author");
    const content = document.getElementById("content");

    const titleError = document.getElementById("titleError");
    const authorError = document.getElementById("authorError");
    const contentError = document.getElementById("contentError");

    if (!title) return true;

    titleError.innerHTML = "";
    authorError.innerHTML = "";
    contentError.innerHTML = "";

    let isValid = true;

    if (title.value.trim() === "") {
        titleError.innerHTML = "Blog title is required";
        titleError.style.color = "red";
        isValid = false;
    }

    if (author.value.trim() === "") {
        authorError.innerHTML = "Author name is required";
        authorError.style.color = "red";
        isValid = false;
    }

    if (content.value.trim() === "") {
        contentError.innerHTML = "Blog content is required";
        contentError.style.color = "red";
        isValid = false;
    }

    if (!isValid) {
        return false;
    }

    saveBlog();

    return false;
}

// ----------------------------
// Load Blogs
// ----------------------------

async function loadBlogs() {

    const container = document.getElementById("blogContainer");

    if (!container) return;

    const response = await fetch("/blogs");
    const blogs = await response.json();

    container.innerHTML = "";

    blogs.forEach(blog => {

        container.innerHTML += `
            <div class="blog-card">

                <h3>${blog.title}</h3>

                <p><strong>Author:</strong> ${blog.author}</p>

                <p>${blog.content}</p>

                <button onclick="editBlog(${blog.id})">
                    Edit
                </button>
                <button onclick="deleteBlog(${blog.id})">
                    Delete
                </button>

            </div>
        `;

    });

}

loadBlogs();

// ----------------------------
// Save / Update Blog
// ----------------------------

async function saveBlog() {

    const id = document.getElementById("blogId").value;

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const content = document.getElementById("content").value;

    const blog = {
        title,
        author,
        content
    };

    if (id === "") {

        await fetch("/blogs", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(blog)

        });

    }
    else {

        await fetch(`/blogs/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(blog)

        });

    }

    window.location.href = "index.html";

}

// ----------------------------
// Edit Blog
// ----------------------------

async function editBlog(id) {

    const response = await fetch(`/blogs/${id}`);

    const blog = await response.json();

    localStorage.setItem("editBlog", JSON.stringify(blog));

    window.location.href = "blog.html";

}

// ----------------------------
// Fill Edit Form
// ----------------------------

window.onload = function () {

    const data = localStorage.getItem("editBlog");

    if (!data) return;

    const blog = JSON.parse(data);

    document.getElementById("blogId").value = blog.id;
    document.getElementById("title").value = blog.title;
    document.getElementById("author").value = blog.author;
    document.getElementById("content").value = blog.content;

    document.getElementById("formHeading").innerHTML = "Edit Blog";
    document.getElementById("submitBtn").innerHTML = "Update Blog";

    localStorage.removeItem("editBlog");

};

// ----------------------------
// Delete Blog
// ----------------------------

let deleteId = null;

// ----------------------------
// Open Delete Modal
// ----------------------------

function deleteBlog(id) {

    deleteId = id;

    document.getElementById("deleteModal").style.display = "flex";

}

// ----------------------------
// Close Delete Modal
// ----------------------------

function closeModal() {

    document.getElementById("deleteModal").style.display = "none";

}

// ----------------------------
// Confirm Delete
// ----------------------------

document.getElementById("confirmDelete").addEventListener("click", async function () {

    await fetch(`/blogs/${deleteId}`, {
        method: "DELETE"
    });

    closeModal();

    loadBlogs();

});