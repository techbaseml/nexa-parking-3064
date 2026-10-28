import * as T from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import type {Car} from './definitions';
/** Original lofted bodywork; the returned group origin matches the Rapier chassis. */
export function vehicleModel(car:Car,color:string){
 const group=new T.Group(),wheels:T.Group[]=[];
 const paint=new T.MeshPhysicalMaterial({color,metalness:.74,roughness:.21,clearcoat:1,clearcoatRoughness:.12});
 const glass=new T.MeshPhysicalMaterial({color:'#1b2c38',metalness:.25,roughness:.09,clearcoat:1});
 const dark=new T.MeshStandardMaterial({color:'#0b1015',roughness:.65});
 const rubber=new T.MeshStandardMaterial({color:'#111315',roughness:.95});
 const silver=new T.MeshStandardMaterial({color:'#bfcbd7',metalness:.94,roughness:.22});
 const light=new T.MeshStandardMaterial({color:'#e4faff',emissive:'#b2eaff',emissiveIntensity:2});
 const tail=new T.MeshStandardMaterial({color:'#d51936',emissive:'#ff1837',emissiveIntensity:1});
 const {width:w,length:l}=car;const tall=car.id==='titan'||car.id==='cargo';const sport=['velocity','hyperion'].includes(car.id);const italian=car.id==='velocity',hyper=car.id==='hyperion';const roof=tall?.95:italian?.47:hyper?.55:.7;
 function mesh(geo:T.BufferGeometry,mat:T.Material,parent:T.Object3D=group){const m=new T.Mesh(geo,mat);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 function box(a:number,b:number,c:number,x:number,y:number,z:number,mat:T.Material,r=.04){const m=mesh(new RoundedBoxGeometry(a,b,c,3,r),mat);m.position.set(x,y,z);return m;}
 // Smooth variable-width body sections: front/rear taper, shoulder, hood and trunk.
 const anchors=italian?[[-.5,.88,.19],[-.44,.99,.30],[-.30,1,.32],[-.1,.90,.26],[.17,.98,.17],[.34,1,.14],[.46,.86,.01],[.5,.69,-.04]]:hyper?[[-.5,.84,.18],[-.44,1,.27],[-.30,1,.34],[-.06,.96,.29],[.18,.98,.24],[.34,1,.24],[.46,.89,.15],[.5,.75,.08]]:[[-.5,.78,.12],[-.46,.94,.24],[-.35,1,.29],[-.17,1,.27],[.17,1,.28],[.32,.99,.24],[.45,.93,.13],[.5,.76,.04]];
 const loft=new T.CatmullRomCurve3(anchors.map(([z,scale,top])=>new T.Vector3(z,scale,top)));const sections=loft.getPoints(48).map(v=>[v.x,v.y,v.z]);
 const pos:number[]=[],indices:number[]=[];
 for(const [z,scale,top]of sections){const half=w*.5*scale;const contour=[[-half*.8,-.3],[-half,-.17],[-half,.05],[-half*.84,top],[0,top+.045],[half*.84,top],[half,.05],[half,-.17],[half*.8,-.3],[0,-.31]];for(const [x,y]of contour)pos.push(x,y,z*l);}
 const n=10;for(let j=0;j<sections.length-1;j++)for(let k=0;k<n;k++){const a=j*n+k,b=j*n+(k+1)%n,c=(j+1)*n+k,d=(j+1)*n+(k+1)%n;indices.push(a,c,b,b,c,d);}for(const j of [0,sections.length-1])for(let k=1;k<n-1;k++)indices.push(j*n,j*n+k+(j===0?0:1),j*n+k+(j===0?1:0));
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setIndex(indices);geo.computeVertexNormals();mesh(geo,paint);
 // Cabin, sloping windshield and rear window are separate shaped surfaces.
 const vertices=[[-w*.41,.25,l*.2],[w*.41,.25,l*.2],[-w*.32,roof,l*.015],[w*.32,roof,l*.015],[-w*.33,roof,-l*.19],[w*.33,roof,-l*.19],[-w*.42,.26,-l*.34],[w*.42,.26,-l*.34]];
 function panel(ids:number[],mat:T.Material){const p=ids.flatMap(i=>vertices[i]);const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex([0,2,1,1,2,3]);g.computeVertexNormals();const m=mesh(g,mat);m.material.side=T.DoubleSide;return m;}
 panel([0,1,2,3],glass);panel([4,5,6,7],glass);panel([0,2,6,4],glass);panel([1,3,7,5],glass);panel([2,3,4,5],paint);
 function tube(points:T.Vector3[],radius:number,mat:T.Material){const path=new T.CatmullRomCurve3(points);return mesh(new T.TubeGeometry(path,20,radius,6,false),mat);}
 for(const side of [-1,1]){
 const ids=side<0?[0,2,4,6]:[1,3,5,7];tube(ids.map(i=>new T.Vector3(...vertices[i] as [number,number,number])),.024,paint);
 tube([new T.Vector3(side*w*.41,.26,l*.2),new T.Vector3(side*w*.42,.27,-l*.34)],.024,paint);
 tube([new T.Vector3(side*w*.405,.29,-l*.11),new T.Vector3(side*w*.325,roof,-l*.11)],.028,dark);
 // Door shut lines, handles, rocker panels and a swept mirror.
 tube([new T.Vector3(side*w*.493,.2,l*.14),new T.Vector3(side*w*.498,-.14,l*.11),new T.Vector3(side*w*.497,-.17,-l*.21),new T.Vector3(side*w*.495,.2,-l*.24)],.006,dark);
 box(.023,.035,.16,side*w*.498,.14,-l*.09,silver,.01);
 box(.06,.09,l*.55,side*w*.48,-.26,-.01,dark,.02);
 box(.19,.105,.26,side*w*.49,.33,l*.14,paint,.04);
 box(w*.31,.035,.06,side*w*.27,.10,l*.48,light,.012).rotation.y=-side*.12;
 box(w*.32,.04,.055,side*w*.27,.15,-l*.475,tail,.015).rotation.y=side*.08;
 // Front air inlets.
 box(w*.22,.115,.05,side*w*.30,-.115,l*.475,dark,.025);
 for(let j=0;j<4;j++)box(w*.15,.006,.015,side*w*.30,-.15+j*.022,l*.505,silver,.001);
 }
 box(w*.40,.13,.06,0,-.12,l*.498,dark,.03);
 box(w*.84,.04,.13,0,-.28,l*.44,dark,.01);box(w*.82,.1,.14,0,-.24,-l*.45,dark,.02);
 box(.42,.10,.03,0,-.075,-l*.498,silver,.01);
 if(sport)box(w*.72,.04,.2,0,.3,-l*.43,paint,.02);
 if(italian){
 // Mid-engine Italian-style wedge: deep side scoops, rear deck louvers, round lamps, raised aero wing.
 for(const side of [-1,1]){
 const scoop=box(.045,.20,l*.25,side*w*.495,-.005,-l*.17,dark,.025);scoop.rotation.y=-side*.14;
 tube([new T.Vector3(side*w*.48,.12,-l*.02),new T.Vector3(side*w*.46,.25,-l*.23)],.025,paint);
 for(const dx of [.23,.35]){const lamp=mesh(new T.TorusGeometry(.075,.021,8,24),tail);lamp.position.set(side*w*dx,.17,-l*.50);}
 box(.055,.18,.10,side*w*.31,.35,-l*.42,dark,.012);
 }
 for(let j=0;j<7;j++)box(w*.53,.02,.035,0,.32,-l*.24-j*.09,dark,.006);
 box(w*.86,.055,.29,0,.46,-l*.43,paint,.015);
 box(w*.76,.05,.22,0,-.27,l*.43,dark,.012);
 }
 if(hyper){
 // Rounded hypercar: horseshoe intake, two-tone rear body, signature side arcs and full-width rear light.
 const secondary=new T.MeshPhysicalMaterial({color:'#0c1627',metalness:.8,roughness:.2,clearcoat:1});
 for(const side of [-1,1]){
 box(.045,.25,l*.3,side*w*.49,.015,-l*.22,secondary,.035);
 tube([new T.Vector3(side*w*.47,.14,l*.02),new T.Vector3(side*w*.44,roof*.82,-l*.10),new T.Vector3(side*w*.46,.32,-l*.31),new T.Vector3(side*w*.49,-.12,-l*.24),new T.Vector3(side*w*.49,-.13,l*.01)],.027,silver);
 for(let j=0;j<4;j++)box(.075,.045,.035,side*(.42+j*.095),.16,l*.48,light,.008);
 }
 tube([new T.Vector3(-.20,-.20,l*.503),new T.Vector3(-.20,.08,l*.503),new T.Vector3(0,.18,l*.503),new T.Vector3(.20,.08,l*.503),new T.Vector3(.20,-.20,l*.503)],.023,silver);
 box(.36,.27,.04,0,-.02,l*.505,dark,.07);box(w*.78,.035,.04,0,.20,-l*.505,tail,.012);
 for(let j=0;j<6;j++)box(.03,.04,.45,-.25+j*.1,.34,-l*.31,dark,.005);
 }
 if(car.id==='cargo')box(w*.77,.75,l*.45,0,.63,-l*.13,paint,.07);
 // Wheel center groups contain a rolling subassembly, so steering and wheel spin are independent.
 for(let i=0;i<4;i++){
 const wheel=new T.Group(),spin=new T.Group();wheel.add(spin);
 const tire=mesh(new T.TorusGeometry(.267,.073,12,40),rubber,spin);tire.rotation.y=Math.PI/2;
 const inner=mesh(new T.CylinderGeometry(.265,.265,.18,40,1,true),rubber,spin);inner.rotation.z=Math.PI/2;
 const rim=mesh(new T.TorusGeometry(.227,.018,6,40),silver,spin);rim.rotation.y=Math.PI/2;rim.position.x=i%2===0?-.105:.105;
 const disk=mesh(new T.CylinderGeometry(.185,.185,.012,32),silver,spin);disk.rotation.z=Math.PI/2;
 const hub=mesh(new T.CylinderGeometry(.047,.047,.23,16),dark,spin);hub.rotation.z=Math.PI/2;
 for(let j=0;j<5;j++){const spoke=mesh(new T.BoxGeometry(.21,.025,.38),silver,spin);spoke.rotation.x=j*Math.PI/5;}
 const caliper=mesh(new T.BoxGeometry(.04,.12,.065),new T.MeshStandardMaterial({color:'#d95338',metalness:.5,roughness:.4}),wheel);caliper.position.set(i%2===0?-.06:.06,.08,-.14);
 wheel.position.set((i%2===0?-1:1)*(w/2-.13),-.35,(i<2?1:-1)*car.wheelbase/2);group.add(wheel);wheels.push(wheel);
 }
 return {group,wheels,paint,tail,light};
}
