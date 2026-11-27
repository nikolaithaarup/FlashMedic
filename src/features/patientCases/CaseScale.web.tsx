import React from 'react';
import type { ScaleProps } from './CaseScale';
export default function CaseScale({min,max,step,value,onChange,disabled,unit}:ScaleProps){
 const start=Math.min(max,min+Math.round((max-min)/2/step)*step);
 return <div style={{width:'100%',color:'#f8f9fa',fontFamily:'inherit'}}>
   <div style={{textAlign:'center',fontWeight:700,fontSize:22,marginBottom:8}}>{value===null?'Vælg værdi':`${value.toLocaleString('da-DK')} ${unit}`}</div>
   <input type="range" aria-label={`Vælg værdi i ${unit}`} min={min} max={max} step={step} value={value??start} disabled={disabled} onChange={e=>onChange(Number(e.currentTarget.value))} onPointerUp={e=>{if(value===null)onChange(Number(e.currentTarget.value));}} onKeyDown={e=>{if(value===null&&['Enter',' '].includes(e.key)){e.preventDefault();onChange(Number(e.currentTarget.value));}}} style={{width:'100%',height:44,margin:0,accentColor:'#5eead4'}}/>
   <div style={{display:'flex',justifyContent:'space-between',fontSize:13}}><span>{min}</span><span>{max} {unit}</span></div>
   {value===null&&!disabled&&<button type="button" onClick={()=>onChange(start)} style={{background:'transparent',color:'#5eead4',border:'1px solid #5eead4',borderRadius:8,padding:'10px 14px',marginTop:8}}>Vælg {start.toLocaleString('da-DK')} {unit}</button>}
 </div>;
}
