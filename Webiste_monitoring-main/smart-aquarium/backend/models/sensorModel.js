const pool = require('../config/db');
const getSensors = async () => {
  const res = await pool.query('SELECT * FROM sensors ORDER BY timestamp DESC LIMIT 100');
  return res.rows;
};
const addSensor = async ({ suhu, ph, kekeruhan }) => {
  await pool.query(
    'INSERT INTO sensors (suhu, ph, kekeruhan, timestamp) VALUES ($1, $2, $3, NOW())',
    [suhu, ph, kekeruhan]
  );
};
module.exports = { getSensors, addSensor };
