require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret_key_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'fitnex_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD
  },
  
  redis: {
    url: process.env.REDIS_TLS === 'true' 
      ? `rediss://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
      : `redis://:${process.env.REDIS_PASSWORD || ''}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || null,
    tls: process.env.REDIS_TLS === 'true'
  },
  
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || 'noreply@fitnex.com'
  },

  app: {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3002'
  },
  
  pdf: {
    tempDir: process.env.PDF_TEMP_DIR || './temp'
  },
  
  websocket: {
    port: process.env.WS_PORT || 3001
  }
};
