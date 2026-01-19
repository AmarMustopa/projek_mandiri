import React, {useState} from 'react';

export default function AutomationStatus(){
  const [on, setOn] = useState(true);
  return (
    <div className="card bg-slate-800">
      <h3 className="text-lg font-semibold mb-3">Automation Status</h3>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-300">Water Replacement System</div>
          <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full ${on? 'bg-emerald-600':'bg-rose-600'}`}>
            <span className="mr-2 w-2 h-2 rounded-full block" style={{background: on? '#bbf7d0':'#fecaca'}}></span>
            <span className="font-semibold">{on? 'ON' : 'OFF'}</span>
          </div>
        </div>
        <div>
          <button onClick={() => setOn(!on)} className="px-3 py-1 bg-slate-700 rounded">Toggle</button>
        </div>
      </div>
    </div>
  );
}
