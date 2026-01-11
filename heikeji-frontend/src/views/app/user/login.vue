<template>
  <div class="login-page">
    <!-- 页面背景 -->
    <div class="login-bg"></div>

    <!-- 登录容器 -->
    <div class="login-container">
      <!-- 标题 -->
      <div class="login-title">黑科易购</div>
      <div class="login-subtitle">欢迎登录</div>

      <!-- 登录表单 -->
      <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" class="login-form">
        <!-- 手机号 -->
        <el-form-item prop="phone">
          <el-input
            v-model="loginForm.phone"
            placeholder="请输入手机号"
            type="tel"
            maxlength="11"
            show-word-limit
          >
            <template #prefix>
              <i class="el-icon-mobile"></i>
            </template>
          </el-input>
        </el-form-item>

        <!-- 密码/验证码 -->
        <el-form-item prop="passwordOrCode">
          <div class="password-container">
            <el-input
              v-model="loginForm.passwordOrCode"
              :type="loginType === 'password' ? 'password' : 'text'"
              :placeholder="loginType === 'password' ? '请输入密码' : '请输入验证码'"
            >
              <template #prefix>
                <i :class="loginType === 'password' ? 'el-icon-lock' : 'el-icon-message'"></i>
              </template>
              <template #suffix>
                <span v-if="loginType === 'password'" class="toggle-type" @click="toggleLoginType">
                  {{ showPassword ? '隐藏' : '显示' }}
                </span>
                <span v-else class="toggle-type" @click="toggleLoginType">密码登录</span>
              </template>
            </el-input>

            <!-- 验证码按钮 -->
            <el-button
              v-if="loginType === 'code'"
              type="text"
              class="get-code-btn"
              :disabled="countdown > 0"
              @click="sendVerificationCode"
            >
              {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
            </el-button>
          </div>
        </el-form-item>

        <!-- 记住密码 -->
        <el-form-item class="remember-me">
          <el-checkbox v-model="rememberMe">记住密码</el-checkbox>
          <span class="forgot-password" @click="goToForgotPassword">忘记密码？</span>
        </el-form-item>

        <!-- 登录按钮 -->
        <el-form-item>
          <el-button type="primary" class="login-btn" :loading="loading" @click="handleLogin" round>
            登录
          </el-button>
        </el-form-item>

        <!-- 其他登录方式 -->
        <div class="other-login">
          <div class="other-login-line"></div>
          <span class="other-login-text">其他登录方式</span>
          <div class="other-login-line"></div>
        </div>

        <div class="social-login">
          <i class="el-icon-wechat"></i>
          <i class="el-icon-weibo"></i>
          <i class="el-icon-qq"></i>
        </div>
      </el-form>

      <!-- 注册入口 -->
      <div class="register-link">还没有账号？ <span @click="goToRegister">立即注册</span></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login, loginByCode, getVerificationCode } from '@/api/app/auth'

// 初始化路由
const router = useRouter()

// 表单引用
const loginFormRef = ref()

// 加载状态
const loading = ref(false)

// 登录类型：password 或 code
const loginType = ref('password')

// 显示密码
const showPassword = ref(false)

// 记住密码
const rememberMe = ref(false)

// 验证码倒计时
const countdown = ref(0)

// 登录表单
const loginForm = reactive({
  phone: '',
  passwordOrCode: '',
})

// 登录表单验证规则
const loginRules = reactive({
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  passwordOrCode: [
    { required: true, message: '请输入密码或验证码', trigger: 'blur' },
    {
      min: loginType.value === 'password' ? 6 : 4,
      max: loginType.value === 'password' ? 20 : 6,
      message:
        loginType.value === 'password' ? '密码长度在 6 到 20 个字符' : '验证码长度为 4-6 个字符',
      trigger: 'blur',
    },
  ],
})

// 切换登录类型
const toggleLoginType = () => {
  loginType.value = loginType.value === 'password' ? 'code' : 'password'
  loginForm.passwordOrCode = ''
}

// 获取验证码
const sendVerificationCode = async () => {
  // 验证手机号
  if (!loginForm.phone) {
    ElMessage.warning('请先输入手机号')
    return
  }

  try {
    // 调用真实API发送验证码
    await getVerificationCode({ phone: loginForm.phone, type: 'login' })
    ElMessage.success('验证码发送成功，请注意查收')

    // 开始倒计时
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (error) {
    console.error('发送验证码失败:', error)
    ElMessage.error('发送验证码失败，请稍后重试')
  }
}

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    // 验证表单
    await loginFormRef.value.validate()

    loading.value = true
    let response

    if (loginType.value === 'password') {
      // 密码登录
      response = await login({
        phone: loginForm.phone,
        password: loginForm.passwordOrCode,
      })
    } else {
      // 验证码登录
      response = await loginByCode({
        phone: loginForm.phone,
        code: loginForm.passwordOrCode,
      })
    }

    ElMessage.success('登录成功')
    loading.value = false

    // 保存登录状态和用户信息
    localStorage.setItem('isLoggedIn', 'true')
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token)
    }

    // 跳转到首页
    router.push('/app/product/list')
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error('登录失败，请检查账号密码或验证码是否正确')
    loading.value = false
  }
}

// 忘记密码
const goToForgotPassword = () => {
  ElMessage.info('忘记密码功能开发中')
}

// 跳转到注册页面
const goToRegister = () => {
  router.push('/app/user/register')
}
</script>

<style scoped>
.login-page {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0.1;
}

.login-container {
  position: relative;
  width: 90%;
  max-width: 400px;
  padding: 32px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.login-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 8px;
}

.login-subtitle {
  font-size: 14px;
  color: #999;
  text-align: center;
  margin-bottom: 32px;
}

.login-form {
  width: 100%;
}

.password-container {
  position: relative;
}

.get-code-btn {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  padding: 0 16px;
  color: #409eff;
}

.toggle-type {
  cursor: pointer;
  color: #409eff;
  font-size: 12px;
}

.remember-me {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.forgot-password {
  cursor: pointer;
  color: #409eff;
  font-size: 12px;
}

.login-btn {
  width: 100%;
  height: 40px;
  font-size: 16px;
  font-weight: bold;
}

.other-login {
  display: flex;
  align-items: center;
  margin: 24px 0;
}

.other-login-line {
  flex: 1;
  height: 1px;
  background-color: #e0e0e0;
}

.other-login-text {
  padding: 0 16px;
  color: #999;
  font-size: 12px;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 24px;
}

.social-login i {
  font-size: 28px;
  color: #999;
  cursor: pointer;
  transition: color 0.3s;
}

.social-login i:hover {
  color: #409eff;
}

.register-link {
  text-align: center;
  font-size: 14px;
  color: #999;
}

.register-link span {
  cursor: pointer;
  color: #409eff;
}
</style>
