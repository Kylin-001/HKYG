<template>
  <div class="register-page min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary-light/5 px-4 py-8 relative overflow-hidden">
    <div class="absolute top-0 left-0 w-96 h-96 bg-primary-100/30 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-primary-light/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

    <div class="w-full max-w-md relative z-10 animate-scale-in">
      <!-- Logo区域 -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-primary-light to-primary-400 shadow-brand mb-6 relative overflow-hidden">
          <span class="text-white font-bold text-3xl tracking-tight">黑科</span>
          <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
        </div>
        <h1 class="text-3xl font-bold text-text-primary mb-2">创建账号</h1>
        <p class="text-text-secondary">加入黑科易购，开启校园生活新体验</p>
        <p class="text-[11px] text-text-quaternary mt-2 tracking-wider">HEILONGJIANG UNIVERSITY OF SCIENCE & TECHNOLOGY</p>
      </div>

      <!-- 注册表单 -->
      <div class="bg-surface rounded-2xl shadow-brand p-8 md:p-10">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
          size="large"
          @submit.prevent="handleRegister"
        >
          <el-form-item prop="nickname">
            <el-input
              v-model="form.nickname"
              placeholder="给自己起个名字吧"
              prefix-icon="User"
              maxlength="12"
              show-word-limit
            />
          </el-form-item>

          <el-form-item prop="studentId">
            <el-input
              v-model="form.studentId"
              placeholder="请输入您的学号（用于身份认证）"
              prefix-icon="Postcard"
              maxlength="10"
            />
          </el-form-item>

          <el-form-item prop="phone">
            <el-input
              v-model="form.phone"
              placeholder="请输入手机号"
              prefix-icon="Phone"
              maxlength="11"
            >
              <template #append>
                <button
                  type="button"
                  :disabled="countdown > 0 || !isPhoneValid"
                  @click="sendCode"
                  class="px-4 text-sm font-medium transition-colors disabled:text-text-quaternary disabled:cursor-not-allowed text-primary hover:text-primary-dark"
                >
                  {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
                </button>
              </template>
            </el-input>
          </el-form-item>

          <div class="grid grid-cols-2 gap-4">
            <el-form-item prop="password">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="请设置密码 (6-20位)"
                prefix-icon="Lock"
                show-password
                maxlength="20"
              />
            </el-form-item>
            <el-form-item prop="confirmPwd">
              <el-input
                v-model="form.confirmPwd"
                type="password"
                placeholder="确认密码"
                prefix-icon="Lock"
                show-password
                maxlength="20"
              />
            </el-form-item>
          </div>

          <el-form-item prop="department">
            <el-select v-model="form.department" placeholder="选择所在学院" class="w-full" size="large">
              <el-option
                v-for="dept in departments"
                :key="dept"
                :label="dept"
                :value="dept"
              />
            </el-select>
          </el-form-item>

          <el-form-item prop="agreement">
            <el-checkbox v-model="form.agreement">
              我已阅读并同意
              <a href="#" class="text-primary hover:text-primary-dark font-medium" @click.prevent>《用户服务协议》</a>
              和
              <a href="#" class="text-primary hover:text-primary-dark font-medium" @click.prevent>《隐私政策》</a>
            </el-checkbox>
          </el-form-item>

          <el-button
            type="primary"
            size="large"
            class="w-full !rounded-xl !h-12 !text-base !font-semibold"
            :loading="loading"
            @click="handleRegister"
          >
            {{ loading ? '注册中...' : '立即注册' }}
          </el-button>
        </el-form>

        <!-- 分割线 -->
        <div class="divider-line my-8">
          <span class="divider-text">其他注册方式</span>
        </div>

        <!-- 第三方注册 -->
        <div class="flex justify-center gap-6 mb-6">
          <button class="social-btn" title="微信注册" @click="ElMessage.info('微信注册开发中')">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="#07C160">
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.057-.342-.78-.535-1.64-.535-2.551 0-3.615 3.194-6.543 7.131-6.543.096 0 .186.012.281.014C14.657 4.754 11.985 2.188 8.691 2.188zm9.952 6.123c-3.527 0-6.386 2.609-6.386 5.825 0 3.217 2.859 5.826 6.386 5.826.699 0 1.372-.105 2.004-.297a.697.697 0 01.579.079l1.534.897a.265.265 0 00.135.044c.133 0 .241-.108.241-.239 0-.058-.023-.114-.038-.171l-.315-1.193a.477.477 0 01.172-.536c1.564-1.139 2.553-2.867 2.553-4.81 0-3.216-2.859-5.825-6.386-5.825z"/>
            </svg>
          </button>
          <button class="social-btn" title="QQ注册" @click="ElMessage.info('QQ注册开发中')">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="#12B7F5">
              <path d="M21.395 15.035a39.548 39.548 0 00-.803-2.264l-1.079-2.646c.001-.032.014-.88.014-1.309 0-3.337-1.922-6.013-5.495-6.013-3.573 0-5.495 2.676-5.495 6.013 0 .428.013 1.277.014 1.309l-1.08 2.645a39.544 39.544 0 00-.803 2.264c-1.112 3.638.496 5.298 2.396 5.982.293.106.58.196.862.27-.086.363-.137.74-.137 1.129 0 2.109 1.708 3.817 3.817 3.817s3.817-1.708 3.817-3.817c0-.389-.051-.766-.138-1.129.282-.074.569-.164.862-.27 1.9-.684 3.508-2.344 2.396-5.982zM12 20.953c-1.576 0-2.854-1.278-2.854-2.854 0-.398.082-.777.23-1.121.512.088 1.046.135 1.624.135s1.112-.047 1.624-.135c.148.344.23.723.23 1.121A2.856 2.856 0 0112 20.953z"/>
            </svg>
          </button>
          <button class="social-btn" title="校园卡注册" @click="ElMessage.info('校园卡注册开发中')">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </button>
        </div>

        <!-- 登录提示 -->
        <div class="mt-6 text-center">
          <p class="text-text-secondary text-sm">
            已有账号？
            <router-link to="/auth/login" class="text-primary hover:text-primary-dark font-medium transition-colors">
              立即登录 →
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const formRef = ref()
const countdown = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const form = reactive({
  nickname: '',
  studentId: '',
  phone: '',
  password: '',
  confirmPwd: '',
  department: '' as string,
  agreement: false as boolean | string,
})

const departments = [
  '计算机学院', '软件学院', '电子工程学院', '机械工程学院',
  '材料科学与工程学院', '矿业工程学院', '理学院', '外国语学院',
  '经济管理学院', '人文社会科学学院', '马克思主义学院', '建筑学院',
  '安全工程学院', '环境与化工学院', '自动化学院', '土木工程学院'
]

const isPhoneValid = computed(() => /^1[3-9]\d{9}$/.test(form.phone))

const rules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 12, message: '昵称长度为2-12个字符', trigger: 'blur' },
    {
      validator: (_rule: any, value: string, callback: Function) => {
        if (value && !/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/.test(value)) {
          callback(new Error('昵称只能包含中文、字母、数字和下划线'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  studentId: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { pattern: /^\d{10}$/, message: '请输入正确的10位学号', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请设置密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20位', trigger: 'blur' },
    {
      validator: (_rule: any, value: string, callback: Function) => {
        if (value && !/(?=.*[a-zA-Z])(?=.*\d)/.test(value)) {
          callback(new Error('密码需同时包含字母和数字'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  confirmPwd: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (_rule: any, value: string, callback: Function) => {
        if (value !== form.password) callback(new Error('两次输入的密码不一致'))
        else callback()
      },
      trigger: 'blur'
    }
  ],
  department: [{ required: true, message: '请选择学院', trigger: 'change' }],
  agreement: [{
    validator: (_rule: any, value: any, callback: Function) => {
      if (!value) callback(new Error('请先同意用户协议和隐私政策'))
      else callback()
    }, trigger: 'change'
  }]
}

async function sendCode(): Promise<void> {
  if (!isPhoneValid.value) return

  try {
    countdown.value = 60
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer!)
        timer = null
      }
    }, 1000)

    ElMessage.success(`验证码已发送至 ${form.phone}`)
  } catch (error) {
    console.error('发送验证码失败:', error)
    ElMessage.error('发送失败，请稍后重试')
  }
}

async function handleRegister(): Promise<void> {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    loading.value = true
    const loadingInstance = ElLoading.service({
      lock: true,
      text: '正在创建账号...',
      background: 'rgba(0, 0, 0, 0.7)',
    })

    await new Promise(resolve => setTimeout(resolve, 1500))

    loadingInstance.close()

    ElMessage.success({
      message: '🎉 注册成功！欢迎加入黑科易购',
      duration: 3000,
      showClose: true,
    })

    setTimeout(() => {
      router.push('/auth/login')
    }, 1000)

  } catch (error: any) {
    console.error('注册失败:', error)

    const errorMessage = error?.message || '注册失败，请检查信息后重试'

    ElMessage.error({
      message: errorMessage,
      duration: 3000,
      showClose: true,
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
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

.divider-line {
  position: relative;
  text-align: center;
}

.divider-line::before,
.divider-line::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background: linear-gradient(to right, transparent, #e5e7eb, transparent);
}

.divider-line::before { left: 0; }
.divider-line::after { right: 0; }

.divider-text {
  padding: 0 1rem;
  color: #9ca3af;
  font-size: 0.8125rem;
  background: white;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: 1.5px solid #e5e7eb;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.social-btn:hover {
  border-color: #003B80;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 59, 128, 0.15);
}

.social-btn:active {
  transform: translateY(0);
}
</style>
