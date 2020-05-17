// const router = require('express').Router();
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../../middleware/auth'); 
const { createPost,
        getPosts,
        getPostById,
        deletePost } = require('../../controllers/post-controller');

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

module.exports = router;
