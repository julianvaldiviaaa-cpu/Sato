# publish.ps1 - Reconstruye y publica los cambios en el despliegue Docker.
#   1) docker compose up -d --build  -> recompila assets (Vite) y recrea contenedores
# Da por hecho que trabajaste en /dev (dev.ps1). Deja Docker corriendo.
# Uso:  .\publish.ps1
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$repo = $PSScriptRoot
Set-Location -LiteralPath $repo

Write-Host ""
Write-Host "==> Publicando en Docker (compila assets y recrea contenedores)..." -ForegroundColor Cyan
docker compose up -d --build

Write-Host ""
if ($LASTEXITCODE -eq 0) {
    Write-Host "==> Listo. Tu cambio esta publicado en http://localhost:8000" -ForegroundColor Green
    Write-Host "    (Si no ves los cambios, haz Ctrl+F5 en el navegador.)" -ForegroundColor Yellow
} else {
    Write-Host "==> Ocurrio un error durante el build. Revisa la salida de arriba." -ForegroundColor Red
}