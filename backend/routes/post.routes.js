const postController = require("../controllers/post.controller");

async function routes(fastify, options) {
    fastify.get("/", postController.getAllPosts);
    fastify.get("/:id", postController.getPostById);
    fastify.post("/", postController.createPost);
    fastify.put("/:id", postController.updatePost);
    fastify.delete("/:id", postController.deletePost);
}

module.exports = routes;