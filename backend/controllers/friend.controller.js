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

        const newFriend = new Friend({
            utente,
            amico
        });

        const result = await newFriend.save();

        const updatedUser = await User.findByIdAndUpdate(utente, { $push: { friends: newFriend._id } }, { new: true });

        console.log("Post creato:", result);
        console.log("Utente aggiornato:", updatedUser);

        reply.status(201).send(result);
    } catch (error) {
        reply.status(500).send({ error: 'Errore durante la creazione dell\'amico' });
    }
}
async function updateFriend(request, reply) {
    try {
        const friend = await Friend.findByIdAndUpdate(request.params.id, request.body, {
            new: true,
        });
        reply.send(friend);
    } catch (error) {
        reply.status(500).send({ error: 'Errore durante l\'aggiornamento dell\'amico' });
    }
}
async function deleteFriend(request, reply) {
    try {
        const deletedFriend = await Friend.findByIdAndDelete(request.params.id);
        if (deletedFriend) {
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
    getFriendById,
    follow,
    updateFriend,
    deleteFriend
};