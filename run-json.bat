@echo off
setlocal
cd /d %~dp0

if not exist package.json (
  npm init -y >nul
)

if not exist node_modules\json-server\package.json (
  npm i -D json-server@0.17.4
)

npx json-server --watch db.json --port 3000

