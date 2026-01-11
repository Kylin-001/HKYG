<template>
  <div class="register-page">
    <!-- 页面背景 -->
    <div class="register-bg"></div>

    <!-- 注册容器 -->
    <div class="register-container">
      <!-- 标题 -->
      <div class="register-title">黑科易购</div>
      <div class="register-subtitle">创建新账号</div>

      <!-- 注册表单 -->
      <el-form
        :model="registerForm"
        :rules="registerRules"
        ref="registerFormRef"
        class="register-form"
      >
        <!-- 手机号 -->
        <el-form-item prop="phone">
          <el-input
            v-model="registerForm.phone"
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

        <!-- 验证码 -->
        <el-form-item prop="verificationCode">
          <div class="code-container">
            <el-input
              v-model="registerForm.verificationCode"
              placeholder="请输入验证码"
              type="text"
              maxlength="6"
              show-word-limit
            >
              <template #prefix>
                <i class="el-icon-message"></i>
              </template>
            </el-input>

            <!-- 验证码按钮 -->
            <el-button
              type="text"
              class="get-code-btn"
              :disabled="countdown > 0"
              @click="getVerificationCode"
            >
              {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
            </el-button>
          </div>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            placeholder="请设置密码"
            type="password"
            maxlength="20"
            show-word-limit
          >
            <template #prefix>
              <i class="el-icon-lock"></i>
            </template>
            <template #suffix>
              <span class="toggle-password" @click="showPassword = !showPassword">
                {{ showPassword ? '隐藏' : '显示' }}
              </span>
            </template>
          </el-input>
        </el-form-item>

        <!-- 确认密码 -->
        <el-form-item prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            placeholder="请确认密码"
            type="password"
            maxlength="20"
            show-word-limit
          >
            <template #prefix>
              <i class="el-icon-lock"></i>
            </template>
          </el-input>
        </el-form-item>

        <!-- 同意协议 -->
        <el-form-item prop="agreeTerms" class="agree-terms">
          <el-checkbox v-model="registerForm.agreeTerms">
            我已阅读并同意
            <span class="agreement-link" @click="showAgreement">《用户协议》</span>
            和
            <span class="agreement-link" @click="showPrivacyPolicy">《隐私政策》</span>
          </el-checkbox>
        </el-form-item>

        <!-- 注册按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            class="register-btn"
            :loading="loading"
            @click="handleRegister"
            round
          >
            注册
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 登录入口 -->
      <div class="login-link">已有账号？ <span @click="goToLogin">立即登录</span></div>
    </div>

    <!-- 协议弹窗 -->
    <el-dialog
      v-model="showAgreementDialog"
      :title="agreementDialogTitle"
      width="80%"
      max-height="80vh"
    >
      <div class="agreement-content">
        <!-- 这里可以根据agreementDialogType显示不同的协议内容 -->
        <div v-if="agreementDialogType === 'terms'">
          <h3>用户协议</h3>
          <p>欢迎使用黑科易购平台服务！为了保障您的合法权益，请您仔细阅读本协议的全部内容。</p>
          <h4>一、协议的接受</h4>
          <p>1.1 本协议是您与黑科易购平台之间关于使用黑科易购平台服务所订立的协议。</p>
          <p>1.2 您在注册或使用黑科易购平台服务前，应当仔细阅读并理解本协议的全部内容。</p>
          <h4>二、用户注册</h4>
          <p>2.1 您应当提供真实、准确、完整的注册信息，并在信息发生变更时及时更新。</p>
          <p>2.2 您应当妥善保管您的账号和密码，对您账号下的所有活动承担法律责任。</p>
          <h4>三、服务内容</h4>
          <p>3.1 黑科易购平台为您提供商品浏览、购买、支付、配送等服务。</p>
          <p>3.2 黑科易购平台有权根据业务发展情况调整服务内容。</p>
          <h4>四、用户行为规范</h4>
          <p>4.1 您应当遵守法律法规，不得利用黑科易购平台从事违法活动。</p>
          <p>4.2 您应当尊重他人的合法权益，不得侵犯他人的知识产权、隐私权等。</p>
          <h4>五、协议的变更和终止</h4>
          <p>5.1 黑科易购平台有权随时修改本协议，修改后的协议将在平台上公布。</p>
          <p>5.2 您有权随时终止使用黑科易购平台服务。</p>
          <h4>六、其他条款</h4>
          <p>6.1 本协议的解释权归黑科易购平台所有。</p>
          <p>6.2 本协议自您注册或使用黑科易购平台服务之日起生效。</p>
        </div>
        <div v-else-if="agreementDialogType === 'privacy'">
          <h3>隐私政策</h3>
          <p>
            黑科易购平台非常重视您的隐私保护，我们将按照本政策的规定收集、使用、存储和保护您的个人信息。
          </p>
          <h4>一、个人信息的收集</h4>
          <p>
            1.1 我们会收集您在注册、使用服务过程中提供的个人信息，包括但不限于手机号、姓名、地址等。
          </p>
          <p>1.2 我们会收集您在使用服务过程中产生的日志信息，包括但不限于IP地址、浏览记录等。</p>
          <h4>二、个人信息的使用</h4>
          <p>2.1 我们会将您的个人信息用于提供服务、优化服务、安全保障等目的。</p>
          <p>
            2.2 我们不会将您的个人信息出售给第三方，但在法律规定的情况下可能会披露您的个人信息。
          </p>
          <h4>三、个人信息的保护</h4>
          <p>3.1 我们采取各种安全措施保护您的个人信息，防止信息泄露、篡改、丢失。</p>
          <p>3.2 您有权访问、修改、删除您的个人信息，有权撤回您的同意。</p>
          <h4>四、隐私政策的变更</h4>
          <p>4.1 我们有权随时修改本隐私政策，修改后的政策将在平台上公布。</p>
          <h4>五、其他条款</h4>
          <p>5.1 本隐私政策的解释权归黑科易购平台所有。</p>
          <p>5.2 本隐私政策自您注册或使用黑科易购平台服务之日起生效。</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

// 初始化路由
const router = useRouter()

// 表单引用
const registerFormRef = ref()

// 加载状态
const loading = ref(false)

// 显示密码
const showPassword = ref(false)

// 验证码倒计时
const countdown = ref(0)

// 协议弹窗
const showAgreementDialog = ref(false)
const agreementDialogTitle = ref('')
const agreementDialogType = ref('terms') // terms 或 privacy

// 注册表单
const registerForm = reactive({
  phone: '',
  verificationCode: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false,
})

// 注册表单验证规则
const registerRules = reactive({
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  verificationCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 4, max: 6, message: '验证码长度为 4-6 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请设置密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
    {
      pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/,
      message: '密码必须包含字母和数字',
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value === '') {
          callback(new Error('请确认密码'))
        } else if (value !== registerForm.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  agreeTerms: [
    {
      validator: (rule: any, value: boolean, callback: any) => {
        if (!value) {
          callback(new Error('请阅读并同意用户协议和隐私政策'))
        } else {
          callback()
        }
      },
      trigger: 'change',
    },
  ],
})

// 获取验证码
const getVerificationCode = () => {
  // 验证手机号
  if (!registerForm.phone) {
    ElMessage.warning('请先输入手机号')
    return
  }

  // 验证手机号格式
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(registerForm.phone)) {
    ElMessage.warning('请输入正确的手机号')
    return
  }

  // 模拟发送验证码
  ElMessage.success('验证码发送成功，请注意查收')

  // 开始倒计时
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return

  try {
    // 验证表单
    await registerFormRef.value.validate()

    loading.value = true

    // 模拟注册请求
    setTimeout(() => {
      ElMessage.success('注册成功')
      loading.value = false

      // 跳转到登录页面
      router.push('/app/user/login')
    }, 1000)
  } catch (error) {
    console.error('注册失败:', error)
  }
}

// 跳转到登录页面
const goToLogin = () => {
  router.push('/app/user/login')
}

// 显示协议
const showAgreement = () => {
  agreementDialogTitle.value = '用户协议'
  agreementDialogType.value = 'terms'
  showAgreementDialog.value = true
}

// 显示隐私政策
const showPrivacyPolicy = () => {
  agreementDialogTitle.value = '隐私政策'
  agreementDialogType.value = 'privacy'
  showAgreementDialog.value = true
}
</script>

<style scoped>
.register-page {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

.register-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0.1;
}

.register-container {
  position: relative;
  width: 90%;
  max-width: 400px;
  padding: 32px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.register-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 8px;
}

.register-subtitle {
  font-size: 14px;
  color: #999;
  text-align: center;
  margin-bottom: 32px;
}

.register-form {
  width: 100%;
}

.code-container {
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

.toggle-password {
  cursor: pointer;
  color: #409eff;
  font-size: 12px;
}

.agree-terms {
  margin-bottom: 24px;
  font-size: 12px;
}

.agreement-link {
  cursor: pointer;
  color: #409eff;
}

.register-btn {
  width: 100%;
  height: 40px;
  font-size: 16px;
  font-weight: bold;
}

.login-link {
  text-align: center;
  font-size: 14px;
  color: #999;
  margin-top: 24px;
}

.login-link span {
  cursor: pointer;
  color: #409eff;
}

.agreement-content {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 16px;
}

.agreement-content h3 {
  font-size: 18px;
  margin-bottom: 16px;
  color: #333;
}

.agreement-content h4 {
  font-size: 16px;
  margin: 16px 0 8px;
  color: #666;
}

.agreement-content p {
  font-size: 14px;
  line-height: 1.5;
  color: #999;
  margin-bottom: 8px;
}
</style>
