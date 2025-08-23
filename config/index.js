module.exports = {
  port: 3000,
  // 数据库配置
  database: {
    // 当前使用JSON文件存储（开发测试）
    type: 'json', // json, mysql (后期扩展)
    jsonPath: './data', // JSON文件存储路径
    // MySQL配置（后期使用）
    mysql: {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'school_club'
    }
  },
  // JWT配置
  jwt: {
    secret: 'school-club-secret-key-2024',
    expiresIn: '24h'
  },
  // 默认用户配置
  defaultUsers: [
    {
      username: 'admin',
      password: '123456',
      name: '系统管理员',
      role: 'admin'
    },
    {
      username: 'student1',
      password: '123',
      name: '张三',
      role: 'student',
      clubId: '1'
    },
    {
      username: 'clubadmin1',
      password: '123',
      name: '李四',
      role: 'club-admin',
      clubId: '1'
    },
    {
      username: 'schooladmin',
      password: '123',
      name: '王五',
      role: 'school-admin'
    }
  ]
};
