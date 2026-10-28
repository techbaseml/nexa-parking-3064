import {beforeAll,it,expect} from 'vitest';
import RAPIER from '@dimforge/rapier3d-compat';
import * as T from 'three';
import {environment} from '../src/environment';
import {VehiclePhysics} from '../src/physics/VehiclePhysics';
import {DriveController} from '../src/input/DriveController';
import {cars} from '../src/vehicles/definitions';
import {missions,evaluateParking,parkingGuidance} from '../src/gameplay/parking';
beforeAll(async()=>await RAPIER.init());
for(const car of cars)it(`${car.name}: Urban parking validates for two seconds in either direction after selecting P`,()=>{
 const world=new RAPIER.World({x:0,y:-9.81,z:0});environment(new T.Scene(),world).layout(2);
 const v=new VehiclePhysics(world,car),drive=new DriveController(v),m=missions[2];
 for(const yaw of [0,Math.PI]){
 v.reset(m.x,m.z,yaw);v.changeGear('N');
 for(let i=0;i<180;i++){v.step(1/60,0,0,0,false);world.step();}
 drive.requestGear('P');let hold=0;
 for(let i=0;i<125;i++){
 drive.update(1/60,{throttle:0,brake:0,steer:0,handbrake:false,reverse:false});world.step();
 const p=v.body.translation();let blocked=false;
 world.contactPairsWith(v.collider,c=>world.contactPair(v.collider,c,m=>{for(let j=0;j<m.numContacts();j++)if(m.contactDist(j)<-.015)blocked=true;}));
 const e=evaluateParking({x:p.x,z:p.z,yaw:v.yaw},car.width,car.length,m,v.speed,v.gear==='P',blocked||p.y>1.4);
 hold=e.valid?hold+1/60:0;
 }
 expect(hold).toBeGreaterThanOrEqual(2);
 }
 v.dispose();world.free();
});
it('still rejects outside, crooked, moving, unparked, or obstructed Urban parking and explains why',()=>{
 const m=missions[2];
 for(const [x,yaw,speed,park,blocked,reason] of [[m.x+2,0,0,true,false,'entire car'],[m.x,.3,0,true,false,'Straighten'],[m.x,0,.2,true,false,'Brake'],[m.x,0,0,false,false,'Select P'],[m.x,0,0,true,true,'obstacle']] as const){
 const e=evaluateParking({x,z:m.z,yaw},1.82,4.1,m,speed,park,blocked);
 expect(e.valid).toBe(false);expect(parkingGuidance(e,speed,park,blocked,m.tolerance)).toContain(reason);
 }
});
