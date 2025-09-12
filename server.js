const express = require('express');
const bodyParser = require('body-parser');
const clientRoutes = require('./src/routes/clientRoutes');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());


app.use('/api/clients', clientRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});