const AuthService = require('../services/authService');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required. Please provide a valid token.'
      });
    }

    const user = await AuthService.verifyToken(token);
    req.user = user;
    req.userId = user._id;
    req.token = token;
    
    next();
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: error.message || 'Authentication failed. Please try again.'
    });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      status: 'error',
      message: 'Access denied. Admin privileges required.'
    });
  }
};

module.exports = { auth, isAdmin };