@echo off
chcp 65001 >nul

echo ================================
echo  暗区突围：无限 - 上传到 GitHub
echo ================================
echo.
echo 仓库: qiuxue111/anqutuweiwuxian
echo.

:: 检查 git
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 未检测到 Git
    echo 下载地址: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)
echo [OK] Git 已安装

:: 初始化仓库
if not exist ".git" (
    echo [..] 初始化 Git 仓库...
    git init
    git remote add origin https://github.com/qiuxue111/anqutuweiwuxian.git
    echo [OK] 仓库初始化完成
)

:: 运行审核脚本
echo.
echo [..] 检查审核队列...
if exist "data\review-queue.json" (
    where node >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        node scripts/approve-changes.js
    ) else (
        echo [跳过] 未安装 Node.js，请手动合并 data/review-queue.json 到 data/pins.json
    )
) else (
    echo [OK] 没有待审核队列
)

:: 添加文件
echo.
echo [..] 提交文件...
git add .

:: 提交说明
setlocal enabledelayedexpansion
set msg=更新攻略
set /p input=^> 提交说明（回车默认"更新攻略"）: 
if not "!input!"=="" set msg=!input!
endlocal & set msg=%msg%

git commit -m "%msg%" --allow-empty

:: 推送到 GitHub
echo.
echo [..] 推送到 GitHub...
echo.
echo   如果提示登录，请输入：
echo     用户名: qiuxue111
echo     密码:   （你的 Personal Access Token，不是登录密码）
echo.
echo   没有 Token？去 https://github.com/settings/tokens 生成一个
echo   勾选 repo 权限即可
echo.
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===== 上传成功！=====
    echo 访问地址: https://qiuxue111.github.io/anqutuweiwuxian/
    echo.
) else (
    echo.
    echo ===== 推送失败 =====
    echo.
    echo 可能的原因:
    echo 1. 没有登录 - 需要 Personal Access Token
    echo    去 https://github.com/settings/tokens 生成
    echo    勾选 repo 权限，然后复制 Token
    echo    运行: git remote set-url origin https://qiuxue111:你的TOKEN@github.com/qiuxue111/anqutuweiwuxian.git
    echo    然后再试
    echo.
    echo 2. 网络问题 - 检查能否访问 github.com
    echo.
    echo 3. 分支冲突 - 试试强制推送:
    echo    git push -u origin main --force
    echo.
)

pause
