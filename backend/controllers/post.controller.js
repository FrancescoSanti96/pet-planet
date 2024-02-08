const Post = require("../models/post.model");
const User = require("../models/user.model");
const Friend = require("../models/friend.model");


// async function getAllPosts(request, reply) {
//     try {
//         const posts = await Post.find();
//         reply.send(posts);
//     } catch (error) {
//         reply.status(500).send({ error: 'Errore durante il recupero del post' });
//     }
// }


async function getPostsOfFriends(request, reply) {
    try {
        const userId = request.params.id;
        const user = await User.findById(userId);
        if (user) {
            const friendEmails = await Friend.find({ _id: { $in: user.friends } }).distinct('amico');
            const friendUsers = await User.find({ email: { $in: friendEmails } });
            const friendUserIdsFinal = friendUsers.map(user => user._id);
            const postsOfFriends = await Post.find({ utente: { $in: friendUserIdsFinal } }).populate('commenti');
            reply.send(postsOfFriends);
        } else {
            reply.status(404).send({ error: 'Utente non trovato' });
        }
    } catch (error) {
        console.error(error);
        reply.status(500).send({ error: 'Errore durante il recupero dei post degli amici' });
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
        const { utente,titolo, corpo, profilePic, img} = request.body;

        const newPost = new Post({
            utente,
            titolo,
            corpo,
            profilePic,
            img
        });

        const result = await newPost.save();
        const updatedUser = await User.findByIdAndUpdate(utente, { $push: { posts: newPost._id } }, { new: true });
        console.log("Utente aggiornato:", updatedUser);

        reply.status(201).send(result);
    } catch (error) {
        console.error(error);
        reply.status(500).send({ error: 'Errore durante la creazione del post' });
    }
}

async function updatePost(request, reply) {
    try {
        const postId = request.params.id;
        const updatedData = request.body;

        const updatedPost = await Post.findByIdAndUpdate(postId, updatedData, {
            new: true,
        });

        if (updatedPost) {
            reply.send(updatedPost);
        } else {
            reply.status(404).send({ error: 'Post non trovato' });
        }
    } catch (error) {
        reply.status(500).send({ error: 'Errore durante l\'aggiornamento del post' });
    }
}

async function deletePost(request, reply) {
    try {
        const postId = request.params.id;

        // Trova il post da eliminare
        const deletedPost = await Post.findByIdAndDelete(postId);

        if (deletedPost) {
            // Rimuovi il riferimento dal documento utente (se necessario)
            await User.updateMany({ posts: postId }, { $pull: { posts: postId } });

            // Rimuovi anche i commenti associati al post eliminato
            // await Comment.deleteMany({ post: postId });

            reply.send({ message: 'Post e commenti associati cancellati con successo' });
        } else {
            reply.status(404).send({ error: 'Post non trovato' });
        }
    } catch (error) {
        reply.status(500).send({ error: 'Errore durante la cancellazione del post e dei commenti associati' });
    }
}



async function createComment(request, reply) {
    try {
        const { utente, testo } = request.body;
        const postId = request.params.id;

        const newComment = {
            utente,
            testo,
        };

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $push: { commenti: newComment } },
            { new: true }
        );

        const updatedUser = await User.findByIdAndUpdate(
            utente,
            { $push: { comments: { post: postId, testo: newComment.testo } } },
            { new: true }
        );

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
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $pull: { commenti: { _id: commentId } } },
            { new: true }
        );
        const updatedUser = await User.findOneAndUpdate(
            { "comments.post": postId, "comments._id": commentId },
            { $pull: { comments: { _id: commentId } } },
            { new: true }
        );

        console.log("Post aggiornato:", updatedPost);
        console.log("Utente aggiornato:", updatedUser);

        reply.send({ message: 'Commento cancellato con successo' });
    } catch (error) {
        reply.status(500).send({ error: 'Errore durante la cancellazione del commento' });
    }
}

module.exports = {
    // getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    createComment,
    getCommentsByPostId,
    deleteComment,
    getPostsByUserId,
    getPostsOfFriends
};