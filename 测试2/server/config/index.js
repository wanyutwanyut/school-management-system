module.exports = {
  port: 3000,
  mongoUri: 'mongodb://localhost:27017/school_club', // 本地MongoDB连接地址
  jwtSecret: 'school-club-secret-key', // JWT加密密钥
  jwtExpiresIn: '24h' // Token有效期
};
