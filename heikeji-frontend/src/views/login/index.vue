<template>
  <div class="login-container">
    <!-- 背景装饰元素 -->
    <div class="login-bg-decoration">
      <div class="bg-circle bg-circle-1"></div>
      <div class="bg-circle bg-circle-2"></div>
      <div class="bg-circle bg-circle-3"></div>
    </div>

    <div class="login-form-wrapper">
      <div class="login-form-header">
        <!-- 学校标识区域 -->
        <div class="school-login-logo">
          <img
            src="@/assets/images/school-logo.svg"
            alt="黑龙江科技大学校徽"
            class="login-logo-img"
          />
        </div>
        <h1 class="login-title">黑龙江科技大学</h1>
        <h2 class="login-subtitle">黑科易购校园电商平台</h2>
        <p class="login-desc">登录您的账号以继续</p>
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
            :maxlength="20"
            auto-complete="on"
            clearable
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            :maxlength="20"
            show-password
            auto-complete="on"
          />
        </el-form-item>
        <el-form-item prop="code" v-if="showCode" :style="{ marginBottom: '15px' }">
          <div class="code-wrapper">
            <el-input
              v-model="loginForm.code"
              placeholder="请输入验证码"
              prefix-icon="el-icon-shield"
              :maxlength="6"
              auto-complete="off"
              style="width: 60%"
            />
            <img :src="codeUrl" @click="getCode" class="code-img" alt="验证码" />
          </div>
        </el-form-item>
        <el-form-item class="login-btn-wrapper">
          <el-button
            type="primary"
            style="width: 100%"
            :loading="loading"
            @click="handleLogin"
            :disabled="loading"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { login, getCaptcha, getCurrentUser } from '@/api/login'
import { setToken } from '@/utils/auth'

// 定义接口
interface LoginForm {
  username: string
  password: string
  code: string
}

// 响应式数据
const loginFormRef = ref()
const loginForm = reactive<LoginForm>({
  username: '',
  password: '',
  code: '',
})

const loginRules = reactive({
  username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
  password: [{ required: true, trigger: 'blur', message: '请输入密码' }],
  code: [{ required: true, trigger: 'blur', message: '请输入验证码' }],
})

const loading = ref(false)
const showCode = ref(true) // 根据后端要求，默认显示验证码
const codeUrl = ref('')

// Router
const router = useRouter()
const route = useRoute()

// 事件处理函数
const handleLogin = () => {
  loginFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      loading.value = true
      login(loginForm)
        .then(res => {
          // 存储token
          setToken(res.data.token)
          // 登录成功后获取用户信息
          getCurrentUser().then(() => {
            router.replace(route.query.redirect ? (route.query.redirect as string) : '/')
          })
        })
        .catch(() => {
          loading.value = false
          if (showCode.value) {
            getCode()
          }
        })
    }
  })
}

const getCode = () => {
  getCaptcha().then(res => {
    showCode.value = true
    // 验证码直接返回图片，设置到src
    codeUrl.value = res.data
  })
}

// 生命周期钩子
onMounted(() => {
  // 自动加载验证码
  getCode()
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.login-container {
  height: 100vh;
  background-color: $background-color;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(135deg, $primary 0%, $primary-dark 100%);
  position: relative;
  overflow: hidden;
}

// 背景装饰元素
.login-bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.bg-circle-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.bg-circle-2 {
  width: 200px;
  height: 200px;
  bottom: -50px;
  right: -50px;
  animation-delay: 2s;
}

.bg-circle-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  right: 10%;
  animation-delay: 4s;
}

// 浮动动画
@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-30px) rotate(180deg);
  }
}

.login-form-wrapper {
  width: 420px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  position: relative;
  z-index: 1;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.login-form-header {
  padding: 40px 30px 20px;
  text-align: center;
  background: linear-gradient(135deg, $primary 0%, $primary-light 100%);
  color: #ffffff;
}

// 学校登录Logo
.school-login-logo {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.login-logo-img {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  object-fit: contain;
}

.login-title {
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 10px 0;
  color: #ffffff;
  font-family: 'Microsoft YaHei', sans-serif;
}

.login-subtitle {
  font-size: 18px;
  font-weight: 500;
  margin: 0 0 15px 0;
  color: rgba(255, 255, 255, 0.9);
}

.login-desc {
  font-size: 14px;
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
}

.login-form {
  padding: 30px;
}

.code-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.code-img {
  width: 36%;
  height: 40px;
  cursor: pointer;
  vertical-align: middle;
  border-radius: 8px;
  border: 1px solid $border-color;
}

.login-btn-wrapper {
  margin-top: 25px;
}

.login-btn-wrapper .el-button--primary {
  height: 44px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, $primary 0%, $primary-light 100%);
  border: none;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover,
  &:focus {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 51, 102, 0.3);
  }
}

// 表单样式调整
.login-form .el-input__wrapper {
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    border-color: $primary;
    box-shadow: 0 0 0 2px rgba(0, 51, 102, 0.1);
  }
}

.login-form .el-input.is-focus .el-input__wrapper {
  border-color: $primary;
  box-shadow: 0 0 0 2px rgba(0, 51, 102, 0.15);
}

// 响应式适配
@media screen and (max-width: 480px) {
  .login-form-wrapper {
    width: 90%;
    margin: 20px;
  }

  .bg-circle-1 {
    width: 200px;
    height: 200px;
  }

  .bg-circle-2 {
    width: 150px;
    height: 150px;
  }

  .bg-circle-3 {
    width: 100px;
    height: 100px;
  }
}
</style>
