const { Users } = require('../models/Users');
const { validationResult } = require('express-validator');

// register Users
const registerUser = (req, res) => {
  //  sends error message for invalid entries
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  res.send('Users route');
};

module.exports = {
  registerUser,
};
