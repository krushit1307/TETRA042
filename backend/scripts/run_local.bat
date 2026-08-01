@echo off
REM Local dev server (port 8000)
cd /d "%~dp0.."
set PORT=8000
"D:\AI-ML\envs\agriforge-backend\Scripts\uvicorn.exe" app.main:app --host 127.0.0.1 --port 8000 --reload
