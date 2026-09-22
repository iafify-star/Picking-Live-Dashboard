@echo off
title Noon Minutes Pick Dashboard
cd /d "%~dp0"
echo Starting live dashboard...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
