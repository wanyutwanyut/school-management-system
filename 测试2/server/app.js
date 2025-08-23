const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const config = require('./config/index');
const User = require('./models/User');

const app = express();

// 中间件
app.use(cors({
  origin: 'http://127.0.0.1:5500', // 允许前端Live Server访问
  credentials: true
}));
app.use(express.json());

// 连接MongoDB
mongoose.connect(config.mongoUri)
  .then(() => {
    console.log('已成功连接到MongoDB');
    // 创建默认管理员用户（首次启动时）
    createDefaultAdmin();
  })
  .catch(err => {
    console.error('MongoDB连接失败:', err.message);
  });

// 创建默认管理员
async function createDefaultAdmin() {
  try {
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      const admin = new User({
        username: 'admin',
        password: '123456', // 默认密码
        name: '系统管理员',
        role: 'admin'
      });
      await admin.save();
      console.log('默认管理员创建成功: 用户名(admin), 密码(123456)');
    }
  } catch (error) {
    console.error('创建默认管理员失败:', error.message);
  }
}

// 登录接口
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 查找用户
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }
    
    // 验证密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }
    
    // 生成JWT令牌
    const token = jwt.sign(
      { id: user._id, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role
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

// 测试接口（需登录）
app.get('/api/test', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: '后端服务运行正常',
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

// 验证Token的中间件
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: '请先登录'
    });
  }
  
  jwt.verify(token, config.jwtSecret, (err, user) => {
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

// 启动服务器
app.listen(config.port, () => {
  console.log(`服务器已启动，监听端口：${config.port}`);
  console.log(`API基础地址：http://localhost:${config.port}/api`);
});
