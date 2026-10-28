import * as T from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import {vehicleModel} from './vehicles/model';import {cars} from './vehicles/definitions';
export function environment(scene:T.Scene,world:RAPIER.World){
 const group=new T.Group();scene.add(group);const bodies:RAPIER.RigidBody[]=[];
 const pixels=new Uint8Array(256*256*4);let seed=3064;for(let i=0;i<256*256;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const v=110+(seed%50);pixels.set([v,v+2,v+4,255],i*4);}const asphalt=new T.DataTexture(pixels,256,256);asphalt.wrapS=asphalt.wrapT=T.RepeatWrapping;asphalt.repeat.set(20,20);asphalt.needsUpdate=true;asphalt.colorSpace=T.SRGBColorSpace;
 const floorMat=new T.MeshStandardMaterial({color:'#6a7278',map:asphalt,roughness:.92,metalness:.04});
 const white=new T.MeshStandardMaterial({color:'#acb6b7',roughness:0.8});
 const edge=new T.MeshStandardMaterial({color:'#52626a',roughness:0.7});
 function box(w:number,h:number,d:number,x:number,y:number,z:number,material:T.Material,solid=true){const m=new T.Mesh(new T.BoxGeometry(w,h,d),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;group.add(m);if(solid){const b=world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(x,y,z));world.createCollider(RAPIER.ColliderDesc.cuboid(w/2,h/2,d/2),b);bodies.push(b);}return m;}
 box(56,0.4,56,0,-0.2,0,floorMat);for(const x of [-27,27])box(0.45,0.65,55,x,0.32,0,edge);for(const z of [-27,27])box(55,0.65,0.45,0,0.32,z,edge);
 for(let x=-22;x<=22;x+=4){for(const z of [-17,17]){box(0.07,0.015,6,x,0.012,z,white,false);box(4,0.015,0.07,x+2,0.012,z+3,white,false);}}
 for(let z=-24;z<24;z+=4)box(0.08,0.01,1.6,-13,0.012,z,white,false);
 for(const x of [-23,23])for(const z of [-20,0,20]){box(0.16,7,0.16,x,3.5,z,edge);box(2,0.12,0.45,x,7,z,white,false);const strip=new T.MeshStandardMaterial({color:'#e4ffff',emissive:'#c1f4ff',emissiveIntensity:2});box(1.7,0.04,0.36,x,6.92,z,strip,false);}
 const building=new T.MeshStandardMaterial({color:'#52616b',metalness:0.35,roughness:0.55});
 for(let i=0;i<30;i++){const theta=i/30*Math.PI*2,r=43+(i%4)*9,h=9+(i*13%27);const x=Math.sin(theta)*r,z=Math.cos(theta)*r;box(7,h,7,x,h/2,z,building,false);for(let j=3;j<h;j+=3){const mat=new T.MeshBasicMaterial({color:i%3?'#8da8ae':'#d9ba8d'});box(7.03,0.1,7.03,x,j,z,mat,false);}}
 for(const x of [-20,20]){const mat=new T.MeshStandardMaterial({color:'#667d70',roughness:1});for(const z of [-8,8]){box(2.5,0.5,2.5,x,0.25,z,edge);box(0.2,2.5,0.2,x,1.5,z,edge,false);const tree=new T.Mesh(new T.IcosahedronGeometry(1.7,2),mat);tree.position.set(x,3.2,z);tree.castShadow=true;group.add(tree);}}
 // Frequent visible references make physical displacement apparent in follow/reverse views.
 for(let z=-25;z<=25;z+=2){box(.12,.012,.7,0,.018,z,white,false);}
 const amber=new T.MeshStandardMaterial({color:'#e8b53a',roughness:.85});
 for(let x=-26;x<=26;x+=1.4)for(const z of [-26.7,26.7])box(.65,.03,.34,x,.66,z,amber,false);
 for(let x=-24;x<=24;x+=4)box(.03,.006,52,x,.009,0,new T.MeshBasicMaterial({color:'#38434a'}),false);
 const parked:T.Group[]=[];for(const [i,x,z] of [[0,-18,17],[1,-10,17],[2,14,17],[3,-18,-17],[4,18,-17]]){const model=vehicleModel(cars[i%cars.length],['#a9b7bb','#344751','#736e76','#d2c9ba','#6a7c88'][i]);model.group.position.set(x,0.68,z);group.add(model.group);parked.push(model.group);const b=world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(x,0.65,z));world.createCollider(RAPIER.ColliderDesc.cuboid(cars[i].width/2,0.65,cars[i].length/2),b);}
 let missionBodies:RAPIER.RigidBody[]=[];let missionMeshes:T.Object3D[]=[];
 function layout(n:number){for(const b of missionBodies)world.removeRigidBody(b);missionBodies=[];for(const m of missionMeshes){group.remove(m);if(m instanceof T.Mesh){m.geometry.dispose();}}missionMeshes=[];
 const obstacles=n===4?[[8,-4],[8,8]]:n===2?[[0,0],[5,-4]]:n===5?[[-4,4],[4,4]]:n===3?[[-3,5]]:[];
 for(const [x,z]of obstacles){const m=box(1.5,0.8,n===4?3:1.5,x,0.4,z,edge);missionMeshes.push(m);missionBodies.push(bodies.pop()!);}
 }
 return {layout,group};
}
