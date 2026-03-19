/**
 * 测试配置文件
 * 用于管理测试环境变量和配置
 */

// 从环境变量中读取测试配置，如果没有则使用默认值
export const testConfig = {
  // 测试用户账号
  user: {
    phone: process.env.TEST_USER_PHONE || '13800138001',
    password: process.env.TEST_USER_PASSWORD || 'test_password_secure_123',
    token: process.env.TEST_USER_TOKEN || 'test_token_secure_123456789',
    wrongPassword: process.env.TEST_USER_WRONG_PASSWORD || 'wrong_test_password',
    newToken: process.env.TEST_USER_NEW_TOKEN || 'new_test_token_456',
    incompleteToken: process.env.TEST_USER_INCOMPLETE_TOKEN || 'incomplete_test_token',
  },

  // 测试API配置
  api: {
    baseUrl: process.env.TEST_API_BASE_URL || 'http://localhost:3000/api',
    timeout: parseInt(process.env.TEST_API_TIMEOUT || '10000', 10),
  },

  // 测试数据库配置
  database: {
    host: process.env.TEST_DB_HOST || 'localhost',
    port: parseInt(process.env.TEST_DB_PORT || '3306', 10),
    name: process.env.TEST_DB_NAME || 'heikeji_test',
    user: process.env.TEST_DB_USER || 'test_user',
    password: process.env.TEST_DB_PASSWORD || 'test_db_password',
  },

  // 测试支付配置
  payment: {
    merchantId: process.env.TEST_PAYMENT_MERCHANT_ID || 'test_merchant_123',
    key: process.env.TEST_PAYMENT_KEY || 'test_payment_key_123456789',
  },

  // 测试邮件配置
  email: {
    host: process.env.TEST_EMAIL_HOST || 'smtp.example.com',
    port: parseInt(process.env.TEST_EMAIL_PORT || '587', 10),
    user: process.env.TEST_EMAIL_USER || 'test@example.com',
    password: process.env.TEST_EMAIL_PASSWORD || 'test_email_password',
  },

  // 测试文件上传配置
  upload: {
    maxSize: parseInt(process.env.TEST_UPLOAD_MAX_SIZE || '10485760', 10), // 10MB
    allowedTypes: (process.env.TEST_UPLOAD_ALLOWED_TYPES || 'jpg,jpeg,png,gif,pdf,doc,docx').split(
      ','
    ),
  },

  // 测试安全配置
  security: {
    jwtSecret: process.env.TEST_JWT_SECRET || 'test_jwt_secret_key_123456789',
    sessionSecret: process.env.TEST_SESSION_SECRET || 'test_session_secret_key_123456789',
  },
}

// 导出常用的测试数据
export const testUserData = {
  phone: testConfig.user.phone,
  password: testConfig.user.password,
  token: testConfig.user.token,
}

export const testApiConfig = {
  baseURL: testConfig.api.baseUrl,
  timeout: testConfig.api.timeout,
}

export const testPaymentConfig = {
  merchantId: testConfig.payment.merchantId,
  key: testConfig.payment.key,
}

export default testConfig
