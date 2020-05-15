const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    // Decode token
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    // Sets request.user to the user inside the token so we can access the user in protected routes to get their profile
    req.user = decoded.user;
    // next tells you to move to next piece of middleware once we're done
    next();
  } catch (err) {
    // If token is invalid send error
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
