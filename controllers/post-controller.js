const Post = require('../models/Post');
const Profile = require('../models/Profile');
const Users = require('../models/Users');
const { validationResult } = require('express-validator')

// Create a post
const createPost = async(req, res) => {
    const errors = validationResult(req); 
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {   
        const user = await Users.findById(req.user.id).select('-password'); 

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });

        const post = await newPost.save();

        res.json(post); 
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get all posts
const getPosts = async(req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts); 
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

// Get post by id
const getPostById = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        res.json(post); 
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
}

// Delete post
const deletePost = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        // Check if user deleting post is the one who made it
        if(post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        await post.remove(); 
        res.json({ msg: 'Post removed' });
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
}

// Like a post
const likePost = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // check if post has already been liked by this user
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post already liked' })
        }
        post.likes.unshift({ user: req.user.id });

        await post.save(); 
        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
}

// Unlike a post
const unlikePost = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // check if post has already been liked by this user
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'Post has not yet been liked' })
        }
        // Get remove index
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex, 1);

        await post.save(); 
        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
}

module.exports = {
    createPost,
    getPosts,
    getPostById,
    deletePost,
    likePost,
    unlikePost
}