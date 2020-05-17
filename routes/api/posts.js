// const router = require('express').Router();
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../../middleware/auth'); 
const { createPost,
        getPosts,
        getPostById,
        deletePost,
        likePost,
        unlikePost,
        commentOnPost,
        deleteComment } = require('../../controllers/post-controller');

// @route       POST api/posts
// @desc        Create a post
// @access      Private
router.route('/').post(
    [auth, [
        check('text', 'Text is required').not().isEmpty()
    ]],
    createPost
);

// @route       GET api/posts
// @desc        Get all posts
// @access      Private
router.route('/').get(auth, getPosts);

// @route       GET api/posts/:id
// @desc        Get post by id
// @access      Private
router.route('/:id').get(auth, getPostById);

// @route       DELETE api/posts/:id
// @desc        Delete a post
// @access      Private
router.route('/:id').delete(auth, deletePost);

// @route       POST api/posts/like/:id
// @desc        Like a post
// @access      Private
router.route('/like/:id').put(auth, likePost);

// @route       POST api/posts/unlike/:id
// @desc        Unlike a post
// @access      Private
router.route('/unlike/:id').put(auth, unlikePost);

// @route       POST api/posts/comment/:id
// @desc        Comment on a post
// @access      Private
router.route('/comment/:id').post(
    [auth, [
        check('text', 'Text is required').not().isEmpty()
    ]],
    commentOnPost
);

// @route       DELETE api/posts/comment/:id/:comment_id
// @desc        Delete a comment
// @access      Private
router.route('/comment/:id/:comment_id').delete(auth, deleteComment);

module.exports = router;
