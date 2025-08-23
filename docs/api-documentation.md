# API 接口文档

## 概述

本文档描述了学校社团管理系统的所有API接口，包括认证、用户管理、社团管理、工时管理和活动管理等模块。

## 基础信息

- **基础URL**: `http://localhost:3000`
- **API前缀**: `/api`
- **认证方式**: JWT Token
- **数据格式**: JSON

## 通用响应格式

### 成功响应
```json
{
  "success": true,
  "data": {},
  "message": "操作成功"
}
```

### 错误响应
```json
{
  "success": false,
  "message": "错误信息"
}
```

## 认证相关接口

### 1. 用户登录

**接口地址**: `POST /api/auth/login`

**请求参数**:
```json
{
  "username": "student1",
  "password": "123"
}
```

**响应示例**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "2",
    "username": "student1",
    "name": "张三",
    "role": "student",
    "clubId": "1"
  }
}
```

### 2. Token验证

**接口地址**: `GET /api/test`

**请求头**:
```
Authorization: Bearer <token>
```

**响应示例**:
```json
{
  "success": true,
  "message": "Token验证成功",
  "user": {
    "id": "2",
    "username": "student1",
    "role": "student"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 用户管理接口

### 1. 获取用户信息

**接口地址**: `GET /api/users/:id`

**响应示例**:
```json
{
  "id": "2",
  "username": "student1",
  "role": "student",
  "clubId": "1"
}
```

## 社团管理接口

### 1. 获取社团列表

**接口地址**: `GET /api/clubs`

**响应示例**:
```json
[
  {
    "id": "1",
    "name": "计算机协会",
    "description": "专注于计算机技术交流",
    "adminId": "2"
  }
]
```

### 2. 获取社团详情

**接口地址**: `GET /api/clubs/:id`

**响应示例**:
```json
{
  "id": "1",
  "name": "计算机协会",
  "description": "专注于计算机技术交流",
  "adminId": "2"
}
```

## 工时管理接口

### 1. 获取工时记录

**接口地址**: `GET /api/work-hours`

**查询参数**:
- `userId`: 用户ID
- `role`: 用户角色
- `clubId`: 社团ID

**响应示例**:
```json
[
  {
    "id": "uuid-1",
    "submitterId": "2",
    "clubId": "1",
    "activityName": "志愿服务",
    "activityType": "志愿服务",
    "hours": 2.5,
    "description": "社区服务活动",
    "status": "pending",
    "submitTime": "2024-01-01T00:00:00.000Z"
  }
]
```

### 2. 提交工时申请

**接口地址**: `POST /api/work-hours`

**请求参数**:
```json
{
  "submitterId": "2",
  "clubId": "1",
  "activityName": "志愿服务",
  "activityType": "志愿服务",
  "hours": 2.5,
  "description": "社区服务活动"
}
```

**响应示例**:
```json
{
  "id": "uuid-1",
  "submitterId": "2",
  "clubId": "1",
  "activityName": "志愿服务",
  "activityType": "志愿服务",
  "hours": 2.5,
  "description": "社区服务活动",
  "status": "pending",
  "submitTime": "2024-01-01T00:00:00.000Z"
}
```

### 3. 审核工时申请

**接口地址**: `PUT /api/work-hours/:id/approve`

**请求参数**:
```json
{
  "status": "approved",
  "approverId": "3"
}
```

**响应示例**:
```json
{
  "id": "uuid-1",
  "status": "approved",
  "approveTime": "2024-01-01T00:00:00.000Z",
  "approverId": "3"
}
```

## 活动管理接口

### 1. 获取活动列表

**接口地址**: `GET /api/activities`

**查询参数**:
- `clubId`: 社团ID
- `role`: 用户角色

**响应示例**:
```json
[
  {
    "id": "uuid-1",
    "name": "技术分享会",
    "clubId": "1",
    "organizerId": "3",
    "description": "分享最新技术动态",
    "startTime": "2024-01-01T10:00:00.000Z",
    "endTime": "2024-01-01T12:00:00.000Z",
    "location": "教学楼A101",
    "status": "pending",
    "submitTime": "2024-01-01T00:00:00.000Z"
  }
]
```

### 2. 申报活动

**接口地址**: `POST /api/activities`

**请求参数**:
```json
{
  "name": "技术分享会",
  "clubId": "1",
  "organizerId": "3",
  "description": "分享最新技术动态",
  "startTime": "2024-01-01T10:00:00.000Z",
  "endTime": "2024-01-01T12:00:00.000Z",
  "location": "教学楼A101"
}
```

**响应示例**:
```json
{
  "id": "uuid-1",
  "name": "技术分享会",
  "clubId": "1",
  "organizerId": "3",
  "description": "分享最新技术动态",
  "startTime": "2024-01-01T10:00:00.000Z",
  "endTime": "2024-01-01T12:00:00.000Z",
  "location": "教学楼A101",
  "status": "pending",
  "submitTime": "2024-01-01T00:00:00.000Z"
}
```

### 3. 审批活动

**接口地址**: `PUT /api/activities/:id/approve`

**请求参数**:
```json
{
  "status": "approved",
  "approverId": "4"
}
```

**响应示例**:
```json
{
  "id": "uuid-1",
  "status": "approved",
  "approveTime": "2024-01-01T00:00:00.000Z",
  "approverId": "4"
}
```

## 统计接口

### 1. 用户统计

**接口地址**: `GET /api/stats/user`

**请求头**:
```
Authorization: Bearer <token>
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "totalUsers": 4,
    "students": 1,
    "clubAdmins": 1,
    "schoolAdmins": 1,
    "admins": 1
  }
}
```

### 2. 工时统计

**接口地址**: `GET /api/stats/workhours`

**请求头**:
```
Authorization: Bearer <token>
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "total": 5,
    "pending": 2,
    "approved": 3,
    "rejected": 0,
    "totalHours": 12.5
  }
}
```

### 3. 活动统计

**接口地址**: `GET /api/stats/activities`

**请求头**:
```
Authorization: Bearer <token>
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "total": 3,
    "pending": 1,
    "approved": 2,
    "rejected": 0,
    "cancelled": 0
  }
}
```

### 4. 最近活动

**接口地址**: `GET /api/recent-activities`

**请求头**:
```
Authorization: Bearer <token>
```

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "name": "技术分享会",
      "clubId": "1",
      "status": "approved",
      "submitTime": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## 兼容接口

### 1. 旧版登录接口

**接口地址**: `POST /api/login`

**请求参数**:
```json
{
  "username": "student1",
  "password": "123"
}
```

**响应示例**:
```json
{
  "success": true,
  "user": {
    "id": "2",
    "username": "student1",
    "role": "student",
    "clubId": "1"
  }
}
```

## 错误码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权，需要登录 |
| 403 | 禁止访问，权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 使用示例

### JavaScript (fetch)

```javascript
// 登录
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'student1',
    password: '123'
  })
});

const loginData = await loginResponse.json();
const token = loginData.token;

// 获取用户统计
const statsResponse = await fetch('/api/stats/user', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const statsData = await statsResponse.json();
```

### cURL

```bash
# 登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"student1","password":"123"}'

# 获取统计信息
curl -X GET http://localhost:3000/api/stats/user \
  -H "Authorization: Bearer <token>"
```

## 注意事项

1. **认证**: 除登录接口外，其他接口都需要在请求头中携带JWT Token
2. **权限**: 不同角色的用户只能访问对应的数据
3. **数据格式**: 所有请求和响应都使用JSON格式
4. **错误处理**: 请根据响应状态码和错误信息进行相应的错误处理
5. **Token过期**: Token有效期为24小时，过期后需要重新登录
