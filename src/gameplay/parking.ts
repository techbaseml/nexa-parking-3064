export interface Pose { x:number; z:number; yaw:number }
export interface Bay extends Pose { width:number; length:number; tolerance:number; eitherDirection?:boolean }
export function angleDifference(a:number,b:number){return Math.abs(Math.atan2(Math.sin(a-b),Math.cos(a-b)));}
export function evaluateParking(p:Pose,width:number,length:number,b:Bay,speed:number,park:boolean,blocked:boolean){
 const c=Math.cos(b.yaw),s=Math.sin(b.yaw),dx=p.x-b.x,dz=p.z-b.z;
 const x=dx*c-dz*s,z=dx*s+dz*c,heading=angleDifference(p.yaw,b.yaw);
 const angle=b.eitherDirection?Math.min(heading,Math.PI-heading):heading;
 const a=p.yaw-b.yaw; const ex=Math.abs(Math.cos(a))*width/2+Math.abs(Math.sin(a))*length/2;
 const ez=Math.abs(Math.sin(a))*width/2+Math.abs(Math.cos(a))*length/2;
 const inside=Math.abs(x)+ex<=b.width/2 && Math.abs(z)+ez<=b.length/2;
 const accuracy=Math.max(0,1-(Math.abs(x)/(b.width/2)+Math.abs(z)/(b.length/2))/2);
 return {inside,angle,accuracy,valid:inside&&angle<=b.tolerance&&Math.abs(speed)<0.12&&park&&!blocked};
}
export function scoreParking(accuracy:number,angle:number,collisions:number,seconds:number,smoothness:number){
 const parts={accuracy:35*Math.max(0,Math.min(1,accuracy)),alignment:20*Math.max(0,1-angle/(Math.PI/12)),safety:Math.max(0,20-collisions*5),time:15*Math.min(1,60/Math.max(60,seconds)),smoothness:10*Math.max(0,Math.min(1,smoothness))};
 return {parts,total:Math.round(Object.values(parts).reduce((a,b)=>a+b,0))};
}
export const missions=[
 {name:'First precision',tag:'STRAIGHT PARKING',description:'A clear approach. Learn the feel of your vehicle.',x:0,z:9,yaw:0,width:3.6,length:6.8,tolerance:0.13,start:[0,-11,0],layout:0},
 {name:'The return',tag:'REVERSE PARKING',description:'Approach from the north and reverse into the bay.',x:0,z:0,yaw:0,width:3.4,length:6.5,tolerance:0.12,start:[0,13,0],layout:1},
 {name:'Urban offset',tag:'LATERAL APPROACH',description:'Navigate the aisle. Park fully inside the bay facing either direction.',eitherDirection:true,x:8,z:8,yaw:0,width:3.3,length:6.3,tolerance:0.1,start:[-8,-10,0],layout:2},
 {name:'Forty-five',tag:'ANGLED PARKING',description:'Read the angle. Settle into the diagonal bay.',x:5,z:7,yaw:Math.PI/4,width:3.4,length:6.5,tolerance:0.1,start:[-8,-10,0],layout:3},
 {name:'Curbside',tag:'PARALLEL PARKING',description:'A narrow curbside space between two parked cars.',x:8,z:2,yaw:0,width:3.1,length:7.4,tolerance:0.09,start:[2,-10,0],layout:4},
 {name:'Exact science',tag:'PRECISION PARKING',description:'A tighter bay. Every centimetre counts.',x:0,z:9,yaw:0,width:2.7,length:6.2,tolerance:0.065,start:[-7,-10,0],layout:5},
];

export function parkingGuidance(e:ReturnType<typeof evaluateParking>,speed:number,park:boolean,blocked:boolean,tolerance:number){
 if(!e.inside)return 'Move the entire car inside the marked bay';
 if(e.angle>tolerance)return `Straighten the car · alignment error ${(e.angle*180/Math.PI).toFixed(0)}°`;
 if(blocked)return 'Clear the obstacle touching the car';
 if(speed>=.12)return 'Brake to a complete stop';
 if(!park)return 'Select P to confirm parking';
 return 'Parking confirmed · keep still for 2 seconds';
}
