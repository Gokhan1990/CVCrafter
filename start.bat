@echo off
echo Starting CV Gelistirici...
echo.
echo 1. Backend (port 3001)
start /B node server/index.cjs
echo 2. Frontend (port 5173)
start /B node node_modules/.bin/vite.cmd
echo.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo CV yukleyince AI analizi icin "node server/analyze.cjs" kullan
