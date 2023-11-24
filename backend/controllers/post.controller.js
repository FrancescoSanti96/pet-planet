const Post = require("../models/post.model");

async function getAllPosts(request, reply) {
    try {
        const posts = await Post.find();
        reply.send(posts);
    } catch (error) {
        reply.status(500).send({ error: 'Errore durante il recupero del post' });
    }
}
async function getPostById(request, reply) {
    try {
        const post = await Post.findById(request.params.id);
        if (post) {
            reply.send(post);
        } else {
            reply.status(404).send({ error: 'Post non trovato' });
        }
    } catch (error) {
        reply.status(500).send({ error: 'Errore durante il recupero del post' });
    }
}
async function createPost(request, reply) {
    try {
        const post = new Post(request.body);
        const result = await post.save();
        reply.status(201).send(result);
    } catch (error) {
        reply.status(500).send({ error: 'Errore durante la creazione del post' });
    }
}
async function updatePost(request, reply) {
    try {
        const post = await Post.findByIdAndUpdate(request.params.id, request.body, {
            new: true,
        });
        reply.send(post);
    } catch (error) {
        reply.status(500).send({ error: 'Errore durante l\'aggiornamento del post' });
    }
}
async function deletePost(request, reply) {
    try {
        const deletedPost = await Post.findByIdAndDelete(request.params.id);
        if (deletedPost) {
            reply.send({ message: 'Post cancellato con successo' });
        } else {
            reply.status(404).send({ error: 'Post non trovato' });
        }
    } catch (error) {
        reply.status(500).send({ error: 'Errore durante la cancellazione del post' });
    }
}

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
};