# 学校管理系统

一个基于 Node.js 和 Express 的学校管理系统，提供学生管理、社团管理、工时认定和活动申报等功能。

## 功能特性

### 🎓 用户管理
- **多角色支持**: 学生、社团管理员、学校管理员
- **用户认证**: 安全的登录系统
- **权限控制**: 基于角色的访问控制

### 🏫 社团管理
- 社团信息管理
- 社团成员管理
- 社团活动申报

### ⏰ 工时认定
- 学生工时提交
- 管理员工时审核
- 工时统计查询

### 📋 活动申报
- 活动信息提交
- 活动审批流程
- 活动状态跟踪

## 技术栈

- **后端**: Node.js + Express
- **前端**: HTML + CSS + JavaScript
- **数据存储**: JSON 文件
- **认证**: JWT (JSON Web Token)
- **加密**: bcrypt

## 安装和运行

### 环境要求
- Node.js (版本 14.0 或更高)
- npm 或 yarn

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <项目地址>
   cd school-management-system
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动服务器**
   ```bash
   node server.js
   ```

4. **访问系统**
   打开浏览器访问: `http://localhost:3000`

## 默认用户账号

系统预置了以下测试账号：

| 角色 | 用户名 | 密码 | 说明 |
|------|--------|------|------|
| 学生 | student1 | 123 | 计算机协会成员 |
| 社团管理员 | clubadmin1 | 123 | 计算机协会管理员 |
| 学校管理员 | schooladmin | 123 | 系统管理员 |

## 系统页面

### 主要页面
- **主页** (`/`): 系统登录页面
- **学生页面** (`/student`): 学生功能界面
- **社团管理员页面** (`/club-admin`): 社团管理功能
- **学校管理员页面** (`/school-admin`): 学校管理功能

### 功能模块

#### 学生功能
- 查看个人信息
- 提交工时认定
- 参与社团活动
- 查看活动历史

#### 社团管理员功能
- 管理社团信息
- 审核学生工时
- 申报社团活动
- 查看社团统计

#### 学校管理员功能
- 用户管理
- 社团管理
- 活动审批
- 系统监控

## API 接口

### 认证接口
- `POST /api/login` - 用户登录

### 用户管理
- `GET /api/users/:id` - 获取用户信息

### 社团管理
- `GET /api/clubs` - 获取社团列表
- `POST /api/clubs` - 创建社团
- `PUT /api/clubs/:id` - 更新社团信息

### 工时管理
- `GET /api/work-hours` - 获取工时记录
- `POST /api/work-hours` - 提交工时认定
- `PUT /api/work-hours/:id/approve` - 审核工时

### 活动管理
- `GET /api/activities` - 获取活动列表
- `POST /api/activities` - 申报活动
- `PUT /api/activities/:id/approve` - 审批活动

## 项目结构

```
school-management-system/
├── data/                   # 数据文件
│   ├── users.json         # 用户数据
│   ├── clubs.json         # 社团数据
│   ├── workHours.json     # 工时数据
│   └── activities.json    # 活动数据
├── public/                # 前端文件
│   ├── index.html         # 主页
│   ├── student.html       # 学生页面
│   ├── club-admin.html    # 社团管理员页面
│   ├── school-admin.html  # 学校管理员页面
│   └── js/
│       └── common.js      # 公共JavaScript
├── server.js              # 服务器主文件
├── package.json           # 项目配置
└── README.md              # 项目说明
```

## 开发说明

### 数据存储
系统使用 JSON 文件作为数据存储，数据文件位于 `data/` 目录下：
- `users.json`: 存储用户信息
- `clubs.json`: 存储社团信息
- `workHours.json`: 存储工时记录
- `activities.json`: 存储活动信息

### 添加新功能
1. 在 `server.js` 中添加新的 API 路由
2. 在对应的前端页面中添加界面元素
3. 更新数据文件结构（如需要）

## 注意事项

- 系统使用 JSON 文件存储数据，适合小型项目使用
- 生产环境建议使用数据库存储
- 密码目前使用明文存储，生产环境应使用加密存储
- 建议定期备份数据文件

## 许可证

本项目采用 MIT 许可证。

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 GitHub Issue
- 发送邮件至项目维护者

---

**注意**: 这是一个演示项目，生产环境使用前请进行适当的安全加固和功能完善。
