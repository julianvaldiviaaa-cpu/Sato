# dev.ps1 - Entorno de desarrollo con HMR (Tailwind/React) en un clic.
# Detiene el despliegue Docker (libera el puerto 8000) y arranca el modo dev de Laravel.
#   1) docker compose down      -> libera :8000
#   2) composer run dev        -> php artisan serve + Vite (HMR) + queue
# Para publicar de nuevo en Docker: docker compose up -d --build
# Uso:  .\dev.ps1
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$repo = $PSScriptRoot
Set-Location -LiteralPath $repo

Write-Host ""
Write-Host "==> Deteniendo contenedores Docker (libera el puerto 8000)..." -ForegroundColor Cyan
docker compose down

Write-Host ""
Write-Host "==> Arrancando entorno dev (Vite HMR en http://localhost:8000)..." -ForegroundColor Cyan
Write-Host "    Edita recursos/ y se recarga al instante. Ctrl+C para detener." -ForegroundColor Yellow
Write-Host ""

# `composer run dev` lanza server + vite + queue de forma concurrente.
# --pullee con el mismo proceso para mostrar su salida en terminal.
composer run dev

Write-Host ""
Write-Host "Modo dev detenido. Para publicar en Docker: docker compose up -d --build" -ForegroundColor Green