const router = require('express').Router();
const auth = require('../../middleware/auth');
const { check } = require('express-validator');
const {
  authorizeUser,
  loginUser,
} = require('../../controllers/auth-controller');

// @route       GET api/auth
// @desc        Get user info after authorized
// @access      Public
router.route('/').get(auth, authorizeUser);

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.route('/').post(
  // Express validator checks to make sure required fields are entered correctly
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  loginUser
);

module.exports = router;
