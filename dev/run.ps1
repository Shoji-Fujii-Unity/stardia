# Robust CDP runner for EMBERFRONT: reads commands from a file, writes results to a log.
# usage: Get-Content ef_run.ps1 -Raw | Invoke-Expression
# env: EFCMD (command file), EFLOG (output log), EFWIN (window size W,H), EFSECS (eval timeout)
$ErrorActionPreference='Continue'
$root="C:\Users\s-fuj\Documents\Strata\Workspace"
$cmdfile=$env:EFCMD; if(-not $cmdfile){ $cmdfile="$root\stardia\cmd.txt" }
$logfile=$env:EFLOG;  if(-not $logfile){ $logfile="$root\stardia\runlog.txt" }
$port=9352
$win='1024,640'; if($env:EFWIN){ $win=$env:EFWIN }
$secs=15; if($env:EFSECS){ $secs=[int]$env:EFSECS }
$edge="${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
if(-not (Test-Path $edge)){ $edge="${env:ProgramFiles}\Microsoft\Edge\Application\msedge.exe" }
$ud=Join-Path $env:TEMP ('stardia_ud_'+(Get-Random))
$enc=New-Object System.Text.UTF8Encoding($false)
$script:log=New-Object System.Collections.ArrayList
function L($s){ [void]$script:log.Add([string]$s) }
function FlushLog(){ try{ [System.IO.File]::WriteAllText($logfile,($script:log -join "`r`n"),$enc) }catch{ Write-Host 'logwrite fail' } }

$stale=Get-CimInstance Win32_Process -Filter "Name='msedge.exe'" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*remote-debugging-port=$port*" }
foreach($s in $stale){ Stop-Process -Id $s.ProcessId -Force -ErrorAction SilentlyContinue }
Start-Sleep -Milliseconds 800

$html=Join-Path $root 'stardia\index.html'
$url='file:///' + $html.Replace('\','/')
$bp=Start-Process -FilePath $edge -ArgumentList @('--headless=new',"--remote-debugging-port=$port","--user-data-dir=$ud",'--disable-gpu','--disable-dev-shm-usage','--remote-allow-origins=*','--mute-audio',"--window-size=$win",'--no-first-run','--disable-features=Translate',$url) -PassThru
$target=$null
for($i=0;$i -lt 60;$i++){ try{
    $list=Invoke-RestMethod "http://127.0.0.1:$port/json/list"
    $page=$list | Where-Object { $_.type -eq 'page' -and $_.url -like 'file://*' -and $_.webSocketDebuggerUrl } | Select-Object -First 1
    if($page){ $target=$page; break } }catch{}
  Start-Sleep -Milliseconds 400 }
if(-not $target){ L 'FAIL: no CDP target'; FlushLog; if($bp){Stop-Process -Id $bp.Id -Force -ErrorAction SilentlyContinue}; Write-Host 'NO TARGET'; exit 1 }

$ws=[System.Net.WebSockets.ClientWebSocket]::new()
$ws.ConnectAsync([Uri]$target.webSocketDebuggerUrl,[Threading.CancellationToken]::None).Wait()
$script:msgId=0; $script:pending=$null; $script:acc=''; $script:results=@{}; $script:dead=$false
function Send-Msg($method,$params){
  if($script:dead){ return 0 }
  $o=[ordered]@{id=(++$script:msgId);method=$method}; if($null -ne $params){$o.params=$params}
  $bytes=[Text.Encoding]::UTF8.GetBytes(($o|ConvertTo-Json -Compress -Depth 10))
  try{ $ws.SendAsync([ArraySegment[byte]]::new($bytes),[System.Net.WebSockets.WebSocketMessageType]::Text,$true,[Threading.CancellationToken]::None).Wait() }
  catch{ $script:dead=$true; L ('SEND FAIL ' + $method); return 0 }
  return $script:msgId }
function Handle-Event($obj){
  if($null -eq $obj){ return }
  if($obj.method -eq 'Runtime.exceptionThrown'){ $d=$obj.params.exceptionDetails
    L ('EXC line'+$d.lineNumber+': ' + $(if($d.exception){$d.exception.description}else{$d.text})) }
  elseif($obj.method -eq 'Runtime.consoleAPICalled' -and ($obj.params.type -eq 'error')){
    L ('CONSOLE: ' + (($obj.params.args|ForEach-Object{ if($_.description){$_.description}else{$_.value} }) -join ' ')) }
  elseif($obj.method -eq 'Log.entryAdded' -and $obj.params.entry.level -eq 'error'){
    L ('LOG: ' + $obj.params.entry.text) }
  if($obj.id){ $script:results[[int]$obj.id]=$obj } }
function Pump($ms){
  if($script:dead){ return }
  $deadline=(Get-Date).AddMilliseconds($ms)
  while($true){
    $rem=[int]($deadline-(Get-Date)).TotalMilliseconds; if($rem -le 0){ return }
    if($null -eq $script:pending){ $buf=New-Object byte[] 262144
      $script:pending=@{task=$ws.ReceiveAsync([ArraySegment[byte]]::new($buf),[Threading.CancellationToken]::None);buf=$buf} }
    $ok=$false
    try{ $ok=$script:pending.task.Wait($rem) }
    catch{ $script:dead=$true; L 'WS DEAD'; $script:pending=$null; return }
    if($ok){
      $res=$script:pending.task.Result
      if($res.MessageType -eq 'Close'){ $script:dead=$true; L 'WS CLOSED'; $script:pending=$null; return }
      $script:acc+=[Text.Encoding]::UTF8.GetString($script:pending.buf,0,$res.Count)
      if($res.EndOfMessage){ $txt=$script:acc; $script:acc=''; $o=$null; try{$o=$txt|ConvertFrom-Json}catch{}
        Handle-Event $o; $script:pending=$null }
      else { $b2=New-Object byte[] 262144; $script:pending=@{task=$ws.ReceiveAsync([ArraySegment[byte]]::new($b2),[Threading.CancellationToken]::None);buf=$b2} } }
    else { return } } }
function Await-Id($id,$secs){
  $dl=(Get-Date).AddSeconds($secs)
  while(-not $script:results.ContainsKey($id) -and (Get-Date) -lt $dl -and -not $script:dead){ Pump 250 }
  return $script:results.ContainsKey($id) }
function Eval($expr){
  if($script:dead){ return '<dead>' }
  $id=Send-Msg 'Runtime.evaluate' ([ordered]@{expression=$expr;returnByValue=$true;awaitPromise=$true})
  if($id -eq 0){ return '<dead>' }
  if(-not (Await-Id $id $secs)){ return '<timeout>' }
  $r=$script:results[$id].result
  if($r.exceptionDetails){ return 'EVALERR: ' + $(if($r.exceptionDetails.exception){$r.exceptionDetails.exception.description}else{$r.exceptionDetails.text}) }
  if($null -ne $r.result.value){ return $r.result.value }
  return ('['+$r.result.type+']') }
function Click-XY($x,$y){
  Send-Msg 'Input.dispatchMouseEvent' ([ordered]@{type='mouseMoved';x=[double]$x;y=[double]$y;button='none'})|Out-Null; Pump 100
  Send-Msg 'Input.dispatchMouseEvent' ([ordered]@{type='mousePressed';x=[double]$x;y=[double]$y;button='left';buttons=1;clickCount=1})|Out-Null; Pump 120
  Send-Msg 'Input.dispatchMouseEvent' ([ordered]@{type='mouseReleased';x=[double]$x;y=[double]$y;button='left';buttons=0;clickCount=1})|Out-Null; Pump 350 }
function Touch-XY($x,$y){
  $pt=[ordered]@{x=[double]$x;y=[double]$y;id=1}
  Send-Msg 'Input.dispatchTouchEvent' ([ordered]@{type='touchStart';touchPoints=@($pt)})|Out-Null; Pump 120
  Send-Msg 'Input.dispatchTouchEvent' ([ordered]@{type='touchEnd';touchPoints=@()})|Out-Null; Pump 350 }
function Shot($name){
  $id=Send-Msg 'Page.captureScreenshot' ([ordered]@{format='png'})
  if(-not (Await-Id $id 20)){ L 'SHOT timeout'; return }
  $r=$script:results[$id].result
  if($r -and $r.data){ $p=Join-Path $root ($name+'.png'); [IO.File]::WriteAllBytes($p,[Convert]::FromBase64String($r.data)); L ("SHOT " + $p) }
  else { L ('SHOT error ' + $r.error.message) } }
function Key($nm){
  $k=$nm; $cd=$nm; $vk=0; $tx=''
  switch($nm){ 'Space'{ $k=' '; $cd='Space'; $vk=32; $tx=' ' } 'Escape'{ $k='Escape'; $cd='Escape'; $vk=27 } 'Enter'{ $k='Enter'; $cd='Enter'; $vk=13; $tx=[string][char]13 } 'Tab'{ $k='Tab'; $cd='Tab'; $vk=9 } default { $tx=$nm } }
  $pd=[ordered]@{type='keyDown';key=$k;code=$cd}; if($vk){ $pd.windowsVirtualKeyCode=$vk; $pd.nativeVirtualKey=$vk }; if($tx -ne ''){ $pd.text=$tx }
  $pu=[ordered]@{type='keyUp';key=$k;code=$cd}; if($vk){ $pu.windowsVirtualKeyCode=$vk; $pu.nativeVirtualKey=$vk }
  Send-Msg 'Input.dispatchKeyEvent' $pd|Out-Null; Pump 150; Send-Msg 'Input.dispatchKeyEvent' $pu|Out-Null; Pump 400 }

Send-Msg 'Runtime.enable' $null|Out-Null; Send-Msg 'Log.enable' $null|Out-Null; Send-Msg 'Page.enable' $null|Out-Null
Pump 6000
L ("loaded: " + (Eval "document.readyState+' '+location.href.length") + " win=" + $win)
$lines=[System.IO.File]::ReadAllLines($cmdfile,$enc)
foreach($ln in $lines){
  if($script:dead){ break }
  $t=$ln.Trim(); if($t -eq '' -or $t.StartsWith('#')){ continue }
  if($t.StartsWith('CLICK ')){
    $sel=$t.Substring(6).Trim()
    $js='(()=>{const e=document.querySelector(`'+$sel+'`); if(!e) return "NOEL"; e.scrollIntoView({block:"center",inline:"nearest"}); const r=e.getBoundingClientRect(); if(r.width<2||r.height<2) return "HIDDEN"; if(r.bottom<0||r.top>window.innerHeight) return "OFFVIEW"; return JSON.stringify({x:Math.round(r.left+r.width/2),y:Math.round(r.top+r.height/2)});})()'
    $v=Eval $js
    if($v -is [string] -and $v -like '{*'){ $o=$v|ConvertFrom-Json; Click-XY $o.x $o.y; L ("CLICKED $sel @"+$o.x+','+$o.y) } else { L ("CLICKFAIL $sel -> $v") }
    continue }
  if($t.StartsWith('TOUCHJS ')){
    $v=Eval ($t.Substring(8).Trim())
    if($v -is [string] -and $v -like '{*'){ $o=$v|ConvertFrom-Json; Touch-XY $o.x $o.y; L ("TOUCHJS @"+$o.x+','+$o.y) } else { L ("TOUCHJSFAIL -> $v") }
    continue }
  if($t.StartsWith('XYJS ')){
    $v=Eval ($t.Substring(5).Trim())
    if($v -is [string] -and $v -like '{*'){ $o=$v|ConvertFrom-Json; Click-XY $o.x $o.y; L ("XYJS @"+$o.x+','+$o.y) } else { L ("XYJSFAIL -> $v") }
    continue }
  if($t.StartsWith('EMUL ')){ $p=$t.Substring(5).Trim().Split(','); Send-Msg 'Emulation.setDeviceMetricsOverride' ([ordered]@{width=[int]$p[0];height=[int]$p[1];deviceScaleFactor=2;mobile=$true})|Out-Null; Pump 700; L ("EMUL "+$p[0]+'x'+$p[1]); continue }
  if($t -eq 'EMULOFF'){ Send-Msg 'Emulation.clearDeviceMetricsOverride' $null|Out-Null; Pump 600; L 'EMUL off'; continue }
  if($t.StartsWith('WAIT ')){ Pump ([int]$t.Substring(5)); continue }
  if($t.StartsWith('XY ')){ $p=$t.Substring(3).Trim().Split(' '); Click-XY ([double]$p[0]) ([double]$p[1]); L ("XY "+$p[0]+','+$p[1]); continue }
  if($t.StartsWith('SHOT ')){ Shot ($t.Substring(5).Trim()); continue }
  if($t.StartsWith('KEY ')){ Key ($t.Substring(4).Trim().Split(' ')[0]); L ("KEY "+$t.Substring(4)); continue }
  $v=Eval $t
  L ("R> " + $t.Substring(0,[Math]::Min(80,$t.Length)))
  $s=($v|Out-String).Trim() -replace "`r`n|`n",' ~ '
  if($s.Length -gt 620){ $s=$s.Substring(0,620)+' ...' }
  L ("   " + $s) }
L 'DONE'
FlushLog
$children=Get-CimInstance Win32_Process -Filter "ParentProcessId=$($bp.Id)" -ErrorAction SilentlyContinue
foreach($c in $children){ Stop-Process -Id $c.ProcessId -Force -ErrorAction SilentlyContinue }
Stop-Process -Id $bp.Id -Force -ErrorAction SilentlyContinue
Write-Host ("ran. log=" + $logfile)
