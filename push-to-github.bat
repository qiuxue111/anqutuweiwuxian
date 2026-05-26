@echo off
chcp 65001 >nul
echo ================================
echo  暗区突围：无限 — 上传到 GitHub
echo ================================
echo.
echo 仓库: qiuxue111/anqutuweiwuxian
echo.

:: 检查 git 是否安装
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 未检测到 Git，请先安装 Git for Windows
    echo 下载地址: https://git-scm.com/download/win
    pause
    exit /b 1
)

:: 初始化 git 仓库（如果还没有）
if not exist ".git" (
    echo 📦 初始化 Git 仓库...
    git init
    git remote add origin https://github.com/qiuxue111/anqutuweiwuxian.git
)

echo 📁 添加所有文件...
git add .

set /p msg="📝 输入提交说明（直接回车默认"更新攻略": "
if "%msg%"=="" set msg=更新攻略

git commit -m "%msg%" --allow-empty

echo.
echo ☁️ 推送到 GitHub...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ 上传成功！
    echo 🌐 访问地址: https://qiuxue111.github.io/anqutuweiwuxian/
    echo.
    echo 提示：需要在 GitHub 仓库 Settings - Pages 开启 GitHub Pages
    echo Source 选 "Deploy from a branch", Branch 选 "main", 目录选 "/ (root)"
) else (
    echo.
    echo ❌ 推送失败，可能是：
    echo   1. 没有登录 GitHub（需要 Personal Access Token）
    echo   2. 网络问题
    echo.
    echo 解决方法：用 GitHub Desktop 或手动上传
)

pause
