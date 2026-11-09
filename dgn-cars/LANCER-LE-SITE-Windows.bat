@echo off
cd /d "%~dp0"
echo === DGN Cars - lancement du site en local ===
where node >nul 2>nul || (echo Node.js n'est pas installe. Telechargez-le sur https://nodejs.org puis relancez ce fichier. & pause & exit /b 1)
if not exist node_modules (echo Installation des composants, quelques minutes la premiere fois... & call npm install || (pause & exit /b 1))
call npm run local
pause
