/* ================= three.js visual ================= */
const G3=(function(){
let ok=false,renderer,scene,camera,hemi,dir,dirBase,rim,fx=[],CRE=null,t0=0,jumpT=0,flashV=0,blink=2,blinkT=0;
let yaw=0.5,pitch=0.3,userYaw=0,userPitch=0,autoYaw=0,dragging=false,lastX=0,lastY=0,movedDist=0;
let curSky=null,tarSky=null,tarDir=null,rocks=[],onPetCb=null,heartTex=null,starTex=null,lastW=0,lastH=0;
const SKY=[0x000000,0x20294a,0x252c52,0x302a4c,0x131a30];
const DIRC=[0x000000,0xdfe8ff,0xfff0d5,0xffc98a,0xbccfff];
function fallback(){const st=$('#stage');st.classList.add('off3');$('#c3').style.display='none';const n=$('#offnote');n.classList.remove('hidden');n.firstElementChild.textContent=L('off_note');}
function texHeart(){const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');g.fillStyle='#ff5f7a';g.beginPath();g.moveTo(32,52);g.bezierCurveTo(4,34,10,8,32,20);g.bezierCurveTo(54,8,60,34,32,52);g.fill();return new THREE.CanvasTexture(c);}
function texStar(){const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');g.fillStyle='#ffd166';g.beginPath();for(let i=0;i<10;i++){const r=i%2?9:26,a=-Math.PI/2+i*Math.PI/5;g.lineTo(32+Math.cos(a)*r,32+Math.sin(a)*r);}g.closePath();g.fill();return new THREE.CanvasTexture(c);}
function mat(col,emissive,glow){const m=new THREE.MeshStandardMaterial({color:col,roughness:0.85,metalness:0.02});if(emissive){m.emissive=new THREE.Color(emissive);m.emissiveIntensity=glow?0.45:0.25;}return m;}
function addShadow(o){o.traverse(n=>{if(n.isMesh)n.castShadow=true;});}
function disposeGroup(g){if(!g)return;g.traverse(n=>{if(n.geometry)n.geometry.dispose();if(n.material){(Array.isArray(n.material)?n.material:[n.material]).forEach(m=>m.dispose());}});if(g.parent)g.parent.remove(g);}
function buildCreature(id){
 const f=FORMS[id];if(!f)return null;
 $('#stage-emoji').textContent=f.emo;
 if(!ok)return null;
 if(CRE)disposeGroup(CRE.group);
 const sp=f.spec,col=sp.color,acc=sp.accent,glow=!!sp.glow;
 const G=new THREE.Group();const bodyMats=[];const eyes=[];let tail=null,wings=[],aura=null,head=null,torso=null,headY=0;
 const mainMat=mat(col,glow?col:null,glow);bodyMats.push(mainMat);
 if(sp.shape==='egg'){
  const e=new THREE.Mesh(new THREE.SphereGeometry(0.6,28,22),mat(0xf3ead8,null,false));e.scale.set(0.82,1.08,0.82);e.position.y=0.66;G.add(e);torso=e;
  for(let i=0;i<7;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(0.06,8,8),mat(0xffb14d,null,false));const a=Math.random()*Math.PI*2,p=Math.random()*Math.PI-Math.PI/2;s.position.set(Math.cos(a)*0.5*Math.cos(p),0.66+Math.sin(p)*0.64,Math.sin(a)*0.5*Math.cos(p));s.scale.set(1.4,1,0.4);G.add(s);}
 }else if(sp.shape==='wide'){
  torso=new THREE.Mesh(new THREE.SphereGeometry(0.8,26,20),mainMat);torso.scale.set(1.18,0.82,1.05);torso.position.y=0.66;G.add(torso);
  headY=1.32;head=new THREE.Mesh(new THREE.SphereGeometry(0.44,24,18),mainMat);head.position.y=headY;G.add(head);
 }else if(sp.shape==='tall'){
  torso=new THREE.Mesh(new THREE.CylinderGeometry(0.4,0.56,1.0,22),mainMat);torso.position.y=0.92;G.add(torso);
  const capm=new THREE.Mesh(new THREE.SphereGeometry(0.4,22,16),mainMat);capm.position.y=1.42;capm.scale.set(1,0.8,1);G.add(capm);
  headY=1.62;head=new THREE.Mesh(new THREE.SphereGeometry(0.44,24,18),mainMat);head.position.y=headY;G.add(head);
  if(sp.legs)[[-0.24,-0.18],[0.24,-0.18],[-0.24,0.22],[0.24,0.22]].forEach(p=>{const l=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.12,0.45,10),mat(col,null,false));l.position.set(p[0],0.22,p[1]);G.add(l);});
 }else{
  torso=new THREE.Mesh(new THREE.SphereGeometry(0.66,26,20),mainMat);torso.scale.set(1,0.94,0.96);torso.position.y=0.7;G.add(torso);
  headY=1.45;head=new THREE.Mesh(new THREE.SphereGeometry(0.5,24,18),mainMat);head.position.y=headY;G.add(head);
 }
 if(sp.shape!=='egg'){
  const hr=(sp.shape==='wide')?0.44:(sp.shape==='tall')?0.44:0.5;
  [-1,1].forEach(s=>{const w=new THREE.Mesh(new THREE.SphereGeometry(0.105,12,10),mat(0xffffff,null,false));w.position.set(0.17*s,headY+0.05,hr*0.72);const p=new THREE.Mesh(new THREE.SphereGeometry(0.05,10,8),mat(0x141a26,null,false));p.position.set(0.17*s,headY+0.05,hr*0.87);G.add(w);G.add(p);eyes.push(w);eyes.push(p);});
  const mo=new THREE.Mesh(new THREE.TorusGeometry(0.09,0.02,8,16,Math.PI),mat(0x3a2a2a,null,false));mo.position.set(0,headY-0.13,hr*0.82);mo.rotation.x=Math.PI+0.2;G.add(mo);
 }
 if(sp.ears&&head)[[-1,1]].concat([]).forEach(()=>{[-1,1].forEach(s=>{const e=new THREE.Mesh(new THREE.SphereGeometry(0.16,12,10),mat(acc,glow?acc:false,glow));e.position.set(0.5*s,headY+0.28,0);e.scale.set(0.8,1,0.6);G.add(e);});});
 if(sp.tuft&&head){const tg=new THREE.Group();tg.position.y=headY+0.45;const b=new THREE.Mesh(new THREE.SphereGeometry(0.12,10,8),mat(acc,acc,glow));tg.add(b);const c1=new THREE.Mesh(new THREE.ConeGeometry(0.07,0.3,8),mat(acc,acc,true));c1.position.y=0.2;tg.add(c1);const c2=new THREE.Mesh(new THREE.ConeGeometry(0.05,0.2,8),mat(acc,acc,true));c2.position.set(0.12,0.14,0);c2.rotation.z=-0.6;tg.add(c2);G.add(tg);}
 if(sp.horns&&head){for(let i=0;i<sp.horns;i++){const hc=new THREE.Mesh(new THREE.ConeGeometry(0.08,0.26,8),mat(0xf2ead8,glow?acc:null,glow));hc.position.set((i-(sp.horns-1)/2)*0.2,headY+0.5,(i%2)*0.05);hc.rotation.z=(i-(sp.horns-1)/2)*-0.18;G.add(hc);}}
 if(sp.wings){[-1,1].forEach(s=>{const wmat=new THREE.MeshStandardMaterial({color:acc,roughness:0.5,transparent:true,opacity:0.8,side:THREE.DoubleSide,emissive:new THREE.Color(acc),emissiveIntensity:0.15});const w=new THREE.Mesh(new THREE.BoxGeometry(0.55,0.65,0.05),wmat);w.position.set(0.55*s,1.25,-0.2);w.rotation.set(0.2*s,0.3*s,0.55*s);G.add(w);wings.push({m:w,base:0.55*s});});}
 if(sp.tail){
  if(sp.tail==='flame'){tail=new THREE.Mesh(new THREE.ConeGeometry(0.16,0.55,10),mat(0xff9a3c,0xff7a1e,true));tail.position.set(0,0.5,-0.95);tail.rotation.x=-0.55;}
  else if(sp.tail==='leaf'){tail=new THREE.Mesh(new THREE.SphereGeometry(0.24,12,8),mat(acc,glow?acc:false,glow));tail.scale.set(0.35,1.1,0.7);tail.position.set(0,0.75,-0.85);tail.rotation.x=-0.7;}
  else{tail=new THREE.Mesh(new THREE.TorusGeometry(0.3,0.06,8,20,Math.PI),mat(acc,glow?acc:false,glow));tail.position.set(0,0.62,-0.85);tail.rotation.set(Math.PI/2,0,1.2);}
  if(tail)G.add(tail);
 }
 if(sp.mane){for(let i=0;i<9;i++){const a=i/9*Math.PI*2;const m=new THREE.Mesh(new THREE.SphereGeometry(0.13,10,8),mat(acc,glow?acc:false,glow));m.position.set(Math.cos(a)*0.52,headY-0.3,Math.sin(a)*0.52);G.add(m);}}
 if(sp.aura){aura=new THREE.Mesh(new THREE.SphereGeometry(1.15,26,20),new THREE.MeshStandardMaterial({color:acc,transparent:true,opacity:0.14,emissive:new THREE.Color(acc),emissiveIntensity:0.5,depthWrite:false}));aura.position.y=1.1;G.add(aura);}
 if(S&&S.flags.sick&&id.indexOf('ail')<0){G.traverse(n=>{if(n.isMesh&&n.material&&n.material.color)n.material.color.lerp(new THREE.Color(0x6a6f7e),0.35);});}
 const sc=sp.scale||1;G.scale.set(sc,sc,sc);addShadow(G);G.position.y=0.04;scene.add(G);
 autoYaw=0;userYaw=0;userPitch=0;
 CRE={group:G,torso:torso,head:head,headY:headY,eyes:eyes,tail:tail,wings:wings,aura:aura,baseTorso:torso?torso.scale.y:1,baseHead:headY};
 return G;
}
function spawnFx(tex,x,y,vy){if(fx.length>28)return;const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false}));s.scale.set(0.28,0.28,1);s.position.set(x,y,0.6);s.userData={vy:vy,t:0};scene.add(s);fx.push(s);}
function setPhase(p){if(!ok)return;tarSky=new THREE.Color(SKY[p]);tarDir=new THREE.Color(DIRC[p]);}
function init(canvas,cb){
 onPetCb=cb;
 if(!window.THREE){fallback();return;}
 try{
  ok=true;heartTex=texHeart();starTex=texStar();
  renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  scene=new THREE.Scene();
  curSky=new THREE.Color(SKY[1]);tarSky=curSky.clone();
  scene.background=curSky;scene.fog=new THREE.Fog(curSky.getHex(),7.5,17);
  camera=new THREE.PerspectiveCamera(42,1,0.1,60);
  hemi=new THREE.HemisphereLight(0xbfd0ff,0x272138,0.8);scene.add(hemi);
  dir=new THREE.DirectionalLight(0xfff0d5,1.0);dirBase=1.0;dir.position.set(3.2,5.5,3.2);dir.castShadow=true;
  dir.shadow.mapSize.set(1024,1024);dir.shadow.camera.left=-4;dir.shadow.camera.right=4;dir.shadow.camera.top=4.5;dir.shadow.camera.bottom=-4.5;scene.add(dir);
  tarDir=dir.color.clone();
  rim=new THREE.PointLight(0xff8a5c,0.55,14);rim.position.set(-2.6,1.7,-2);scene.add(rim);
  const g1=new THREE.Mesh(new THREE.CylinderGeometry(2.5,2.3,0.36,44),new THREE.MeshStandardMaterial({color:0x2b3557,roughness:0.95}));
  g1.position.y=-0.18;g1.receiveShadow=true;scene.add(g1);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(2.42,0.045,10,64),new THREE.MeshStandardMaterial({color:0x5a6a9c,emissive:new THREE.Color(0x28406e),emissiveIntensity:0.5,roughness:0.5}));
  ring.rotation.x=Math.PI/2;ring.position.y=0.01;scene.add(ring);
  for(let i=0;i<6;i++){const m=new THREE.Mesh(new THREE.IcosahedronGeometry(0.1+Math.random()*0.09,0),new THREE.MeshStandardMaterial({color:0x3b4a74,roughness:0.9,flatShading:true}));const a=Math.random()*Math.PI*2,rr=1.9+Math.random()*1.1;m.position.set(Math.cos(a)*rr,1+Math.random()*1.4,Math.sin(a)*rr);m.userData={fy:m.position.y,ph:Math.random()*7};scene.add(m);rocks.push(m);}
  for(let i=0;i<3;i++){const cr=new THREE.Mesh(new THREE.ConeGeometry(0.1,0.5+Math.random()*0.4,6),new THREE.MeshStandardMaterial({color:0x4a5f96,emissive:new THREE.Color(0x2a4a8a),emissiveIntensity:0.4,flatShading:true,roughness:0.6}));const a=2.2+i*2.1;cr.position.set(Math.cos(a)*1.85,0.25,Math.sin(a)*1.85);cr.rotation.z=(Math.random()-0.5)*0.3;cr.receiveShadow=true;cr.castShadow=true;scene.add(cr);}
  const pos=[];for(let i=0;i<170;i++){const x=(Math.random()-0.5)*26,y=1+Math.random()*11,z=(Math.random()-0.5)*26;pos.push(x,y,z);}
  const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  const st=new THREE.Points(sg,new THREE.PointsMaterial({color:0xd6e4ff,size:0.07,transparent:true,opacity:0.9}));scene.add(st);rocks.push(st);st.userData={fy:0,ph:0,isStars:true};
  // interaction
  canvas.addEventListener('pointerdown',e=>{dragging=true;movedDist=0;lastX=e.clientX;lastY=e.clientY;try{canvas.setPointerCapture(e.pointerId);}catch(err){}});
  canvas.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;movedDist+=Math.abs(dx)+Math.abs(dy);userYaw+=dx*0.008;userPitch=clamp(userPitch-dy*0.006,-0.3,0.55);lastX=e.clientX;lastY=e.clientY;});
  canvas.addEventListener('pointerup',e=>{if(!dragging)return;dragging=false;if(movedDist<12&&CRE&&onPetCb){const r=canvas.getBoundingClientRect();const mx=((e.clientX-r.left)/r.width)*2-1,my=-((e.clientY-r.top)/r.height)*2+1;const rc=new THREE.Raycaster();rc.setFromCamera({x:mx,y:my},camera);const hit=rc.intersectObject(CRE.group,true);if(hit.length)onPetCb();}});
  t0=performance.now();
  requestAnimationFrame(loop);
 }catch(err){ok=false;console.error('Stardia 3D init failed',err);fallback();}
}
function loop(){
 const now=performance.now();const dt=Math.min(0.05,(now-t0)/1000);t0=now;
 const st=$('#stage');
 if(st&&lastW!==st.clientWidth&&st.clientWidth>0){lastW=st.clientWidth;lastH=st.clientHeight;renderer.setSize(lastW,lastH,false);camera.aspect=lastW/lastH;camera.updateProjectionMatrix();}
 // sky lerp
 if(tarSky&&curSky){curSky.lerp(tarSky,Math.min(1,dt*2.2));scene.background=curSky;scene.fog.color.copy(curSky);}
 if(tarDir)dir.color.lerp(tarDir,Math.min(1,dt*2.2));
 if(!dragging)autoYaw+=dt*0.12;
 const yy=yaw+autoYaw+userYaw,pp=clamp(pitch+userPitch,-0.15,0.85),rad=4.5;
 camera.position.set(Math.sin(yy)*Math.cos(pp)*rad,1.05+Math.sin(pp)*rad,Math.cos(yy)*Math.cos(pp)*rad);
 camera.lookAt(0,1.05,0);
 const T=now/1000;
 rocks.forEach(m=>{m.position.y=m.userData.fy+Math.sin(T*0.8+m.userData.ph)*0.12;if(m.userData.isStars)m.rotation.y+=dt*0.01;});
 if(CRE){
  let jy=0;
  if(jumpT>0){jumpT-=dt;jy=Math.max(0,Math.sin((1-Math.max(0,jumpT)/0.75)*Math.PI))*0.6;}
  CRE.group.position.y=0.04+jy+Math.sin(T*2.1)*0.045;
  CRE.group.rotation.z=Math.sin(T*0.9)*0.02;
  if(CRE.torso){const k=1+Math.sin(T*2.1)*0.03;CRE.torso.scale.y=CRE.baseTorso*k;}
  if(CRE.head)CRE.head.position.y=CRE.baseHead+Math.sin(T*2.1+0.5)*0.03;
  if(CRE.tail)CRE.tail.rotation.y=Math.sin(T*3)*0.35;
  CRE.wings.forEach((w,i)=>{w.m.rotation.z=w.base+Math.sin(T*6+i*3)*0.25;});
  if(CRE.aura){const a=1+Math.sin(T*3)*0.05;CRE.aura.scale.set(a,a,a);CRE.aura.rotation.y+=dt*0.6;}
  blink-=dt;if(blink<=0){blink=1.5+Math.random()*3;blinkT=0.12;}
  const es=blinkT>0?0.15:1;if(blinkT>0)blinkT-=dt;
  CRE.eyes.forEach(e=>{e.scale.y=es;});
 }
 // fx
 for(let i=fx.length-1;i>=0;i--){const s=fx[i];s.userData.t+=dt;s.position.y+=s.userData.vy*dt;s.position.x+=Math.sin(s.userData.t*7)*0.003;const k=s.userData.t;s.material.opacity=Math.max(0,1-k*0.8);s.scale.setScalar(0.24+k*0.1);if(k>1.3){scene.remove(s);s.material.dispose();fx.splice(i,1);}}
 if(flashV>0){flashV=Math.max(0,flashV-dt*1.8);dir.intensity=dirBase+flashV*3;}else dir.intensity=dirBase;
 if(rim)rim.intensity=0.5+Math.sin(T*2.4)*0.12;
 if(lastW>0)renderer.render(scene,camera);
 requestAnimationFrame(loop);
}
return {
 ok:function(){return ok;},
 init:init,
 setPhase:setPhase,
 buildCreature:buildCreature,
 jump:function(){jumpT=0.75;},
 hearts:function(n){if(!ok||!heartTex)return;for(let i=0;i<n;i++){const hx=(Math.random()-0.5)*1.4;spawnFx(heartTex,hx,1.2+Math.random()*0.5,0.8+Math.random()*0.5);}},
 evolveFx:function(){if(!ok||!starTex)return;flashV=1;for(let i=0;i<12;i++){const a=Math.random()*Math.PI*2;spawnFx(starTex,Math.cos(a)*1.2,0.9+Math.random()*1.2,1+Math.random()*1.2);}}
};
})();
