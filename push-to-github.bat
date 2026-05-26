@echo off
chcp 437 >nul
echo ================================
echo  Upload to GitHub - Anqutuwei
echo ================================
echo.

where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [FAIL] Git not found
    echo Download: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo [OK] Git found

if not exist ".git" (
    echo [INIT] Creating repository...
    git init
    git remote add origin https://github.com/qiuxue111/anqutuweiwuxian.git
    echo [OK] Repository initialized
)

echo.
if exist "data\review-queue.json" (
    echo [REVIEW] Merging review queue...
    where node >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        node scripts/approve-changes.js
    ) else (
        echo [SKIP] Node.js not found, merge manually
    )
) else (
    echo [OK] No pending reviews
)

echo.
echo [GIT] Adding files...
git add .

set /p msg=Commit message: 
if "%msg%"=="" set msg=update

git commit -m "%msg%" --allow-empty

echo.
echo [GIT] Pushing to GitHub...
echo.
echo If login prompt appears:
echo   Username: qiuxue111
echo   Password: use Personal Access Token (NOT your login password)
echo.
echo Get token: https://github.com/settings/tokens
echo.
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===== SUCCESS =====
    echo Site: https://qiuxue111.github.io/anqutuweiwuxian/
) else (
    echo.
    echo ===== FAILED =====
    echo.
    echo 1. Need token? Set it:
    echo    git remote set-url origin https://qiuxue111:YOUR_TOKEN@github.com/qiuxue111/anqutuweiwuxian.git
    echo.
    echo 2. Network issue? Check github.com access
    echo.
    echo 3. Branch conflict? Try force push:
    echo    git push -u origin main --force
)

pause
