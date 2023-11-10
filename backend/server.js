const fastify = require('fastify')({ logger: !true })

// Richiamo il plugin per la connessione al database
fastify.register(require('@fastify/mongodb'), {
    forceClose: true,
    // TODO usare .env per variabile
    url: 'mongodb://localhost:27017',
    database: 'pet-planet'
})

// Aggiungi utente
fastify.post('/user', async (request, reply) => {
    const result = await fastify
        .mongo.db.collection('users')
        .insertOne(request.body)

    reply.send({
        message: 'user added',
        id: result.insertId
    })
})

// Visualizza tutti gli utenti
fastify.get('/users', async (request, reply) => {
    const users = await fastify
        .mongo.db.collection('users')
        .find().toArray()

    reply.send(users)
})

// Modifica id utente
fastify.put('/users/:userId', async (request, reply) => {
    const { userId } = request.params;
    const ObjectId = fastify.mongo.ObjectId
    const result = await fastify
        .mongo.db.collection('users')
        .replaceOne(
            { _id: new ObjectId(userId) },
            request.body
        )

    reply.send({
        message: 'user updated',
        id: result.insertId
    })
})

// Elimina utente
fastify.delete('/users/:userId', async (request, reply) => {
    const { userId } = request.params;
    const ObjectId = fastify.mongo.ObjectId
    await fastify
        .mongo.db.collection('books')
        .deleteOne({ _id: new ObjectId(userId) })

    reply.statusCode = 204
    reply.send(null)
})

const start = async () => {
    try {
        await fastify.listen({ port: 3000 })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start()


// Comandi di test Rest Api
// curl http://localhost:3000/users
// curl -H 'Content-type: application/json' -X POST http://localhost:3000/user -d '{"Nome":"Francesco", "Cognome": "Santi"}'
// curl -X PUT -H 'Content-type: application/json' http://localhost:3000/users/ -d '{"Nome":"Umberto", "Cognome": "Schiavone"}'
// curl -v -X DELETE http://localhost:3000/users/