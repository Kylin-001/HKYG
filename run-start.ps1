$scriptPath = 'e:\Program File\HKYG\heikeji-mall\start-services.ps1'
$content = [System.IO.File]::ReadAllText($scriptPath)
Invoke-Expression $content
