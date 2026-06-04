@echo off
title CVCrafter
echo CVCrafter baslatiliyor...
echo.
echo 1. Backend (port 3001)
start /B node server/index.cjs
echo 2. Frontend (port 5173)
start /B node node_modules/.bin/vite.cmd
echo.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Kapatmak icin bu pencereyi kapatin.
