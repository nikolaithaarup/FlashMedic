import {useEffect,useRef,useState} from 'react';
import {appStorage} from '../../storage/appStorage';
import type {PatientCase} from './caseEngine';
import {decodeProgress,progressKey,recordCompletion,type Progress} from './caseProgress';
// Writes are serialized in this app session. No Firebase or cross-device sync.
let writes:Promise<void>=Promise.resolve();
export function useCaseProgress(uid:string|null){
 const [progress,setProgress]=useState<Progress>({});const current=useRef<Progress>({});
 const [status,setStatus]=useState<'loading'|'ready'|'unavailable'>(uid?'loading':'ready');
 const [saveError,setSaveError]=useState(false);
 useEffect(()=>{let alive=true;if(!uid)return;const key=progressKey(uid);void writes.then(()=>appStorage.getItem(key)).then(raw=>{if(!alive)return;current.current=decodeProgress(raw);setProgress(current.current);setStatus('ready');}).catch(()=>{if(alive)setStatus('unavailable');});return()=>{alive=false;};},[uid]);
 function complete(c:PatientCase,answers:boolean[]){
  if(status!=='ready')return;
  const next=recordCompletion(current.current,c,answers);current.current=next;setProgress(next);
  if(uid){const key=progressKey(uid);const payload=JSON.stringify(next);setSaveError(false);writes=writes.then(()=>appStorage.setItem(key,payload)).catch(()=>{setSaveError(true);});}
 }
 return {progress,status,saveError,complete};
}
