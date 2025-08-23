# 数据库表设计文档

## 概述
本文档描述了学校社团管理系统的完整数据库表结构设计，支持JSON文件存储（开发测试）和MySQL数据库（生产环境）。

## 数据库表结构

### 1. 用户表 (users)
存储系统用户信息

| 字段名 | 类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|------|------|----------|--------|------|
| id | INT | - | NOT NULL | AUTO_INCREMENT | 主键ID |
| username | VARCHAR | 50 | NOT NULL | - | 用户名，唯一 |
| password | VARCHAR | 255 | NOT NULL | - | 密码（加密存储） |
| name | VARCHAR | 100 | NOT NULL | - | 真实姓名 |
| role | ENUM | - | NOT NULL | 'student' | 用户角色：admin, student, club-admin, school-admin |
| email | VARCHAR | 100 | NULL | - | 邮箱地址 |
| phone | VARCHAR | 20 | NULL | - | 手机号码 |
| avatar | VARCHAR | 255 | NULL | - | 头像URL |
| status | ENUM | - | NOT NULL | 'active' | 状态：active, inactive, banned |
| club_id | INT | - | NULL | - | 所属社团ID（外键） |
| created_at | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**索引：**
- PRIMARY KEY (id)
- UNIQUE KEY (username)
- INDEX (role)
- INDEX (club_id)
- INDEX (status)

### 2. 社团表 (clubs)
存储社团基本信息

| 字段名 | 类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|------|------|----------|--------|------|
| id | INT | - | NOT NULL | AUTO_INCREMENT | 主键ID |
| name | VARCHAR | 100 | NOT NULL | - | 社团名称 |
| description | TEXT | - | NULL | - | 社团描述 |
| admin_id | INT | - | NOT NULL | - | 社团管理员ID（外键） |
| category | VARCHAR | 50 | NOT NULL | - | 社团类别：学术、文艺、体育、科技等 |
| max_members | INT | - | NULL | - | 最大成员数 |
| current_members | INT | - | NOT NULL | 0 | 当前成员数 |
| logo | VARCHAR | 255 | NULL | - | 社团Logo URL |
| status | ENUM | - | NOT NULL | 'active' | 状态：active, inactive, pending |
| created_at | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**索引：**
- PRIMARY KEY (id)
- UNIQUE KEY (name)
- INDEX (admin_id)
- INDEX (category)
- INDEX (status)

### 3. 社团成员表 (club_members)
存储社团成员关系

| 字段名 | 类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|------|------|----------|--------|------|
| id | INT | - | NOT NULL | AUTO_INCREMENT | 主键ID |
| club_id | INT | - | NOT NULL | - | 社团ID（外键） |
| user_id | INT | - | NOT NULL | - | 用户ID（外键） |
| role | ENUM | - | NOT NULL | 'member' | 在社团中的角色：admin, member |
| join_date | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 加入时间 |
| status | ENUM | - | NOT NULL | 'active' | 状态：active, inactive, left |
| created_at | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |

**索引：**
- PRIMARY KEY (id)
- UNIQUE KEY (club_id, user_id)
- INDEX (club_id)
- INDEX (user_id)
- INDEX (status)

### 4. 工时记录表 (work_hours)
存储学生工时认定记录

| 字段名 | 类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|------|------|----------|--------|------|
| id | INT | - | NOT NULL | AUTO_INCREMENT | 主键ID |
| submitter_id | INT | - | NOT NULL | - | 提交者ID（外键） |
| club_id | INT | - | NOT NULL | - | 社团ID（外键） |
| activity_name | VARCHAR | 200 | NOT NULL | - | 活动名称 |
| activity_type | VARCHAR | 50 | NOT NULL | - | 活动类型：志愿服务、社团活动等 |
| hours | DECIMAL | 5,2 | NOT NULL | - | 工时数 |
| description | TEXT | - | NULL | - | 活动描述 |
| activity_date | DATE | - | NOT NULL | - | 活动日期 |
| status | ENUM | - | NOT NULL | 'pending' | 状态：pending, approved, rejected |
| submit_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 提交时间 |
| approve_time | TIMESTAMP | - | NULL | - | 审批时间 |
| approver_id | INT | - | NULL | - | 审批人ID（外键） |
| reject_reason | TEXT | - | NULL | - | 拒绝原因 |
| created_at | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**索引：**
- PRIMARY KEY (id)
- INDEX (submitter_id)
- INDEX (club_id)
- INDEX (status)
- INDEX (activity_date)
- INDEX (submit_time)

### 5. 活动表 (activities)
存储社团活动信息

| 字段名 | 类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|------|------|----------|--------|------|
| id | INT | - | NOT NULL | AUTO_INCREMENT | 主键ID |
| name | VARCHAR | 200 | NOT NULL | - | 活动名称 |
| club_id | INT | - | NOT NULL | - | 社团ID（外键） |
| organizer_id | INT | - | NOT NULL | - | 组织者ID（外键） |
| description | TEXT | - | NULL | - | 活动描述 |
| start_time | DATETIME | - | NOT NULL | - | 开始时间 |
| end_time | DATETIME | - | NOT NULL | - | 结束时间 |
| location | VARCHAR | 200 | NULL | - | 活动地点 |
| max_participants | INT | - | NULL | - | 最大参与人数 |
| current_participants | INT | - | NOT NULL | 0 | 当前参与人数 |
| activity_type | VARCHAR | 50 | NOT NULL | - | 活动类型：会议、培训、比赛等 |
| status | ENUM | - | NOT NULL | 'pending' | 状态：pending, approved, rejected, cancelled |
| submit_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 提交时间 |
| approve_time | TIMESTAMP | - | NULL | - | 审批时间 |
| approver_id | INT | - | NULL | - | 审批人ID（外键） |
| reject_reason | TEXT | - | NULL | - | 拒绝原因 |
| created_at | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**索引：**
- PRIMARY KEY (id)
- INDEX (club_id)
- INDEX (organizer_id)
- INDEX (status)
- INDEX (start_time)
- INDEX (activity_type)

### 6. 活动参与表 (activity_participants)
存储活动参与记录

| 字段名 | 类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|------|------|----------|--------|------|
| id | INT | - | NOT NULL | AUTO_INCREMENT | 主键ID |
| activity_id | INT | - | NOT NULL | - | 活动ID（外键） |
| user_id | INT | - | NOT NULL | - | 用户ID（外键） |
| status | ENUM | - | NOT NULL | 'registered' | 状态：registered, attended, absent |
| register_time | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 报名时间 |
| attend_time | TIMESTAMP | - | NULL | - | 签到时间 |
| created_at | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |

**索引：**
- PRIMARY KEY (id)
- UNIQUE KEY (activity_id, user_id)
- INDEX (activity_id)
- INDEX (user_id)
- INDEX (status)

### 7. 系统日志表 (system_logs)
存储系统操作日志

| 字段名 | 类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|------|------|----------|--------|------|
| id | INT | - | NOT NULL | AUTO_INCREMENT | 主键ID |
| user_id | INT | - | NULL | - | 操作用户ID（外键） |
| action | VARCHAR | 100 | NOT NULL | - | 操作类型 |
| resource | VARCHAR | 100 | NOT NULL | - | 操作资源 |
| resource_id | INT | - | NULL | - | 资源ID |
| details | TEXT | - | NULL | - | 操作详情 |
| ip_address | VARCHAR | 45 | NULL | - | IP地址 |
| user_agent | TEXT | - | NULL | - | 用户代理 |
| created_at | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |

**索引：**
- PRIMARY KEY (id)
- INDEX (user_id)
- INDEX (action)
- INDEX (resource)
- INDEX (created_at)

### 8. 通知表 (notifications)
存储系统通知

| 字段名 | 类型 | 长度 | 是否为空 | 默认值 | 说明 |
|--------|------|------|----------|--------|------|
| id | INT | - | NOT NULL | AUTO_INCREMENT | 主键ID |
| user_id | INT | - | NOT NULL | - | 接收用户ID（外键） |
| title | VARCHAR | 200 | NOT NULL | - | 通知标题 |
| content | TEXT | - | NOT NULL | - | 通知内容 |
| type | ENUM | - | NOT NULL | 'system' | 通知类型：system, activity, approval |
| is_read | BOOLEAN | - | NOT NULL | FALSE | 是否已读 |
| related_id | INT | - | NULL | - | 相关记录ID |
| created_at | TIMESTAMP | - | NOT NULL | CURRENT_TIMESTAMP | 创建时间 |

**索引：**
- PRIMARY KEY (id)
- INDEX (user_id)
- INDEX (type)
- INDEX (is_read)
- INDEX (created_at)

## 外键关系

1. **users.club_id** → **clubs.id**
2. **clubs.admin_id** → **users.id**
3. **club_members.club_id** → **clubs.id**
4. **club_members.user_id** → **users.id**
5. **work_hours.submitter_id** → **users.id**
6. **work_hours.club_id** → **clubs.id**
7. **work_hours.approver_id** → **users.id**
8. **activities.club_id** → **clubs.id**
9. **activities.organizer_id** → **users.id**
10. **activities.approver_id** → **users.id**
11. **activity_participants.activity_id** → **activities.id**
12. **activity_participants.user_id** → **users.id**
13. **system_logs.user_id** → **users.id**
14. **notifications.user_id** → **users.id**

## JSON文件结构

当前开发阶段使用JSON文件模拟数据库，文件结构如下：

```
data/
├── users.json          # 用户数据
├── clubs.json          # 社团数据
├── club_members.json   # 社团成员关系
├── work_hours.json     # 工时记录
├── activities.json     # 活动数据
├── activity_participants.json  # 活动参与记录
├── system_logs.json    # 系统日志
└── notifications.json  # 通知数据
```

## 数据迁移策略

后期从JSON迁移到MySQL时，可以：
1. 保持JSON文件结构作为数据备份
2. 编写数据迁移脚本
3. 逐步迁移各表数据
4. 验证数据完整性
5. 切换数据库连接配置
