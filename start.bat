@echo off
echo ========================================
echo    学校社团管理系统 - 快速启动
echo ========================================
echo.

echo 正在检查Node.js环境...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js环境检查通过
echo.

echo 正在安装依赖包...
npm install
if %errorlevel% neq 0 (
    echo 错误: 依赖安装失败
    pause
    exit /b 1
)

echo 依赖安装完成
echo.

echo 正在启动服务器...
echo 服务器将在 http://localhost:3000 启动
echo 按 Ctrl+C 停止服务器
echo.

node server.js

pause
