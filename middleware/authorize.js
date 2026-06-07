const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user info to req.user
 */
exports.authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Unauthorized.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authentication Error:', error.message);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

/**
 * Higher-order function for role-based authorization
 * @param {...string} allowedRoles - Roles that are allowed to access the resource
 * @returns {Function} Middleware function
 */
exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check if user has one of the allowed roles
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `User role '${req.user?.role || 'unknown'}' is not authorized to access this resource.`
        });
      }
      next();
    } catch (error) {
      console.error('Authorization Error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Authorization check failed'
      });
    }
  };
};
