const friendController = require("../controllers/friend.controller");

async function routes(fastify, options) {
    fastify.get("/", friendController.getAllFriends);
    fastify.get("/:id", friendController.getFriendById);
    fastify.post("/", friendController.createFriend);
    fastify.put("/:id", friendController.updateFriend);
    fastify.delete("/:id", friendController.deleteFriend);
}

module.exports = routes;