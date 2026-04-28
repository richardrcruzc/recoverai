$ErrorActionPreference = "Stop"

$frontendPath = ".\FrontEnd"
$backendPath = ".\BackEnd"
$apiProject = "$backendPath\src\CollectFlow.Api"
$wwwrootPath = "$apiProject\wwwroot"
$publishProfile = "collectflowai.com - Web Deploy.pubxml"

Write-Host "1. Building React frontend..." -ForegroundColor Cyan
Push-Location $frontendPath
npm run build
if ($LASTEXITCODE -ne 0) { throw "React build failed." }
Pop-Location

Write-Host "2. Cleaning API wwwroot..." -ForegroundColor Cyan
if (Test-Path $wwwrootPath) {
    Remove-Item "$wwwrootPath\*" -Recurse -Force
} else {
    New-Item -ItemType Directory -Path $wwwrootPath | Out-Null
}

Write-Host "3. Copying React build to API wwwroot..." -ForegroundColor Cyan
Copy-Item "$frontendPath\dist\*" "$wwwrootPath\" -Recurse -Force

Write-Host "4. Publishing with Visual Studio Web Deploy profile..." -ForegroundColor Cyan
dotnet msbuild "$apiProject\CollectFlow.Api.csproj" `
  /p:Configuration=Release `
  /p:DeployOnBuild=true `
  /p:PublishProfile=$publishProfile `
  /p:WebPublishMethod=MSDeploy

if ($LASTEXITCODE -ne 0) {
    throw "Web Deploy failed."
}

Write-Host "Deployment completed." -ForegroundColor Green