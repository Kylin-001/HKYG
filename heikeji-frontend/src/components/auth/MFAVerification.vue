<template>
  <div class="mfa-verification">
    <div class="mfa-header">
      <el-icon :size="48" color="#409EFF">
        <Lock />
      </el-icon>
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>

    <el-tabs v-model="activeTab" class="mfa-tabs">
      <el-tab-pane label="验证码" name="code" v-if="showCode">
        <el-form :model="codeForm" :rules="codeRules" ref="codeFormRef">
          <el-form-item prop="code">
            <el-input
              v-model="codeForm.code"
              placeholder="请输入6位验证码"
              maxlength="6"
              :prefix-icon="Message"
              @input="handleCodeInput"
            />
          </el-form-item>
          <div class="code-tips">
            <span>验证码已发送至: {{ maskedPhone }}</span>
            <el-button link type="primary" @click="handleResend" :disabled="countdown > 0">
              {{ countdown > 0 ? `${countdown}秒后重发` : '重新发送' }}
            </el-button>
          </div>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="身份验证器" name="authenticator" v-if="showAuthenticator">
        <el-form :model="totpForm" :rules="totpRules" ref="totpFormRef">
          <el-form-item prop="code">
            <el-input
              v-model="totpForm.code"
              placeholder="请输入6位动态口令"
              maxlength="6"
              :prefix-icon="Lock"
              @input="handleTotpInput"
            />
          </el-form-item>
          <div class="totp-tips">
            <span>打开身份验证器APP，查看6位验证码</span>
          </div>
          <div class="totp-preview" v-if="showCountdown">
            <el-progress
              :percentage="totpProgress"
              :stroke-width="6"
              :show-text="false"
              status="exception"
            />
            <span class="totp-time">{{ totpTime }}</span>
          </div>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="邮箱验证" name="email" v-if="showEmail">
        <el-form :model="emailForm" :rules="emailRules" ref="emailFormRef">
          <el-form-item prop="code">
            <el-input
              v-model="emailForm.code"
              placeholder="请输入6位验证码"
              maxlength="6"
              :prefix-icon="Message"
              @input="handleEmailInput"
            />
          </el-form-item>
          <div class="code-tips">
            <span>验证码已发送至: {{ maskedEmail }}</span>
            <el-button
              link
              type="primary"
              @click="handleResendEmail"
              :disabled="emailCountdown > 0"
            >
              {{ emailCountdown > 0 ? `${emailCountdown}秒后重发` : '重新发送' }}
            </el-button>
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <div class="mfa-actions">
      <el-button @click="handleCancel">{{ cancelText }}</el-button>
      <el-button type="primary" @click="handleVerify" :loading="loading" :disabled="!canVerify">
        {{ verifyText }}
      </el-button>
    </div>

    <div class="mfa-trust" v-if="showTrustDevice">
      <el-checkbox v-model="trustDevice">信任此设备，30天内免验证</el-checkbox>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Lock, Message } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

interface Props {
  title?: string
  description?: string
  showCode?: boolean
  showAuthenticator?: boolean
  showEmail?: boolean
  showTrustDevice?: boolean
  phone?: string
  email?: string
  cancelText?: string
  verifyText?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '身份验证',
  description: '为保护您的账户安全，请完成身份验证',
  showCode: true,
  showAuthenticator: true,
  showEmail: true,
  showTrustDevice: true,
  cancelText: '取消',
  verifyText: '验证',
})

const emit = defineEmits<{
  verify: [code: string, trustDevice: boolean]
  cancel: []
  sendCode: []
  sendEmail: []
}>()

const activeTab = ref('code')
const loading = ref(false)
const trustDevice = ref(false)
const countdown = ref(0)
const emailCountdown = ref(0)
const totpTime = ref(30)
const totpProgress = ref(100)
let countdownTimer: ReturnType<typeof setInterval> | null = null
let totpTimer: ReturnType<typeof setInterval> | null = null

const codeFormRef = ref<FormInstance>()
const totpFormRef = ref<FormInstance>()
const emailFormRef = ref<FormInstance>()

const codeForm = ref({ code: '' })
const totpForm = ref({ code: '' })
const emailForm = ref({ code: '' })

const maskedPhone = computed(() => {
  if (!props.phone) return ''
  return props.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
})

const maskedEmail = computed(() => {
  if (!props.email) return ''
  const [username, domain] = props.email.split('@')
  if (!username || !domain) return props.email
  return `${username.substring(0, 3)}***@${domain}`
})

const canVerify = computed(() => {
  if (activeTab.value === 'code') {
    return codeForm.value.code.length === 6
  } else if (activeTab.value === 'authenticator') {
    return totpForm.value.code.length === 6
  } else if (activeTab.value === 'email') {
    return emailForm.value.code.length === 6
  }
  return false
})

const codeRules: FormRules = {
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' },
  ],
}

const totpRules: FormRules = {
  code: [
    { required: true, message: '请输入动态口令', trigger: 'blur' },
    { len: 6, message: '动态口令为6位数字', trigger: 'blur' },
  ],
}

const emailRules: FormRules = {
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' },
  ],
}

const handleCodeInput = () => {
  codeForm.value.code = codeForm.value.code.replace(/\D/g, '').slice(0, 6)
}

const handleTotpInput = () => {
  totpForm.value.code = totpForm.value.code.replace(/\D/g, '').slice(0, 6)
}

const handleEmailInput = () => {
  emailForm.value.code = emailForm.value.code.replace(/\D/g, '').slice(0, 6)
}

const handleResend = () => {
  if (countdown.value > 0) return
  emit('sendCode')
  ElMessage.success('验证码已重新发送')
  countdown.value = 60
  startCountdown()
}

const handleResendEmail = () => {
  if (emailCountdown.value > 0) return
  emit('sendEmail')
  ElMessage.success('验证码已重新发送')
  emailCountdown.value = 60
  startEmailCountdown()
}

const startCountdown = () => {
  if (countdownTimer) clearInterval(countdownTimer)
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer!)
    }
  }, 1000)
}

const startEmailCountdown = () => {
  if (countdownTimer) clearInterval(countdownTimer)
  countdownTimer = setInterval(() => {
    emailCountdown.value--
    if (emailCountdown.value <= 0) {
      clearInterval(countdownTimer!)
    }
  }, 1000)
}

const startTotpCountdown = () => {
  const updateTotp = () => {
    const now = Math.floor(Date.now() / 1000)
    totpTime.value = 30 - (now % 30)
    totpProgress.value = (totpTime.value / 30) * 100
  }
  updateTotp()
  if (totpTimer) clearInterval(totpTimer)
  totpTimer = setInterval(updateTotp, 1000)
}

const handleVerify = async () => {
  if (!canVerify.value) {
    ElMessage.warning('请输入完整的验证码')
    return
  }

  loading.value = true

  try {
    let code = ''
    if (activeTab.value === 'code') {
      await codeFormRef.value?.validate()
      code = codeForm.value.code
    } else if (activeTab.value === 'authenticator') {
      await totpFormRef.value?.validate()
      code = totpForm.value.code
    } else if (activeTab.value === 'email') {
      await emailFormRef.value?.validate()
      code = emailForm.value.code
    }

    emit('verify', code, trustDevice.value)
  } catch (error) {
    // 验证失败
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
}

const resetForm = () => {
  codeForm.value.code = ''
  totpForm.value.code = ''
  emailForm.value.code = ''
}

onMounted(() => {
  startCountdown()
  if (props.showAuthenticator) {
    startTotpCountdown()
  }
})

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
  if (totpTimer) clearInterval(totpTimer)
})

defineExpose({
  resetForm,
  startCountdown,
})
</script>

<style scoped lang="scss">
.mfa-verification {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;

  .mfa-header {
    text-align: center;
    margin-bottom: 30px;

    h3 {
      margin: 16px 0 8px;
      font-size: 20px;
      color: #303133;
    }

    p {
      color: #909399;
      font-size: 14px;
    }
  }

  .mfa-tabs {
    :deep(.el-tabs__content) {
      padding: 20px 0;
    }
  }

  .code-tips,
  .totp-tips {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    color: #909399;
    margin-top: 8px;
  }

  .totp-preview {
    margin-top: 20px;
    position: relative;

    .totp-time {
      position: absolute;
      right: 0;
      top: -20px;
      font-size: 12px;
      color: #909399;
    }
  }

  .mfa-actions {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 24px;
  }

  .mfa-trust {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
