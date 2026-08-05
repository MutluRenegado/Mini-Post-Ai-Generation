@echo off
setlocal EnableExtensions

REM ============================================================
REM Mini Post App - Provider Documentation Structure Creator
REM
REM Place this BAT file inside:
REM docs\Providers Modules\
REM
REM Then double-click it or run it from Command Prompt.
REM Existing files will NOT be overwritten.
REM ============================================================

set "ROOT=%~dp0"

echo.
echo Creating provider documentation structure in:
echo %ROOT%
echo.

REM ---------- Root shared documentation files ----------
call :CreateFile "%ROOT%README.md" "# Provider Modules"
call :CreateFile "%ROOT%Provider-Architecture-Standard.md" "# Provider Architecture Standard"
call :CreateFile "%ROOT%Provider-Development-Guide.md" "# Provider Development Guide"
call :CreateFile "%ROOT%Provider-Checklist.md" "# Provider Checklist"
call :CreateFile "%ROOT%Provider-Registry.md" "# Provider Registry"
call :CreateFile "%ROOT%Canonical-Image-Model.md" "# Canonical Image Model"
call :CreateFile "%ROOT%Provider-Router.md" "# Provider Router"
call :CreateFile "%ROOT%Secret-Manager-Guide.md" "# Secret Manager Guide"
call :CreateFile "%ROOT%Security-Requirements.md" "# Security Requirements"
call :CreateFile "%ROOT%Licensing-Compliance.md" "# Licensing Compliance"
call :CreateFile "%ROOT%Attribution-Rules.md" "# Attribution Rules"
call :CreateFile "%ROOT%Testing-Standards.md" "# Testing Standards"
call :CreateFile "%ROOT%Adding-New-Provider.md" "# Adding a New Provider"

REM ---------- Provider folders ----------
call :CreateProvider "Pexels"
call :CreateProvider "Pixabay"
call :CreateProvider "Unsplash"

echo.
echo ============================================================
echo Provider documentation structure created successfully.
echo Existing files were preserved.
echo ============================================================
echo.
pause
exit /b 0

:CreateProvider
set "PROVIDER=%~1"
set "DIR=%ROOT%%PROVIDER%"

if not exist "%DIR%\" (
    mkdir "%DIR%" >nul 2>&1
    echo [CREATED] Folder: %PROVIDER%
) else (
    echo [EXISTS ] Folder: %PROVIDER%
)

call :CreateFile "%DIR%\README.md" "# %PROVIDER% Provider"
call :CreateFile "%DIR%\Architecture.md" "# %PROVIDER% Architecture"
call :CreateFile "%DIR%\API.md" "# %PROVIDER% API"
call :CreateFile "%DIR%\Authentication.md" "# %PROVIDER% Authentication"
call :CreateFile "%DIR%\Configuration.md" "# %PROVIDER% Configuration"
call :CreateFile "%DIR%\Secret-Manager.md" "# %PROVIDER% Secret Manager"
call :CreateFile "%DIR%\Endpoints.md" "# %PROVIDER% Endpoints"
call :CreateFile "%DIR%\Search.md" "# %PROVIDER% Search"
call :CreateFile "%DIR%\Mapping.md" "# %PROVIDER% Mapping"
call :CreateFile "%DIR%\Image-Model.md" "# %PROVIDER% Image Model"
call :CreateFile "%DIR%\Rate-Limits.md" "# %PROVIDER% Rate Limits"
call :CreateFile "%DIR%\Caching.md" "# %PROVIDER% Caching"
call :CreateFile "%DIR%\Error-Handling.md" "# %PROVIDER% Error Handling"
call :CreateFile "%DIR%\Attribution.md" "# %PROVIDER% Attribution"
call :CreateFile "%DIR%\Licensing.md" "# %PROVIDER% Licensing"
call :CreateFile "%DIR%\Storage.md" "# %PROVIDER% Storage"
call :CreateFile "%DIR%\Security.md" "# %PROVIDER% Security"
call :CreateFile "%DIR%\Testing.md" "# %PROVIDER% Testing"
call :CreateFile "%DIR%\Troubleshooting.md" "# %PROVIDER% Troubleshooting"
call :CreateFile "%DIR%\Changelog.md" "# %PROVIDER% Changelog"
call :CreateFile "%DIR%\Future-Roadmap.md" "# %PROVIDER% Future Roadmap"

if /I "%PROVIDER%"=="Unsplash" (
    call :CreateFile "%DIR%\Download-Tracking.md" "# Unsplash Download Tracking"
)

exit /b 0

:CreateFile
set "FILE=%~1"
set "TITLE=%~2"

if exist "%FILE%" (
    echo [SKIPPED] %FILE%
) else (
    >"%FILE%" echo %TITLE%
    >>"%FILE%" echo.
    >>"%FILE%" echo Status: Draft
    >>"%FILE%" echo.
    echo [CREATED] %FILE%
)

exit /b 0
