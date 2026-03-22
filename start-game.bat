@echo off
title Minecraft Web Starter
echo --------------------------------------
echo Dang khoi dong Minecraft Web Server...
echo --------------------------------------

:: Mo trinh duyet sau 5 giay (doi server len)
start "" "http://localhost:3000/game/play.html"

:: Chay server Next.js
npm run dev

pause
