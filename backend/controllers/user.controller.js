const User = require("../models/user.model");

async function getAllUsers(request, reply) {
  try {
    const users = await User.find();
    reply.send(users);
  } catch (error) {
    reply.status(500).send({ error: 'Errore durante il recupero degli utenti' });
  }
}
async function getUserById(request, reply) {
  try {
    const user = await User.findById(request.params.id).populate('posts');
    if (user) {
      reply.send(user);
    } else {
      reply.status(404).send({ error: 'Utente non trovato' });
    }
  } catch (error) {
    reply.status(500).send({ error: 'Errore durante il recupero dell\'utente' });
  }
}
async function getUserByEmail(request, reply) {
  try {
    const email = request.params.email; 
    const user = await User.findOne({ email });

    if (user) {
      reply.send(user);
    } else {
      reply.status(404).send({ error: 'Utente non trovato' });
    }
  } catch (error) {
    reply.status(500).send({ error: 'Errore durante il recupero dell\'utente' });
  }
}
async function getAllUsersExceptOne(request, reply) {
  try {
    const userIdToExclude = request.params.id;

    // Trova tutti gli utenti tranne quello specificato
    const users = await User.find({ _id: { $ne: userIdToExclude } });

    reply.send(users);
  } catch (error) {
    reply.status(500).send({ error: 'Errore durante il recupero degli utenti' });
  }
}
async function createUser(request, reply) {
  try {
    // Verifica se l'email è già presente nel database
    const existingUser = await User.findOne({ email: request.body.email });

    if (existingUser) {
      // Se l'utente già esiste, restituisci un errore
      reply.status(400).send({ error: 'Utente già registrato con questa email' });
    } else {
      // Se l'email non è presente, crea il nuovo utente
      const user = new User(request.body);
      const result = await user.save();
      reply.status(201).send(result);
    }
  } catch (error) {
    reply.status(500).send({ error: 'Errore durante la creazione dell\'utente' });
  }
}
// async function updateUser(request, reply) {
//   try {
//     const user = await User.findByIdAndUpdate(request.params.id, request.body, {
//       new: true,
//     });
//     reply.send(user);
//   } catch (error) {
//     reply.status(500).send({ error: 'Errore durante l\'aggiornamento dell\'utente' });
//   }
// }
async function deleteUser(request, reply) {
  try {
    const deletedUser = await User.findByIdAndDelete(request.params.id);
    if (deletedUser) {
      reply.send({ message: 'Utente cancellato con successo' });
    } else {
      reply.status(404).send({ error: 'Utente non trovato' });
    }
  } catch (error) {
    reply.status(500).send({ error: 'Errore durante la cancellazione dell\'utente' });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  // updateUser,
  deleteUser,
  getAllUsersExceptOne,
};