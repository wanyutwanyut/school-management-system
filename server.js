const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('./config/index');

const app = express();
const PORT = process.env.PORT || config.port;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// 数据存储路径
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const WORKS_FILE = path.join(DATA_DIR, 'workHours.json');
const ACTIVITIES_FILE = path.join(DATA_DIR, 'activities.json');
const CLUBS_FILE = path.join(DATA_DIR, 'clubs.json');

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 初始化数据文件
function initDataFile(filePath, initialData) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
    }
}

// 初始化默认数据
const defaultUsers = config.defaultUsers.map((user, index) => ({
    id: (index + 1).toString(),
    ...user
}));

initDataFile(USERS_FILE, defaultUsers);

initDataFile(CLUBS_FILE, [
    { id: '1', name: '计算机协会', description: '专注于计算机技术交流', adminId: '2' },
    { id: '2', name: '文学社', description: '文学爱好者的聚集地', adminId: '' }
]);

initDataFile(WORKS_FILE, []);
initDataFile(ACTIVITIES_FILE, []);

// 读取数据
function readData(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

// 写入数据
function writeData(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// 登录接口
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // 使用JSON文件存储
        const users = readData(USERS_FILE);
        const user = users.find(u => u.username === username);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: '用户名或密码错误'
            });
        }
        
        // 验证密码（支持明文和加密密码）
        let isPasswordValid = false;
        if (user.password === password) {
            // 明文密码（开发阶段）
            isPasswordValid = true;
        } else {
            // 加密密码验证
            try {
                isPasswordValid = await bcrypt.compare(password, user.password);
            } catch (error) {
                console.error('密码验证错误:', error);
            }
        }
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: '用户名或密码错误'
            });
        }
        
        // 生成JWT token
        const token = jwt.sign(
            { 
                id: user.id, 
                username: user.username,
                role: user.role 
            },
            config.jwt.secret,
            { expiresIn: config.jwt.expiresIn }
        );
        
        res.json({ 
            success: true, 
            token: token,
            user: {
                id: user.id,
                username: user.username,
                name: user.name || user.username,
                role: user.role,
                clubId: user.clubId
            }
        });
    } catch (error) {
        console.error('登录错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误，请稍后再试'
        });
    }
});

// 兼容旧登录接口
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const users = readData(USERS_FILE);
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        res.json({ 
            success: true, 
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                clubId: user.clubId
            }
        });
    } else {
        res.json({ success: false, message: '用户名或密码错误' });
    }
});

// JWT验证中间件
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: '请先登录'
        });
    }
    
    jwt.verify(token, config.jwt.secret, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: '登录已过期，请重新登录'
            });
        }
        req.user = user;
        next();
    });
}

// 测试接口，用于验证token
app.get('/api/test', authenticateToken, (req, res) => {
    res.json({
        success: true,
        message: 'Token验证成功',
        user: req.user,
        timestamp: new Date().toISOString()
    });
});

// 获取用户信息
app.get('/api/users/:id', (req, res) => {
    const users = readData(USERS_FILE);
    const user = users.find(u => u.id === req.params.id);
    
    if (user) {
        res.json({
            id: user.id,
            username: user.username,
            role: user.role,
            clubId: user.clubId
        });
    } else {
        res.status(404).json({ message: '用户不存在' });
    }
});

// 获取社团信息
app.get('/api/clubs', (req, res) => {
    const clubs = readData(CLUBS_FILE);
    res.json(clubs);
});

app.get('/api/clubs/:id', (req, res) => {
    const clubs = readData(CLUBS_FILE);
    const club = clubs.find(c => c.id === req.params.id);
    
    if (club) {
        res.json(club);
    } else {
        res.status(404).json({ message: '社团不存在' });
    }
});

// 工时认定相关接口
app.get('/api/work-hours', (req, res) => {
    const { userId, role, clubId } = req.query;
    let works = readData(WORKS_FILE);
    
    // 根据角色筛选数据
    if (role === 'student') {
        works = works.filter(w => w.submitterId === userId);
    } else if (role === 'club-admin') {
        works = works.filter(w => w.clubId === clubId);
    }
    
    res.json(works);
});

app.post('/api/work-hours', (req, res) => {
    const works = readData(WORKS_FILE);
    const newWork = {
        id: uuidv4(),
        ...req.body,
        status: 'pending',
        submitTime: new Date().toISOString()
    };
    
    works.push(newWork);
    writeData(WORKS_FILE, works);
    res.json(newWork);
});

app.put('/api/work-hours/:id/approve', (req, res) => {
    const works = readData(WORKS_FILE);
    const { status, approverId } = req.body;
    const workIndex = works.findIndex(w => w.id === req.params.id);
    
    if (workIndex !== -1) {
        works[workIndex] = {
            ...works[workIndex],
            status,
            approveTime: new Date().toISOString(),
            approverId
        };
        
        writeData(WORKS_FILE, works);
        res.json(works[workIndex]);
    } else {
        res.status(404).json({ message: '工时认定记录不存在' });
    }
});

// 活动申报相关接口
app.get('/api/activities', (req, res) => {
    const { clubId, role } = req.query;
    let activities = readData(ACTIVITIES_FILE);
    
    // 根据角色筛选数据
    if (role === 'club-admin' && clubId) {
        activities = activities.filter(a => a.clubId === clubId);
    }
    
    res.json(activities);
});

app.post('/api/activities', (req, res) => {
    const activities = readData(ACTIVITIES_FILE);
    const newActivity = {
        id: uuidv4(),
        ...req.body,
        status: 'pending',
        submitTime: new Date().toISOString()
    };
    
    activities.push(newActivity);
    writeData(ACTIVITIES_FILE, activities);
    res.json(newActivity);
});

app.put('/api/activities/:id/approve', (req, res) => {
    const activities = readData(ACTIVITIES_FILE);
    const { status, approverId } = req.body;
    const activityIndex = activities.findIndex(a => a.id === req.params.id);
    
    if (activityIndex !== -1) {
        activities[activityIndex] = {
            ...activities[activityIndex],
            status,
            approveTime: new Date().toISOString(),
            approverId
        };
        
        writeData(ACTIVITIES_FILE, activities);
        res.json(activities[activityIndex]);
    } else {
        res.status(404).json({ message: '活动申报记录不存在' });
    }
});

// 前端页面路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// 兼容旧路由，重定向到dashboard
app.get('/student', (req, res) => {
    res.redirect('/dashboard');
});

app.get('/club-admin', (req, res) => {
    res.redirect('/dashboard');
});

app.get('/school-admin', (req, res) => {
    res.redirect('/dashboard');
});

// 新增API接口

// 获取用户统计信息
app.get('/api/stats/user', authenticateToken, async (req, res) => {
    try {
        const users = readData(USERS_FILE);
        const stats = {
            totalUsers: users.length,
            students: users.filter(u => u.role === 'student').length,
            clubAdmins: users.filter(u => u.role === 'club-admin').length,
            schoolAdmins: users.filter(u => u.role === 'school-admin').length,
            admins: users.filter(u => u.role === 'admin').length
        };
        
        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: '获取统计信息失败' });
    }
});

// 获取工时统计信息
app.get('/api/stats/workhours', authenticateToken, async (req, res) => {
    try {
        const works = readData(WORKS_FILE);
        const stats = {
            total: works.length,
            pending: works.filter(w => w.status === 'pending').length,
            approved: works.filter(w => w.status === 'approved').length,
            rejected: works.filter(w => w.status === 'rejected').length,
            totalHours: works
                .filter(w => w.status === 'approved')
                .reduce((sum, w) => sum + (parseFloat(w.hours) || 0), 0)
        };
        
        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: '获取统计信息失败' });
    }
});

// 获取活动统计信息
app.get('/api/stats/activities', authenticateToken, async (req, res) => {
    try {
        const activities = readData(ACTIVITIES_FILE);
        const stats = {
            total: activities.length,
            pending: activities.filter(a => a.status === 'pending').length,
            approved: activities.filter(a => a.status === 'approved').length,
            rejected: activities.filter(a => a.status === 'rejected').length,
            cancelled: activities.filter(a => a.status === 'cancelled').length
        };
        
        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: '获取统计信息失败' });
    }
});

// 获取最近活动
app.get('/api/recent-activities', authenticateToken, async (req, res) => {
    try {
        const allActivities = readData(ACTIVITIES_FILE);
        const activities = allActivities
            .sort((a, b) => new Date(b.submitTime) - new Date(a.submitTime))
            .slice(0, 5);
        
        res.json({ success: true, data: activities });
    } catch (error) {
        res.status(500).json({ success: false, message: '获取最近活动失败' });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
    console.log(`📡 API基础地址：http://localhost:${PORT}/api`);
    console.log(`💾 数据存储方式：JSON文件 (${config.database.jsonPath})`);
    console.log(`🔐 JWT密钥：${config.jwt.secret.substring(0, 10)}...`);
    console.log(`⏰ Token有效期：${config.jwt.expiresIn}`);
});
