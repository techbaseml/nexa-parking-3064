import {beforeAll,it,expect} from 'vitest';import RAPIER from '@dimforge/rapier3d-compat';import {cars} from '../src/vehicles/definitions';import {VehiclePhysics} from '../src/physics/VehiclePhysics';import {DriveController} from '../src/input/DriveController';
beforeAll(async()=>await RAPIER.init());
for(const car of cars)it(`${car.name}: idle sleep → R + accelerator → brake → D + accelerator`,()=>{
 const w=new RAPIER.World({x:0,y:-9.81,z:0});w.createCollider(RAPIER.ColliderDesc.cuboid(100,.2,100).setTranslation(0,-.2,0));const v=new VehiclePhysics(w,car),d=new DriveController(v);v.reset(0,0,0);
 function tick(n:number,throttle=0,brake=0){for(let i=0;i<n;i++){d.update(1/60,{throttle,brake,steer:0,reverse:false,handbrake:false});w.step();}}
 tick(1200);expect(v.body.isSleeping()).toBe(true);expect(v.speed).toBeLessThan(.01);
 d.requestGear('R');tick(120,1);expect(v.body.isSleeping()).toBe(false);expect(v.body.translation().z).toBeLessThan(-1);
 // Match the video: request Drive during reverse, without manually changing physics state.
 d.requestGear('D');tick(120,1);expect(d.pending).toBeNull();expect(v.gear).toBe('D');expect(v.body.linvel().z).toBeGreaterThan(.5);
 tick(180,0,1);expect(v.speed).toBeLessThan(.1);d.requestGear('P');tick(1200);expect(v.body.isSleeping()).toBe(true);
 d.requestGear('D');const start=v.body.translation().z;tick(120,1);expect(v.body.translation().z).toBeGreaterThan(start+1);w.free();
});
it('ordinary throttle wakes a chassis that fell asleep while already in Reverse',()=>{const w=new RAPIER.World({x:0,y:-9.81,z:0});w.createCollider(RAPIER.ColliderDesc.cuboid(100,.2,100).setTranslation(0,-.2,0));const v=new VehiclePhysics(w,cars[3]);v.reset(0,0,0);v.changeGear('R');for(let i=0;i<1200;i++){v.step(1/60,0,0,0,false);w.step();}expect(v.body.isSleeping()).toBe(true);expect(v.speed).toBeLessThan(.01);for(let i=0;i<120;i++){v.step(1/60,1,0,0,false);w.step();}expect(v.body.translation().z).toBeLessThan(-1);w.free();});
