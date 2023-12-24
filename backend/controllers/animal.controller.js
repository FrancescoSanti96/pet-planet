const Animal = require("../models/animal.model");

async function getAllAnimals(request, reply) {
    try {
        const animals = await Animal.find();
        reply.send(animals);
    } catch (error) {
        reply.status(500).send({ error: 'Errore durante il recupero degli animali' });
    }
}
async function getAnimalById(request, reply) {
    try {
        const animal = await Animal.findById(request.params.id);
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
        const animal = new Animal(request.body);
        const result = await animal.save();
        reply.status(201).send(result);
    } catch (error) {
        reply.status(500).send({ error: 'Errore durante la creazione dell\'animale' });
    }
}
async function updateAnimal(request, reply) {
    try {
        const animal = await Animal.findByIdAndUpdate(request.params.id, request.body, {
            new: true,
        });
        reply.send(animal);
    } catch (error) {
        reply.status(500).send({ error: 'Errore durante l\'aggiornamento dell\'animale' });
    }
}
async function deleteAnimal(request, reply) {
    try {
        const deletedAnimal = await Animal.findByIdAndDelete(request.params.id);
        if (deletedAnimal) {
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
};