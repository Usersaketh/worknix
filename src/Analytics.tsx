import React from 'react';

// Lightweight placeholder analytics component (skip in dev)
export function Analytics(){
  React.useEffect(()=>{
    if (import.meta.env.DEV) return;
    fetch('/__analytics', { method: 'POST', body: JSON.stringify({ path: location.pathname, ts: Date.now() }) }).catch(()=>{});
  },[]);
  return null;
}
