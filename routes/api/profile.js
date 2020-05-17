// const router = require('express').Router();
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { getProfile, 
        createUpdateProfile, 
        getAllProfiles, 
        getProfileById,
        deleteProfile,
        addExperience,
        deleteExperience,
        addEducation,
        deleteEducation} = require('../../controllers/profile-controller');
const { check } = require('express-validator');

// @route       GET api/profile/me
// @desc        Get current users profile
// @access      Private
router.route('/me').get(auth, getProfile);

// @route       POST api/profile
// @desc        Create or update user profile
// @access      Private
router.route('/').post(
    [auth, [
        check('status', 'Status is required').not().isEmpty(),
        check('skills', 'Skills is required').not().isEmpty()
    ]],
    createUpdateProfile
);

// @route       GET api/profile
// @desc        Get all profiles
// @access      Public
router.route('/').get(getAllProfiles);

// @route       GET api/profile/user/:user_id
// @desc        Get profile by user id
// @access      Public
router.route('/user/:user_id').get(getProfileById);

// @route       DELETE api/profile
// @desc        Delete profile, user and posts 
// @access      Private
router.route('/').delete(auth, deleteProfile);

// @route       PUT api/profile/experience
// @desc        Add profile experience 
// @access      Private
router.route('/experience').put(
    [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
    ]],
    addExperience
);

// @route       DELETE api/profile/experience/:exp_id
// @desc        Delete profile experience from profile 
// @access      Private
router.route('/experience/:exp_id').delete(auth, deleteExperience);

// @route       PUT api/profile/education
// @desc        Add profile education 
// @access      Private
router.route('/education').put(
    [auth, [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
    ]],
    addEducation
);

// @route       DELETE api/profile/education/:edu_id
// @desc        Delete profile education from profile 
// @access      Private
router.route('/education/:edu_id').delete(auth, deleteEducation);

module.exports = router;
