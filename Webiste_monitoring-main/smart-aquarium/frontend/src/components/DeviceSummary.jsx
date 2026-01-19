import React from 'react';

const sensors = [
  {name:'Temp Sensor', ok:true},
  {name:'pH Sensor', ok:true},
  {name:'Turbidity', ok:true},
  {name:'DO Sensor', ok:false},
  {name:'Level Sensor', ok:true}
];

export default function DeviceSummary(){
  const success = 128, failed = 4;
  return (
    <div className="card bg-slate-800">
      <h3 className="text-lg font-semibold mb-3">Device Summary</h3>
      <div className="space-y-2">
        {sensors.map(s => (
          <div key={s.name} className="flex items-center justify-between">
            <div className="text-sm">{s.name}</div>
            <div className={`text-xs px-2 py-0.5 rounded ${s.ok? 'bg-emerald-600':'bg-rose-600'}`}>{s.ok? 'Active':'Inactive'}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-400">Successful transmissions</div>
          <div className="font-bold text-lg">{success}</div>
        </div>
        <div>
          <div className="text-sm text-slate-400">Failed transmissions</div>
          <div className="font-bold text-lg text-rose-400">{failed}</div>
        </div>
      </div>
    </div>
  );
}
