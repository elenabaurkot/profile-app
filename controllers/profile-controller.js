const Profile = require('../models/Profile');
const Users = require('../models/Users');
const Post = require('../models/Post');
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


// Get all profiles
const getAllProfiles = async(req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get profile by ID
const getProfileById = async(req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id}).populate('user', ['name', 'avatar']);

    if(!profile) {
      return res.status(400).json({ msg: 'Profile not found'})
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      res.status(400).json({ msg: 'Profile not found'})
    }
    res.status(500).send('Server error');
  }
};

// Delete profile, user & posts
const deleteProfile = async(req, res) => {
  try {
    // Remove user posts
    await Post.deleteMany({ user: req.user.id })
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await Users.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User deleted'});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Add profile experience
const addExperience = async(req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  } = req.body

  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  }

  try {
    const profile = await Profile.findOne({ user: req.user.id });

    profile.experience.unshift(newExp);

    await profile.save()

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error'); 
  }
}

// Delete profile experience
const deleteExperience = async(req, res) => {
  try {
    // get profile by user id
    const profile = await Profile.findOne({ user: req.user.id });
    // get remove index
    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
    
    profile.experience.splice(removeIndex, 1);

    await profile.save(); 
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error'); 
  }
}

// Add profile education
const addEducation = async(req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  } = req.body

  const newEdu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  }

  try {
    const profile = await Profile.findOne({ user: req.user.id });

    profile.education.unshift(newEdu);

    await profile.save()

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error'); 
  }
}

// Delete profile education
const deleteEducation = async(req, res) => {
  try {
    // get profile by user id
    const profile = await Profile.findOne({ user: req.user.id });
    // get remove index
    const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
    
    profile.education.splice(removeIndex, 1);

    await profile.save(); 
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error'); 
  }
}


module.exports = {
  getProfile,
  createUpdateProfile,
  getAllProfiles,
  getProfileById,
  deleteProfile,
  addExperience,
  deleteExperience,
  addEducation,
  deleteEducation
};
