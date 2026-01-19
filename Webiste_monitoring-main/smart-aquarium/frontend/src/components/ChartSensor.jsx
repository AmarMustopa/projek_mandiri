import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
export default function ChartSensor({ data }) {
  return (
    <LineChart width={500} height={300} data={data}>
      <XAxis dataKey="timestamp" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="suhu" stroke="#8884d8" />
      <Line type="monotone" dataKey="ph" stroke="#82ca9d" />
      <Line type="monotone" dataKey="kekeruhan" stroke="#ff7300" />
    </LineChart>
  );
}
