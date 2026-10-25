/* ================= boot ================= */
function wire(){
$('#btnLang').addEventListener('click',()=>{SET.lang=LANGS[(LANGS.indexOf(SET.lang)+1)%LANGS.length];saveSet();SFX.click();applyLabels();if(screen==='title')renderTitle();else if(screen==='slots')buildSlots();else if(screen==='gallery')buildGallery();});
$('#btnSound').addEventListener('click',()=>{SET.sound=!SET.sound;applySound();if(SET.sound)SFX.click();saveSet();});
$('#btnNew').addEventListener('click',goSlots);
$('#btnCont').addEventListener('click',()=>{SFX.click();const last=lastSlot();if(slotData(last))resumeGame(last);});
$('#btnGal').addEventListener('click',goGallery);
$('#btnHelpT').addEventListener('click',()=>{SFX.click();showOvl({title:L('m_help'),msg:L('help_text'),btns:[{l:'OK ✓',cb:closeOvlNoQueue}]});});
$('#btnSlotsBack').addEventListener('click',()=>{SFX.click();goTitle();});
$('#btnGalBack').addEventListener('click',()=>{SFX.click();goTitle();});
$('#btnStart').addEventListener('click',startGame);
$('#btnEndDay').addEventListener('click',endDay);
$('#btnSave').addEventListener('click',()=>{if(S&&!S.ended){if(saveGame()){logLine('saved_ok',null,'sys');SFX.ok();}else{logLine('save_failed',null,'sys');SFX.no();}}});
$('#btnTitle').addEventListener('click',()=>{SFX.click();if(S)saveGame();stopBgm();goTitle();});
}
function boot(){
applyLabels();
applySound();
wire();
G3.init($('#c3'),()=>petPet());
G3.setPhase(1);
G3.buildCreature('egg');
renderTitle();
showScreen('title');
}
boot();
