export type SyringeSpec={capacity:number;increment:number};
export function syringeSpec(capacity:1|2|5|10):SyringeSpec{return {capacity,increment:capacity===1||capacity===2?.1:capacity===5?.2:.5};}
export function snapVolume(spec:SyringeSpec,value:number){return Math.round(Math.max(0,Math.min(spec.capacity,Math.round(value/spec.increment)*spec.increment))*1000)/1000;}
export function syringeGeometry(spec:SyringeSpec,volume:number){const x0=32,barrel=130,v=snapVolume(spec,volume),fill=barrel*v/spec.capacity,piston=x0+fill;return {x0,barrel,fill,piston,rodEnd:piston+142,volume:v};}
export function syringeTicks(spec:SyringeSpec){const count=Math.round(spec.capacity/spec.increment),majorEvery=spec.capacity===1?2:spec.capacity===2?5:spec.capacity===5?5:2;return Array.from({length:count+1},(_,i)=>({volume:Math.round(i*spec.increment*1000)/1000,major:i%majorEvery===0||i===count}));}
