const User = require("../models/user.model");
const { decodeAccessToken, deleteAccessToken, setAccessToken } = require("../app.js");

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
// TODO Login
async function login(request, reply) {
  try {
    const email = request.body.email; 
    const password = request.body.password;
    const user = await User.findOne({ email });

    if (user) {
      const passwordOk = await bcrypt.compare(user.password, password);
      if (!passwordOk) {
        return reply.status(400).send("Credenziali errate.");
      }

      delete user.password;
      // setAccessToken(request, reply, user);
      // reply.send(user);
      // TODO controllare hash password
      return reply.json({ message: "Login effettuato con successo" });

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
// TODO Registrazione
async function createUser(request, reply) {
  try {
    // Verifica se l'email è già presente nel database
    const existingUser = await User.findOne({ email: request.body.email });

    if (existingUser) {
      // Se l'utente già esiste, restituisci un errore
      reply.status(400).send({ error: 'Utente già registrato con questa email' });
    } else {
      // Se l'email non è presente, crea il nuovo utente
      // TODO fare hash password e passaere body senza password
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
  login,
  createUser,
  // updateUser,
  deleteUser,
  getAllUsersExceptOne,
};