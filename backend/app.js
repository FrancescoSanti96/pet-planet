// Import plugins
const fastify = require("fastify")({ logger: true });
// ODM (Object Data Modeling) library
const mongoose = require("mongoose");

// Import my routes
const userRoutes = require("./routes/user.routes");

// Connect to my database
const connectToDatabase = async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/pet-planet', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to the database");
    } catch (error) {
      console.log("Error connecting to the database", error);
    }
  };

connectToDatabase();

// start my server
fastify.register(userRoutes, { prefix: "/api/v1/users" });

const start = async () => {
  try {
    await fastify.listen({port: 3000});
    fastify.log.info(
      `Server is running on port ${fastify.server.address().port}`
    );
  } catch (error) {
    console.error(error);
  }
};

start();

// Comandi di test Rest Api
// ...id = id univoco creato da mongosee dell'utente che si vuole modificare o eliminare
// curl http://localhost:3000/api/v1/users
// curl http://localhost:3000/api/v1/users/...id
// curl -H 'Content-type: application/json' -X POST http://localhost:3000/api/v1/users -d '{"firstName":"Francesco", "lastName": "Santi", "email": "francesco.santi@.com", "password": "Admin"}'
// curl -X PUT -H 'Content-type: application/json' http://localhost:3000/api/v1/users/...id -d '{"firstName":"Umberto", "lastName": "Schiavone", "email": "umberto.schiavone@.com", "password": "Admin"}'
// curl localhost:3000/api/v1/users/...id -X DELETE