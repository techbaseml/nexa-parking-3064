import {TouchState} from './TouchState';
/** One owner per finger. Ignore lost-capture bubbling from a nested pedal label. */
export function bindPedals(root:HTMLElement,state:TouchState){
 const owners=new Map<number,HTMLElement>();const win=root.ownerDocument.defaultView!;
 function release(id:number){const owner=owners.get(id);owners.delete(id);state.release(id);owner?.classList.remove('pressed');}
 function down(e:PointerEvent){const target=e.target as HTMLElement;const button=target.closest<HTMLElement>('[data-hold]');if(!button||!root.contains(button))return;e.preventDefault();owners.set(e.pointerId,button);state.press(e.pointerId,button.dataset.hold!);button.classList.add('pressed');try{button.setPointerCapture(e.pointerId);}catch{/* Window release remains authoritative if capture is unsupported. */}}
 function up(e:PointerEvent){release(e.pointerId);}
 function lost(e:PointerEvent){const owner=owners.get(e.pointerId);if(owner&&e.target===owner&&!owner.hasPointerCapture?.(e.pointerId))release(e.pointerId);}
 function clear(){for(const id of owners.keys())release(id);state.clear();}
 root.addEventListener('pointerdown',down);root.addEventListener('lostpointercapture',lost);win.addEventListener('pointerup',up);win.addEventListener('pointercancel',up);win.addEventListener('blur',clear);
 return {clear,dispose(){clear();root.removeEventListener('pointerdown',down);root.removeEventListener('lostpointercapture',lost);win.removeEventListener('pointerup',up);win.removeEventListener('pointercancel',up);win.removeEventListener('blur',clear);}};
}
