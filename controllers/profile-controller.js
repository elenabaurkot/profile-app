const Profile = require('../models/Profile');
const Users = require('../models/Users');

const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);
    // if no profile send error message
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    // if there is a profile, send profile
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getProfile,
};
