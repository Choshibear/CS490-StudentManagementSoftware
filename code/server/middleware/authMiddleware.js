const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  console.log('Received token:', token); // Debug logging
  
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Debug logging
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Token verification failed:', error.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};

const roleAuth = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};

module.exports = { authenticate, roleAuth };