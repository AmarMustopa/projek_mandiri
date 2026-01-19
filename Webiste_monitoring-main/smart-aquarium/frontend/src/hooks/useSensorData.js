import { useEffect, useState, useRef } from 'react';

export default function useSensorData({endpoint='/api/dummy-sensors/', interval=5000} = {}){
  const [data, setData] = useState([]);
  const mounted = useRef(true);

  useEffect(()=>{
    mounted.current = true;
    async function fetchOnce(){
      try{
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const json = await res.json();
        if (mounted.current) setData(json);
      }catch(err){
        console.warn('useSensorData fetch error', err);
      }
    }
    fetchOnce();
    const id = setInterval(fetchOnce, interval);
    return ()=>{ mounted.current = false; clearInterval(id); };
  }, [endpoint, interval]);

  const latest = data && data.length? data[data.length-1] : null;
  return { data, latest };
}
