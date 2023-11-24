const animalController = require("../controllers/animal.controller");

async function routes(fastify, options) {
  fastify.get("/", animalController.getAllAnimals);
  fastify.get("/:id", animalController.getAnimalById);
  fastify.post("/", animalController.createAnimal);
  fastify.put("/:id", animalController.updateAnimal);
  fastify.delete("/:id", animalController.deleteAnimal);
}

module.exports = routes;