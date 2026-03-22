@echo off
echo Dang kiem tra moi truong...
node -v
if %errorlevel% neq 0 (
    echo [LOI] Node.js chua duoc cai dat!
) else (
    echo Node.js: OK
)
npm -v
if %errorlevel% neq 0 (
    echo [LOI] NPM chua duoc cai dat!
) else (
    echo NPM: OK
)
pause
