/** Tracks each physical pointer independently; released/unmounted controls cannot remain pressed. */
export class TouchState {
 private pointers=new Map<number,string>();
 press(id:number,action:string){this.pointers.set(id,action);}
 release(id:number){this.pointers.delete(id);}
 has(action:string){return [...this.pointers.values()].includes(action);}
 clear(){this.pointers.clear();}
}
