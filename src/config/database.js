// src/config/database.js
const mongoose = require('mongoose');
const MONGO_DB = Deno.env.get('MONGO_DB');
const MONGO_PASS = Deno.env.get("MONGO_PASS");
const MONGO_USER = Deno.env.get("MONGO_USER");

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@stayloopusers.3alunnv.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`,
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
