/* ================= state & save ================= */
const SAVEKEY=i=>'stardia_save'+i, LASTKEY='stardia_last', SETKEY='stardia_set', ENDKEY='stardia_endings';
const MAXDAY=60;
let S=null;
function saveSet(){try{localStorage.setItem(SETKEY,JSON.stringify(SET));}catch(e){}}
try{const s=JSON.parse(localStorage.getItem(SETKEY)||'null');if(s){if(LANGS.indexOf(s.lang)>=0)SET.lang=s.lang;SET.sound=!!s.sound;}}catch(e){}
function slotData(i){try{const d=JSON.parse(localStorage.getItem(SAVEKEY(i))||'null');return (d&&d.sp)?d:null;}catch(e){return null;}}
function saveGame(){
if(!S)return false;
try{localStorage.setItem(SAVEKEY(S.slot),JSON.stringify(S));}
catch(e){console.error('Stardia save failed',e);return false;}
try{localStorage.setItem(LASTKEY,String(S.slot));}
catch(e){console.error('Stardia last-slot update failed',e);}
return true;
}
function deleteSlot(i){try{localStorage.removeItem(SAVEKEY(i));}catch(e){}}
function endingColl(){try{const a=JSON.parse(localStorage.getItem(ENDKEY)||'[]');return Array.isArray(a)?a:[];}catch(e){return[];}}
function lastSlot(){try{const v=+(localStorage.getItem(LASTKEY));return isNaN(v)?-1:v;}catch(e){return -1;}}
function addEndingColl(id){const a=endingColl();if(a.indexOf(id)<0){a.push(id);try{localStorage.setItem(ENDKEY,JSON.stringify(a));}catch(e){}}}
/* ================= audio ================= */
const AU={ctx:null,master:null,timer:0,step:0,mel:[]};
function audioInit(){if(AU.ctx||!SET.sound)return;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;AU.ctx=new C();AU.master=AU.ctx.createGain();AU.master.gain.value=SET.sound?0.9:0;AU.master.connect(AU.ctx.destination);}catch(e){}}
function tone(f,dur,type,vol,delay,slide){if(!SET.sound||!AU.ctx)return;try{const c=AU.ctx,t0=c.currentTime+(delay||0);const o=c.createOscillator(),g=c.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t0);if(slide)o.frequency.linearRampToValueAtTime(slide,t0+dur);g.gain.setValueAtTime(0.0001,t0);g.gain.linearRampToValueAtTime(vol||0.2,t0+0.015);g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);o.connect(g);g.connect(AU.master);o.start(t0);o.stop(t0+dur+0.05);}catch(e){}}
const SFX={
click(){tone(900,0.07,'triangle',0.12);},
ok(){tone(660,0.12,'sine',0.16);tone(880,0.14,'sine',0.12,0.09);},
no(){tone(200,0.2,'sawtooth',0.1);},
coin(){tone(980,0.09,'square',0.08);tone(1320,0.12,'square',0.08,0.07);},
chime(){tone(1568,0.25,'sine',0.14);tone(2093,0.3,'sine',0.1,0.12);},
fanfare(){[523,659,784,1047,1319].forEach((f,i)=>tone(f,0.28,'triangle',0.2,i*0.11));[1319].forEach(f=>tone(f,0.7,'triangle',0.16,0.62));},
pet(){tone(520,0.09,'sine',0.12,0,760);},
end(){[392,523,659,784,659,784,1047].forEach((f,i)=>tone(f,0.4,'sine',0.18,i*0.22));}
};
function bgmScale(){const base=[220,262,294,329,392,440,523,587];let seed=0;const nm=SPECIES[S.species].default[SET.lang]||'x'+S.slot;for(let i=0;i<nm.length;i++)seed=(seed*31+nm.charCodeAt(i))>>>0;const arr=base.slice();for(let i=arr.length-1;i>0;i--){seed=(seed*1103515245+12345)>>>0;const j=seed%(i+1);const t=arr[i];arr[i]=arr[j];arr[j]=t;}AU.mel=arr;}
function startBgm(){stopBgm();bgmScale();AU.timer=setInterval(()=>{if(!SET.sound||!AU.ctx||screen!=='game')return;const m=AU.mel,st=AU.step++;const n=m[(st*3+((st>>3)*5))%m.length]*(st%8===7?0.5:1);tone(n,0.16,'triangle',0.045);if(st%8===0)tone(m[0]*0.5,0.4,'sine',0.05);if(st%8===4)tone(m[2]*1,0.3,'sine',0.035);},350);}
function stopBgm(){if(AU.timer){clearInterval(AU.timer);AU.timer=0;}}
function applySound(){if(AU.master)AU.master.gain.value=SET.sound?0.9:0;if(SET.sound){audioInit();if(AU.ctx&&AU.ctx.state==='suspended')AU.ctx.resume();}$('#btnSound').textContent=SET.sound?'🔊 ON':'🔇 OFF';saveSet();}
/* ================= UI ================= */
let screen='title', evQueue=[], ovlOpen=false, petLock=0, chosenStarter='ember', pendingSlot=0;
function showScreen(name){screen=name;['title','slots','new','game','gallery'].forEach(n=>{$('#screen-'+n).classList.toggle('hidden',n!==name);$('#screen-'+n).classList.toggle('screen',true);});$('#stage').classList.toggle('off',name==='slots'||name==='new'||name==='gallery');updateTopbar();}
function dayPhase(d){return d<=19?1:d<=44?2:3;}
function updateTopbar(){if(S&&screen==='game'){$('#daylbl').textContent=t('d',{d:S.day,max:MAXDAY})+' ✦ '+t('ph'+dayPhase(S.day));}else{$('#daylbl').textContent='Stardia ✦';}}
function L(k,p){return t(k,p);}
function applyLabels(){
document.documentElement.lang=SET.lang;
$('#btnLang').textContent='🌐 '+LANGNAME[SET.lang];
$('#titleTag').textContent=L('tag');
$('#btnNew').textContent=L('menu_new');
$('#btnCont').textContent=L('menu_cont');
$('#btnGal').textContent=L('col_t');
$('#btnHelpT').textContent=L('m_help');
$('#btnEndDay').textContent=L('a_end');
$('#btnSave').textContent=L('m_save');
$('#btnTitle').textContent=L('m_title');
$('#hNote').textContent=L('n_extra');
$('#nameLabel').textContent=L('name_label');
$('#btnStart').textContent=L('start_btn');
buildStatGrid();
updateTopbar();renderLog();renderActs();renderHUD();}
/* log */
function logLine(key,par,cls){if(!S)return;S.log.push({k:key,p:par||null,c:cls||''});if(S.log.length>80)S.log.shift();renderLog();}
function renderLog(){const el=$('#glog');if(!S){el.innerHTML='';return;}let h='';for(let i=Math.max(0,S.log.length-40);i<S.log.length;i++){const e=S.log[i];h+='<p class="'+(e.c||'')+'">'+esc(t(e.k,e.p))+'</p>';}el.innerHTML=h;el.scrollTop=el.scrollHeight;}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');}
/* HUD */
function renderHUD(){if(!S)return;
const f=FORMS[S.form];
$('#hForm').innerHTML='<span>'+f.emo+'</span><b>'+esc(f.name[SET.lang]||f.name.en)+'</b><span style="color:#93a0c8">'+L('form_l'+(f.st===0?1:f.st===2?2:3))+'</span>';
$('#hCoins').textContent='🪙 '+S.coins;
$('#bE').firstElementChild.style.width=S.energy+'%';$('#vE').textContent=S.energy;
$('#bM').firstElementChild.style.width=S.mood+'%';$('#vM').textContent=S.mood;
STATKEYS.forEach((k,i)=>{const v=S[k];const bar=$('#bar'+i),val=$('#val'+i);if(bar){bar.style.width=Math.min(100,v)+'%';val.textContent=Math.round(v);}});}
function buildStatGrid(){let h='';STATKEYS.forEach((k,i)=>{h+='<div class="stat">'+STATICON[i]+'<b>'+esc(L('st_'+k))+'</b><div class="bar" id="bar'+i+'"><i></i></div><em id="val'+i+'">0</em></div>';});$('#statgrid').innerHTML=h;}
function renderActs(){const el=$('#acts');if(!S){el.innerHTML='';return;}el.innerHTML='';
ACTS.forEach(a=>{const b=document.createElement('button');b.className='abtn';
let dis=false;
if(S.ended)dis=true;
else if(S.actLeft<=0&&!a.free)dis=true;
else if(S.flags.tired&&['train','study','work','adventure','hobby','shop'].indexOf(a.id)>=0)dis=true;
else if(a.id==='medicine'&&!S.flags.sick)dis=true;
else if(S.energy<a.e||S.coins<a.c)dis=true;
if(dis)b.classList.add('dis');
b.title=L('a_tip_'+a.id);
const cost=(a.e?'⚡'+a.e:'⚡0')+(a.c?' 🪙'+a.c:'')+(a.free?'':'')+(a.free?'':' ×'+S.actLeft);
b.innerHTML='<span class="ai">'+a.ic+'</span><span class="an">'+esc(L('a_'+a.id))+'</span><span class="ac">'+esc(cost)+'</span>';
b.addEventListener('click',()=>doAction(a));el.appendChild(b);});}
/* overlay */
function showOvl(o){ovlOpen=true;$('#ov').classList.remove('hidden');
const em=$('#ovemo');if(o.emo){em.textContent=o.emo;em.classList.remove('hidden');}else em.classList.add('hidden');
if(o.rank){$('#ovTitle').innerHTML='<span class="rank rank'+o.rank+'">'+L('rank_l')+' '+o.rank+'</span><br>'+esc(o.title);}else $('#ovTitle').textContent=o.title||'';
$('#ovMsg').innerHTML=o.html?o.msg:'<span style="white-space:pre-line">'+esc(o.msg||'')+'</span>';
const bb=$('#ovbtns');bb.innerHTML='';(o.btns||[{l:L('menu_yes'),cb:closeOvl}]).forEach(b=>{const x=document.createElement('button');if(b.hi)x.className='hi';if(b.res){x.className='res';x.textContent=b.res;}else{x.textContent=b.l;x.addEventListener('click',()=>{SFX.click();b.cb();});}bb.appendChild(x);});}
function closeOvl(){ovlOpen=false;$('#ov').classList.add('hidden');if(S)renderPending();}
function renderPending(){if(evQueue.length&&!ovlOpen){const e=evQueue.shift();showEventOvl(e);}}
function showEventOvl(e){if(e.evo){G3.evolveFx();showOvl({emo:e.emo,title:e.title,msg:e.msg,btns:[{l:'OK ✓',cb:closeOvl}]});return;}showOvl({title:e.title,msg:e.msg,btns:e.buttons});}
/* ================= gain helpers ================= */
function moodMult(){return S.mood>=70?1.15:(S.mood<40?0.8:1);}
function applyGain(stat,base){const v=Math.max(1,Math.round(base*moodMult()*(S.flags.sick?0.6:1)*(0.85+Math.random()*0.3)));S[stat]=clamp(S[stat]+v,0,99);return v;}
function addMood(v){S.mood=clamp(S.mood+v,0,100);}
function addAff(v){S.aff=clamp(S.aff+v,0,100);}
function gainMsg(parts){const g=[];STATKEYS.forEach(k=>{if(parts['g_'+k])g.push(L('g_'+k)+' +'+parts['g_'+k]);});if(parts.mood)g.push(L('g_mood')+' '+(parts.mood>0?'+':'')+parts.mood);if(parts.coins)g.push('+'+parts.coins+' '+L('g_coins'));return g.join(' · ');}
/* ================= actions ================= */
function doAction(a){
if(!S||S.ended||ovlOpen)return;
if(S.actLeft<=0&&!a.free){SFX.no();return;}
if(S.flags.tired&&['train','study','work','adventure','hobby','shop'].indexOf(a.id)>=0){SFX.no();return;}
if(S.energy<a.e){SFX.no();logLine('no_energy',null,'sys');return;}
if(S.coins<a.c){SFX.no();logLine('no_coins',null,'sys');return;}
if(a.id==='medicine'&&!S.flags.sick){logLine('no_medicine',null,'sys');SFX.no();return;}
if(a.id==='adventure'&&(S.energy<30||S.st<15)){SFX.no();logLine('ad_pre',null,'sys');return;}
logLine(a.log,null,'');
if(a.id==='adventure'){adventure();}
else if(a.id==='medicine'){S.energy-=a.e;S.flags.sick=false;logLine('w_heal',null,'evo');S.ev.medicine=(S.ev.medicine||0)+1;SFX.ok();G3.jump();}
else if(a.id==='rest'){S.energy=clamp(S.energy+45,0,100);addMood(8);const wasSick=S.flags.sick;S.flags.tired=false;if(wasSick){S.flags.sick=false;logLine('w_heal',null,'evo');}logLine('⚡ +45 · '+L('g_mood')+' +8',null,'sys');SFX.ok();}
else{
S.energy-=a.e;S.coins-=a.c;
const parts={};
STATKEYS.forEach(k=>{if(a.g&&a.g[k]){parts['g_'+k]=applyGain(k,a.g[k]);}});
if(a.coins){const m=a.coins[0]+ri(0,a.coins[1]-a.coins[0]);S.coins+=m;parts.coins=m;SFX.coin();}
if(a.mood){addMood(a.mood);parts.mood=a.mood;}
if(a.aff)addAff(a.aff);
if(a.flag)S.ev[a.id]=(S.ev[a.id]||0)+1;
if(a.id==='clean')S.cleanFlag=true;
logLine(gainMsg(parts),null,'sys');
SFX.ok();if(a.id==='play'||a.id==='shop'||a.id==='groom')G3.hearts(2);else G3.jump();
if(a.id==='shop')openShop();
}
if(!a.free)S.actLeft--;
if(S.energy<=1&&!S.flags.tired){S.flags.tired=true;logLine('w_tired',null,'evo');}
tryEvolve();
if(S.day>=MAXDAY&&!S.ended&&evQueue.length===0){/* waiting endDay */}
saveGame();renderActs();renderHUD();updateTopbar();renderPending();
}
function adventure(){
S.energy-=30;S.coins-=6;S.ev.adventure=(S.ev.adventure||0)+1;
const roll=ri(1,10)+(S.pw+S.st+S.br)/40;
if(roll>=8){
const c=10+ri(5,15);S.coins+=c;const g1=applyGain('st',3),g2=applyGain('pw',2);
if(Math.random()<0.3){S.ev.artifact=(S.ev.artifact||0)+1;addMood(6);S.ev.sp=(S.ev.sp||0)+1;logLine('ad_great_tre',null,'ev');}
logLine(gainMsg({g_st:g1,g_pw:g2,coins:c}),null,'sys');SFX.coin();
}else if(roll>=4.5){
const c=5+ri(2,8);S.coins+=c;const g=applyGain('st',2);logLine(gainMsg({g_st:g,coins:c}),null,'sys');SFX.ok();
}else{
addMood(-8);S.flags.tired=true;const g=applyGain('sp',1);logLine('ad_bad',null,'ev');logLine(gainMsg({g_sp:g,mood:-8}),null,'sys');SFX.no();
}
if(Math.random()<0.35){S.ev.explore=(S.ev.explore||0)+1;const g=applyGain('sp',3);addMood(3);logLine('ad_wonder',null,'ev');logLine(gainMsg({g_sp:g,mood:3}),null,'sys');SFX.chime();}
}
/* ================= evolution ================= */
function branchId(sp,st){
if(st===1){
if(S.flags.sick){const top=topStat(['pw','br','ch']);return 'ail_'+({pw:'p',br:'b',ch:'c'})[top];}
const top=topStat(['pw','br','ch']);return sp+'1_'+({pw:'p',br:'b',ch:'c'})[top];
}else{
if(S.flags.sick)return 'ail2';
if(S.aff>=75&&S.mood>=80)return sp+'2_s';
const top=topStat(['pw','br','ch']);return sp+'2_'+({pw:'p',br:'b',ch:'c'})[top];
}
}
function topStat(keys){let best=keys[0];keys.forEach(k=>{if(S[k]>S[best])best=k;});return best;}
function tryEvolve(){
const st=FORMS[S.form].st;
if(st===0&&S.day>=19){evolveTo(branchId(S.species,1));}
else if(st===2&&S.day>=44){evolveTo(branchId(S.species,2));}
}
function evolveTo(id){
const old=FORMS[S.form],nf=FORMS[id];
S.form=id;
logLine('evo_l1',{n:S.name,f:nf.name[SET.lang]||nf.name.en},'evo');
S.energy=clamp(S.energy+20,0,100);addMood(6);addAff(4);
evQueue.push({evo:true,emo:nf.emo,title:L('evolve_title'),msg:L('evo_l1',{n:S.name,f:nf.name[SET.lang]||nf.name.en})});
if(nf.st===3){S.flags.love=S.flags.love||(id.indexOf('_s')>=0);if(id.indexOf('_s')>=0)S.flags.love=true;}
G3.buildCreature(id);G3.jump();SFX.fanfare();
}
/* ================= end of day ================= */
function endDay(){
if(!S||S.ended||ovlOpen)return;
SFX.click();
if(S.day>=MAXDAY){finishEnding();return;}
if(S.energy>=40)S.flags.tired=false;
S.coins=Math.max(0,S.coins-2);logLine('w_food',{c:2},'sys');
addMood(-(S.cleanFlag?2:3));S.cleanFlag=false;
if(!S.flags.sick&&S.ev.sickRoll===undefined)S.ev.sickRoll=0;
if(!S.flags.sick&&(S.energy<25||S.mood<30)&&S.ev.sick<2&&Math.random()<0.16){S.flags.sick=true;S.ev.sick=(S.ev.sick||0)+1;logLine('w_ill',{n:S.name},'evo');}
S.day++;S.energy=clamp(55+S.st/4,0,100);S.actLeft=2;
logLine('daysep',{d:S.day},'sep');
tryEvolve();
if(S.day===MAXDAY)logLine('day60',null,'evo');
rollDayEvents(S.day);
saveGame();renderHUD();renderActs();updateTopbar();
renderPending();
}
/* ================= events ================= */
function rollDayEvents(d){
if(d%15===12)evQueue.push(evCup());
if(d%15===0)evQueue.push(evFestival());
const pool=EVENT_POOL.filter(e=>{try{return (!e.one||!S.ev['ev_'+e.id])&&e.cond();}catch(err){return false;}});
if(Math.random()<0.6&&pool.length){const e=pool[ri(0,pool.length-1)];S.ev['ev_'+e.id]=1;evQueue.push(e.make());}
}
function b(l,cb){return {l:l,cb:cb};}
function evt(o){SFX.chime();return o;}
function evCup(){
return evt({title:L('f_cup_t'),msg:L('f_cup_m',{n:S.name}),buttons:[
b(L('f_cup_b1'),()=>{S.ev.fight=(S.ev.fight||0)+1;const pw=S.pw+S.st/2+ri(1,15);const win=pw>=45&&Math.random()<clamp(pw/85,0.2,0.92);
if(win){S.flags.champion=true;const c=35;S.coins+=c;const a1=applyGain('pw',4),a2=6;addMood(a2);logLine('f_cup_r1',{c:c,a:a1,a2:a2},'ev');SFX.fanfare();G3.jump();}
else{const a1=applyGain('st',4),a2=4;addMood(a2);logLine('f_cup_r2',{c:0,a:a1,a2:a2},'ev');SFX.ok();}closeOvl();}),
b(L('f_cup_b2'),()=>{const a=5;addMood(a);logLine('f_cup_r3',{a:a},'ev');closeOvl();})
]});
}
function evFestival(){
return evt({title:L('f_fest_t'),msg:L('f_fest_m'),buttons:[
b(L('f_fest_b1',{c:10}),()=>{if(S.coins>=10){S.coins-=10;const a1=applyGain('ch',4),a2=8;addMood(a2);logLine('f_fest_r1',{a:a1,a2:a2},'ev');SFX.coin();G3.hearts(3);}closeOvl();}),
b(L('f_fest_b2'),()=>{if(S.coins<5){$('#ovMsg').textContent=L('no_coins');SFX.no();return;}S.coins-=5;const a=6;addMood(a);logLine('f_fest_r2',{c:5,a:a},'ev');closeOvl();})
]});
}
function evSickRepeat(){
return evt({title:L('f_sick_t'),emo:'🤒',msg:L('f_sick_m2',{n:S.name}),buttons:[
b(L('f_sick_b1'),()=>{S.flags.sick=false;S.ev.medicine=(S.ev.medicine||0)+1;logLine('w_heal',null,'evo');SFX.ok();closeOvl();}),
b(L('f_sick_b2'),()=>{logLine('f_sick_r2',null,'ev');closeOvl();})
]});
}
const EVENT_POOL=[
{id:'market',one:false,cond:()=>S.day>=5,make:()=>evt({title:L('f_market_t'),emo:'🪙',msg:L('f_market_m'),buttons:[
 b(L('f_b1'),()=>{const c=8;S.coins+=c;logLine('f_market_r1',{c:c},'ev');SFX.coin();closeOvl();}),
 b(L('f_b2'),()=>{if(Math.random()<0.5){const c=22;S.coins+=c;logLine('f_market_r2',{c:c},'ev');SFX.coin();}else{const c=Math.min(S.coins,12);S.coins-=c;logLine('f_market_r3',{c:c},'ev');SFX.no();}closeOvl();}),
 b(L('f_b3'),()=>{const a=3;addMood(a);logLine('f_market_r4',{a:a},'ev');closeOvl();})
]})},
{id:'rival',one:true,cond:()=>S.day>=6&&!S.flags.rival,make:()=>evt({title:L('f_rival_t'),emo:'😼',msg:L('f_rival_m'),buttons:[
 b(L('f_b4'),()=>{S.flags.rival=true;const a1=applyGain('pw',3),a2=applyGain('st',3);logLine('f_rival_r1',{a:a1,a2:a2},'ev');closeOvl();}),
 b(L('f_b5'),()=>{const a=applyGain('sp',4);logLine('f_rival_r2',{a:a},'ev');closeOvl();}),
 b(L('f_b6'),()=>{const a1=applyGain('ch',3),a2=6;addMood(a2);logLine('f_rival_r3',{a:a1,a2:a2},'ev');closeOvl();})
]})},
{id:'sick',one:false,cond:()=>S.flags.sick,make:evSickRepeat},
{id:'dream',one:true,cond:()=>(S.ev.sp||0)>=6,make:()=>evt({title:L('f_dream_t'),emo:'💭',msg:L('f_dream_m',{n:S.name}),buttons:[
 b(L('f_dream_b1'),()=>{addMood(8);addAff(3);const a=applyGain('sp',2);logLine('f_dream_r1',null,'ev');logLine(gainMsg({g_sp:a,mood:8}),null,'sys');G3.hearts(3);closeOvl();}),
 b(L('f_dream_b2'),()=>{addMood(4);logLine('f_dream_r2',null,'ev');closeOvl();})
]})},
{id:'treasure',one:true,cond:()=>S.day>=8,make:()=>evt({title:L('f_tre_t'),emo:'💎',msg:L('f_tre_m'),buttons:[
 b(L('f_tre_b1'),()=>{const c=24;S.coins+=c;logLine('f_tre_r1',{c:c},'ev');SFX.coin();closeOvl();}),
 b(L('f_tre_b2'),()=>{S.ev.artifact=(S.ev.artifact||0)+1;addMood(10);logLine('f_tre_r2',null,'ev');SFX.chime();closeOvl();})
]})},
{id:'friend',one:false,cond:()=>S.day>=4&&S.day%3!==0,make:()=>evt({title:L('f_friend_t'),emo:'👋',msg:L('f_friend_m'),buttons:[
 b(L('f_friend_b1'),()=>{const a=applyGain('ch',3);logLine('f_friend_r1',{a:a},'ev');closeOvl();}),
 b(L('f_friend_b2'),()=>{if(S.coins<4){$('#ovMsg').textContent=L('no_coins');SFX.no();return;}S.coins-=4;const a=7;addMood(a);logLine('f_friend_r2',{a:a},'ev');closeOvl();}),
 b(L('f_friend_b3'),()=>{const c=6;S.coins+=c;logLine('f_friend_r3',{c:c},'ev');SFX.coin();closeOvl();})
]})},
{id:'insp',one:true,cond:()=>S.br>=20,make:()=>evt({title:L('f_insp_t'),emo:'💡',msg:L('f_insp_m'),buttons:[
 b(L('f_insp_b1'),()=>{const a=applyGain('br',6);logLine('f_insp_r1',{a:a},'ev');SFX.chime();closeOvl();}),
 b(L('f_insp_b2'),()=>{const a=applyGain('br',3);logLine('f_insp_r2',{a:a},'ev');closeOvl();})
]})},
{id:'storm',one:true,cond:()=>S.day>=10&&dayPhase(S.day)===3,make:()=>evt({title:L('f_storm_t'),emo:'⛈️',msg:L('f_storm_m',{n:S.name}),buttons:[
 b(L('f_storm_b1'),()=>{const a=applyGain('st',4);logLine('f_storm_r1',{a:a},'ev');closeOvl();}),
 b(L('f_storm_b2'),()=>{const a=applyGain('sp',4),a2=applyGain('pw',3);logLine('f_storm_r2',{a:a,a2:a2},'ev');G3.jump();closeOvl();})
]})},
{id:'star',one:true,cond:()=>dayPhase(S.day)===3&&S.day>=15,make:()=>evt({title:L('f_star_t'),emo:'🌠',msg:L('f_star_m'),buttons:[
 b(L('f_star_b1'),()=>{const a=12;addMood(a);addAff(6);logLine('f_star_r1',{a:a},'ev');G3.hearts(4);closeOvl();}),
 b(L('f_star_b2'),()=>{const a=applyGain('sp',5);logLine('f_star_r2',{a:a},'ev');SFX.chime();closeOvl();})
]})},
{id:'gift',one:true,cond:()=>S.aff>=55,make:()=>evt({title:L('f_gift_t'),emo:'🎁',msg:L('f_gift_m'),buttons:[
 b(L('f_gift_b1'),()=>{const c=20;S.coins+=c;addMood(6);logLine('f_gift_r1',{c:c},'ev');SFX.coin();closeOvl();}),
 b(L('f_gift_b2'),()=>{const a=applyGain('sp',4);addMood(5);logLine('f_gift_r2',{a:a},'ev');closeOvl();})
]})},
{id:'cook',one:true,cond:()=>S.ch>=30,make:()=>evt({title:L('f_cook_t'),emo:'🍳',msg:L('f_cook_m'),buttons:[
 b(L('f_cook_b1'),()=>{if(S.ch+ri(1,10)>=S.day*0.8){const c=26;S.coins+=c;logLine('f_cook_r1',{c:c},'ev');SFX.coin();}else{addMood(-4);logLine('f_market_r3',{c:5},'ev');S.coins=Math.max(0,S.coins-5);SFX.no();}closeOvl();}),
 b(L('f_cook_b2'),()=>{const a=6;addMood(a);logLine('f_cook_r2',{a:a},'ev');closeOvl();})
]})},
{id:'egg',one:true,cond:()=>S.day>=20&&Math.random()<0.5,make:()=>evt({title:L('f_egg_t'),emo:'🥚',msg:L('f_egg_m'),buttons:[
 b(L('f_egg_b1'),()=>{const a=applyGain('sp',6),a2=applyGain('br',4);logLine('f_egg_r1',{a:a,a2:a2},'ev');SFX.chime();closeOvl();}),
 b(L('f_egg_b2'),()=>{logLine('f_egg_r2',null,'ev');closeOvl();})
]})}
];
/* ================= ending ================= */
function finishEnding(){
let e=null;for(const E of ENDINGS){try{if(E.cond(S)){e=E;break;}}catch(err){}}
if(!e)e=ENDINGS[ENDINGS.length-1];
S.ended=e.id;addEndingColl(e.id);saveGame();stopBgm();SFX.end();
logLine('fin_t',null,'evo');
showOvl({emo:FORMS[S.form].emo,title:e.name[SET.lang]||e.name.en,rank:e.rank,msg:(e.text[SET.lang]||e.text.en)+'\n\n'+L('form_l')+': '+FORMS[S.form].emo+' '+(FORMS[S.form].name[SET.lang]||FORMS[S.form].name.en)+'\n'+L('end_stats')+': 💪'+Math.round(S.pw)+' 🧠'+Math.round(S.br)+' 💃'+Math.round(S.ch)+' 🏃'+Math.round(S.st)+' 🧘'+Math.round(S.sp)+'\n'+L('days_l'),btns:[
 {l:L('btn_newRun'),hi:true,cb:()=>{closeOvlNoQueue();goNew(S.slot);}},
 {l:L('btn_toTitle'),cb:()=>{closeOvlNoQueue();goTitle();}}
]});
}
function closeOvlNoQueue(){ovlOpen=false;evQueue.length=0;$('#ov').classList.add('hidden');}
/* ================= shop ================= */
function openShop(){
if(!S||S.ended||ovlOpen)return;SFX.click();
const btns=SHOPITEMS.map(it=>b('🪙'+it.price+' · '+SHOPNAME[it.it][SET.lang],()=>{
 if(S.coins<it.price){logLine('shop_no',null,'sys');SFX.no();closeOvl();return;}
 S.coins-=it.price;const parts={};
 if(it.st){S.st=clamp(S.st+it.st,0,99);}
 if(it.g)STATKEYS.forEach(k=>{if(it.g[k])parts['g_'+k]=applyGain(k,it.g[k]);});
 logLine('shop_ok',{it:SHOPNAME[it.it][SET.lang]},'ev');logLine(gainMsg(parts),null,'sys');SFX.coin();closeOvl();}));
btns.push(b(L('menu_no'),closeOvl));
showOvl({title:L('shop_t'),emo:'🛒',msg:'',btns:btns});
}
/* ================= screens ================= */
function goTitle(){stopBgm();showScreen('title');renderTitle();}
function renderTitle(){
const last=lastSlot();const d=slotData(last);
$('#btnCont').classList.toggle('hidden',!(S||d));
if(d)$('#btnCont').textContent=L('menu_cont')+'  (Day '+d.day+' · '+(d.name||'')+')';
$('#titleHint').textContent=L('help_text').split('\n')[0];
}
function goSlots(){SFX.click();buildSlots();showScreen('slots');}
function buildSlots(){
$('#slotsTitle').textContent=L('menu_slots');$('#slotsSub').textContent=L('menu_slots_sub');
$('#btnSlotsBack').textContent=L('menu_back');
const el=$('#slotsList');el.innerHTML='';
for(let i=0;i<3;i++){
const d=slotData(i);const card=document.createElement('div');card.className='slot';
if(d){const f=FORMS[d.form]||FORMS.egg;
card.innerHTML='<div class="semo">'+f.emo+'</div><div class="sinfo"><div class="st1">'+esc(d.name||'')+' ('+esc(SPECIES[d.sp]?SPECIES[d.sp].default[SET.lang]:'')+')'+'</div><div class="st2">'+esc(L('d',{d:d.day,max:MAXDAY}))+' · '+esc(f.name[SET.lang]||f.name.en)+'</div></div>';
const go=document.createElement('button');go.className='go';go.textContent=L('menu_start');go.addEventListener('click',ev=>{ev.stopPropagation();SFX.click();resumeGame(i);});
const del=document.createElement('button');del.className='del';del.textContent=L('menu_del');del.addEventListener('click',ev=>{ev.stopPropagation();SFX.click();showOvl({title:L('menu_delq'),btns:[{l:L('menu_yes'),cb:()=>{deleteSlot(i);closeOvlNoQueue();buildSlots();},hi:true},{l:L('menu_no'),cb:closeOvlNoQueue}]});});
const w=document.createElement('div');w.className='sbtns';w.appendChild(go);w.appendChild(del);card.appendChild(w);
card.addEventListener('click',()=>{SFX.click();showOvl({title:L('replace'),btns:[{l:L('menu_start'),hi:true,cb:()=>{closeOvlNoQueue();goNew(i);}},{l:L('menu_cont'),cb:()=>{closeOvlNoQueue();resumeGame(i);}},{l:L('menu_no'),cb:closeOvlNoQueue}]});});
}else{
card.innerHTML='<div class="semo">➕</div><div class="sinfo"><div class="st1">Slot '+(i+1)+'</div><div class="st2">'+L('menu_new')+'</div></div>';
card.addEventListener('click',()=>{SFX.click();goNew(i);});
}
el.appendChild(card);}
}
function goNew(slot){pendingSlot=slot;chosenStarter='ember';
$('#newTitle').textContent=L('new_title');$('#newSub').textContent=L('new_sub');
const el=$('#starterList');el.innerHTML='';
['ember','sprout','bubble'].forEach(sp=>{
const c=document.createElement('button');c.className='starter'+(sp===chosenStarter?' sel':'');
c.innerHTML='<span class="semo">'+SPECIES[sp].emo+'</span><span><b>'+esc(FORMS[sp+'0'].name[SET.lang]||FORMS[sp+'0'].name.en)+'</b><span>'+esc(L(SPECIES[sp].t))+'</span></span>';
c.addEventListener('click',()=>{chosenStarter=sp;SFX.click();[...el.children].forEach(x=>x.classList.remove('sel'));c.classList.add('sel');$('#nameInput').value=SPECIES[sp].default[SET.lang];});
el.appendChild(c);});
$('#nameInput').value=SPECIES[chosenStarter].default[SET.lang];
showScreen('new');
}
function startGame(){
SFX.fanfare();
const nm=($('#nameInput').value||'').trim().slice(0,10)||SPECIES[chosenStarter].default[SET.lang];
S={slot:pendingSlot,sp:chosenStarter,species:chosenStarter,name:nm,day:1,actLeft:2,energy:70,coins:30,mood:70,aff:10,
pw:5,br:5,ch:5,st:5,sp:5,form:chosenStarter+'0',ended:null,
flags:{sick:false,tired:false,love:false,rival:false,champion:false},ev:{sick:0},log:[]};
logLine('daysep',{d:1},'sep');
buildStatGrid();showScreen('game');G3.setPhase(1);G3.buildCreature(S.form);
saveGame();applyLabels();startBgm();
G3.evolveFx();
}
function resumeGame(i){
const d=slotData(i);if(!d)return;S=d;
if(!S.ev)S.ev={};if(!S.flags)S.flags={};if(!S.log)S.log=[];
buildStatGrid();showScreen('game');G3.setPhase(dayPhase(S.day));G3.buildCreature(S.form);
applyLabels();startBgm();
if(S.ended){const e=ENDINGS.find(x=>x.id===S.ended)||ENDINGS[ENDINGS.length-1];logLine('fin_t',null,'evo');finishShow(e);}
}
function finishShow(e){showOvl({emo:FORMS[S.form].emo,title:e.name[SET.lang]||e.name.en,rank:e.rank,msg:(e.text[SET.lang]||e.text.en),btns:[{l:L('btn_newRun'),hi:true,cb:()=>{closeOvlNoQueue();goNew(S.slot);}},{l:L('btn_toTitle'),cb:()=>{closeOvlNoQueue();goTitle();}}]});}
function goGallery(){SFX.click();buildGallery();showScreen('gallery');}
function buildGallery(){
$('#galTitle').textContent=L('col_t');
const got=endingColl();
$('#galSub').textContent=L('col_sub',{n:got.length,m:ENDINGS.length});
$('#btnGalBack').textContent=L('menu_back');
const el=$('#galList');el.innerHTML='';
ENDINGS.slice().sort((a,b)=>('SABCD'.indexOf(a.rank)-'SABCD'.indexOf(b.rank))).forEach(e=>{
const div=document.createElement('div');div.className='galitem'+(got.indexOf(e.id)<0?' lock':'');
if(got.indexOf(e.id)<0)div.innerHTML='<span class="gr rankD">?</span>'+L('col_locked');
else div.innerHTML='<span class="gr rank'+e.rank+'">'+e.rank+'</span><b>'+esc(e.name[SET.lang]||e.name.en)+'</b><div style="font-size:11.5px;color:#93a0c8;margin-top:3px">'+esc(e.text[SET.lang]||e.text.en)+'</div>';
el.appendChild(div);});
}
/* pet */
function petPet(){
if(!S||screen!=='game'||ovlOpen||S.ended)return;
const now=Date.now();if(now-petLock<2000)return;petLock=now;
addMood(2);addAff(1);logLine('log_pet',{n:S.name},'');
SFX.pet();G3.hearts(2);saveGame();renderHUD();
}
