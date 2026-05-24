import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

export function errorHandler(err, req, res, next) {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      message: err.message,
      errors: err.errors 
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
}
