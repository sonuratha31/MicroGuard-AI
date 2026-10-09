@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Node.js is required. Use the Node.js installation already used for your Vite project.
 pause
 exit /b 1
)
start "" "http://localhost:8080"
node serve.mjs
pause
