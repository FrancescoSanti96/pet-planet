const friendController = require("../controllers/friend.controller");

async function routes(fastify, options) {
    fastify.get("/", friendController.getAllFriends);
    fastify.get("/user/:id", friendController.getAllFriendsByUser);
    fastify.get("/:id", friendController.getFriendById);
    fastify.post("/", friendController.follow);
    fastify.put("/:id", friendController.updateFriend);
    fastify.delete("/:id", friendController.deleteFriend);
}

module.exports = routes;