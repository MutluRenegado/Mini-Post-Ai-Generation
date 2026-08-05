@echo off
echo Loading secrets from Google Cloud Secret Manager...

for /f "delims=" %%i in ('gcloud secrets versions access latest --secret="GEMINI_SECRET_KEY"') do set GEMINI_SECRET_KEY=%%i
for /f "delims=" %%i in ('gcloud secrets versions access latest --secret="PEXELS_API_KEY"') do set PEXELS_API_KEY=%%i

echo Secrets loaded. Starting dev server...
npm run dev
