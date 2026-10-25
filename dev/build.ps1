# Stardia build: concatenate shell html + js parts into index.html
$ErrorActionPreference='Stop'
$dir=Split-Path -Parent $MyInvocation.MyCommand.Path
$utf8=New-Object System.Text.UTF8Encoding($false)
$shell=[System.IO.File]::ReadAllText((Join-Path $dir '_shell.html'),[System.Text.Encoding]::UTF8)
$parts=@('p1.js','p2.js','p3.js','p4.js')|ForEach-Object{[System.IO.File]::ReadAllText((Join-Path $dir (Join-Path 'js' $_)),[System.Text.Encoding]::UTF8)}
$js=$parts -join "`r`n"
$out=$shell+"`r`n"+$js+"`r`n</script>`r`n</body>`r`n</html>`r`n"
$root=Split-Path -Parent $dir
$outPath=Join-Path $root 'index.html'
[System.IO.File]::WriteAllText($outPath,$out,$utf8)
# also make a plain js copy for syntax check
[System.IO.File]::WriteAllText((Join-Path $dir '_check.js'),'"use strict";'+$js,$utf8)
Write-Host "built index.html ($((Get-Item $outPath).Length) bytes)"
