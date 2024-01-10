const Animal = require("../models/animal.model");
const User = require("../models/user.model");

async function getAllAnimals(request, reply) {
    try {
        const animals = await Animal.find().populate('owner');
        reply.send(animals);
    } catch (error) {
        reply.status(500).send({ error: 'Errore durante il recupero degli animali' });
    }
}

async function getAnimalByUserId(request, reply) {
    try {
        const userId = request.params.userId;
        const user = await User.findById(userId);

        if (user && user.animal) {
            const animal = await Animal.findById(user.animal);
            if (animal) {
                reply.send(animal);
            } else {
                reply.status(404).send({ error: 'Animale non trovato' });
            }
        } else {
            reply.status(404).send({ error: 'Utente o animale non trovati' });
        }
    } catch (error) {
        reply.status(500).send({ error: 'Errore durante il recupero dell\'animale' });
    }
}

async function getAnimalById(request, reply) {
    try {
        const animal = await Animal.findById(request.params.id).populate('owner');
        if (animal) {
            reply.send(animal);
        } else {
            reply.status(404).send({ error: 'Animale non trovato' });
        }
    } catch (error) {
        reply.status(500).send({ error: 'Errore durante il recupero dell\'animale' });
    }
}

async function createAnimal(request, reply) {
    try {
        const { nome, tipoAnimale, razza, sesso, owner } = request.body;
        const newAnimal = new Animal({
            nome,
            tipoAnimale,
            razza,
            sesso,
            owner, 
        });

        const result = await newAnimal.save();
        const updatedUser = await User.findByIdAndUpdate(owner, { animal: newAnimal._id }, { new: true });

        console.log("Utente aggiornato:", updatedUser);
        reply.status(201).send(result);
    } catch (error) {
        console.error(error);
        reply.status(500).send({ error: 'Errore durante la creazione dell\'animale' });
    }
}

async function updateAnimal(request, reply) {
    try {
        const animalId = request.params.id;
        const updatedData = request.body;

        const updatedAnimal = await Animal.findByIdAndUpdate(animalId, updatedData, {
            new: true,
        }).populate('owner');
        reply.send(updatedAnimal);
    } catch (error) {
        reply.status(500).send({ error: 'Errore durante l\'aggiornamento dell\'animale' });
    }
}

async function deleteAnimal(request, reply) {
    try {
        const animalId = request.params.id;
        const deletedAnimal = await Animal.findByIdAndDelete(animalId).populate('owner');

        if (deletedAnimal) {
            const updatedUser = await User.findByIdAndUpdate(
                deletedAnimal.owner,
                { animal: null },
                { new: true }
            );

            reply.send({ message: 'Animale cancellato con successo' });
        } else {
            reply.status(404).send({ error: 'Animale non trovato' });
        }
    } catch (error) {
        reply.status(500).send({ error: 'Errore durante la cancellazione dell\'animale' });
    }
}

module.exports = {
    getAllAnimals,
    getAnimalById,
    createAnimal,
    updateAnimal,
    deleteAnimal,
    getAnimalByUserId,
};
