# PowerShell script to check what files will be tracked by Git
Write-Host "Files that WILL be tracked by Git:" -ForegroundColor Green
git ls-files --cached --others --exclude-standard

Write-Host ""
Write-Host "Files that will be IGNORED by Git:" -ForegroundColor Red
git status --ignored | Select-String -Pattern "Ignored"
