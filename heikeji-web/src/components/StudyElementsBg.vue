<template>
  <!-- 学习元素装饰背景 - 书本、铅笔、毕业帽等教育元素 -->
  <div class="study-elements-bg" :class="{ 'is-animated': animated }">
    <svg 
      viewBox="0 0 800 600" 
      class="study-elements-svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <!-- 渐变定义 -->
        <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" :stop-color="primaryColor" stop-opacity="0.1"/>
          <stop offset="100%" :stop-color="primaryColor" stop-opacity="0.03"/>
        </linearGradient>
        <linearGradient id="pencilGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" :stop-color="secondaryColor" stop-opacity="0.12"/>
          <stop offset="100%" :stop-color="secondaryColor" stop-opacity="0.04"/>
        </linearGradient>
      </defs>
      
      <!-- 打开的书本 1 - 左上 -->
      <g class="study-element book" transform="translate(80, 60) rotate(-15)">
        <path 
          d="M 0 20 
             Q 30 5, 60 20 
             L 60 80 
             Q 30 65, 0 80 
             Z"
          fill="url(#bookGradient)"
          :stroke="primaryColor"
          stroke-width="1"
          stroke-opacity="0.12"
        />
        <path 
          d="M 60 20 
             Q 90 5, 120 20 
             L 120 80 
             Q 90 65, 60 80 
             Z"
          fill="url(#bookGradient)"
          :stroke="primaryColor"
          stroke-width="1"
          stroke-opacity="0.12"
        />
        <!-- 书页线条 -->
        <line x1="10" y1="30" x2="50" y2="25" :stroke="primaryColor" stroke-width="0.5" stroke-opacity="0.08"/>
        <line x1="10" y1="40" x2="50" y2="35" :stroke="primaryColor" stroke-width="0.5" stroke-opacity="0.08"/>
        <line x1="10" y1="50" x2="50" y2="45" :stroke="primaryColor" stroke-width="0.5" stroke-opacity="0.08"/>
        <line x1="70" y1="25" x2="110" y2="30" :stroke="primaryColor" stroke-width="0.5" stroke-opacity="0.08"/>
        <line x1="70" y1="35" x2="110" y2="40" :stroke="primaryColor" stroke-width="0.5" stroke-opacity="0.08"/>
        <line x1="70" y1="45" x2="110" y2="50" :stroke="primaryColor" stroke-width="0.5" stroke-opacity="0.08"/>
      </g>
      
      <!-- 打开的书本 2 - 右下 -->
      <g class="study-element book" transform="translate(650, 450) rotate(10)">
        <path 
          d="M 0 20 
             Q 25 8, 50 20 
             L 50 70 
             Q 25 58, 0 70 
             Z"
          fill="url(#bookGradient)"
          :stroke="primaryColor"
          stroke-width="1"
          stroke-opacity="0.1"
        />
        <path 
          d="M 50 20 
             Q 75 8, 100 20 
             L 100 70 
             Q 75 58, 50 70 
             Z"
          fill="url(#bookGradient)"
          :stroke="primaryColor"
          stroke-width="1"
          stroke-opacity="0.1"
        />
      </g>
      
      <!-- 铅笔 - 右侧 -->
      <g class="study-element pencil" transform="translate(700, 150) rotate(25)">
        <rect x="0" y="0" width="12" height="80" rx="2" fill="url(#pencilGradient)" :stroke="secondaryColor" stroke-width="1" stroke-opacity="0.1"/>
        <!-- 笔尖 -->
        <path d="M 0 80 L 6 95 L 12 80 Z" :fill="secondaryColor" fill-opacity="0.15"/>
        <!-- 笔芯 -->
        <path d="M 4 88 L 6 93 L 8 88 Z" :fill="secondaryColor" fill-opacity="0.3"/>
        <!-- 橡皮 -->
        <rect x="0" y="-8" width="12" height="8" rx="1" :fill="primaryColor" fill-opacity="0.1"/>
      </g>
      
      <!-- 毕业帽 - 左下 -->
      <g class="study-element cap" transform="translate(120, 480) rotate(-5)">
        <!-- 帽顶 -->
        <path 
          d="M 0 30 L 50 10 L 100 30 L 50 50 Z"
          fill="url(#bookGradient)"
          :stroke="primaryColor"
          stroke-width="1"
          stroke-opacity="0.12"
        />
        <!-- 帽檐 -->
        <ellipse cx="50" cy="50" rx="50" ry="12" fill="url(#bookGradient)" :stroke="primaryColor" stroke-width="1" stroke-opacity="0.1"/>
        <!-- 流苏 -->
        <line x1="50" y1="10" x2="80" y2="40" :stroke="secondaryColor" stroke-width="1.5" stroke-opacity="0.15"/>
        <circle cx="80" cy="42" r="4" :fill="secondaryColor" fill-opacity="0.2"/>
      </g>
      
      <!-- 笔记本 - 右上 -->
      <g class="study-element notebook" transform="translate(680, 80) rotate(5)">
        <rect x="0" y="0" width="70" height="90" rx="3" fill="url(#bookGradient)" :stroke="primaryColor" stroke-width="1" stroke-opacity="0.1"/>
        <!-- 螺旋装订 -->
        <g :stroke="secondaryColor" stroke-width="2" stroke-opacity="0.15">
          <line x1="8" y1="10" x2="8" y2="15"/>
          <line x1="8" y1="25" x2="8" y2="30"/>
          <line x1="8" y1="40" x2="8" y2="45"/>
          <line x1="8" y1="55" x2="8" y2="60"/>
          <line x1="8" y1="70" x2="8" y2="75"/>
        </g>
        <!-- 横线 -->
        <line x1="18" y1="20" x2="60" y2="20" :stroke="primaryColor" stroke-width="0.5" stroke-opacity="0.08"/>
        <line x1="18" y1="35" x2="60" y2="35" :stroke="primaryColor" stroke-width="0.5" stroke-opacity="0.08"/>
        <line x1="18" y1="50" x2="60" y2="50" :stroke="primaryColor" stroke-width="0.5" stroke-opacity="0.08"/>
        <line x1="18" y1="65" x2="60" y2="65" :stroke="primaryColor" stroke-width="0.5" stroke-opacity="0.08"/>
      </g>
      
      <!-- 尺子和三角板 - 中间偏左 -->
      <g class="study-element ruler" transform="translate(200, 350) rotate(-30)">
        <rect x="0" y="0" width="8" height="100" fill="url(#pencilGradient)" :stroke="secondaryColor" stroke-width="1" stroke-opacity="0.1"/>
        <!-- 刻度 -->
        <g :stroke="secondaryColor" stroke-width="0.5" stroke-opacity="0.1">
          <line x1="0" y1="10" x2="5" y2="10"/>
          <line x1="0" y1="20" x2="5" y2="20"/>
          <line x1="0" y1="30" x2="5" y2="30"/>
          <line x1="0" y1="40" x2="5" y2="40"/>
          <line x1="0" y1="50" x2="5" y2="50"/>
          <line x1="0" y1="60" x2="5" y2="60"/>
          <line x1="0" y1="70" x2="5" y2="70"/>
          <line x1="0" y1="80" x2="5" y2="80"/>
          <line x1="0" y1="90" x2="5" y2="90"/>
        </g>
      </g>
      
      <!-- 三角板 - 中间 -->
      <g class="study-element triangle" transform="translate(550, 300) rotate(15)">
        <path 
          d="M 0 60 L 30 0 L 60 60 Z"
          fill="url(#pencilGradient)"
          :stroke="secondaryColor"
          stroke-width="1"
          stroke-opacity="0.1"
        />
        <!-- 内部小三角 -->
        <path 
          d="M 15 50 L 30 20 L 45 50 Z"
          fill="none"
          :stroke="secondaryColor"
          stroke-width="0.5"
          stroke-opacity="0.08"
        />
      </g>
      
      <!-- 放大镜 - 右中 -->
      <g class="study-element magnifier" transform="translate(600, 200) rotate(-10)">
        <circle cx="25" cy="25" r="22" fill="none" :stroke="primaryColor" stroke-width="2" stroke-opacity="0.1"/>
        <line x1="42" y1="42" x2="55" y2="55" :stroke="primaryColor" stroke-width="3" stroke-opacity="0.12" stroke-linecap="round"/>
        <!-- 镜片反光 -->
        <path d="M 15 15 Q 20 10, 28 12" fill="none" :stroke="secondaryColor" stroke-width="1" stroke-opacity="0.15"/>
      </g>
      
      <!-- 灯泡/灵感 - 左上中 -->
      <g class="study-element bulb" transform="translate(250, 100) rotate(5)">
        <path 
          d="M 20 0 
             C 35 0, 45 12, 45 28 
             C 45 38, 40 45, 35 50 
             L 35 55 
             L 5 55 
             L 5 50 
             C 0 45, -5 38, -5 28 
             C -5 12, 5 0, 20 0 Z"
          fill="url(#bookGradient)"
          :stroke="primaryColor"
          stroke-width="1"
          stroke-opacity="0.1"
        />
        <!-- 灯丝 -->
        <path d="M 12 35 Q 20 25, 28 35" fill="none" :stroke="secondaryColor" stroke-width="1" stroke-opacity="0.15"/>
        <!-- 底座螺纹 -->
        <line x1="8" y1="55" x2="32" y2="55" :stroke="primaryColor" stroke-width="1" stroke-opacity="0.12"/>
        <line x1="10" y1="60" x2="30" y2="60" :stroke="primaryColor" stroke-width="1" stroke-opacity="0.12"/>
      </g>
      
      <!-- 原子/科学符号 - 底部中间 -->
      <g class="study-element atom" transform="translate(400, 520)">
        <circle cx="0" cy="0" r="6" :fill="primaryColor" fill-opacity="0.15"/>
        <!-- 轨道 -->
        <ellipse cx="0" cy="0" rx="35" ry="12" fill="none" :stroke="secondaryColor" stroke-width="1" stroke-opacity="0.1" transform="rotate(0)"/>
        <ellipse cx="0" cy="0" rx="35" ry="12" fill="none" :stroke="secondaryColor" stroke-width="1" stroke-opacity="0.1" transform="rotate(60)"/>
        <ellipse cx="0" cy="0" rx="35" ry="12" fill="none" :stroke="secondaryColor" stroke-width="1" stroke-opacity="0.1" transform="rotate(120)"/>
      </g>
      
      <!-- 小装饰圆点 -->
      <g class="decoration-dots">
        <circle cx="180" cy="200" r="3" :fill="primaryColor" fill-opacity="0.08"/>
        <circle cx="620" cy="350" r="4" :fill="secondaryColor" fill-opacity="0.06"/>
        <circle cx="320" cy="450" r="2" :fill="primaryColor" fill-opacity="0.1"/>
        <circle cx="480" cy="150" r="3" :fill="secondaryColor" fill-opacity="0.08"/>
        <circle cx="150" cy="380" r="2.5" :fill="primaryColor" fill-opacity="0.07"/>
        <circle cx="750" cy="280" r="3" :fill="secondaryColor" fill-opacity="0.05"/>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
interface Props {
  primaryColor?: string
  secondaryColor?: string
  animated?: boolean
}

withDefaults(defineProps<Props>(), {
  primaryColor: '#000ab0',
  secondaryColor: '#3b82f6',
  animated: true
})
</script>

<style scoped>
.study-elements-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.study-elements-svg {
  width: 100%;
  height: 100%;
  opacity: 0.7;
}

.study-element {
  transform-box: fill-box;
  transform-origin: center;
}

/* 动画效果 */
.is-animated .study-element {
  animation: floatElement 6s ease-in-out infinite;
}

.is-animated .book {
  animation-delay: 0s;
}

.is-animated .pencil {
  animation-delay: 1s;
}

.is-animated .cap {
  animation-delay: 2s;
}

.is-animated .notebook {
  animation-delay: 0.5s;
}

.is-animated .ruler {
  animation-delay: 1.5s;
}

.is-animated .triangle {
  animation-delay: 2.5s;
}

.is-animated .magnifier {
  animation-delay: 3s;
}

.is-animated .bulb {
  animation-delay: 0.8s;
}

.is-animated .atom {
  animation: rotateAtom 20s linear infinite;
}

.is-animated .decoration-dots circle {
  animation: dotPulse 3s ease-in-out infinite;
}

.is-animated .decoration-dots circle:nth-child(1) { animation-delay: 0s; }
.is-animated .decoration-dots circle:nth-child(2) { animation-delay: 0.5s; }
.is-animated .decoration-dots circle:nth-child(3) { animation-delay: 1s; }
.is-animated .decoration-dots circle:nth-child(4) { animation-delay: 1.5s; }
.is-animated .decoration-dots circle:nth-child(5) { animation-delay: 2s; }
.is-animated .decoration-dots circle:nth-child(6) { animation-delay: 2.5s; }

@keyframes floatElement {
  0%, 100% {
    transform: translateY(0) rotate(var(--rotation, 0deg));
  }
  50% {
    transform: translateY(-8px) rotate(var(--rotation, 0deg));
  }
}

@keyframes rotateAtom {
  from {
    transform: translate(400px, 520px) rotate(0deg);
  }
  to {
    transform: translate(400px, 520px) rotate(360deg);
  }
}

@keyframes dotPulse {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.3);
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .study-elements-svg {
    opacity: 0.5;
    transform: scale(1.1);
  }
}
</style>
