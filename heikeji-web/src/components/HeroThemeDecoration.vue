<template>
  <!-- Hero 区域主题装饰 - 根据轮播主题显示不同的校园服务元素 -->
  <div class="hero-theme-decoration" :class="[`theme-${theme}`, { 'is-animated': animated }]">
    <svg 
      viewBox="0 0 400 300" 
      class="theme-svg"
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <!-- 渐变定义 -->
        <linearGradient id="themeGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="currentColor" stop-opacity="0.4"/>
          <stop offset="40%" stop-color="currentColor" stop-opacity="0.2"/>
          <stop offset="70%" stop-color="currentColor" stop-opacity="0.05"/>
          <stop offset="100%" stop-color="currentColor" stop-opacity="0"/>
        </linearGradient>
        
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="currentColor" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="currentColor" stop-opacity="0.1"/>
        </linearGradient>
      </defs>
      
      <!-- ========== 主题 1: 黑科易购 - 购物/电商 ========== -->
      <g v-if="theme === 'shopping'" class="theme-group shopping-theme">
        <!-- 购物车 -->
        <g class="element cart" transform="translate(280, 180)">
          <path d="M 10 20 L 20 60 L 60 60 L 70 20 Z" fill="url(#themeGradient)"/>
          <circle cx="20" cy="20" r="15" fill="url(#themeGradient)"/>
          <line x1="5" y1="20" x2="75" y2="20" stroke="currentColor" stroke-width="3" stroke-opacity="0.3"/>
          <circle cx="30" cy="70" r="6" fill="currentColor" fill-opacity="0.4"/>
          <circle cx="55" cy="70" r="6" fill="currentColor" fill-opacity="0.4"/>
        </g>
        
        <!-- 包裹/盒子 -->
        <g class="element package" transform="translate(50, 200)">
          <rect x="0" y="20" width="50" height="50" rx="3" fill="url(#themeGradient)"/>
          <rect x="0" y="20" width="50" height="15" rx="3" fill="currentColor" fill-opacity="0.2"/>
          <line x1="25" y1="20" x2="25" y2="70" stroke="currentColor" stroke-width="2" stroke-opacity="0.25"/>
          <line x1="0" y1="35" x2="50" y2="35" stroke="currentColor" stroke-width="2" stroke-opacity="0.25"/>
        </g>
        
        <!-- 商店建筑 -->
        <g class="element store" transform="translate(150, 150)">
          <rect x="0" y="40" width="100" height="80" fill="url(#themeGradient)"/>
          <polygon points="-10,40 50,10 110,40" fill="url(#themeGradient)"/>
          <rect x="20" y="60" width="25" height="40" rx="2" fill="currentColor" fill-opacity="0.2"/>
          <rect x="55" y="60" width="25" height="40" rx="2" fill="currentColor" fill-opacity="0.2"/>
          <!-- 招牌 -->
          <rect x="15" y="25" width="70" height="12" rx="2" fill="currentColor" fill-opacity="0.3"/>
        </g>
        
        <!-- 漂浮的商品标签 -->
        <g class="floating-tags">
          <rect x="30" y="100" width="35" height="20" rx="10" fill="currentColor" fill-opacity="0.15"/>
          <rect x="320" y="120" width="40" height="20" rx="10" fill="currentColor" fill-opacity="0.15"/>
          <rect x="100" y="80" width="30" height="15" rx="7" fill="currentColor" fill-opacity="0.12"/>
        </g>
      </g>
      
      <!-- ========== 主题 2: 校园外卖 - 餐饮配送 ========== -->
      <g v-if="theme === 'food'" class="theme-group food-theme">
        <!-- 餐盒 -->
        <g class="element lunchbox" transform="translate(260, 190)">
          <rect x="0" y="20" width="60" height="45" rx="5" fill="url(#themeGradient)"/>
          <rect x="5" y="15" width="50" height="8" rx="2" fill="currentColor" fill-opacity="0.25"/>
          <!-- 食物分隔 -->
          <line x1="20" y1="20" x2="20" y2="65" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.2"/>
          <line x1="40" y1="20" x2="40" y2="65" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.2"/>
          <!-- 热气 -->
          <path d="M 15 5 Q 20 0, 15 -5" stroke="currentColor" stroke-width="2" stroke-opacity="0.2" fill="none"/>
          <path d="M 30 5 Q 35 0, 30 -5" stroke="currentColor" stroke-width="2" stroke-opacity="0.2" fill="none"/>
          <path d="M 45 5 Q 50 0, 45 -5" stroke="currentColor" stroke-width="2" stroke-opacity="0.2" fill="none"/>
        </g>
        
        <!-- 餐具 -->
        <g class="element utensils" transform="translate(40, 210)">
          <!-- 筷子 -->
          <line x1="5" y1="0" x2="5" y2="50" stroke="currentColor" stroke-width="3" stroke-opacity="0.3" stroke-linecap="round"/>
          <line x1="15" y1="0" x2="15" y2="50" stroke="currentColor" stroke-width="3" stroke-opacity="0.3" stroke-linecap="round"/>
          <!-- 勺子 -->
          <ellipse cx="35" cy="10" rx="8" ry="10" fill="currentColor" fill-opacity="0.25"/>
          <line x1="35" y1="20" x2="35" y2="50" stroke="currentColor" stroke-width="3" stroke-opacity="0.3"/>
        </g>
        
        <!-- 食堂建筑 -->
        <g class="element cafeteria" transform="translate(140, 140)">
          <rect x="0" y="50" width="110" height="70" fill="url(#themeGradient)"/>
          <polygon points="-5,50 55,20 115,50" fill="url(#themeGradient)"/>
          <!-- 大窗户（食堂特色） -->
          <rect x="15" y="65" width="80" height="35" rx="3" fill="currentColor" fill-opacity="0.15"/>
          <line x1="55" y1="65" x2="55" y2="100" stroke="currentColor" stroke-width="2" stroke-opacity="0.2"/>
          <line x1="15" y1="82" x2="95" y2="82" stroke="currentColor" stroke-width="2" stroke-opacity="0.2"/>
          <!-- 餐具图标 -->
          <circle cx="55" cy="40" r="12" fill="currentColor" fill-opacity="0.2"/>
        </g>
        
        <!-- 配送轨迹 -->
        <g class="delivery-path" stroke="currentColor" stroke-width="2" stroke-opacity="0.15" stroke-dasharray="5,5" fill="none">
          <path d="M 20 150 Q 100 120, 180 140"/>
          <path d="M 350 160 Q 280 130, 200 150"/>
        </g>
      </g>
      
      <!-- ========== 主题 3: AI智慧课堂 - 学习/科技 ========== -->
      <g v-if="theme === 'education'" class="theme-group education-theme">
        <!-- 电脑/笔记本 -->
        <g class="element laptop" transform="translate(250, 170)">
          <rect x="0" y="20" width="70" height="50" rx="3" fill="url(#themeGradient)"/>
          <rect x="5" y="25" width="60" height="35" rx="2" fill="currentColor" fill-opacity="0.15"/>
          <!-- 屏幕内容 -->
          <line x1="12" y1="35" x2="35" y2="35" stroke="currentColor" stroke-width="2" stroke-opacity="0.25"/>
          <line x1="12" y1="42" x2="50" y2="42" stroke="currentColor" stroke-width="2" stroke-opacity="0.25"/>
          <line x1="12" y1="49" x2="40" y2="49" stroke="currentColor" stroke-width="2" stroke-opacity="0.25"/>
          <!-- 键盘底座 -->
          <path d="M -5 70 L 75 70 L 70 85 L 0 85 Z" fill="url(#themeGradient)"/>
        </g>
        
        <!-- 书本堆叠 -->
        <g class="element books" transform="translate(30, 200)">
          <rect x="0" y="30" width="55" height="12" rx="2" fill="currentColor" fill-opacity="0.25"/>
          <rect x="3" y="18" width="50" height="12" rx="2" fill="currentColor" fill-opacity="0.3"/>
          <rect x="0" y="6" width="55" height="12" rx="2" fill="currentColor" fill-opacity="0.35"/>
          <!-- 书脊线条 -->
          <line x1="10" y1="6" x2="10" y2="18" stroke="currentColor" stroke-width="1" stroke-opacity="0.3"/>
          <line x1="10" y1="18" x2="10" y2="30" stroke="currentColor" stroke-width="1" stroke-opacity="0.3"/>
        </g>
        
        <!-- 教学楼/阶梯教室 -->
        <g class="element classroom" transform="translate(130, 130)">
          <rect x="0" y="60" width="120" height="60" fill="url(#themeGradient)"/>
          <polygon points="0,60 60,30 120,60" fill="url(#themeGradient)"/>
          <!-- 阶梯式窗户 -->
          <rect x="10" y="70" width="20" height="15" rx="1" fill="currentColor" fill-opacity="0.2"/>
          <rect x="35" y="70" width="20" height="15" rx="1" fill="currentColor" fill-opacity="0.2"/>
          <rect x="60" y="70" width="20" height="15" rx="1" fill="currentColor" fill-opacity="0.2"/>
          <rect x="85" y="70" width="20" height="15" rx="1" fill="currentColor" fill-opacity="0.2"/>
          <!-- 第二层 -->
          <rect x="20" y="50" width="18" height="12" rx="1" fill="currentColor" fill-opacity="0.15"/>
          <rect x="42" y="50" width="18" height="12" rx="1" fill="currentColor" fill-opacity="0.15"/>
          <rect x="64" y="50" width="18" height="12" rx="1" fill="currentColor" fill-opacity="0.15"/>
          <rect x="86" y="50" width="18" height="12" rx="1" fill="currentColor" fill-opacity="0.15"/>
        </g>
        
        <!-- 知识图谱连线 -->
        <g class="knowledge-nodes" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.2">
          <circle cx="50" cy="100" r="8" fill="currentColor" fill-opacity="0.15"/>
          <circle cx="100" cy="80" r="6" fill="currentColor" fill-opacity="0.15"/>
          <circle cx="150" cy="95" r="7" fill="currentColor" fill-opacity="0.15"/>
          <circle cx="200" cy="75" r="5" fill="currentColor" fill-opacity="0.15"/>
          <line x1="58" y1="100" x2="94" y2="82"/>
          <line x1="106" y1="82" x2="143" y2="93"/>
          <line x1="157" y1="93" x2="195" y2="77"/>
        </g>
        
        <!-- 灯泡/灵感 -->
        <g class="element bulb" transform="translate(340, 90)">
          <path d="M 20 0 C 35 0, 40 12, 40 25 C 40 35, 35 42, 30 48 L 30 55 L 10 55 L 10 48 C 5 42, 0 35, 0 25 C 0 12, 5 0, 20 0" 
                fill="url(#themeGradient)"/>
          <path d="M 12 35 Q 20 28, 28 35" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.3" fill="none"/>
        </g>
      </g>
      
      <!-- ========== 主题 4: 智慧校园 - 数字化服务 ========== -->
      <g v-if="theme === 'campus'" class="theme-group campus-theme">
        <!-- 手机APP -->
        <g class="element smartphone" transform="translate(270, 175)">
          <rect x="0" y="0" width="50" height="90" rx="8" fill="url(#themeGradient)"/>
          <rect x="3" y="8" width="44" height="70" rx="3" fill="currentColor" fill-opacity="0.15"/>
          <!-- 屏幕内容 - 校园服务图标 -->
          <circle cx="15" cy="25" r="6" fill="currentColor" fill-opacity="0.25"/>
          <circle cx="35" cy="25" r="6" fill="currentColor" fill-opacity="0.25"/>
          <circle cx="15" cy="45" r="6" fill="currentColor" fill-opacity="0.25"/>
          <circle cx="35" cy="45" r="6" fill="currentColor" fill-opacity="0.25"/>
          <!-- Home键 -->
          <circle cx="25" cy="82" r="4" fill="currentColor" fill-opacity="0.3"/>
        </g>
        
        <!-- 校园卡 -->
        <g class="element card" transform="translate(35, 210)">
          <rect x="0" y="0" width="60" height="38" rx="4" fill="url(#themeGradient)"/>
          <rect x="5" y="8" width="20" height="6" rx="1" fill="currentColor" fill-opacity="0.25"/>
          <line x1="5" y1="22" x2="45" y2="22" stroke="currentColor" stroke-width="2" stroke-opacity="0.2"/>
          <line x1="5" y1="28" x2="35" y2="28" stroke="currentColor" stroke-width="2" stroke-opacity="0.2"/>
          <!-- 芯片 -->
          <rect x="45" y="25" width="10" height="8" rx="1" fill="currentColor" fill-opacity="0.3"/>
        </g>
        
        <!-- 图书馆 -->
        <g class="element library" transform="translate(140, 125)">
          <rect x="0" y="50" width="120" height="70" fill="url(#themeGradient)"/>
          <polygon points="10,50 60,20 110,50" fill="url(#themeGradient)"/>
          <!-- 大柱子 -->
          <rect x="15" y="55" width="12" height="55" fill="currentColor" fill-opacity="0.2"/>
          <rect x="35" y="55" width="12" height="55" fill="currentColor" fill-opacity="0.2"/>
          <rect x="54" y="55" width="12" height="55" fill="currentColor" fill-opacity="0.2"/>
          <rect x="73" y="55" width="12" height="55" fill="currentColor" fill-opacity="0.2"/>
          <rect x="93" y="55" width="12" height="55" fill="currentColor" fill-opacity="0.2"/>
          <!-- 顶部装饰 -->
          <rect x="45" y="30" width="30" height="15" rx="2" fill="currentColor" fill-opacity="0.25"/>
        </g>
        
        <!-- WiFi信号 -->
        <g class="wifi-signals" transform="translate(60, 100)">
          <path d="M 0 20 Q 15 5, 30 20" stroke="currentColor" stroke-width="2" stroke-opacity="0.2" fill="none"/>
          <path d="M 5 25 Q 15 15, 25 25" stroke="currentColor" stroke-width="2" stroke-opacity="0.25" fill="none"/>
          <circle cx="15" cy="30" r="3" fill="currentColor" fill-opacity="0.3"/>
        </g>
        
        <g class="wifi-signals" transform="translate(340, 130)">
          <path d="M 0 20 Q 15 5, 30 20" stroke="currentColor" stroke-width="2" stroke-opacity="0.15" fill="none"/>
          <path d="M 5 25 Q 15 15, 25 25" stroke="currentColor" stroke-width="2" stroke-opacity="0.2" fill="none"/>
          <circle cx="15" cy="30" r="3" fill="currentColor" fill-opacity="0.25"/>
        </g>
        
        <!-- 数据流动线条 -->
        <g class="data-flow" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.15" fill="none">
          <path d="M 20 180 Q 80 160, 140 170" stroke-dasharray="4,4"/>
          <path d="M 350 200 Q 300 180, 260 190" stroke-dasharray="4,4"/>
        </g>
      </g>
      
      <!-- ========== 通用装饰元素 ========== -->
      <g class="common-decorations">
        <!-- 底部装饰线 -->
        <line x1="0" y1="280" x2="400" y2="280" stroke="currentColor" stroke-width="1" stroke-opacity="0.1"/>
        
        <!-- 小圆点装饰 -->
        <circle cx="20" cy="150" r="3" fill="currentColor" fill-opacity="0.15"/>
        <circle cx="380" cy="180" r="4" fill="currentColor" fill-opacity="0.12"/>
        <circle cx="200" cy="100" r="2" fill="currentColor" fill-opacity="0.2"/>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
interface Props {
  theme: 'shopping' | 'food' | 'education' | 'campus'
  animated?: boolean
}

withDefaults(defineProps<Props>(), {
  animated: true
})
</script>

<style scoped>
.hero-theme-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
  color: inherit;
}

.theme-svg {
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
}

/* 各主题颜色 */
.theme-shopping {
  color: rgba(255, 255, 255, 0.9);
}

.theme-food {
  color: rgba(255, 255, 255, 0.9);
}

.theme-education {
  color: rgba(255, 255, 255, 0.9);
}

.theme-campus {
  color: rgba(255, 255, 255, 0.9);
}

/* 动画效果 */
.is-animated .element {
  animation: elementFloat 5s ease-in-out infinite;
}

.is-animated .cart {
  animation-delay: 0s;
}

.is-animated .package {
  animation-delay: 0.5s;
}

.is-animated .store,
.is-animated .cafeteria,
.is-animated .classroom,
.is-animated .library {
  animation: buildingPulse 6s ease-in-out infinite;
}

.is-animated .lunchbox {
  animation-delay: 0.3s;
}

.is-animated .utensils {
  animation-delay: 0.8s;
}

.is-animated .laptop {
  animation-delay: 0.2s;
}

.is-animated .books {
  animation-delay: 0.6s;
}

.is-animated .smartphone {
  animation-delay: 0.4s;
}

.is-animated .card {
  animation-delay: 0.7s;
}

.is-animated .bulb {
  animation: bulbGlow 3s ease-in-out infinite;
}

.is-animated .wifi-signals {
  animation: wifiPulse 2s ease-in-out infinite;
}

.is-animated .knowledge-nodes circle {
  animation: nodePulse 3s ease-in-out infinite;
}

.is-animated .knowledge-nodes circle:nth-child(1) { animation-delay: 0s; }
.is-animated .knowledge-nodes circle:nth-child(2) { animation-delay: 0.5s; }
.is-animated .knowledge-nodes circle:nth-child(3) { animation-delay: 1s; }
.is-animated .knowledge-nodes circle:nth-child(4) { animation-delay: 1.5s; }

@keyframes elementFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

@keyframes buildingPulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.85;
  }
}

@keyframes bulbGlow {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}

@keyframes wifiPulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

@keyframes nodePulse {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* 响应式 */
@media (max-width: 1024px) {
  .hero-theme-decoration {
    opacity: 0.7;
    height: 50%;
  }
}

@media (max-width: 768px) {
  .hero-theme-decoration {
    display: none;
  }
}
</style>
