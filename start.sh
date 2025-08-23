#!/bin/bash

echo "========================================"
echo "   学校社团管理系统 - 快速启动"
echo "========================================"
echo

# 检查Node.js环境
echo "正在检查Node.js环境..."
if ! command -v node &> /dev/null; then
    echo "错误: 未找到Node.js，请先安装Node.js"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi

echo "Node.js环境检查通过"
echo

# 安装依赖
echo "正在安装依赖包..."
if ! npm install; then
    echo "错误: 依赖安装失败"
    exit 1
fi

echo "依赖安装完成"
echo

# 启动服务器
echo "正在启动服务器..."
echo "服务器将在 http://localhost:3000 启动"
echo "按 Ctrl+C 停止服务器"
echo

node server.js
