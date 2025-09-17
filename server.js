const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');


dotenv.config(); // carga variables .env
connectDB();     // conecta a MongoDB


const app = express();
const PORT = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || 'localhost';


app.use(express.json());


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://${hostname}:${PORT}`);
});


app.use('/auth', authRoutes);
app.use('/users', userRoutes);    
