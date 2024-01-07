const friendController = require("../controllers/friend.controller");

async function routes(fastify, options) {
    fastify.get("/user/:id", friendController.getAllFriends);
    fastify.get("/:id", friendController.getFriendById);
    fastify.post("/", friendController.follow);
    fastify.put("/:id", friendController.updateFriend);
    fastify.delete("/:id", friendController.deleteFriend);
}

module.exports = routes;