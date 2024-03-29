const fastify = require('fastify')({ logger: true });
const fastifyCors = require('@fastify/cors');
const mongoose = require('mongoose');
const oauthPlugin = require('@fastify/oauth2')

// Import my routes
const userRoutes = require("./routes/user.routes");
const animalRoutes = require("./routes/animal.routes");
const postRoutes = require("./routes/post.routes");
const friendRoutes = require("./routes/friend.routes");
const followerRoutes = require("./routes/follower.routes");

// Register fastify-oauth2 plugin
fastify.register(oauthPlugin, {
  name: 'googleOAuth2',
  scope: ['profile', 'email'],
  credentials: {
    client: {
      id: 'inserisci qui il tuo client id',
      secret: 'inserisci qui il tuo client secret'
    },
    auth: oauthPlugin.GOOGLE_CONFIGURATION
  },
  startRedirectPath: '/oauth2/google',
  callbackUri: `http://localhost:3000/oauth2/google/callback`,

});

fastify.get('/oauth2/google/callback', async function (request, reply) {
  try {
    const { token } = await this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
    reply.redirect("http://localhost:4200/homepage/?access_token=" + token.access_token);
  } catch (error) {
    console.error("OAuth callback error:", error);
    reply.code(500).send({ error: 'Internal Server Error' });
  }
 
});

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

// Use @fastify/cors plugin
fastify.register(fastifyCors, {
  origin: "*", // Puoi specificare l'origine o "*" per accettare da qualsiasi origine
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
});


// Register routes
fastify.register(userRoutes, { prefix: "/api/v1/users" });
fastify.register(animalRoutes, { prefix: "/api/v1/animals" });
fastify.register(postRoutes, { prefix: "/api/v1/posts" });
fastify.register(friendRoutes, { prefix: "/api/v1/friends" });
fastify.register(followerRoutes, { prefix: "/api/v1/followers" });

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
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

//Utenti
// curl http://localhost:3000/api/v1/users
// curl http://localhost:3000/api/v1/users/...id
// curl -H 'Content-type: application/json' -X POST http://localhost:3000/api/v1/users -d '{"idGoogle":"108387050657370466331", "firstName":"Francesco", "lastName": "Santi", "email": "francesco.santi@.com"}'
// curl -X PUT -H 'Content-type: application/json' http://localhost:3000/api/v1/users/...id -d '{"firstName":"Umberto", "lastName": "Schiavone", "email": "umberto.schiavone@.com", "password": "Admin"}'
// curl localhost:3000/api/v1/users/...id -X DELETE

//Animali
// curl http://localhost:3000/api/v1/animals
// curl http://localhost:3000/api/v1/animals/...id
// curl -H 'Content-type: application/json' -X POST http://localhost:3000/api/v1/animals -d '{"nome":"Oreo", "specie": "cane", "razza": "Labrador", "sesso": "maschio", "età":"2 anni", "proprietario":"Umberto", "compleanno":"2023-11-24T15:30:00"}'
// curl localhost:3000/api/v1/animals/...id -X DELETE

//Post
// curl http://localhost:3000/api/v1/posts
// curl http://localhost:3000/api/v1/posts/...id
// curl -H 'Content-type: application/json' -X POST http://localhost:3000/api/v1/posts -d '{"utente":"Francesco", "testo":"Primo post!", "dataInserimento":"2023-11-24T15:30:00"}'
// curl -H 'Content-type: application/json' -X POST http://localhost:3000/api/v1/posts -d '{"utente":"659aade9e4471dae5ebc52fb", "testo":"Primo post!", "dataInserimento":"2023-11-24T15:30:00"}'
// curl localhost:3000/api/v1/posts/...id -X DELETE

//Amici
// curl http://localhost:3000/api/v1/friends
// curl http://localhost:3000/api/v1/friends/...id
// curl -H 'Content-type: application/json' -X POST http://localhost:3000/api/v1/friends -d '{"utente":"Francesco", "amico":"Umberto"}'
// curl -H 'Content-type: application/json' -X POST http://localhost:3000/api/v1/friends -d '{"utente":"Umberto", "amico":"Francesco"}'
// curl localhost:3000/api/v1/friends/...id -X DELETE

//Commenti
// curl http://localhost:3000/api/v1/posts
// curl -H 'Content-type: application/json' -X POST http://localhost:3000/api/v1/posts/65c91303df7e521664e07eff/comment -d '{utente":"65c8aea4677f7a4b522fc24d", "testo":"ciao", "email": "oreolabraddor@.com}'

// npm install @fastify/cors    

// curl -H 'Content-type: application/json' -X POST http://localhost:3000/api/v1/posts -d '{"utente":"659addc83a738caa847ff15c", "titolo":"Terzo post!", "corpo":"2023-11-26T12:00:00"}'
// curl -H 'Content-type: application/json' -X POST http://localhost:3000/api/v1/friends -d '{"utente":"659addc83a738caa847ff15c", "amico":"Terzo post!"}'