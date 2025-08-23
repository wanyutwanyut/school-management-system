#!/usr/bin/env node

/**
 * JSON到MySQL数据迁移工具
 * 使用方法: node tools/migrate-to-mysql.js
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const config = require('../config/index');

// 数据文件路径
const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const CLUBS_FILE = path.join(DATA_DIR, 'clubs.json');
const WORKS_FILE = path.join(DATA_DIR, 'workHours.json');
const ACTIVITIES_FILE = path.join(DATA_DIR, 'activities.json');

// 读取JSON数据
function readJsonFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  文件不存在: ${filePath}`);
        return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

// 创建MySQL连接
async function createConnection() {
    return mysql.createConnection({
        host: config.database.mysql.host,
        port: config.database.mysql.port,
        user: config.database.mysql.user,
        password: config.database.mysql.password,
        database: config.database.mysql.database,
        charset: 'utf8mb4'
    });
}

// 迁移用户数据
async function migrateUsers(connection) {
    console.log('📦 开始迁移用户数据...');
    const users = readJsonFile(USERS_FILE);
    
    for (const user of users) {
        // 加密密码
        let hashedPassword = user.password;
        if (user.password && user.password.length < 60) {
            // 如果是明文密码，进行加密
            hashedPassword = await bcrypt.hash(user.password, 10);
        }
        
        const [result] = await connection.execute(
            `INSERT INTO users (id, username, password, name, role, status, club_id, created_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                user.id,
                user.username,
                hashedPassword,
                user.name || user.username,
                user.role,
                'active',
                user.clubId || null,
                user.createdAt || new Date()
            ]
        );
        console.log(`✅ 用户 ${user.username} 迁移成功`);
    }
    console.log(`🎉 用户数据迁移完成，共 ${users.length} 条记录`);
}

// 迁移社团数据
async function migrateClubs(connection) {
    console.log('📦 开始迁移社团数据...');
    const clubs = readJsonFile(CLUBS_FILE);
    
    for (const club of clubs) {
        const [result] = await connection.execute(
            `INSERT INTO clubs (id, name, description, admin_id, category, max_members, current_members, status, created_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                club.id,
                club.name,
                club.description || '',
                club.adminId || null,
                '其他', // 默认类别
                club.maxMembers || null,
                club.currentMembers || 0,
                'active',
                club.createdAt || new Date()
            ]
        );
        console.log(`✅ 社团 ${club.name} 迁移成功`);
    }
    console.log(`🎉 社团数据迁移完成，共 ${clubs.length} 条记录`);
}

// 迁移工时数据
async function migrateWorkHours(connection) {
    console.log('📦 开始迁移工时数据...');
    const works = readJsonFile(WORKS_FILE);
    
    for (const work of works) {
        const [result] = await connection.execute(
            `INSERT INTO work_hours (id, submitter_id, club_id, activity_name, activity_type, hours, description, activity_date, status, submit_time, approve_time, approver_id, reject_reason, created_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                work.id,
                work.submitterId,
                work.clubId,
                work.activityName,
                work.activityType || '其他',
                work.hours,
                work.description || '',
                work.activityDate || new Date(),
                work.status,
                work.submitTime,
                work.approveTime || null,
                work.approverId || null,
                work.rejectReason || null,
                work.createdAt || new Date()
            ]
        );
        console.log(`✅ 工时记录 ${work.id} 迁移成功`);
    }
    console.log(`🎉 工时数据迁移完成，共 ${works.length} 条记录`);
}

// 迁移活动数据
async function migrateActivities(connection) {
    console.log('📦 开始迁移活动数据...');
    const activities = readJsonFile(ACTIVITIES_FILE);
    
    for (const activity of activities) {
        const [result] = await connection.execute(
            `INSERT INTO activities (id, name, club_id, organizer_id, description, start_time, end_time, location, max_participants, current_participants, activity_type, status, submit_time, approve_time, approver_id, reject_reason, created_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                activity.id,
                activity.name,
                activity.clubId,
                activity.organizerId,
                activity.description || '',
                activity.startTime || new Date(),
                activity.endTime || new Date(),
                activity.location || '',
                activity.maxParticipants || null,
                activity.currentParticipants || 0,
                activity.activityType || '其他',
                activity.status,
                activity.submitTime,
                activity.approveTime || null,
                activity.approverId || null,
                activity.rejectReason || null,
                activity.createdAt || new Date()
            ]
        );
        console.log(`✅ 活动 ${activity.name} 迁移成功`);
    }
    console.log(`🎉 活动数据迁移完成，共 ${activities.length} 条记录`);
}

// 主迁移函数
async function migrateData() {
    console.log('🚀 开始数据迁移...');
    console.log(`📁 数据源: ${DATA_DIR}`);
    console.log(`🗄️  目标数据库: ${config.database.mysql.database}`);
    
    let connection;
    try {
        // 创建数据库连接
        connection = await createConnection();
        console.log('✅ 数据库连接成功');
        
        // 清空现有数据（可选）
        console.log('🧹 清空现有数据...');
        await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
        await connection.execute('TRUNCATE TABLE activity_participants');
        await connection.execute('TRUNCATE TABLE work_hours');
        await connection.execute('TRUNCATE TABLE activities');
        await connection.execute('TRUNCATE TABLE club_members');
        await connection.execute('TRUNCATE TABLE clubs');
        await connection.execute('TRUNCATE TABLE users');
        await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
        console.log('✅ 数据清空完成');
        
        // 按顺序迁移数据（考虑外键约束）
        await migrateUsers(connection);
        await migrateClubs(connection);
        await migrateWorkHours(connection);
        await migrateActivities(connection);
        
        console.log('🎉 所有数据迁移完成！');
        
    } catch (error) {
        console.error('❌ 迁移失败:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 数据库连接已关闭');
        }
    }
}

// 运行迁移
if (require.main === module) {
    migrateData().catch(console.error);
}

module.exports = { migrateData };
