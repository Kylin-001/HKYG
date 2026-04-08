<script setup lang="ts">
/**
 * 404 错误页面 - 品牌化UI升级 v3.0
 * 黑科易购校园服务平台 (HLJUST Campus Mall)
 *
 * 设计特点：
 * - 品牌渐变背景 + 几何图案装饰
 * - 超大404数字（渐变文字 + 浮动动画）
 * - SVG插画（迷失的人物场景）
 * - 友好的错误提示文案
 * - 倒计时自动跳转功能
 * - 趣味文案随机切换
 * - 完整的响应式适配和可访问性支持
 */
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// ====== 倒计时自动跳转 ======
const countdown = ref(10)
let timer: ReturnType<typeof setInterval> | null = null

function startCountdown() {
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      goHome()
    }
  }, 1000)
}

function stopCountdown() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

// ====== 趣味文案池 ======
const funMessages = [
  '页面走丢了，可能去食堂买饭了',
  '哎呀！这个页面玩失踪了',
  '404 - 页面已离家出走',
  '迷路了？别担心，我们带你回家',
  '这个页面好像被外星人绑架了',
  '页面不存在，但你的笑容还在',
  'Oops！页面掉进黑洞里了'
]

const currentMessage = ref(funMessages[0])

function getRandomMessage() {
  const randomIndex = Math.floor(Math.random() * funMessages.length)
  currentMessage.value = funMessages[randomIndex]
}

// ====== 导航函数 ======
function goHome() {
  stopCountdown()
  router.push('/')
}

function goBack() {
  stopCountdown()
  router.back()
}

// ====== 生命周期 ======
onMounted(() => {
  getRandomMessage()
  startCountdown()
})

onUnmounted(() => {
  stopCountdown()
})
</script>

<template>
  <!-- 主容器：全屏居中布局 -->
  <main
    class="error-page-container"
    role="main"
    aria-label="404 页面未找到"
  >
    <!-- 背景装饰层 -->
    <div class="background-decoration" aria-hidden="true">
      <!-- 几何图案：网格线 -->
      <div class="grid-pattern"></div>
      <!-- 浮动圆形装饰 -->
      <div class="floating-shapes">
        <div class="shape circle-1"></div>
        <div class="shape circle-2"></div>
        <div class="shape circle-3"></div>
        <div class="shape dot-grid"></div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-wrapper">
      <!-- 404 数字展示区 -->
      <div class="error-code-section" aria-hidden="true">
        <h1 class="error-code">404</h1>
        <!-- 装饰性下划线 -->
        <div class="code-underline"></div>
      </div>

      <!-- SVG 插画区域：迷失场景 -->
      <div class="illustration-section" aria-hidden="true">
        <svg
          class="lost-illustration"
          viewBox="0 0 400 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <!-- 背景地面 -->
          <ellipse cx="200" cy="260" rx="180" ry="20" fill="var(--color-primary-50)" opacity="0.5"/>

          <!-- 迷路的小人 -->
          <g class="character">
            <!-- 身体 -->
            <circle cx="200" cy="140" r="35" fill="var(--color-primary-200)"/>
            <!-- 头部 -->
            <circle cx="200" cy="90" r="28" fill="var(--color-primary-300)"/>
            <!-- 眼睛（疑惑表情） -->
            <circle cx="190" cy="85" r="3" fill="var(--color-text-primary)"/>
            <circle cx="210" cy="85" r="3" fill="var(--color-text-primary)"/>
            <!-- 疑问号 -->
            <text x="195" y="108" font-size="20" fill="var(--color-text-primary)" font-weight="bold">?</text>
            <!-- 手臂（摊手姿势） -->
            <line x1="165" y1="145" x2="145" y2="160" stroke="var(--color-primary-300)" stroke-width="6" stroke-linecap="round"/>
            <line x1="235" y1="145" x2="255" y2="160" stroke="var(--color-primary-300)" stroke-width="6" stroke-linecap="round"/>
            <!-- 腿 -->
            <line x1="185" y1="175" x2="175" y2="210" stroke="var(--color-primary-300)" stroke-width="6" stroke-linecap="round"/>
            <line x1="215" y1="175" x2="225" y2="210" stroke="var(--color-primary-300)" stroke-width="6" stroke-linecap="round"/>
          </g>

          <!-- 破碎的链接/路径 -->
          <g class="broken-path">
            <path d="M 80 200 Q 120 180, 140 200 T 200 195" stroke="var(--color-gold)" stroke-width="3" stroke-dasharray="8,4" opacity="0.6"/>
            <path d="M 260 195 Q 300 210, 320 190" stroke="var(--color-gold)" stroke-width="3" stroke-dasharray="8,4" opacity="0.6"/>
            <!-- 断裂标记 X -->
            <text x="235" y="185" font-size="24" fill="var(--color-crimson)" font-weight="bold" opacity="0.7">×</text>
          </g>

          <!-- 问号装饰 -->
          <g class="question-marks">
            <text x="70" y="130" font-size="32" fill="var(--color-primary-200)" opacity="0.4" font-weight="bold">?</text>
            <text x="310" y="150" font-size="24" fill="var(--color-primary-200)" opacity="0.3" font-weight="bold">?</text>
            <text x="100" y="240" font-size="20" fill="var(--color-gold-light)" opacity="0.5" font-weight="bold">?</text>
            <text x="290" y="235" font-size="28" fill="var(--color-primary-100)" opacity="0.4" font-weight="bold">?</text>
          </g>

          <!-- 搜索图标（放大镜） -->
          <g class="search-icon" transform="translate(330, 80)">
            <circle cx="15" cy="15" r="12" stroke="var(--color-primary-300)" stroke-width="3" fill="none"/>
            <line x1="24" y1="24" x2="33" y2="33" stroke="var(--color-primary-300)" stroke-width="3" stroke-linecap="round"/>
          </g>
        </svg>
      </div>

      <!-- 错误信息文案区域 -->
      <div class="message-section">
        <h2 class="error-title">{{ currentMessage }}</h2>
        <p class="error-description">
          您访问的页面不存在或已被移除。<br class="mobile-break"/>
          请检查URL是否正确，或者返回首页继续探索。
        </p>

        <!-- 倒计时提示 -->
        <div class="countdown-hint">
          <span class="countdown-text">
            <svg class="clock-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            {{ countdown }}秒后自动返回首页...
          </span>
          <button
            @click="stopCountdown"
            class="cancel-countdown"
            aria-label="取消自动跳转"
            title="取消倒计时"
          >
            取消
          </button>
        </div>
      </div>

      <!-- 操作按钮组 -->
      <div class="action-buttons">
        <button
          @click="goHome"
          class="btn btn-brand btn-primary-action"
          aria-label="返回首页"
        >
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>返回首页</span>
        </button>

        <button
          @click="goBack"
          class="btn btn-secondary btn-back-action"
          aria-label="返回上一页"
        >
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <polyline points="12 19 5 12 12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>返回上页</span>
        </button>
      </div>

      <!-- 快速链接区域 -->
      <nav class="quick-links" aria-label="快速导航">
        <p class="links-title">您可能正在寻找...</p>
        <div class="links-grid">
          <router-link to="/products" class="quick-link">
            <svg class="link-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2"/>
              <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>商品商城</span>
          </router-link>

          <router-link to="/takeout" class="quick-link">
            <svg class="link-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>外卖订餐</span>
          </router-link>

          <router-link to="/student-affairs" class="quick-link">
            <svg class="link-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <polyline points="10 9 9 9 8 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>学工办理</span>
          </router-link>

          <router-link to="/payment" class="quick-link link-highlight-gold">
            <svg class="link-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
              <line x1="1" y1="10" x2="23" y2="10" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>缴费中心</span>
          </router-link>

          <router-link to="/campus/schedule" class="quick-link">
            <svg class="link-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
              <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>
            </svg>
            <span>校园服务</span>
          </router-link>

          <router-link to="/secondhand" class="quick-link">
            <svg class="link-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="9" cy="21" r="1" stroke="currentColor" stroke-width="2"/>
              <circle cx="20" cy="21" r="1" stroke="currentColor" stroke-width="2"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>二手市场</span>
          </router-link>

          <router-link to="/announcements" class="quick-link link-highlight-info">
            <svg class="link-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>信息公告</span>
          </router-link>

          <router-link to="/community/forum" class="quick-link">
            <svg class="link-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>社区论坛</span>
          </router-link>

          <router-link to="/help" class="quick-link link-highlight-gold">
            <svg class="link-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>帮助中心</span>
          </router-link>
        </div>
      </nav>

      <!-- 有用提示区域 -->
      <aside class="helpful-tips" aria-label="故障排除建议">
        <details class="tips-details">
          <summary class="tips-summary">
            <svg class="tips-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="12" y1="8" x2="12.01" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>遇到问题？查看解决建议</span>
          </summary>
          <ul class="tips-list">
            <li>检查浏览器地址栏的URL拼写是否正确</li>
            <li>尝试使用网站搜索功能查找内容</li>
            <li>清除浏览器缓存和Cookie后重试</li>
            <li>如果问题持续存在，请联系客服支持</li>
          </ul>
        </details>
      </aside>
    </div>
  </main>
</template>

<style scoped>
/* ============================================
   404 页面样式 - 品牌化设计系统 v3.0
   使用 CSS Custom Properties 实现主题切换
   ============================================ */

/* ====== 主容器 ====== */
.error-page-container {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background-color: var(--color-background);
  overflow: hidden;
  isolation: isolate; /* 创建新的层叠上下文 */
}

/* ====== 背景装饰层 ====== */
.background-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: var(--z-base);
}

/* 网格图案背景 */
.grid-pattern {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--color-border-subtle) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-border-subtle) 1px, transparent 1px);
  background-size: 60px 60px;
  opacity: 0.4;
  mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
}

/* 品牌渐变叠加 */
.grid-pattern::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--gradient-primary);
  opacity: 0.03;
}

/* 浮动形状装饰 */
.floating-shapes {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.shape {
  position: absolute;
  border-radius: 50%;
  will-change: transform;
}

.circle-1 {
  width: 400px;
  height: 400px;
  top: -10%;
  right: -5%;
  background: var(--gradient-primary);
  opacity: 0.04;
  animation: float-slow 20s ease-in-out infinite;
}

.circle-2 {
  width: 300px;
  height: 300px;
  bottom: -10%;
  left: -8%;
  background: var(--gradient-gold);
  opacity: 0.05;
  animation: float-slow 25s ease-in-out infinite reverse;
}

.circle-3 {
  width: 200px;
  height: 200px;
  top: 40%;
  left: 10%;
  background: var(--color-primary-200);
  opacity: 0.06;
  animation: float-medium 18s ease-in-out infinite;
}

/* 点阵装饰 */
.dot-grid {
  width: 150px;
  height: 150px;
  bottom: 20%;
  right: 15%;
  background-image: radial-gradient(circle, var(--color-primary-200) 2px, transparent 2px);
  background-size: 20px 20px;
  opacity: 0.3;
  animation: float-fast 15s ease-in-out infinite;
}

/* ====== 内容包装器 ====== */
.content-wrapper {
  position: relative;
  z-index: var(--z-content);
  max-width: 800px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 1.5rem;
}

/* ====== 404 数字展示区 ====== */
.error-code-section {
  position: relative;
  margin-bottom: 1rem;
  animation: fade-in-scale 600ms var(--ease-out) both;
}

.error-code {
  font-size: clamp(6rem, 15vw, 12rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.04em;
  background: var(--gradient-primary-deep);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  user-select: none;
  /* 持续浮动动画 */
  animation:
    fade-in-scale 600ms var(--ease-out) both,
    float-y 3s ease-in-out infinite;
  will-change: transform;
}

/* 404数字下方的装饰线 */
.code-underline {
  width: 120px;
  height: 4px;
  margin: 0.5rem auto 0;
  background: var(--gradient-gold);
  border-radius: 2px;
  opacity: 0.8;
  animation: expand-width 800ms var(--ease-out) 400ms both;
}

/* ====== SVG 插画区域 ====== */
.illustration-section {
  width: 100%;
  max-width: 350px;
  height: auto;
  aspect-ratio: 4 / 3;
  margin-bottom: 2rem;
  animation: fade-in-up 700ms var(--ease-out) 200ms both;
}

.lost-illustration {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 4px 12px rgba(0, 10, 176, 0.08));
}

/* 人物摇摆动画 */
.character {
  transform-origin: center bottom;
  animation: gentle-sway 4s ease-in-out infinite;
}

/* 问号漂浮动画 */
.question-marks text:nth-child(odd) {
  animation: float-question 6s ease-in-out infinite;
}

.question-marks text:nth-child(even) {
  animation: float-question 6s ease-in-out infinite reverse;
}

/* 搜索图标脉冲 */
.search-icon {
  animation: pulse-glow 3s ease-in-out infinite;
}

/* ====== 错误信息文案区域 ====== */
.message-section {
  margin-bottom: 2.5rem;
  animation: fade-in-up 600ms var(--ease-out) 400ms both;
}

.error-title {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
  line-height: 1.3;
}

.error-description {
  font-size: clamp(0.9375rem, 2vw, 1.125rem);
  color: var(--color-text-secondary);
  line-height: 1.75;
  max-width: 480px;
  margin: 0 auto 1.25rem;
}

.mobile-break {
  display: none;
}

/* 倒计时提示 */
.countdown-hint {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1.25rem;
  background: var(--color-surface-tertiary);
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  color: var(--color-text-tertiary);
}

.clock-icon {
  width: 16px;
  height: 16px;
  animation: clock-tick 1s steps(1) infinite;
}

.cancel-countdown {
  padding: 0.25rem 0.75rem;
  font-size: 0.8125rem;
  color: var(--color-text-tertiary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);

  &:hover {
    color: var(--color-text-primary);
    border-color: var(--color-border-strong);
    background: var(--color-surface);
  }

  &:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
  }
}

/* ====== 操作按钮组 ====== */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 420px;
  margin-bottom: 3rem;
  animation: fade-in-up 500ms var(--ease-out) 600ms both;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: center;
  }
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
  min-height: 52px;
  touch-action: manipulation;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: currentColor;
    opacity: 0;
    transition: opacity var(--duration-fast) var(--ease-out);
  }

  &:hover::after {
    opacity: 0.05;
  }

  &:active::after {
    opacity: 0.1;
  }
}

.btn-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* 主按钮：品牌渐变 */
.btn-primary-action {
  flex: 1;
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow-brand);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg), 0 0 20px rgba(0, 10, 176, 0.15);
  }

  &:active {
    transform: translateY(0) scale(0.97);
  }

  &:focus-visible {
    outline: 2px solid white;
    outline-offset: 2px;
  }
}

/* 次要按钮：幽灵风格 */
.btn-back-action {
  flex: 1;
  background: var(--color-surface);
  color: var(--color-text-secondary);
  border: 2px solid var(--color-border);

  &:hover {
    border-color: var(--color-primary-300);
    color: var(--color-primary);
    background: var(--color-primary-25);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  &:active {
    transform: translateY(0) scale(0.97);
  }

  &:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
  }
}

/* ====== 快速链接区域 ====== */
.quick-links {
  width: 100%;
  max-width: 650px;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border-subtle);
  animation: fade-in-up 600ms var(--ease-out) 800ms both;
}

.links-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-text-tertiary);
  margin-bottom: 1rem;
  letter-spacing: 0.02em;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
}

.quick-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: all var(--duration-fast) var(--ease-out);

  .link-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    transition: transform var(--duration-fast) var(--ease-out);
  }

  &:hover {
    color: var(--color-primary);
    border-color: var(--color-primary-200);
    background: var(--color-primary-25);
    text-decoration: none;
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);

    .link-icon {
      transform: scale(1.1);
    }
  }

  &:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
  }

  /* 特殊高亮链接 */
  &.link-highlight-gold:hover {
    color: var(--color-gold-dark);
    border-color: var(--color-gold-light);
    background: var(--color-gold-bg);
  }

  &.link-highlight-info:hover {
    color: var(--color-info-dark);
    border-color: var(--color-info-light);
    background: var(--color-info-bg);
  }
}

/* ====== 有用提示区域 ====== */
.helpful-tips {
  width: 100%;
  max-width: 550px;
  margin-top: 2rem;
  animation: fade-in-up 600ms var(--ease-out) 1000ms both;
}

.tips-details {
  background: var(--color-surface);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--duration-normal) var(--ease-out);

  &[open] {
    border-color: var(--color-primary-200);
    box-shadow: var(--shadow-sm);
  }
}

.tips-summary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  list-style: none;
  user-select: none;
  transition: color var(--duration-fast) var(--ease-out);

  /* 移除默认箭头 */
  &::-webkit-details-marker {
    display: none;
  }

  &::before {
    content: '+';
    margin-right: auto;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text-tertiary);
    transition: transform var(--duration-fast) var(--ease-out);
  }

  &:hover {
    color: var(--color-text-primary);
  }
}

.tips-details[open] .tips-summary::before {
  content: '×';
  transform: rotate(0deg);
}

.tips-icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary);
}

.tips-list {
  margin: 0;
  padding: 0 1.25rem 1rem;
  list-style: none;
}

.tips-list li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text-tertiary);
  line-height: 1.6;

  &::before {
    content: '•';
    position: absolute;
    left: 0.5rem;
    color: var(--color-primary-300);
    font-weight: bold;
  }

  &:last-child {
    margin-bottom: 0;
  }
}

/* ============================================
   动画关键帧定义
   ============================================ */

/* 入场动画：淡入 + 缩放 */
@keyframes fade-in-scale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 入场动画：淡入向上 */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 404数字持续浮动 */
@keyframes float-y {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 装饰线下划线展开 */
@keyframes expand-width {
  from {
    width: 0;
    opacity: 0;
  }
  to {
    width: 120px;
    opacity: 0.8;
  }
}

/* 背景形状慢速浮动 */
@keyframes float-slow {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(30px, -30px) rotate(5deg);
  }
  66% {
    transform: translate(-20px, 20px) rotate(-3deg);
  }
}

/* 中速浮动 */
@keyframes float-medium {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(15px, -25px) scale(1.05);
  }
}

/* 快速浮动 */
@keyframes float-fast {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-20px, 15px);
  }
}

/* 人物轻微摇摆 */
@keyframes gentle-sway {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(2deg);
  }
  75% {
    transform: rotate(-2deg);
  }
}

/* 问号漂浮 */
@keyframes float-question {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-15px) rotate(10deg);
    opacity: 0.6;
  }
}

/* 搜索图标脉冲发光 */
@keyframes pulse-glow {
  0%,
  100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

/* 时钟滴答动画 */
@keyframes clock-tick {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

/* ============================================
   响应式适配
   ============================================ */

/* 小屏幕 (< 640px) */
@media (max-width: 639px) {
  .error-page-container {
    padding: 1.5rem 1rem;
  }

  .content-wrapper {
    padding: 1.5rem 1rem;
  }

  .error-code {
    font-size: clamp(5rem, 20vw, 8rem);
  }

  .illustration-section {
    max-width: 280px;
    margin-bottom: 1.5rem;
  }

  .error-description .mobile-break {
    display: block;
  }

  .action-buttons {
    flex-direction: column;
    max-width: 100%;
  }

  .btn {
    width: 100%;
  }

  .links-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .countdown-hint {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}

/* 中等屏幕 (640px - 1023px) */
@media (min-width: 640px) and (max-width: 1023px) {
  .error-code {
    font-size: clamp(6rem, 12vw, 10rem);
  }

  .illustration-section {
    max-width: 320px;
  }

  .links-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 大屏幕 (>= 1024px) */
@media (min-width: 1024px) {
  .content-wrapper {
    padding: 3rem 2.5rem;
  }

  .links-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* ============================================
   可访问性增强
   ============================================ */

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .error-code {
    animation: none;
  }

  .character,
  .question-marks text,
  .search-icon,
  .shape {
    animation: none;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .error-code {
    -webkit-text-fill-color: var(--color-text-primary);
    background: none;
    text-shadow: 2px 2px 0 var(--color-background);
  }

  .quick-link {
    border-width: 2px;
  }

  .btn-back-action {
    border-width: 2px;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .btn {
    min-height: 56px;
  }

  .quick-link {
    min-height: 48px;
  }
}
</style>
