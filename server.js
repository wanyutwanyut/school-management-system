const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

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
initDataFile(USERS_FILE, [
    { id: '1', username: 'student1', password: '123', role: 'student', clubId: '1' },
    { id: '2', username: 'clubadmin1', password: '123', role: 'club-admin', clubId: '1' },
    { id: '3', username: 'schooladmin', password: '123', role: 'school-admin' }
]);

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

app.get('/student', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'student.html'));
});

app.get('/club-admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'club-admin.html'));
});

app.get('/school-admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'school-admin.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});
