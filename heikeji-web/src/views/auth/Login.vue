<script setup lang="ts">
/**
 * 黑龙江科技大学 - 现代化登录/注册页面 v3.0
 * 设计系统：Brand Design System v3.0
 * 特性：分屏布局、现代化表单、完整A11y、响应式设计
 */
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

// ====== 设计令牌导入 ======
import {
  lightColorTokens,
  gradients,
  shadows
} from '@/tokens/colors'
import { typographyTokens } from '@/tokens/typography'
import { borderRadiusTokens } from '@/tokens/spacing'
import { animationTokens, transitionPresets } from '@/tokens/animation'

// ====== 路由和状态管理 ======
const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const userStore = useUserStore()

// ====== 响应式状态 ======
const isLoginMode = ref(true) // 登录/注册模式切换
const loading = ref(false)
const showPassword = ref(false)
const agreeToTerms = ref(false)
const formRef = ref()
const pageLoaded = ref(false) // 页面加载状态（用于骨架屏）

// ====== 表单数据 ======
const loginForm = reactive({
  account: '',
  password: '',
  remember: false,
})

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
})

// ====== 计算属性 ======
const accountEmail = computed({
  get: () => isLoginMode.value ? loginForm.account : registerForm.email,
  set: (val: string) => {
    if (isLoginMode.value) {
      loginForm.account = val
    } else {
      registerForm.email = val
    }
  }
})

const passwordField = computed({
  get: () => isLoginMode.value ? loginForm.password : registerForm.password,
  set: (val: string) => {
    if (isLoginMode.value) {
      loginForm.password = val
    } else {
      registerForm.password = val
    }
  }
})

// ====== 表单验证规则 ======
const loginRules = {
  account: [
    { required: true, message: '请输入手机号或邮箱', trigger: 'blur' },
    { min: 3, max: 50, message: '账号长度为3-50位', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20位', trigger: 'blur' },
  ],
}

const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度为2-20位', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  agreeToTerms: [
    {
      validator: (rule: any, value: boolean, callback: Function) => {
        if (!value) {
          callback(new Error('请阅读并同意用户协议'))
        } else {
          callback()
        }
      },
      trigger: 'change',
    },
  ],
}

// ====== 密码强度计算 ======
interface PasswordStrength {
  level: 'weak' | 'medium' | 'strong'
  score: number
  label: string
  color: string
  width: string
}

const passwordStrength = computed<PasswordStrength>(() => {
  const password = isLoginMode.value ? loginForm.password : registerForm.password
  let score = 0

  // 长度检查
  if (password.length >= 6) score++
  if (password.length >= 10) score++

  // 复杂度检查
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  if (score <= 2) {
    return {
      level: 'weak',
      score,
      label: '弱',
      color: lightColorTokens.crimson.DEFAULT,
      width: '33%',
    }
  } else if (score <= 4) {
    return {
      level: 'medium',
      score,
      label: '中',
      color: lightColorTokens.gold.DEFAULT,
      width: '66%',
    }
  } else {
    return {
      level: 'strong',
      score,
      label: '强',
      color: lightColorTokens.pine.DEFAULT,
      width: '100%',
    }
  }
})

// 显示密码强度指示器（仅在密码有内容时）
const showPasswordStrength = computed(() => {
  const password = isLoginMode.value ? loginForm.password : registerForm.password
  return password.length > 0
})

// ====== 当前表单和规则（根据模式切换） ======
const currentForm = computed(() => isLoginMode.value ? loginForm : registerForm)
const currentRules = computed(() => isLoginMode.value ? loginRules : registerRules)

// ====== 事件处理函数 ======

/**
 * 处理登录提交
 * 包含完整的验证、API调用和错误处理流程
 */
async function handleSubmit() {
  if (!formRef.value) return

  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    try {
      loading.value = true

      if (isLoginMode.value) {
        await userStore.login({
          account: loginForm.account,
          password: loginForm.password,
        })
        ElMessage.success('登录成功！')

        const redirect = (route.query.redirect as string) || '/'
        router.push(redirect)
      } else {
        if (!registerForm.agreeToTerms) {
          ElMessage.warning('请先阅读并同意用户协议和隐私政策')
          return
        }
        await userStore.register({
          username: registerForm.username,
          email: registerForm.email,
          password: registerForm.password,
        })
        ElMessage.success('注册成功！请登录')
        isLoginMode.value = true
      }
    } catch (error: any) {
      console.error(isLoginMode.value ? '登录失败:' : '注册失败:', error)
      ElMessage.error(error?.message || (isLoginMode.value ? '登录失败，请重试' : '注册失败，请重试'))
    } finally {
      loading.value = false
    }
  })
}

function handleSocialLogin(provider: string) {
  const providerNames: Record<string, string> = {
    wechat: '微信',
    qq: 'QQ',
    alipay: '支付宝'
  }
  ElMessage.info(`${providerNames[provider] || provider}登录功能即将上线，敬请期待`)
}

/**
 * 切换登录/注册模式
 * 带有平滑过渡动画
 */
function toggleMode() {
  isLoginMode.value = !isLoginMode.value
  // 重置表单验证状态
  formRef.value?.clearValidate()
}

/**
 * 导航到忘记密码页面
 */
function goToForgotPassword() {
  router.push('/auth/forgot-password')
}

/**
 * 切换密码可见性
 */
function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}

// ====== 生命周期钩子 ======
onMounted(() => {
  // 模拟页面加载，用于骨架屏展示
  setTimeout(() => {
    pageLoaded.value = true
  }, 300)
})
</script>

<template>
  <!-- ====== 主容器 - 全屏分屏布局 ====== -->
  <div
    class="auth-page"
    role="main"
    :class="{ 'page-loaded': pageLoaded }"
  >
    <!-- Skip Link - 可访问性：允许键盘用户跳过导航 -->
    <a href="#auth-content" class="skip-link">
      跳转到主要内容
    </a>

    <!-- ====== 左侧品牌展示区（桌面端60%） ====== -->
    <aside class="brand-section" aria-label="品牌信息">
      <!-- 品牌背景装饰 -->
      <div class="brand-background">
        <!-- 几何装饰图案 -->
        <div class="geometric-pattern">
          <div class="geo-circle geo-circle-1"></div>
          <div class="geo-circle geo-circle-2"></div>
          <div class="geo-circle geo-circle-3"></div>
          <div class="geo-square geo-square-1"></div>
          <div class="geo-triangle geo-triangle-1"></div>
        </div>

        <!-- 品牌内容 -->
        <div class="brand-content">
          <!-- 学校Logo -->
          <div class="brand-logo">
            <div class="logo-container">
              <span class="logo-text">黑科</span>
              <div class="logo-glow"></div>
            </div>
            <p class="school-name">黑龙江科技大学</p>
            <p class="school-name-en">HEILONGJIANG UNIVERSITY OF SCIENCE & TECHNOLOGY</p>
          </div>

          <!-- 校训 -->
          <blockquote class="motto" cite="https://www.usth.edu.cn">
            <span class="motto-text">厚德博学</span>
            <span class="motto-divider">·</span>
            <span class="motto-text">强吾兴邦</span>
          </blockquote>

          <!-- 品牌Slogan -->
          <div class="brand-slogan">
            <h2 class="slogan-title">开启智慧校园新生活</h2>
            <p class="slogan-subtitle">
              黑科易购 — 您的一站式校园服务平台<br/>
              连接师生，服务校园，共创未来
            </p>
          </div>

          <!-- 品牌特性列表 -->
          <ul class="features-list" aria-label="平台特性">
            <li class="feature-item">
              <span class="feature-icon" aria-hidden="true">&#10003;</span>
              <span>安全可靠的交易环境</span>
            </li>
            <li class="feature-item">
              <span class="feature-icon" aria-hidden="true">&#10003;</span>
              <span>便捷的校园生活服务</span>
            </li>
            <li class="feature-item">
              <span class="feature-icon" aria-hidden="true">&#10003;</span>
              <span>专属的学生优惠权益</span>
            </li>
          </ul>
        </div>

        <!-- 底部版权信息 -->
        <footer class="brand-footer">
          <p class="copyright">&copy; 1947-{{ new Date().getFullYear() }} 黑龙江科技大学</p>
          <p class="version">黑科易购 v3.0</p>
        </footer>
      </div>
    </aside>

    <!-- ====== 右侧表单区域（桌面端40%） ====== -->
    <section id="auth-content" class="form-section" aria-label="认证表单">
      <div class="form-container">
        <!-- 移动端品牌Header（仅在移动端显示） -->
        <header class="mobile-brand-header">
          <div class="mobile-logo">
            <span>黑科</span>
          </div>
          <h1 class="mobile-title">{{ isLoginMode ? '欢迎回来' : '创建账户' }}</h1>
        </header>

        <!-- 表单卡片 -->
        <div class="form-card">
          <!-- 桌面端标题 -->
          <header class="form-header desktop-only">
            <h2 class="form-title">{{ isLoginMode ? '欢迎回来' : '创建账户' }}</h2>
            <p class="form-subtitle">
              {{ isLoginMode
                ? '登录您的账户以继续使用黑科易购服务'
                : '填写以下信息完成注册，开启校园新体验'
              }}
            </p>
          </header>

          <!-- 模式切换标签 -->
          <div class="mode-switcher" role="tablist" aria-label="登录/注册切换">
            <button
              role="tab"
              :aria-selected="isLoginMode"
              :class="{ active: isLoginMode }"
              @click="toggleMode"
              class="mode-tab"
            >
              登录
            </button>
            <button
              role="tab"
              :aria-selected="!isLoginMode"
              :class="{ active: !isLoginMode }"
              @click="toggleMode"
              class="mode-tab"
            >
              注册
            </button>
            <div
              class="mode-indicator"
              :class="{ 'register-mode': !isLoginMode }"
              aria-hidden="true"
            ></div>
          </div>

          <!-- 登录/注册表单 -->
          <el-form
            ref="formRef"
            :model="currentForm"
            :rules="currentRules"
            label-position="top"
            size="large"
            class="auth-form"
            @submit.prevent="handleSubmit"
          >
            <!-- 用户名字段（仅注册模式） -->
            <el-form-item
              v-if="!isLoginMode"
              prop="username"
              class="form-item-custom"
            >
              <label for="username" class="form-label">
                用户名
                <span class="required-mark" aria-hidden="true">*</span>
              </label>
              <el-input
                id="username"
                v-model="registerForm.username"
                placeholder="请输入用户名"
                prefix-icon="User"
                clearable
                aria-required="true"
                autocomplete="username"
              />
            </el-form-item>

            <!-- 账号字段（登录模式）/ 邮箱字段（注册模式） -->
            <el-form-item
              :prop="isLoginMode ? 'account' : 'email'"
              class="form-item-custom"
            >
              <label :for="isLoginMode ? 'account' : 'email'" class="form-label">
                {{ isLoginMode ? '账号' : '邮箱地址' }}
                <span class="required-mark" aria-hidden="true">*</span>
              </label>
              <el-input
                :id="isLoginMode ? 'account' : 'email'"
                v-model="accountEmail"
                :placeholder="isLoginMode ? '手机号 / 邮箱' : 'example@usth.edu.cn'"
                prefix-icon="User"
                clearable
                aria-required="true"
                :autocomplete="isLoginMode ? 'username' : 'email'"
              />
            </el-form-item>

            <!-- 密码字段 -->
            <el-form-item
              prop="password"
              class="form-item-custom"
            >
              <label for="password" class="form-label">
                密码
                <span class="required-mark" aria-hidden="true">*</span>
              </label>
              <div class="password-input-wrapper">
                <el-input
                  id="password"
                  v-model="passwordField"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="请输入密码"
                  prefix-icon="Lock"
                  aria-required="true"
                  autocomplete="current-password"
                  :aria-describedby="showPasswordStrength ? 'password-strength' : undefined"
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="togglePasswordVisibility"
                  :aria-label="showPassword ? '隐藏密码' : '显示密码'"
                  :aria-pressed="showPassword"
                >
                  <span v-if="showPassword" class="toggle-icon" aria-hidden="true">&#128065;</span>
                  <span v-else class="toggle-icon" aria-hidden="true">&#128064;</span>
                </button>
              </div>

              <!-- 密码强度指示器 -->
              <div
                v-if="showPasswordStrength"
                id="password-strength"
                class="password-strength"
                role="status"
                aria-live="polite"
              >
                <div class="strength-bar">
                  <div
                    class="strength-fill"
                    :style="{
                      width: passwordStrength.width,
                      backgroundColor: passwordStrength.color
                    }"
                  ></div>
                </div>
                <span
                  class="strength-label"
                  :style="{ color: passwordStrength.color }"
                >
                  密码强度：{{ passwordStrength.label }}
                </span>
              </div>
            </el-form-item>

            <!-- 确认密码字段（仅注册模式） -->
            <el-form-item
              v-if="!isLoginMode"
              prop="confirmPassword"
              class="form-item-custom"
            >
              <label for="confirm-password" class="form-label">
                确认密码
                <span class="required-mark" aria-hidden="true">*</span>
              </label>
              <el-input
                id="confirm-password"
                v-model="registerForm.confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                prefix-icon="Lock"
                aria-required="true"
                autocomplete="new-password"
              />
            </el-form-item>

            <!-- 记住我 & 忘记密码（仅登录模式） -->
            <div v-if="isLoginMode" class="form-options">
              <label class="custom-checkbox">
                <input
                  type="checkbox"
                  v-model="loginForm.remember"
                  class="checkbox-input"
                />
                <span class="checkbox-checkmark" aria-hidden="true"></span>
                <span class="checkbox-label">记住我</span>
              </label>
              <button
                type="button"
                @click="goToForgotPassword"
                class="forgot-link"
              >
                忘记密码？
              </button>
            </div>

            <!-- 用户协议（仅注册模式） -->
            <div v-if="!isLoginMode" class="terms-agreement">
              <label class="custom-checkbox">
                <input
                  type="checkbox"
                  v-model="registerForm.agreeToTerms"
                  class="checkbox-input"
                  aria-required="true"
                />
                <span class="checkbox-checkmark" aria-hidden="true"></span>
                <span class="checkbox-label">
                  我已阅读并同意
                  <a href="#" class="terms-link" target="_blank" rel="noopener noreferrer">用户协议</a>
                  和
                  <a href="#" class="terms-link" target="_blank" rel="noopener noreferrer">隐私政策</a>
                </span>
              </label>
            </div>

            <!-- 提交按钮 -->
            <el-button
              type="primary"
              class="submit-btn"
              :loading="loading"
              :disabled="loading"
              @click="handleSubmit"
            >
              <span v-if="!loading" class="btn-text">
                {{ isLoginMode ? '登 录' : '注 册' }}
              </span>
              <span v-else class="btn-loading">
                <span class="loading-spinner" aria-hidden="true"></span>
                处理中...
              </span>
            </el-button>
          </el-form>

          <!-- 分割线 -->
          <div class="divider" role="separator">
            <span class="divider-text">或使用以下方式</span>
          </div>

          <!-- 第三方社交登录 -->
          <div class="social-login" aria-label="第三方登录">
            <button
              type="button"
              class="social-btn wechat"
              aria-label="使用微信登录"
              title="微信登录"
              @click="handleSocialLogin('wechat')"
            >
              <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.062-6.122zM14.18 13.178c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.85 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z"/>
              </svg>
            </button>
            <button
              type="button"
              class="social-btn qq"
              aria-label="使用QQ登录"
              title="QQ登录"
              @click="handleSocialLogin('qq')"
            >
              <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12.003 2c-2.265 0-6.29 1.364-6.29 7.325v1.195S3.55 14.96 3.55 17.474c0 .665.17 1.025.396 1.025.216 0 .484-.33.77-.838.476-.846.91-1.725 1.093-1.956.167-.212.356-.315.57-.315.215 0 .406.103.573.315.183.231.618 1.11 1.094 1.956.286.508.554.838.77.838.226 0 .396-.36.396-1.025 0-2.514-2.164-6.954-2.164-6.954V9.325C6.714 3.364 10.74 2 12.003 2z"/>
                <path d="M12.003 2c2.265 0 6.29 1.364 6.29 7.325v1.195s2.163 4.44 2.163 6.954c0 .665-.17 1.025-.396 1.025-.216 0-.484-.33-.77-.838-.476-.846-.91-1.725-1.093-1.956-.167-.212-.356-.315-.57-.315-.215 0-.406.103-.573.315-.183.231-.618 1.11-1.094 1.956-.286.508-.554.838-.77.838-.226 0-.396-.36-.396-1.025 0-2.514 2.164-6.954 2.164-6.954V9.325C17.292 3.364 13.266 2 12.003 2z"/>
              </svg>
            </button>
            <button
              type="button"
              class="social-btn alipay"
              aria-label="使用支付宝登录"
              title="支付宝登录"
              @click="handleSocialLogin('alipay')"
            >
              <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M21.422 15.358c-3.32-1.326-5.678-2.428-7.063-3.304 1.223-2.055 2.133-4.703 2.534-7.954H13.99V2.5h5.084v1.656h-2.883c-.388 2.536-1.166 4.676-2.158 6.433 1.718.93 4.078 2.135 7.389 3.468v1.301zM4.386 21.5c-.488 0-.934-.187-1.26-.527a1.752 1.752 0 01-.496-1.245V4.272c0-.479.185-.92.516-1.244A1.724 1.724 0 014.386 2.5h7.75v1.656H4.594V19.844h7.542V21.5H4.386z"/>
              </svg>
            </button>
          </div>

          <!-- 底部链接 -->
          <footer class="form-footer">
            <p class="footer-text">
              {{ isLoginMode ? '还没有账号？' : '已有账号？' }}
              <button
                type="button"
                @click="toggleMode"
                class="mode-toggle-link"
              >
                {{ isLoginMode ? '立即注册' : '返回登录' }}
              </button>
            </p>
          </footer>
        </div>
      </div>
    </section>
  </div>
</template>

<!-- ====== 样式部分 - 使用设计令牌系统 ====== -->
<style scoped>
/* ========================================
   CSS变量定义 - 从设计令牌导入
   ======================================== */
:root {
  /* 主要颜色 */
  --color-primary: #000AB0;
  --color-primary-light: #3B82F6;
  --color-primary-50: #DBEAFE;
  --color-primary-100: #BFDBFE;
  --color-primary-300: #60A5FA;

  /* 品牌色 */
  --color-gold: #D97706;
  --color-crimson: #DC2626;
  --color-pine: #16A34A;

  /* 中性色 */
  --color-white: #FFFFFF;
  --color-neutral-50: #F9FAFB;
  --color-neutral-100: #F3F4F6;
  --color-neutral-200: #E5E7EB;
  --color-neutral-300: #D1D5DB;
  --color-neutral-400: #9CA3AF;
  --color-neutral-500: #6B7280;
  --color-neutral-600: #4B5563;
  --color-neutral-700: #374151;
  --color-neutral-800: #1F2937;
  --color-neutral-900: #111827;

  /* 文本色 */
  --text-primary: #111827;
  --text-secondary: #4B5563;
  --text-tertiary: #6B7280;
  --text-inverse: #FFFFFF;

  /* 边框色 */
  --border-subtle: #F3F4F6;
  --border-default: #E5E7EB;
  --border-focus: #3B82F6;

  /* 渐变 */
  --gradient-primary: linear-gradient(135deg, #000AB0 0%, #3B82F6 50%, #60A5FA 100%);
  --gradient-gold: linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #FBBF24 100%);

  /* 阴影 */
  --shadow-card: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-brand: 0 4px 14px rgba(0, 10, 176, 0.2), 0 0 1px rgba(0, 10, 176, 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

  /* 圆角 */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-full: 9999px;

  /* 动画时长 */
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;

  /* 动画曲线 */
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}

/* ========================================
   主容器 - 分屏布局
   ======================================== */
.auth-page {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-neutral-50);
  position: relative;
  overflow: hidden;

  /* 入场动画 */
  opacity: 0;
  transform: translateY(20px);
  transition: opacity var(--duration-slow) var(--ease-out),
              transform var(--duration-slow) var(--ease-out);
}

.auth-page.page-loaded {
  opacity: 1;
  transform: translateY(0);
}

/* Skip Link - 可访问性 */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-primary);
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 0 0 var(--radius-sm) 0;
  z-index: 10000;
  transition: top var(--duration-fast) ease-out;
}

.skip-link:focus {
  top: 0;
}

/* ========================================
   左侧品牌区域
   ======================================== */
.brand-section {
  flex: 0 0 60%;
  max-width: 60%;
  background: var(--gradient-primary);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.brand-background {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3rem 4rem;
  position: relative;
  z-index: 1;
}

/* 几何装饰图案 */
.geometric-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
}

.geo-circle,
.geo-square,
.geo-triangle {
  position: absolute;
  opacity: 0.1;
  animation: float 20s infinite ease-in-out;
}

.geo-circle {
  border-radius: 50%;
  background: white;
}

.geo-circle-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  right: -100px;
  animation-delay: 0s;
}

.geo-circle-2 {
  width: 200px;
  height: 200px;
  bottom: 150px;
  left: 50px;
  animation-delay: -5s;
}

.geo-circle-3 {
  width: 150px;
  height: 150px;
  top: 40%;
  right: 20%;
  animation-delay: -10s;
}

.geo-square {
  width: 120px;
  height: 120px;
  top: 30%;
  left: 10%;
  transform: rotate(45deg);
  background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
  animation-delay: -7s;
}

.geo-triangle {
  width: 0;
  height: 0;
  border-left: 80px solid transparent;
  border-right: 80px solid transparent;
  border-bottom: 140px solid rgba(255, 255, 255, 0.15);
  bottom: 20%;
  right: 15%;
  transform: rotate(-15deg);
  animation-delay: -12s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  33% {
    transform: translateY(-30px) rotate(5deg);
  }
  66% {
    transform: translateY(15px) rotate(-3deg);
  }
}

/* 品牌内容 */
.brand-content {
  position: relative;
  z-index: 2;
  color: white;
  max-width: 600px;
}

/* Logo区域 */
.brand-logo {
  margin-bottom: 3rem;
}

.logo-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-xl);
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
  transition: transform var(--duration-normal) var(--ease-out);
}

.logo-container:hover {
  transform: scale(1.05);
}

.logo-text {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.2));
  pointer-events: none;
}

.school-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  letter-spacing: 0.02em;
}

.school-name-en {
  font-size: 0.75rem;
  opacity: 0.8;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* 校训 */
.motto {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 2rem 0;
  letter-spacing: 0.1em;
  padding-left: 1.5rem;
  border-left: 4px solid rgba(255, 255, 255, 0.5);
}

.motto-divider {
  opacity: 0.5;
}

/* Slogan */
.brand-slogan {
  margin: 2.5rem 0;
}

.slogan-title {
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 1rem;
}

.slogan-subtitle {
  font-size: 1.125rem;
  line-height: 1.7;
  opacity: 0.9;
}

/* 特性列表 */
.features-list {
  list-style: none;
  padding: 0;
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  opacity: 0.95;
}

.feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  font-size: 0.875rem;
  flex-shrink: 0;
}

/* 底部版权 */
.brand-footer {
  position: relative;
  z-index: 2;
  color: white;
  opacity: 0.7;
  font-size: 0.875rem;
}

.copyright {
  margin-bottom: 0.25rem;
}

.version {
  font-size: 0.75rem;
  opacity: 0.6;
}

/* ========================================
   右侧表单区域
   ======================================== */
.form-section {
  flex: 0 0 40%;
  max-width: 40%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--color-white);
  position: relative;
  z-index: 2;
}

.form-container {
  width: 100%;
  max-width: 440px;
}

/* 移动端品牌Header */
.mobile-brand-header {
  display: none;
  text-align: center;
  margin-bottom: 2rem;
}

.mobile-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: var(--gradient-primary);
  color: white;
  border-radius: var(--radius-lg);
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.mobile-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

/* 表单卡片 */
.form-card {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  padding: 2.5rem;
  position: relative;
  overflow: hidden;
}

/* 桌面端标题 */
.form-header {
  margin-bottom: 2rem;
  text-align: center;
}

.form-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.form-subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.6;
}

/* ========================================
   模式切换器
   ======================================== */
.mode-switcher {
  position: relative;
  display: flex;
  background: var(--color-neutral-100);
  border-radius: var(--radius-md);
  padding: 4px;
  margin-bottom: 2rem;
}

.mode-tab {
  flex: 1;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  position: relative;
  z-index: 2;
  transition: color var(--duration-fast) ease-out;
}

.mode-tab.active {
  color: var(--color-primary);
}

.mode-tab:hover:not(.active) {
  color: var(--text-primary);
}

.mode-indicator {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: var(--color-white);
  border-radius: var(--radius-sm);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform var(--duration-normal) var(--ease-out);
  z-index: 1;
}

.mode-indicator.register-mode {
  transform: translateX(100%);
}

/* ========================================
   表单元素自定义样式
   ======================================== */
.auth-form {
  margin-top: 1.5rem;
}

.form-item-custom {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.required-mark {
  color: var(--color-crimson);
  margin-left: 2px;
}

/* Element Plus 输入框覆盖样式 */
:deep(.el-input__wrapper) {
  border-radius: var(--radius-lg) !important;
  border: 2px solid var(--border-default) !important;
  box-shadow: none !important;
  padding: 0.75rem 1rem !important;
  transition: border-color var(--duration-normal) ease-out,
              box-shadow var(--duration-normal) ease-out !important;
  background: var(--color-white) !important;
}

:deep(.el-input__wrapper:hover) {
  border-color: var(--color-primary-300) !important;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: var(--color-primary-300) !important;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 0 0 1px var(--border-focus) !important;
}

:deep(.el-input__inner) {
  font-size: 1rem !important;
  line-height: 1.5 !important;
}

:deep(.el-input__prefix) {
  color: var(--text-tertiary) !important;
  font-size: 1.125rem !important;
}

/* 错误状态 */
:deep(.el-form-item.is-error) .el-input__wrapper {
  border-color: var(--color-crimson) !important;
  animation: shake 0.5s ease-in-out;
}

:deep(.el-form-item.is-error .el-form-item__error) {
  color: var(--color-crimson) !important;
  font-size: 0.8125rem !important;
  padding-top: 0.25rem !important;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

:deep(.el-form-item.is-error .el-form-item__error::before) {
  content: '⚠';
  font-size: 0.875rem;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
}

/* 密码输入包装器 */
.password-input-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  font-size: 1.25rem;
  color: var(--text-tertiary);
  transition: color var(--duration-fast) ease-out;
  z-index: 10;
}

.password-toggle:hover {
  color: var(--text-primary);
}

.toggle-icon {
  display: block;
  line-height: 1;
}

/* 密码强度指示器 */
.password-strength {
  margin-top: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.strength-bar {
  flex: 1;
  height: 4px;
  background: var(--color-neutral-200);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width var(--duration-normal) ease-out,
              background-color var(--duration-normal) ease-out;
}

.strength-label {
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

/* ========================================
   表单选项（记住我、忘记密码）
   ======================================== */
.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

/* 自定义复选框 */
.custom-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
  position: relative;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-default);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-fast) ease-out;
  flex-shrink: 0;
  background: var(--color-white);
}

.checkbox-input:checked + .checkbox-checkmark {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.checkbox-input:checked + .checkbox-checkmark::after {
  content: '✓';
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
}

.checkbox-input:focus-visible + .checkbox-checkmark {
  outline: 2px solid var(--color-primary-300);
  outline-offset: 2px;
}

.checkbox-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.forgot-link {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  text-decoration: none;
  transition: color var(--duration-fast) ease-out;
}

.forgot-link:hover {
  color: var(--color-primary-light);
  text-decoration: underline;
}

/* 用户协议 */
.terms-agreement {
  margin-bottom: 1.5rem;
}

.terms-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color var(--duration-fast) ease-out;
}

.terms-link:hover {
  color: var(--color-primary-light);
  text-decoration: underline;
}

/* ========================================
   提交按钮
   ======================================== */
.submit-btn {
  width: 100%;
  height: 52px !important;
  border-radius: var(--radius-lg) !important;
  font-size: 1rem !important;
  font-weight: 700 !important;
  letter-spacing: 0.05em !important;
  background: var(--gradient-primary) !important;
  border: none !important;
  color: white !important;
  box-shadow: var(--shadow-brand) !important;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all var(--duration-normal) var(--ease-out) !important;
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left var(--duration-slow) ease-out;
}

.submit-btn:hover:not(:disabled)::before {
  left: 100%;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg) !important;
}

.submit-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ========================================
   分割线
   ======================================== */
.divider {
  position: relative;
  margin: 2rem 0;
  text-align: center;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--border-default);
}

.divider-text {
  position: relative;
  display: inline-block;
  padding: 0 1rem;
  background: var(--color-white);
  color: var(--text-tertiary);
  font-size: 0.875rem;
}

/* ========================================
   社交登录按钮
   ======================================== */
.social-login {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.social-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid var(--border-default);
  background: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
  position: relative;
  overflow: hidden;
}

.social-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: currentColor;
  opacity: 0;
  transition: opacity var(--duration-fast) ease-out;
}

.social-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: var(--shadow-lg);
  border-color: currentColor;
}

.social-btn:hover::after {
  opacity: 0.1;
}

.social-btn:active {
  transform: scale(0.95);
}

.social-btn.wechat {
  color: #07C160;
}

.social-btn.qq {
  color: #12B7F5;
}

.social-btn.alipay {
  color: #1677FF;
}

.social-icon {
  width: 24px;
  height: 24px;
  position: relative;
  z-index: 1;
}

/* ========================================
   底部链接
   ======================================== */
.form-footer {
  text-align: center;
  margin-top: 1.5rem;
}

.footer-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.mode-toggle-link {
  background: none;
  border: none;
  color: var(--color-primary);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0;
  margin-left: 0.25rem;
  text-decoration: none;
  transition: all var(--duration-fast) ease-out;
}

.mode-toggle-link:hover {
  color: var(--color-primary-light);
  text-decoration: underline;
}

/* ========================================
   可访问性增强
   ======================================== */
:focus-visible {
  outline: 2px solid var(--color-primary-300);
  outline-offset: 2px;
}

/* 屏幕阅读器专用文本 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* ========================================
   响应式设计
   ======================================== */

/* 平板端（768px - 1023px）*/
@media (max-width: 1023px) {
  .brand-section {
    display: none; /* 隐藏左侧品牌区 */
  }

  .form-section {
    flex: 1 1 100%;
    max-width: 100%;
    padding: 2rem 1rem;
  }

  .form-container {
    max-width: 480px;
  }

  .mobile-brand-header {
    display: block; /* 显示移动端Header */
  }

  .desktop-only {
    display: none; /* 隐藏桌面端标题 */
  }

  .form-card {
    padding: 2rem;
  }
}

/* 移动端（< 768px）*/
@media (max-width: 767px) {
  .auth-page {
    flex-direction: column;
    padding: 0;
  }

  .form-section {
    padding: 1.5rem 1rem;
    min-height: 100vh;
    align-items: flex-start;
    padding-top: 2rem;
  }

  .form-container {
    max-width: 100%;
  }

  .mobile-logo {
    width: 48px;
    height: 48px;
    font-size: 1.25rem;
  }

  .mobile-title {
    font-size: 1.25rem;
  }

  .form-card {
    padding: 1.5rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
  }

  .form-title {
    font-size: 1.5rem;
  }

  .submit-btn {
    height: 48px !important;
    font-size: 0.9375rem !important;
  }

  .social-login {
    gap: 0.75rem;
  }

  .social-btn {
    width: 44px;
    height: 44px;
  }

  /* 触摸目标优化 - 最小44px */
  .custom-checkbox,
  .forgot-link,
  .mode-toggle-link {
    min-height: 44px;
    display: flex;
    align-items: center;
  }

  .mode-tab {
    padding: 1rem 0.75rem;
  }
}

/* 大屏幕优化（≥1536px）*/
@media (min-width: 1536px) {
  .brand-section {
    flex: 0 0 65%;
    max-width: 65%;
  }

  .form-section {
    flex: 0 0 35%;
    max-width: 35%;
  }

  .form-container {
    max-width: 480px;
  }

  .brand-content {
    max-width: 700px;
  }

  .slogan-title {
    font-size: 2.25rem;
  }
}
</style>
