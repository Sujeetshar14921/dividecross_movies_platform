const jwt = require('jsonwebtoken');

const verifyToken = function (req, res, next) {
  const header = req.header('Authorization');
  if (!header) return res.status(401).json({ msg: 'No token provided' });
  const token = header.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token invalid' });
  }
};

module.exports = { verifyToken };
