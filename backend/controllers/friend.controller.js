const Friend = require("../models/friend.model");
const User = require("../models/user.model");

async function getAllFriends(request, reply) {
    try {
        const friends = await Friend.find();
        reply.send(friends);
    } catch (error) {
        reply.status(500).send({ error: 'Errore durante il recupero dell\'amico' });
    }
}

async function getAllFriendsByUser(request, reply) {
    try {
        const userId = request.params.id;

        // Trova l'utente specificato
        const user = await User.findById(userId);

        if (!user) {
            return reply.status(404).send({ error: 'Utente non trovato' });
        }

        // Ottenere gli amici associati all'utente
        const friends = await Friend.find({ utente: userId });

        reply.send(friends);
    } catch (error) {
        reply.status(500).send({ error: 'Errore durante il recupero degli amici' });
    }
}


async function getFriendById(request, reply) {
    try {
        const friend = await Friend.findById(request.params.id);
        if (friend) {
            reply.send(friend);
        } else {
            reply.status(404).send({ error: 'Amico non trovato' });
        }
    } catch (error) {
        reply.status(500).send({ error: 'Errore durante il recupero dell\'amico' });
    }
}

async function follow(request, reply) {
    try {
        const { utente, amico } = request.body;

        // Verifica se l'amico è già un amico dell'utente corrente
        const isAlreadyFriend = await Friend.exists({ utente, amico });

        if (isAlreadyFriend) {
            // L'amico è già un amico dell'utente corrente
            return reply.status(400).send({ error: 'Questo amico è già presente nella tua lista di amici.' });
        }

        // Procedi con l'aggiunta dell'amico
        const newFriend = new Friend({
            utente,
            amico
        });

        const result = await newFriend.save();

        const updatedUser = await User.findByIdAndUpdate(utente, { $push: { friends: newFriend._id } }, { new: true });
        console.log("Utente aggiornato:", updatedUser);

        reply.status(201).send(result);
    } catch (error) {
        console.error("Errore durante l'aggiunta dell'amico:", error);
        reply.status(500).send({ error: 'Errore interno del server durante l\'aggiunta dell\'amico' });
    }
}


// async function updateFriend(request, reply) {
//     try {
//         const friend = await Friend.findByIdAndUpdate(request.params.id, request.body, {
//             new: true,
//         });
//         reply.send(friend);
//     } catch (error) {
//         reply.status(500).send({ error: 'Errore durante l\'aggiornamento dell\'amico' });
//     }
// }
async function unfollow(request, reply) {
    try {
        const unfollowFriend = await Friend.findByIdAndDelete(request.params.id);
        if (unfollowFriend) {
            reply.send({ message: 'Amico cancellato con successo' });
        } else {
            reply.status(404).send({ error: 'Amico non trovato' });
        }
    } catch (error) {
        reply.status(500).send({ error: 'Errore durante la cancellazione dell\'amico' });
    }
}

module.exports = {
    getAllFriends,
    getAllFriendsByUser,
    getFriendById,
    follow,
    unfollow,
    // updateFriend,
};