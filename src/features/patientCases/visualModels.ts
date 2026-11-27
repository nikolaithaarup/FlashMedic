// Original simplified educational drawings. Coordinates use a 320 x 180 canvas.
export type DiagramId='heart'|'airway'|'ecg'|'nephron'|'brain';
export type ModelId='co'|'av'|'mv'|'coRate'|'avRate';
type Point=[number,number];
type Stroke={points:Point[];color:string;width:number};
type Region={id:string;label:string;x:number;y:number};
type Diagram={caption:string;strokes:Stroke[];regions:Region[];grid?:boolean};
const line=(color:string,width:number,points:Point[]):Stroke=>({color,width,points});
const blue='#70B9ED',red='#F29C9B',teal='#5EEAD4',grey='#B7C8D3';
const region=(id:string,label:string,x:number,y:number):Region=>({id,label,x,y});
export const diagrams:Record<DiagramId,Diagram>={
 heart:{caption:'Skematisk hjerte set forfra · patientens højre er til venstre',strokes:[
 line(blue,3,[[85,14],[85,45],[59,57],[51,80],[65,100],[110,103],[135,88],[135,54],[110,45],[85,45]]),
 line(blue,3,[[65,100],[54,122],[82,145],[140,163],[148,113],[110,103]]),
 line(red,3,[[184,56],[207,45],[248,55],[267,73],[248,100],[202,102],[177,87],[184,56]]),
 line(red,5,[[202,102],[175,113],[155,163],[218,146],[255,123],[248,100]]),
 line(grey,2,[[150,88],[158,160]]),line(blue,4,[[120,116],[145,36],[119,25],[95,25]]),line(red,4,[[207,112],[172,34],[195,15],[230,15],[247,30],[247,43]])],
 regions:[region('ra','Højre atrium',94,73),region('rv','Højre ventrikel',103,132),region('la','Venstre atrium',226,73),region('lv','Venstre ventrikel',217,132)]},
 airway:{caption:'Skematisk nedre luftvej og lunger',strokes:[
 line(grey,2,[[146,35],[122,22],[90,31],[62,65],[52,111],[69,137],[131,140],[146,120],[146,35]]),
 line(grey,2,[[174,35],[196,22],[232,31],[258,65],[268,111],[251,137],[189,140],[174,120],[174,35]]),
 line(teal,8,[[160,12],[160,60]]),line(teal,7,[[160,60],[110,86],[82,104]]),line(teal,7,[[160,60],[210,86],[238,104]]),
 line(teal,3,[[110,86],[101,118],[83,127]]),line(teal,3,[[210,86],[221,118],[240,127]]),
 line(teal,2,[[238,104],[246,96],[257,104],[254,116],[242,117],[238,104]]),
 line(grey,4,[[42,156],[90,143],[160,137],[230,143],[278,156]])],
 regions:[region('trachea','Trachea',160,28),region('bronchus','Hovedbronkie',116,79),region('alveoli','Alveoler (skematisk klynge)',252,108),region('diaphragm','Diafragma',160,148)]},
 ecg:{caption:'Skematisk normal enkeltcyklus · ikke et patient-EKG eller en måleskala',grid:true,strokes:[
 line('#F2F7F8',2.5,[[12,105],[35,105],[45,103],[55,90],[64,87],[73,90],[83,103],[95,105],[118,105],[126,114],[139,37],[150,128],[161,105],[190,105],[205,100],[220,76],[235,69],[250,76],[267,100],[278,105],[308,105]])],
 regions:[region('p','P-tak',64,118),region('qrs','QRS-kompleks',145,148),region('t','T-tak',235,118)]},
 nephron:{caption:'Skematisk nefron · ikke i målestok',strokes:[
 line(red,3,[[16,48],[45,48],[53,34],[74,32],[86,43],[78,62],[60,65],[49,49],[65,38],[80,51],[64,58],[91,60],[104,42]]),
 line(grey,3,[[47,24],[35,40],[38,68],[58,82],[90,74],[104,59],[104,38],[91,22]]),
 line(teal,5,[[90,74],[118,86],[135,72],[151,86],[140,99],[154,109],[154,150],[184,150],[184,77],[207,66],[226,80],[208,96],[242,95],[258,106],[258,162]])],
 regions:[region('glomerulus','Glomerulus',67,48),region('proximal','Proksimale tubulus',130,86),region('loop','Henles slynge',169,147),region('collecting','Samlerør',258,133)]},
 brain:{caption:'Skematisk sidevisning af venstre hjernehalvdel · front mod venstre',strokes:[
 line(grey,3,[[37,93],[30,66],[45,37],[82,23],[127,19],[175,23],[220,34],[256,58],[279,83],[276,111],[252,134],[214,145],[180,137],[153,142],[115,132],[76,130],[48,117],[37,93]]),
 line(teal,2,[[150,22],[144,50],[151,75],[138,98]]),line(teal,2,[[55,103],[108,96],[149,106],[193,91],[238,81]]),line(grey,2,[[223,38],[214,64],[226,87],[214,136]])],
 regions:[region('frontal','Frontallap',84,63),region('parietal','Parietallap',182,55),region('temporal','Temporallap',142,120),region('occipital','Occipitallap',249,91)]}
};
export const modelInfo:Record<ModelId,{label:string;fixedLabel:string;fixedUnit:string;unit:string;output:string;formula:string}>={
 co:{label:'Slagvolumen',fixedLabel:'Puls',fixedUnit:'/min',unit:'ml',output:'Minutvolumen',formula:'CO = puls × slagvolumen / 1000'},
 av:{label:'Tidalvolumen',fixedLabel:'RF',fixedUnit:'/min',unit:'ml',output:'Alveolær ventilation',formula:'VA = RF × (tidalvolumen − 150 ml) / 1000'},
 mv:{label:'Tidalvolumen',fixedLabel:'RF',fixedUnit:'/min',unit:'ml',output:'Minutventilation',formula:'VE = RF × tidalvolumen / 1000'},
 coRate:{label:'Puls',fixedLabel:'Slagvolumen',fixedUnit:' ml',unit:'/min',output:'Minutvolumen',formula:'CO = puls × slagvolumen / 1000'},
 avRate:{label:'RF',fixedLabel:'Tidalvolumen',fixedUnit:' ml',unit:'/min',output:'Alveolær ventilation',formula:'VA = RF × (tidalvolumen − 150 ml) / 1000'}
};
export function modelOutput(model:ModelId,value:number,fixed:number){return model==='avRate'?value*Math.max(0,fixed-150)/1000:fixed*(model==='av'?Math.max(0,value-150):value)/1000;}
