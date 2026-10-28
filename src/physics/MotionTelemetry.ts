export class MotionTelemetry {
 speed=0;distance=0;deltaX=0;deltaZ=0;private x=0;private z=0;
 reset(p:{x:number;z:number}){this.x=p.x;this.z=p.z;this.speed=0;this.distance=0;this.deltaX=0;this.deltaZ=0;}
 sample(p:{x:number;z:number},dt:number){this.deltaX=p.x-this.x;this.deltaZ=p.z-this.z;const traveled=Math.hypot(this.deltaX,this.deltaZ);this.x=p.x;this.z=p.z;this.distance+=traveled;this.speed=dt>0?traveled/dt:0;return traveled;}
}
