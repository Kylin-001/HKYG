<template>
  <div class="forgot-page min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary-light/5 px-4 py-8 relative overflow-hidden">
    <div class="absolute top-0 left-0 w-96 h-96 bg-primary-100/30 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-primary-light/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

    <div class="w-full max-w-md relative z-10 animate-scale-in">
      <!-- Step 1: 输入账号 -->
      <div v-if="step === 1">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-primary-light to-primary-400 shadow-brand mb-6 relative overflow-hidden">
            <span class="text-white text-3xl">🔑</span>
            <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
          </div>
          <h1 class="text-3xl font-bold text-text-primary mb-2">找回密码</h1>
          <p class="text-text-secondary">请输入您注册时使用的手机号</p>
          <p class="text-[11px] text-text-quaternary mt-2 tracking-wider">PASSWORD RECOVERY</p>
        </div>

        <div class="bg-surface rounded-2xl shadow-brand p-8 md:p-10">
          <el-form ref="form1Ref" :model="form1" :rules="rules1" label-position="top" size="large">
            <el-form-item prop="phone">
              <el-input
                v-model="form1.phone"
                placeholder="请输入注册手机号"
                prefix-icon="Phone"
                maxlength="11"
              />
            </el-form-item>
          </el-form>

          <el-button
            type="primary"
            size="large"
            class="w-full !rounded-xl !h-12 !text-base !font-semibold"
            :loading="sending"
            @click="sendCode"
          >
            {{ sending ? '发送中...' : '发送验证码' }}
          </el-button>

          <div class="mt-6 text-center">
            <router-link to="/auth/login" class="text-primary hover:text-primary-dark font-medium transition-colors">
              ← 返回登录
            </router-link>
          </div>
        </div>
      </div>

      <!-- Step 2: 验证码 -->
      <div v-if="step === 2">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-warning to-gold shadow-brand mb-6 relative overflow-hidden">
            <span class="text-white text-3xl">📱</span>
            <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
          </div>
          <h1 class="text-3xl font-bold text-text-primary mb-2">验证身份</h1>
          <p class="text-text-secondary">验证码已发送至</p>
          <p class="font-mono font-semibold text-primary mt-1">{{ maskedPhone }}</p>
        </div>

        <div class="bg-surface rounded-2xl shadow-brand p-8 md:p-10">
          <div class="flex justify-center gap-3 mb-6">
            <input
              v-for="(digit, i) in codeDigits"
              :key="i"
              v-model="codeDigits[i]"
              @input="onCodeInput(i)"
              @keydown.backspace="onCodeBackspace(i)"
              maxlength="1"
              class="code-input"
              :ref="(el: any) => { if (el) codeInputs[i] = el as HTMLInputElement }"
            />
          </div>

          <p class="text-center text-sm text-text-secondary mb-6">
            <template v-if="countdown > 0">
              <span class="text-text-quaternary">{{ countdown }}秒后可重新发送</span>
            </template>
            <template v-else>
              没有收到？
              <button @click="resendCode" class="text-primary hover:text-primary-dark font-medium">重新发送</button>
            </template>
          </p>

          <el-button
            type="primary"
            size="large"
            class="w-full !rounded-xl !h-12 !text-base !font-semibold"
            :disabled="!isCodeComplete"
            @click="verifyCode"
          >
            验证并继续
          </el-button>
        </div>
      </div>

      <!-- Step 3: 重置密码 -->
      <div v-if="step === 3">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-success to-emerald-500 shadow-brand mb-6 relative overflow-hidden">
            <span class="text-white text-3xl">🔒</span>
            <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
          </div>
          <h1 class="text-3xl font-bold text-text-primary mb-2">设置新密码</h1>
          <p class="text-text-secondary">请设置新的登录密码</p>
        </div>

        <div class="bg-surface rounded-2xl shadow-brand p-8 md:p-10">
          <el-form ref="form3Ref" :model="form3" :rules="rules3" label-position="top" size="large">
            <el-form-item prop="newPassword">
              <el-input
                v-model="form3.newPassword"
                type="password"
                placeholder="6-20位字母数字组合"
                prefix-icon="Lock"
                show-password
                maxlength="20"
              />

              <!-- 密码强度指示器 -->
              <div class="mt-3 px-1">
                <div class="flex gap-1.5 mb-2">
                  <div
                    v-for="level in 3"
                    :key="level"
                    class="h-1.5 flex-1 rounded-full transition-all duration-300"
                    :class="pwdStrength >= level ? strengthColors[level - 1] : 'bg-gray-100'"
                  ></div>
                </div>
                <p class="text-xs" :class="strengthText.color">{{ strengthText.label }}</p>
              </div>
            </el-form-item>

            <el-form-item prop="confirmNewPwd">
              <el-input
                v-model="form3.confirmNewPwd"
                type="password"
                placeholder="再次输入新密码"
                prefix-icon="Lock"
                show-password
                maxlength="20"
              />
            </el-form-item>
          </el-form>

          <el-button
            type="primary"
            size="large"
            class="w-full !rounded-xl !h-12 !text-base !font-semibold"
            :loading="resetting"
            @click="resetPassword"
          >
            {{ resetting ? '重置中...' : '确认重置密码' }}
          </el-button>
        </div>
      </div>

      <!-- 成功页面 -->
      <div v-if="step === 4" class="text-center">
        <div class="success-animation mb-8">
          <div class="success-circle">
            <svg class="checkmark" viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="25" fill="none" stroke="#10B981" stroke-width="2"/>
              <path fill="none" stroke="#10B981" stroke-width="3" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>
        </div>

        <h1 class="text-3xl font-bold text-text-primary mb-3">🎉 密码重置成功！</h1>
        <p class="text-text-secondary mb-8">您的新密码已生效，可以使用新密码登录了</p>

        <el-button
          type="primary"
          size="large"
          class="!rounded-xl !h-12 !px-16 !text-base !font-semibold"
          @click="$router.push('/auth/login')"
        >
          返回登录 →
        </el-button>
      </div>

      <!-- 步骤指示器 -->
      <div v-if="step < 4" class="flex items-center justify-center gap-2 mt-8">
        <button
          v-for="s in 4"
          :key="s"
          :class="[
            'transition-all duration-300 rounded-full',
            s <= step ? 'w-6 h-2.5 bg-primary' : 'w-2 h-2.5 bg-gray-200'
          ]"
          @click="s < step ? (step = s) : null"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'

const step = ref(1)
const sending = ref(false)
const resetting = ref(false)
const countdown = ref(0)

const form1Ref = ref()
const form3Ref = ref()

const form1 = reactive({ phone: '' })
const form3 = reactive({ newPassword: '', confirmNewPwd: '' })
const codeDigits = ref(['', '', '', '', '', ''])
const codeInputs = ref<HTMLInputElement[]>([])

const rules1 = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ]
}

const rules3 = {
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20位', trigger: 'blur' },
    {
      validator: (_r: any, v: string, cb: Function) => {
        if (v && !/(?=.*[a-zA-Z])(?=.*\d)/.test(v)) {
          cb(new Error('密码需同时包含字母和数字'))
        } else {
          cb()
        }
      },
      trigger: 'blur'
    }
  ],
  confirmNewPwd: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (_r: any, v: string, cb: Function) => {
        if (v !== form3.newPassword) cb(new Error('两次密码不一致'))
        else cb()
      },
      trigger: 'blur'
    }
  ]
}

const maskedPhone = computed(() => {
  const p = form1.phone
  return p.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
})

const isCodeComplete = computed(() => codeDigits.value.every(d => d.length > 0))

const pwdStrength = computed(() => {
  const pwd = form3.newPassword
  if (!pwd) return 0

  let strength = 0
  if (pwd.length >= 8) strength++
  if (/[a-z]/.test(pwd)) strength++
  if (/[A-Z]/.test(pwd)) strength++
  if (/\d/.test(pwd)) strength++
  if (/[^A-Za-z0-9]/.test(pwd)) strength++

  return Math.min(Math.ceil(strength / 1.5), 3)
})

const strengthText = computed(() => {
  const map = [
    { label: '', color: 'text-gray-400' },
    { label: '弱：建议混合大小写字母、数字和符号', color: 'text-red-500' },
    { label: '中等：可以添加特殊字符增强安全性', color: 'text-yellow-600' },
    { label: '强：密码安全性很好 ✓', color: 'text-green-600' }
  ]
  return map[pwdStrength.value]
})

const strengthColors = ['bg-red-500', 'bg-yellow-500', 'bg-green-500']

let timer: ReturnType<typeof setInterval> | null = null

async function sendCode(): Promise<void> {
  try {
    await form1Ref.value?.validate()
    sending.value = true

    await new Promise(resolve => setTimeout(resolve, 1200))

    ElMessage.success(`验证码已发送至 ${maskedPhone.value}`)
    step.value = 2
    startCountdown()
  } catch (error) {
    console.error('发送验证码失败:', error)
  } finally {
    sending.value = false
  }
}

function resendCode(): void {
  sendCode()
}

function startCountdown(): void {
  countdown.value = 60
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0 && timer) clearInterval(timer)
  }, 1000)
}

function onCodeInput(index: number): void {
  if (codeDigits.value[index] && index < 5) {
    codeInputs.value[index + 1]?.focus()
  }
}

function onCodeBackspace(index: number): void {
  if (!codeDigits.value[index] && index > 0) {
    codeInputs.value[index - 1]?.focus()
  }
}

async function verifyCode(): Promise<void> {
  try {
    ElMessage.success('验证成功')
    step.value = 3
  } catch (error) {
    console.error('验证失败:', error)
    ElMessage.error('验证码错误，请重新输入')
  }
}

async function resetPassword(): Promise<void> {
  try {
    await form3Ref.value?.validate()
    resetting.value = true

    await new Promise(resolve => setTimeout(resolve, 1500))

    ElMessage.success({
      message: '✅ 密码重置成功！',
      duration: 3000,
      showClose: true
    })

    step.value = 4
  } catch (error: any) {
    console.error('重置密码失败:', error)
    ElMessage.error(error?.message || '重置失败，请稍后重试')
  } finally {
    resetting.value = false
  }
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.forgot-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f5ff 0%, #e6efff 50%, #f0f5ff 100%);
}

.animate-scale-in {
  animation: scaleIn 0.5s ease-out;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.shadow-brand {
  box-shadow: 0 20px 60px rgba(0, 59, 128, 0.15);
}

.bg-surface {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.code-input {
  width: 48px;
  height: 56px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  outline: none;
  transition: all 0.2s ease;
  background: white;
}

.code-input:focus {
  border-color: #003B80;
  box-shadow: 0 0 0 3px rgba(0, 59, 128, 0.1);
}

.success-animation {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.success-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: successScaleIn 0.5s ease-out;
}

.checkmark {
  width: 64px;
  height: 64px;
  animation: checkDraw 0.4s ease-out 0.3s both;
}

@keyframes successScaleIn {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes checkDraw {
  0% {
    stroke-dashoffset: 100;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
</style>
