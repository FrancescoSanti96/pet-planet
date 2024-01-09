const Follower = require("../models/follower.model");
const User = require("../models/user.model");

async function getAllFollowersByUser(request, reply) {
    try {
        const userId = request.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return reply.status(404).send({ error: 'Utente non trovato' });
        }
        const followers = await Follower.find({ utente: userId });

        reply.send(followers);
    } catch (error) {
        reply.status(500).send({ error: 'Errore durante il recupero dei follower' });
    }
}

async function addFollower(request, reply) {
    try {
        const { utente, amico } = request.body;

        const newFollower = new Follower({
            utente,
            amico
        });

        const result = await newFollower.save();

        const updatedUser = await User.findByIdAndUpdate(utente, { $push: { followers: newFollower._id } }, { new: true });

        console.log("Post creato:", result);
        console.log("Utente aggiornato:", updatedUser);

        reply.status(201).send(result);
    } catch (error) {
        reply.status(500).send({ error: 'Errore durante la creazione dell\'amico' });
    }
}

// async function removeFollower(request, reply) {
//     try {
//         const userId = request.params.userId;
//         const friendId = request.params.friendId;

//         // Trova il follower in base all'id dell'utente e all'id dell'amico
//         const removedFollower = await Follower.findOneAndDelete({ utente: userId, amico: friendId });

//         if (removedFollower) {
//             // Rimuovi l'ID del follower dalla lista dei follower dell'utente
//             const updatedUser = await User.findByIdAndUpdate(userId, { $pull: { followers: removedFollower._id } }, { new: true });

//             if (updatedUser) {
//                 reply.send({ message: 'Amico cancellato con successo' });
//             } else {
//                 reply.status(404).send({ error: 'Utente non trovato' });
//             }
//         } else {
//             reply.status(404).send({ error: 'Amico non trovato' });
//         }
//     } catch (error) {
//         console.error('Errore durante la cancellazione dell\'amico:', error);
//         reply.status(500).send({ error: 'Errore durante la cancellazione dell\'amico' });
//     }
// }

async function removeFollower(request, reply) {
    try {
        // Ottenere l'id utente dalla mail fornita
        const userEmail = request.params.email;
        const userId = await User.findOne({ email: userEmail }).select('_id');

        if (!userId) {
            reply.status(404).send({ error: 'Utente non trovato' });
            return;
        }

        // Ottenere l'id dell'altro utente dal parametro della richiesta
        const otherUserId = request.params.userId; // Aggiornato da request.params.id
        const otherUser = await User.findById(otherUserId);

        if (!otherUser) {
            reply.status(404).send({ error: 'Altro utente non trovato' });
            return;
        }

        // Ottenere l'email dell'altro utente
        const otherUserEmail = otherUser.email;

        // Controllare e eliminare il follower
        const removeFollower = await Follower.findOneAndDelete({ utente: userId, amico: otherUserEmail });

        if (removeFollower) {
            reply.send({ message: 'Amico cancellato con successo' });
        } else {
            reply.status(404).send({ error: 'Amico non trovato' });
        }
    } catch (error) {
        console.error('Errore durante la cancellazione dell\'amico:', error);
        reply.status(500).send({ error: 'Errore durante la cancellazione dell\'amico' });
    }
}



module.exports = {
    getAllFollowersByUser,
    addFollower,
    removeFollower
};