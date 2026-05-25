@echo off
cd /d "%~dp0"
if "%OPENAI_API_KEY%"=="" (
  echo.
  echo OPENAI_API_KEY is not set.
  echo The app will open, but real AI chat needs an OpenAI API key.
  echo.
)
"C:\Users\Saule\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" server.mjs
