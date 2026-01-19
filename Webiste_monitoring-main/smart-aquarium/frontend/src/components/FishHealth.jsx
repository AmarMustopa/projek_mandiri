import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function FishHealth(){
  const healthy = 78;
  const data = [ { name:'Healthy', value: healthy }, { name:'Needs', value: 100-healthy } ];
  const colors = ['#34d399', '#f97316'];
  return (
    <div className="card bg-slate-800">
      <h3 className="text-lg font-semibold mb-3">Fish Health Indicator</h3>
      <div style={{width: '100%', height: 180}}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} innerRadius={50} outerRadius={70} dataKey="value">
              {data.map((entry, idx) => <Cell key={idx} fill={colors[idx]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-center">
        <div className="text-sm text-slate-400">Healthy Environment</div>
        <div className="text-2xl font-bold">{healthy}%</div>
      </div>
    </div>
  );
}
