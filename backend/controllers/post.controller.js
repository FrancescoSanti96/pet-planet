const Post = require("../models/post.model");
const User = require("../models/user.model");


async function getAllPosts(request, reply) {
    try {
        const posts = await Post.find();
        reply.send(posts);
    } catch (error) {
        reply.status(500).send({ error: 'Errore durante il recupero del post' });
    }
}

async function getPostsByUserId(request, reply) {
    try {
        const userId = request.params.id;
        const user = await User.findById(userId);

        if (user) {
            // Recupera i post dell'utente con i commenti associati
            const posts = await Post.find({ utente: userId }).populate('commenti');
            reply.send(posts);
        } else {
            reply.status(404).send({ error: 'Post non trovati' });
        }
    } catch (error) {
        reply.status(500).send({ error: 'Errore durante il recupero dei commenti' });
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
        const { utente,titolo, corpo} = request.body;

        // Crea il post
        const newPost = new Post({
            utente,
            titolo,
            corpo,
        });

        // Salva il post
        const result = await newPost.save();

        // Aggiorna l'utente aggiungendo l'ID del nuovo post alla sua array di posts
        const updatedUser = await User.findByIdAndUpdate(utente, { $push: { posts: newPost._id } }, { new: true });

        // Log per debug
        console.log("Post creato:", result);
        console.log("Utente aggiornato:", updatedUser);

        reply.status(201).send(result);
    } catch (error) {
        console.error(error);
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


async function createComment(request, reply) {
    try {
        const { utente, testo } = request.body;
        const postId = request.params.id;

        // Crea il commento
        const newComment = {
            utente,
            testo,
        };

        // Aggiungi il commento al post
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $push: { commenti: newComment } },
            { new: true }
        );

        // Aggiorna l'utente aggiungendo l'ID del nuovo commento alla sua array di commenti
        const updatedUser = await User.findByIdAndUpdate(
            utente,
            { $push: { comments: { post: postId, testo: newComment.testo } } },
            { new: true }
        );

        // Log per debug
        console.log("Commento creato:", newComment);
        console.log("Post aggiornato:", updatedPost);
        console.log("Utente aggiornato:", updatedUser);

        reply.status(201).send(newComment);
    } catch (error) {
        console.error(error);
        reply.status(500).send({ error: 'Errore durante la creazione del commento' });
    }
}

async function getCommentsByPostId(request, reply) {
    try {
        const postId = request.params.id;
        const post = await Post.findById(postId);
        
        if (post) {
            const comments = post.commenti;
            reply.send(comments);
        } else {
            reply.status(404).send({ error: 'Post non trovato' });
        }
    } catch (error) {
        reply.status(500).send({ error: 'Errore durante il recupero dei commenti' });
    }
}

async function deleteComment(request, reply) {
    try {
        const { postId, commentId } = request.params;

        // Rimuovi il commento dal post
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $pull: { commenti: { _id: commentId } } },
            { new: true }
        );

        // Rimuovi il commento dall'utente
        const updatedUser = await User.findOneAndUpdate(
            { "comments.post": postId, "comments._id": commentId },
            { $pull: { comments: { _id: commentId } } },
            { new: true }
        );

        // Log per debug
        console.log("Commento eliminato:", commentId);
        console.log("Post aggiornato:", updatedPost);
        console.log("Utente aggiornato:", updatedUser);

        reply.send({ message: 'Commento cancellato con successo' });
    } catch (error) {
        reply.status(500).send({ error: 'Errore durante la cancellazione del commento' });
    }
}

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    createComment,
    getCommentsByPostId,
    deleteComment,
    getPostsByUserId
};