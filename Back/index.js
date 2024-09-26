const express = require('express');
const bodyParser = require('body-parser');
const taskRoutes = require('./routes/tasks');
const authenticateToken = require('./middleware');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const cors = require('cors');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: 'http://localhost:4200', // Aquí colocas la URL de tu aplicación Angular
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use('/api/tasks', authenticateToken, taskRoutes);

app.post('/api/login', (req, res) => {
  const username = req.body.username;
  const user = { name: username };
  const access_token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ access_token });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
