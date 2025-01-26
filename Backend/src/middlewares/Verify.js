import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    console.log('Token not found');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    if (!decoded.userId) {
      console.log('userId not found in token');
      return res.status(403).json({ message: 'Invalid token structure' });
    }

    req.userId = decoded.userId; 
    
    next(); 
  } catch (err) {
    console.error('Invalid or expired token:', err);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export default verifyToken;
