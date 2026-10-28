import type {VehiclePhysics} from '../physics/VehiclePhysics';
import type {vehicleModel} from '../vehicles/model';
/** The visible root is always synchronized from the actual Rapier body, in both gears. */
export function syncVehicle(physics:VehiclePhysics,model:ReturnType<typeof vehicleModel>){
 const p=physics.body.translation(),q=physics.body.rotation();
 model.group.position.set(p.x,p.y,p.z);model.group.quaternion.set(q.x,q.y,q.z,q.w);
 for(let i=0;i<4;i++){
 model.wheels[i].position.y=-(physics.controller.wheelSuspensionLength(i)??.38);
 model.wheels[i].rotation.set(0,physics.controller.wheelSteering(i)??0,0);
 const spin=model.wheels[i].children[0];if(spin)spin.rotation.x=physics.controller.wheelRotation(i)??0;
 }
}
