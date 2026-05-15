const jwt = require('jsonwebtoken');

function decodedData(req, res) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    res.status(401).json({ message: 'No token provided' });
    return null;
  }

  try {
    const token = authHeader.split(' ')[1]; 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; 
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
    return null;
  }
}

module.exports = decodedData;
