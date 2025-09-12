const mongoose = require('mongoose');
const { password } = process.env;

mongoose.connect(
  `mongodb+srv://rs25001_db_user:${password}@stayloopusers.3alunnv.mongodb.net/Securitystayloop`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => console.log(' Conexión exitosa a la base de datos'))
.catch(err => console.error('Database connection error:', err));

module.exports = mongoose;