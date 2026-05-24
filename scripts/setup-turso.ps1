# Run after adding DATABASE_URL and TURSO_AUTH_TOKEN to .env
# Usage: .\scripts\setup-turso.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

if (-not (Test-Path .env)) {
  Write-Host "Create .env from .env.example first and add TURSO_AUTH_TOKEN." -ForegroundColor Red
  exit 1
}

Write-Host "Pushing schema to Turso..." -ForegroundColor Cyan
npx prisma db push

Write-Host "Seeding admin user and defaults..." -ForegroundColor Cyan
npm run db:seed

Write-Host "Done. Admin login: username SHoEmafia" -ForegroundColor Green
