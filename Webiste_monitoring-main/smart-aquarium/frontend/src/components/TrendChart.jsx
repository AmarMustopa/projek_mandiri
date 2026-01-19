import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = Array.from({length:12}).map((_,i)=>({
  time: `T-${11-i}`,
  suhu: 25 + Math.sin(i/2)*2 + Math.random()*0.5,
  ph: 7 + Math.cos(i/3)*0.2 + Math.random()*0.05,
  kekeruhan: 10 + Math.abs(Math.sin(i/2))*8 + Math.random()*2
}));

export default function TrendChart(){
  return (
    <div className="card bg-slate-800">
      <h3 className="text-lg font-semibold mb-3">Trend Analysis</h3>
      <div style={{width:'100%', height:320}}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#0b1220" />
            <XAxis dataKey="time" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="suhu" stroke="#60a5fa" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="ph" stroke="#34d399" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="kekeruhan" stroke="#f97316" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
