import React,{useRef} from 'react';
import {syringeGeometry,syringeTicks,snapVolume,type SyringeSpec} from './syringeGeometry';
type Props={spec:SyringeSpec;value:number;onChange?:(v:number)=>void;disabled?:boolean;readOnly?:boolean};
export default function SyringeExercise({spec,value,onChange,disabled=false,readOnly=false}:Props){
 const svg=useRef<SVGSVGElement>(null),start=useRef<{x:number;volume:number}|null>(null);
 const g=syringeGeometry(spec,value),fmt=(n:number)=>n.toLocaleString('da-DK',{maximumFractionDigits:2});
 const xAt=(clientX:number)=>{const r=svg.current?.getBoundingClientRect();return r&&r.width>0?(clientX-r.left)*320/r.width:0;};
 const active=!disabled&&!readOnly&&!!onChange;
 return <div style={{width:'100%',maxWidth:550,alignSelf:'center',color:'#e5e7eb'}}>
 <svg ref={svg} viewBox="0 0 320 90" width="100%" role={readOnly?'img':undefined} aria-label={readOnly?'Gradueret øvelsessprøjte. Aflæs stempelfronten.':'Øvelsessprøjte med spids til venstre og stempel til højre'} style={{display:'block',userSelect:'none'}}>
 <rect x="3" y="52" width="10" height="6" rx="2" fill="#a7b5be"/><path d="M13 49 H24 L32 39 V71 L24 61 H13 Z" fill="#8598a5" stroke="#c6d4da"/>
 <rect x="32" y="35" width="136" height="40" rx="3" fill="#142d37" stroke="#9bb5c2" strokeWidth="1.2"/>
 <rect x={g.x0} y="37" width={g.fill} height="36" fill="#28b8ac" opacity=".58"/>
 <rect x={g.piston} y="38" width="6" height="34" rx="1" fill="#dce6eb"/><rect x={g.piston+6} y="51" width="136" height="8" rx="2" fill="#8b9ca7"/><rect x={g.rodEnd-3} y="39" width="6" height="32" rx="2" fill="#cfdae0"/><path d="M168 31 V79 M172 31 V79" stroke="#9bb5c2" strokeWidth="2"/>
 {syringeTicks(spec).map(t=>{const x=g.x0+g.barrel*t.volume/spec.capacity;return <g key={t.volume}><line x1={x} x2={x} y1="35" y2={t.major?47:41} stroke="#dce6eb" strokeWidth={t.major?1.1:.7}/>{t.major&&<text x={x} y="28" textAnchor="middle" fontSize="10" fill="#e5e7eb">{fmt(t.volume)}</text>}</g>})}
 <text x="176" y="28" fontSize="10" fill="#a7b5be">mL</text><line x1={g.piston} x2={g.piston} y1="46" y2="75" stroke="#ecfeff" strokeWidth="1.4"/>
 {active&&<rect x={g.rodEnd-18} y="31" width="34" height="48" fill="transparent" style={{cursor:'ew-resize',touchAction:'none'}} onPointerDown={e=>{start.current={x:xAt(e.clientX),volume:value};e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={e=>{if(start.current)onChange?.(snapVolume(spec,start.current.volume+(xAt(e.clientX)-start.current.x)*spec.capacity/g.barrel));}} onPointerUp={()=>{start.current=null;}} onPointerCancel={()=>{start.current=null;}} onLostPointerCapture={()=>{start.current=null;}}/>}
 </svg>
 {!readOnly&&<><div style={{textAlign:'center',fontSize:22,fontWeight:700,color:'#5eead4'}}>{fmt(g.volume)} mL</div><div style={{marginLeft:'7%',width:'47%'}}><input type="range" aria-label="Sprøjtevolumen i mL" min={0} max={spec.capacity} step={spec.increment} value={g.volume} disabled={!active} onChange={e=>onChange?.(Number(e.currentTarget.value))} onPointerUp={e=>onChange?.(Number(e.currentTarget.value))} style={{width:'100%',margin:0,height:44,accentColor:'#5eead4',direction:'ltr'}}/></div><div style={{textAlign:'center',fontSize:12,color:'#a7b5be'}}>Træk mod højre · skub mod venstre</div></>}
 </div>;
}
