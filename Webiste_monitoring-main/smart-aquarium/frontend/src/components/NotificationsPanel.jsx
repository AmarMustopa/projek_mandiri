import React from 'react';

const alerts = [
  {id:1, level:'warning', text:'pH level rising above 8.0'},
  {id:2, level:'danger', text:'Dissolved oxygen low: 3.2 mg/L'},
  {id:3, level:'info', text:'Scheduled water replacement in 2 hours'},
];

export default function NotificationsPanel(){
  return (
    <div className="card bg-slate-800">
      <h3 className="text-lg font-semibold mb-3">Notifications</h3>
      <ul className="space-y-2">
        {alerts.map(a => (
          <li key={a.id} className="flex items-start gap-3">
            <div className={`w-2 h-2 rounded-full mt-2 ${a.level==='danger'? 'bg-rose-400': a.level==='warning'? 'bg-amber-400' : 'bg-sky-400'}`}></div>
            <div>
              <div className="text-sm">{a.text}</div>
              <div className="text-xs text-slate-400">{a.level}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
