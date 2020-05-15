const router = require('express').Router();
const { authorizeUser } = require('../../controllers/auth-controller');
const auth = require('../../middleware/auth');

// @route       GET api/auth
// @desc        Test route
// @access      Public
router.route('/').get(auth, authorizeUser);

module.exports = router;
