// src/config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@stayloopusers.3alunnv.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=StayloopUsers`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log('✅ Conexión exitosa a la base de datos');
  } catch (err) {
    console.error('❌ Error de conexión a la base de datos:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
