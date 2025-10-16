const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');




dotenv.config(); // carga variables .env
connectDB();     // conecta a MongoDB


const app = express();
const PORT = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || 'localhost';

// Configuración de CORS
const corsOptions = {
  origin: '*', // Permite todas las origenes
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
  exposedHeaders: ['Content-Range', 'X-Content-Range'], // Headers expuestos
  credentials: true, // Permite credenciales
  maxAge: 86400 // Tiempo máximo de cache para los resultados de las solicitudes preflight
};

app.use(cors(corsOptions));


app.use(express.json());


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://${hostname}:${PORT}`);
});


app.use('/auth', authRoutes);
app.use('/users', userRoutes);    

module.exports = app;
