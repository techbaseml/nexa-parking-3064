import RAPIER from '@dimforge/rapier3d-compat';
import type { Car } from '../vehicles/definitions';
export type Gear='P'|'R'|'N'|'D';
export class VehiclePhysics {
 body:RAPIER.RigidBody; collider:RAPIER.Collider; controller:RAPIER.DynamicRayCastVehicleController; steer=0; gear:Gear='P'; power=true;
 constructor(public world:RAPIER.World,public car:Car){
 this.body=world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(0,1.1,0).setLinearDamping(0.16).setAngularDamping(0.65).setCcdEnabled(true));
 this.collider=world.createCollider(RAPIER.ColliderDesc.cuboid(car.width/2,0.32,car.length/2).setMass(car.mass).setFriction(0.5).setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS),this.body);
 this.controller=world.createVehicleController(this.body);this.controller.indexUpAxis=1;this.controller.setIndexForwardAxis=2;
 for(let i=0;i<4;i++){this.controller.addWheel({x:(i%2===0?-1:1)*(car.width/2-0.13),y:0,z:(i<2?1:-1)*car.wheelbase/2},{x:0,y:-1,z:0},{x:-1,y:0,z:0},0.38,0.34);
 this.controller.setWheelSuspensionStiffness(i,30);this.controller.setWheelSuspensionCompression(i,4.4);this.controller.setWheelSuspensionRelaxation(i,5.5);this.controller.setWheelMaxSuspensionForce(i,car.mass*15);this.controller.setWheelMaxSuspensionTravel(i,0.22);this.controller.setWheelFrictionSlip(i,2.4);this.controller.setWheelSideFrictionStiffness(i,1.0);}
 }
 get speed(){const v=this.body.linvel();return Math.hypot(v.x,v.z);}
 get yaw(){const q=this.body.rotation();return Math.atan2(2*(q.w*q.y+q.x*q.z),1-2*(q.y*q.y+q.x*q.x));}
 changeGear(g:Gear){if(this.speed>0.5)return false;this.gear=g;this.body.wakeUp();return true;}
 reset(x:number,z:number,yaw:number){this.body.setTranslation({x,y:0.95,z},true);this.body.setRotation({x:0,y:Math.sin(yaw/2),z:0,w:Math.cos(yaw/2)},true);this.body.setLinvel({x:0,y:0,z:0},true);this.body.setAngvel({x:0,y:0,z:0},true);this.steer=0;this.gear='P';this.power=true;}
 step(dt:number,throttle:number,brake:number,steer:number,handbrake:boolean){
 // Rapier's raycast controller can change velocity without waking its rigid body.
 // Wake on driver input, and never accumulate controller velocity on a sleeping chassis.
 if(throttle>0||brake>0||handbrake||Math.abs(steer)>.001)this.body.wakeUp();
 if(this.body.isSleeping())return;
 const limit=0.55/(1+this.speed*0.065);this.steer+=(steer*limit-this.steer)*Math.min(1,dt*6);
 for(let i=0;i<4;i++){
 let angle=0;if(i<2&&Math.abs(this.steer)>0.001){const radius=this.car.wheelbase/Math.tan(Math.abs(this.steer));const inner=(this.steer>0?i===1:i===0);angle=Math.sign(this.steer)*Math.atan(this.car.wheelbase/(radius+(inner?-1:1)*(this.car.width-0.26)/2));}
 this.controller.setWheelSteering(i,angle);
 this.controller.setWheelEngineForce(i,this.power&&brake<0.1&&!handbrake&&i<2&&this.speed<12?throttle*this.car.force*(this.gear==='D'?1:this.gear==='R'?-0.65:0):0);
 this.controller.setWheelBrake(i,this.gear==='P'?90:brake*140+(handbrake&&i>=2?90:0));
 }
 this.controller.updateVehicle(dt,undefined,undefined,c=>c.handle!==this.collider.handle);
 }
 dispose(){this.world.removeVehicleController(this.controller);this.world.removeRigidBody(this.body);}
}
