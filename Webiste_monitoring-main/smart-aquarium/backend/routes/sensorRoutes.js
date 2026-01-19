const express = require('express');
const router = express.Router();
const { getSensors, addSensor } = require('../models/sensorModel');

router.get('/', async (req, res) => {
  const data = await getSensors();
  res.json(data);
});

router.post('/', async (req, res) => {
  await addSensor(req.body);
  res.status(201).json({ message: 'Sensor data added' });
});

module.exports = router;
