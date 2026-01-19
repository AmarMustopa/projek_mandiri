import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

export default function WaterQualityOverview({ data = [], latest = null }){
  // derive display values - prefer latest then fall back to averages or defaults
  const defaultList = [
    { name:'Suhu', value: latest?.suhu ?? (data.length? (data.reduce((s,it)=>s+Number(it.suhu||0),0)/data.length).toFixed(1): 0), fill: '#60a5fa' },
    { name:'pH', value: latest?.ph ?? (data.length? (data.reduce((s,it)=>s+Number(it.ph||0),0)/data.length).toFixed(2): 0), fill: '#34d399' },
    { name:'Kekeruhan', value: latest?.kekeruhan ?? (data.length? (data.reduce((s,it)=>s+Number(it.kekeruhan||0),0)/data.length).toFixed(1): 0), fill: '#f97316' },
  ];

  return (
    <div className="card bg-slate-800">
      <h3 className="text-lg font-semibold mb-3">Water Quality Overview</h3>
      <div className="grid grid-cols-2 gap-3">
        {defaultList.map((s)=> (
          <div key={s.name} className="flex flex-col items-center bg-slate-900 p-3 rounded">
            <div className="text-sm text-slate-300">{s.name}</div>
            <div className="w-28 h-28">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="60%" outerRadius="100%" data={[{...s, value: Number(s.value)}] } startAngle={180} endAngle={-180}>
                  <RadialBar minAngle={15} background clockWise dataKey="value" cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 font-semibold text-lg">{s.value}{s.name==='Suhu'? ' °C':''}{s.name==='DO'? ' mg/L':''}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
