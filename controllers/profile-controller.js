const Profile = require('../models/Profile');
const Users = require('../models/Users');
const { validationResult } = require('express-validator');

// Get user's profile
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

// Create or update user profile
const createUpdateProfile = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()})
  }

  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin
  } = req.body;

  // Build profile object
  const profileFields = {};
  profileFields.user = req.user.id; 
  if (company) profileFields.company = company; 
  if (website) profileFields.website = website; 
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (status) profileFields.status = status; 
  if (githubusername) profileFields.githubusername = githubusername;
  if (skills) {
    profileFields.skills = skills.split(',').map(skill => skill.trim());
  }

  // Build social object
  profileFields.social = {}; 
  if (youtube) profileFields.social.youtube = youtube; 
  if (twitter) profileFields.social.twitter = twitter; 
  if (facebook) profileFields.social.facebook = facebook; 
  if (linkedin) profileFields.social.linkedin = linkedin; 
  if (instagram) profileFields.social.instagram = instagram; 

  try {
    let profile = await Profile.findOne({ user: req.user.id });
    // Update profile
    if(profile){
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id }, 
        { $set: profileFields}, 
        { new: true }
      );
      return res.json(profile); 
    }
    // Create Profile
    profile = new Profile(profileFields); 
    await profile.save();
    res.json(profile);

  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error'); 
  }
}

module.exports = {
  getProfile,
  createUpdateProfile
};
