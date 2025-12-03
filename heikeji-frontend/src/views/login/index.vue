<template>
  <div class="login-container">
    <div class="login-form-wrapper">
      <div class="login-form-header">
        <h1 class="login-title">黑科易购系统</h1>
        <p class="login-subtitle">登录您的账号以继续</p>
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
import { ElMessage } from 'element-plus'
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
.login-container {
  height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-form-wrapper {
  width: 420px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.login-form-header {
  padding: 30px 30px 10px;
  text-align: center;
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: #303133;
}

.login-subtitle {
  margin-top: 10px;
  color: #909399;
  font-size: 14px;
}

.login-form {
  padding: 20px 30px 30px;
}

.code-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.code-img {
  width: 36%;
  height: 40px;
  cursor: pointer;
  vertical-align: middle;
  border-radius: 4px;
}

.login-btn-wrapper {
  margin-top: 20px;
}

.login-btn-wrapper .el-button--primary {
  height: 40px;
  font-size: 16px;
}

// 响应式适配
@media screen and (max-width: 480px) {
  .login-form-wrapper {
    width: 90%;
    margin: 20px;
  }
}
</style>
