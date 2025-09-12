const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./src/config/database');
const clientRoutes = require('./src/routes/clientRoutes');

dotenv.config(); // carga variables .env
connectDB();     // conecta a MongoDB

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Rutas
app.use('/api/clients', clientRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
