const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Obtener solo el token
  
    if (!token) return res.sendStatus(401); // No se proporciona token
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403); // Token inválido
      req.user = user;
      next();
    });
};

module.exports = authenticateToken;
