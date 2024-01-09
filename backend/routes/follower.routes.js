const followerController = require("../controllers/follower.controller");

async function routes(fastify, options) {
    fastify.get("/user/:id", followerController.getAllFollowersByUser);
    fastify.post("/", followerController.addFollower);
    fastify.delete("/user/:userId/email/:email", followerController.removeFollower);
}

module.exports = routes;