export const cars = [
{id:'urban',name:'Urban E1',class:'COMPACT ELECTRIC',length:4.1,width:1.82,wheelbase:2.55,mass:1250,force:2700,color:'#cbd7dd',price:0},
{id:'velocity',name:'Velocity Rosso',class:'ITALIAN-STYLE SUPERCAR',length:4.5,width:1.94,wheelbase:2.7,mass:1450,force:3900,color:'#d92335',price:600},
{id:'executive',name:'Executive LX',class:'LUXURY SEDAN',length:4.9,width:1.93,wheelbase:2.95,mass:1800,force:3400,color:'#adb4cb',price:1000},
{id:'titan',name:'Titan X',class:'PERFORMANCE SUV',length:4.8,width:2.06,wheelbase:2.9,mass:2200,force:4300,color:'#c4bba7',price:1500},
{id:'hyperion',name:'Hyperion Royale',class:'TWO-TONE HYPERCAR',length:4.7,width:2.0,wheelbase:2.85,mass:1650,force:4500,color:'#246ed2',price:2200},
{id:'cargo',name:'Cargo Pro',class:'COMMERCIAL',length:5.4,width:2.12,wheelbase:3.3,mass:2600,force:4200,color:'#e0e5e7',price:2800}
];
export type Car = typeof cars[number];
