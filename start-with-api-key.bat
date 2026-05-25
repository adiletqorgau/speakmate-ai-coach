@echo off
cd /d "%~dp0"
echo Paste your OpenAI API key and press Enter.
echo The key stays in this window only.
set /p OPENAI_API_KEY=OPENAI_API_KEY:
"C:\Users\Saule\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" server.mjs
echo.
echo Server stopped or crashed. Copy the message above and send it to Codex.
pause
