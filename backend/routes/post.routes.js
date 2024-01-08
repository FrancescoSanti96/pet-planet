const postController = require("../controllers/post.controller");

async function routes(fastify, options) {
    // Rotte per i post
    fastify.get("/", postController.getAllPosts);
    fastify.get("/:id", postController.getPostById);
    fastify.post("/", postController.createPost);
    fastify.put("/:id", postController.updatePost);
    fastify.delete("/:id", postController.deletePost);
    fastify.get("/:id/user", postController.getPostsByUserId);

    // Rotte per i commenti
    fastify.post("/:id/comment", postController.createComment); // Creare un commento a un post
    fastify.get("/:id/comments", postController.getCommentsByPostId); // Ottenere i commenti di un post
    fastify.delete("/:postId/comments/:commentId", postController.deleteComment); // Cancellare un commento di un post
}

module.exports = routes;