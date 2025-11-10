const jwt = require('jsonwebtoken');

/**
 * General authentication middleware
 * Verifies JWT and attaches decoded token info to req.user
 */
exports.authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied: please login first' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email || undefined,
      adminName: decoded.adminName || undefined,
    };

    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

/**
 * Role-based authorization middleware
 */
exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      const rolesList = allowedRoles.join(', ');
      return res.status(403).json({ 
        message: `Access denied: only ${rolesList} can access` 
      });
    }
    next();
  };
};
