const Users = require('../models/Users');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const config = require('config');
const { validationResult } = require('express-validator');

// register Users
const registerUser = async (req, res) => {
  //  sends error message for invalid entries to user registration
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // See if user exists
    let user = await Users.findOne({ email });
    if (user) {
      res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }
    // Get users gravatar
    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm',
    });
    // Creates instance of new user
    user = new Users({
      name,
      email,
      avatar,
      password,
    });
    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    // saves the user
    await user.save();

    // Return JSONWebToken
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  registerUser,
};
