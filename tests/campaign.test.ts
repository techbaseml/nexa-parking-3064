import {beforeAll,it,expect} from 'vitest';import * as T from 'three';import RAPIER from '@dimforge/rapier3d-compat';import {environment} from '../src/environment';import {missions,evaluateParking} from '../src/gameplay/parking';import {cars} from '../src/vehicles/definitions';import {VehiclePhysics} from '../src/physics/VehiclePhysics';
beforeAll(async()=>await RAPIER.init());
for(let index=0;index<missions.length;index++)it(`A0${index+1}: start and target footprint clear, final physics pose valid`,()=>{
 const world=new RAPIER.World({x:0,y:-9.81,z:0});const scene=new T.Scene();const e=environment(scene,world);e.layout(index);const m=missions[index];
 for(const car of cars){const v=new VehiclePhysics(world,car);for(const target of [false,true]){
 const x=target?m.x:m.start[0],z=target?m.z:m.start[1],yaw=target?m.yaw:m.start[2];v.reset(x,z,yaw);
 for(let i=0;i<180;i++){v.step(1/60,0,0,0,false);world.step();}
 const pos=v.body.translation();expect(Math.hypot(pos.x-x,pos.z-z)).toBeLessThan(.1);let blocked=false;world.contactPairsWith(v.collider,c=>world.contactPair(v.collider,c,manifold=>{for(let n=0;n<manifold.numContacts();n++)if(manifold.contactDist(n)<-.015)blocked=true;}));expect(blocked).toBe(false);
 if(target)expect(evaluateParking({x:pos.x,z:pos.z,yaw:v.yaw},car.width,car.length,m,v.speed,true,blocked).valid).toBe(true);
 }v.dispose();}
 world.free();
});
