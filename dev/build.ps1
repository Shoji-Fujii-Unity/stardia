# Stardia build: concatenate shell html + js parts into index.html
$ErrorActionPreference='Stop'
$dir=Split-Path -Parent $MyInvocation.MyCommand.Path
$shell=Get-Content -Raw (Join-Path $dir '_shell.html')
$parts=@('p1.js','p2.js','p3.js','p4.js')|ForEach-Object{Get-Content -Raw (Join-Path $dir (Join-Path 'js' $_))}
$js=$parts -join "`r`n"
$out=$shell+"`r`n"+$js+"`r`n</script>`r`n</body>`r`n</html>`r`n"
[System.IO.File]::WriteAllText((Join-Path $dir 'index.html'),$out,(New-Object System.Text.UTF8Encoding($false)))
# also make a plain js copy for syntax check
[System.IO.File]::WriteAllText((Join-Path $dir '_check.js'),'"use strict";'+$js,(New-Object System.Text.UTF8Encoding($false)))
Write-Host "built index.html ($((Get-Item (Join-Path $dir 'index.html')).Length) bytes)"
