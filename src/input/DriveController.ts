import type {VehiclePhysics,Gear} from '../physics/VehiclePhysics';
export interface DriveInput {throttle:number;brake:number;steer:number;handbrake:boolean;reverse:boolean}
/** Direction changes are queued: brake first, shift near zero speed, then apply propulsion. */
export class DriveController {
 pending:Gear|null=null;private reversing=false;
 constructor(public vehicle:VehiclePhysics){}
 requestGear(g:Gear){this.pending=g;this.tryShift();}
 private tryShift(){if(this.pending&&this.vehicle.speed<.18&&this.vehicle.changeGear(this.pending)){this.pending=null;}}
 reset(){this.pending=null;this.reversing=false;}
 update(dt:number,input:DriveInput){
 if(input.reverse&&!this.reversing)this.requestGear('R');this.reversing=input.reverse;
 this.tryShift();
 const shifting=this.pending!==null;
 const brake=shifting?1:Math.max(0,Math.min(1,input.brake));
 const throttle=shifting||brake>0||input.handbrake?0:input.reverse?1:input.throttle;
 this.vehicle.step(dt,throttle,brake,input.steer,input.handbrake);
 }
}
/** Shared by the live HUD and DOM/physics integration tests. */
export function bindGearButtons(root:HTMLElement,getController:()=>DriveController,onChange:()=>void){
 const click=(event:MouseEvent)=>{const button=(event.target as HTMLElement).closest<HTMLElement>('[data-action]');const action=button?.dataset.action;if(!action?.startsWith('gear:'))return;const gear=action.slice(5);if(!['P','R','N','D'].includes(gear))return;getController().requestGear(gear as Gear);onChange();};
 root.addEventListener('click',click);return ()=>root.removeEventListener('click',click);
}
