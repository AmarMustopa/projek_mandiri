const express = require('express');
const cors = require('cors');
const sensorRoutes = require('./routes/sensorRoutes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/sensors', sensorRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));
