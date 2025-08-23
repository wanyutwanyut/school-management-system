-- 学校社团管理系统数据库建表语句
-- 适用于MySQL 5.7+

-- 创建数据库
CREATE DATABASE IF NOT EXISTS school_club DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE school_club;

-- 1. 用户表
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'student', 'club-admin', 'school-admin') NOT NULL DEFAULT 'student',
    email VARCHAR(100) NULL,
    phone VARCHAR(20) NULL,
    avatar VARCHAR(255) NULL,
    status ENUM('active', 'inactive', 'banned') NOT NULL DEFAULT 'active',
    club_id INT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_role (role),
    INDEX idx_club_id (club_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. 社团表
CREATE TABLE clubs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NULL,
    admin_id INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    max_members INT NULL,
    current_members INT NOT NULL DEFAULT 0,
    logo VARCHAR(255) NULL,
    status ENUM('active', 'inactive', 'pending') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_admin_id (admin_id),
    INDEX idx_category (category),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. 社团成员表
CREATE TABLE club_members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    club_id INT NOT NULL,
    user_id INT NOT NULL,
    role ENUM('admin', 'member') NOT NULL DEFAULT 'member',
    join_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'inactive', 'left') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_club_user (club_id, user_id),
    INDEX idx_club_id (club_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. 工时记录表
CREATE TABLE work_hours (
    id INT PRIMARY KEY AUTO_INCREMENT,
    submitter_id INT NOT NULL,
    club_id INT NOT NULL,
    activity_name VARCHAR(200) NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    hours DECIMAL(5,2) NOT NULL,
    description TEXT NULL,
    activity_date DATE NOT NULL,
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    submit_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    approve_time TIMESTAMP NULL,
    approver_id INT NULL,
    reject_reason TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_submitter_id (submitter_id),
    INDEX idx_club_id (club_id),
    INDEX idx_status (status),
    INDEX idx_activity_date (activity_date),
    INDEX idx_submit_time (submit_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. 活动表
CREATE TABLE activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    club_id INT NOT NULL,
    organizer_id INT NOT NULL,
    description TEXT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    location VARCHAR(200) NULL,
    max_participants INT NULL,
    current_participants INT NOT NULL DEFAULT 0,
    activity_type VARCHAR(50) NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'cancelled') NOT NULL DEFAULT 'pending',
    submit_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    approve_time TIMESTAMP NULL,
    approver_id INT NULL,
    reject_reason TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_club_id (club_id),
    INDEX idx_organizer_id (organizer_id),
    INDEX idx_status (status),
    INDEX idx_start_time (start_time),
    INDEX idx_activity_type (activity_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. 活动参与表
CREATE TABLE activity_participants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    activity_id INT NOT NULL,
    user_id INT NOT NULL,
    status ENUM('registered', 'attended', 'absent') NOT NULL DEFAULT 'registered',
    register_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    attend_time TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_activity_user (activity_id, user_id),
    INDEX idx_activity_id (activity_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. 系统日志表
CREATE TABLE system_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    resource_id INT NULL,
    details TEXT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_resource (resource),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. 通知表
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    type ENUM('system', 'activity', 'approval') NOT NULL DEFAULT 'system',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    related_id INT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 添加外键约束
ALTER TABLE users ADD CONSTRAINT fk_users_club_id FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE SET NULL;
ALTER TABLE clubs ADD CONSTRAINT fk_clubs_admin_id FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE RESTRICT;
ALTER TABLE club_members ADD CONSTRAINT fk_club_members_club_id FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE;
ALTER TABLE club_members ADD CONSTRAINT fk_club_members_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE work_hours ADD CONSTRAINT fk_work_hours_submitter_id FOREIGN KEY (submitter_id) REFERENCES users(id) ON DELETE RESTRICT;
ALTER TABLE work_hours ADD CONSTRAINT fk_work_hours_club_id FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE RESTRICT;
ALTER TABLE work_hours ADD CONSTRAINT fk_work_hours_approver_id FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE activities ADD CONSTRAINT fk_activities_club_id FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE RESTRICT;
ALTER TABLE activities ADD CONSTRAINT fk_activities_organizer_id FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE RESTRICT;
ALTER TABLE activities ADD CONSTRAINT fk_activities_approver_id FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE activity_participants ADD CONSTRAINT fk_activity_participants_activity_id FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE;
ALTER TABLE activity_participants ADD CONSTRAINT fk_activity_participants_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE system_logs ADD CONSTRAINT fk_system_logs_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE notifications ADD CONSTRAINT fk_notifications_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- 插入默认数据
INSERT INTO users (username, password, name, role, status) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '系统管理员', 'admin', 'active'),
('student1', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '张三', 'student', 'active'),
('clubadmin1', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '李四', 'club-admin', 'active'),
('schooladmin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '王五', 'school-admin', 'active');

INSERT INTO clubs (name, description, admin_id, category, max_members, current_members, status) VALUES 
('计算机协会', '专注于计算机技术交流', 3, '科技', 50, 0, 'active'),
('文学社', '文学爱好者的聚集地', 3, '文艺', 30, 0, 'active');

-- 更新用户表中的club_id
UPDATE users SET club_id = 1 WHERE username IN ('student1', 'clubadmin1');
