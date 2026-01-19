export default function SensorCard({ suhu, ph, kekeruhan }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <div>Suhu: {suhu}°C</div>
      <div>pH: {ph}</div>
      <div>Kekeruhan: {kekeruhan}</div>
    </div>
  );
}
