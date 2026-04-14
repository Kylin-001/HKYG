<template>
  <!-- 校园建筑轮廓剪影 - 用于 Hero 区域左侧装饰 -->
  <div class="campus-silhouette" :class="{ 'is-animated': animated }">
    <svg 
      viewBox="0 0 400 300" 
      class="silhouette-svg"
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <!-- 渐变定义 - 从底部向上渐隐 -->
        <linearGradient id="silhouetteGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" :stop-color="color" stop-opacity="0.5"/>
          <stop offset="30%" :stop-color="color" stop-opacity="0.25"/>
          <stop offset="60%" :stop-color="color" stop-opacity="0.08"/>
          <stop offset="100%" :stop-color="color" stop-opacity="0"/>
        </linearGradient>
        
        <!-- 窗户发光效果 -->
        <linearGradient id="windowGlow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.2"/>
        </linearGradient>
      </defs>
      
      <!-- 主建筑剪影组 -->
      <g class="buildings-group">
        <!-- 主教学楼/图书馆 - 中央高建筑 -->
        <g class="building main-building">
          <!-- 主体 -->
          <rect x="140" y="80" width="120" height="220" fill="url(#silhouetteGradient)"/>
          <!-- 顶部装饰 -->
          <polygon points="140,80 200,40 260,80" fill="url(#silhouetteGradient)"/>
          <!-- 柱子/装饰线条 -->
          <rect x="155" y="100" width="8" height="180" :fill="color" fill-opacity="0.3"/>
          <rect x="175" y="100" width="8" height="180" :fill="color" fill-opacity="0.3"/>
          <rect x="195" y="100" width="8" height="180" :fill="color" fill-opacity="0.3"/>
          <rect x="215" y="100" width="8" height="180" :fill="color" fill-opacity="0.3"/>
          <rect x="235" y="100" width="8" height="180" :fill="color" fill-opacity="0.3"/>
          <!-- 窗户 -->
          <rect x="160" y="120" width="18" height="25" rx="1" fill="url(#windowGlow)"/>
          <rect x="190" y="120" width="18" height="25" rx="1" fill="url(#windowGlow)"/>
          <rect x="220" y="120" width="18" height="25" rx="1" fill="url(#windowGlow)"/>
          <rect x="160" y="160" width="18" height="25" rx="1" fill="url(#windowGlow)"/>
          <rect x="190" y="160" width="18" height="25" rx="1" fill="url(#windowGlow)"/>
          <rect x="220" y="160" width="18" height="25" rx="1" fill="url(#windowGlow)"/>
        </g>
        
        <!-- 左侧建筑 - 实验楼/教学楼 -->
        <g class="building left-building">
          <rect x="40" y="140" width="90" height="160" fill="url(#silhouetteGradient)"/>
          <!-- 顶部阶梯状 -->
          <rect x="45" y="120" width="80" height="20" fill="url(#silhouetteGradient)"/>
          <rect x="55" y="105" width="60" height="15" fill="url(#silhouetteGradient)"/>
          <!-- 窗户网格 -->
          <rect x="55" y="155" width="12" height="18" rx="1" fill="url(#windowGlow)"/>
          <rect x="75" y="155" width="12" height="18" rx="1" fill="url(#windowGlow)"/>
          <rect x="95" y="155" width="12" height="18" rx="1" fill="url(#windowGlow)"/>
          <rect x="55" y="185" width="12" height="18" rx="1" fill="url(#windowGlow)"/>
          <rect x="75" y="185" width="12" height="18" rx="1" fill="url(#windowGlow)"/>
          <rect x="95" y="185" width="12" height="18" rx="1" fill="url(#windowGlow)"/>
          <rect x="55" y="215" width="12" height="18" rx="1" fill="url(#windowGlow)"/>
          <rect x="75" y="215" width="12" height="18" rx="1" fill="url(#windowGlow)"/>
          <rect x="95" y="215" width="12" height="18" rx="1" fill="url(#windowGlow)"/>
        </g>
        
        <!-- 右侧建筑 - 宿舍楼/体育馆 -->
        <g class="building right-building">
          <rect x="270" y="160" width="100" height="140" fill="url(#silhouetteGradient)"/>
          <!-- 圆顶/体育馆特征 -->
          <path d="M 270 160 Q 320 110, 370 160" fill="url(#silhouetteGradient)"/>
          <!-- 窗户 -->
          <rect x="285" y="180" width="15" height="20" rx="1" fill="url(#windowGlow)"/>
          <rect x="310" y="180" width="15" height="20" rx="1" fill="url(#windowGlow)"/>
          <rect x="335" y="180" width="15" height="20" rx="1" fill="url(#windowGlow)"/>
          <rect x="285" y="215" width="15" height="20" rx="1" fill="url(#windowGlow)"/>
          <rect x="310" y="215" width="15" height="20" rx="1" fill="url(#windowGlow)"/>
          <rect x="335" y="215" width="15" height="20" rx="1" fill="url(#windowGlow)"/>
          <rect x="285" y="250" width="15" height="20" rx="1" fill="url(#windowGlow)"/>
          <rect x="310" y="250" width="15" height="20" rx="1" fill="url(#windowGlow)"/>
          <rect x="335" y="250" width="15" height="20" rx="1" fill="url(#windowGlow)"/>
        </g>
        
        <!-- 远景小建筑 -->
        <g class="building far-building-left">
          <rect x="10" y="200" width="30" height="100" fill="url(#silhouetteGradient)"/>
          <polygon points="10,200 25,180 40,200" fill="url(#silhouetteGradient)"/>
        </g>
        
        <g class="building far-building-right">
          <rect x="370" y="190" width="25" height="110" fill="url(#silhouetteGradient)"/>
          <rect x="365" y="175" width="35" height="15" fill="url(#silhouetteGradient)"/>
        </g>
        
        <!-- 树木剪影 - 点缀 -->
        <g class="trees">
          <!-- 左侧树木 -->
          <circle cx="30" cy="280" r="20" :fill="color" fill-opacity="0.4"/>
          <circle cx="50" cy="285" r="15" :fill="color" fill-opacity="0.3"/>
          <rect x="28" y="280" width="4" height="20" :fill="color" fill-opacity="0.5"/>
          <rect x="48" y="285" width="3" height="15" :fill="color" fill-opacity="0.4"/>
          
          <!-- 右侧树木 -->
          <circle cx="370" cy="275" r="18" :fill="color" fill-opacity="0.35"/>
          <circle cx="385" cy="282" r="12" :fill="color" fill-opacity="0.25"/>
          <rect x="368" y="275" width="4" height="25" :fill="color" fill-opacity="0.45"/>
          
          <!-- 中间点缀树木 -->
          <circle cx="130" cy="290" r="10" :fill="color" fill-opacity="0.3"/>
          <circle cx="270" cy="288" r="12" :fill="color" fill-opacity="0.3"/>
        </g>
        
        <!-- 飞鸟剪影 -->
        <g class="birds" :stroke="color" stroke-width="1.5" stroke-opacity="0.2" fill="none">
          <path d="M 80 60 Q 85 55, 90 60 Q 85 62, 80 60" class="bird"/>
          <path d="M 100 45 Q 105 40, 110 45 Q 105 47, 100 45" class="bird"/>
          <path d="M 300 70 Q 305 65, 310 70 Q 305 72, 300 70" class="bird"/>
        </g>
        
        <!-- 云朵装饰 -->
        <g class="clouds" :fill="color" fill-opacity="0.08">
          <ellipse cx="100" cy="50" rx="25" ry="12"/>
          <ellipse cx="115" cy="45" rx="20" ry="10"/>
          <ellipse cx="85" cy="48" rx="18" ry="9"/>
          
          <ellipse cx="320" cy="55" rx="22" ry="11"/>
          <ellipse cx="335" cy="50" rx="18" ry="9"/>
        </g>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
interface Props {
  color?: string
  animated?: boolean
}

withDefaults(defineProps<Props>(), {
  color: '#ffffff',
  animated: true
})
</script>

<style scoped>
.campus-silhouette {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 55%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.silhouette-svg {
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
}

.building {
  transform-origin: bottom center;
}

/* 动画效果 */
.is-animated .main-building {
  animation: buildingPulse 8s ease-in-out infinite;
}

.is-animated .left-building {
  animation: buildingPulse 8s ease-in-out infinite;
  animation-delay: 0.5s;
}

.is-animated .right-building {
  animation: buildingPulse 8s ease-in-out infinite;
  animation-delay: 1s;
}

.is-animated .bird {
  animation: fly 15s linear infinite;
}

.is-animated .bird:nth-child(1) { animation-delay: 0s; }
.is-animated .bird:nth-child(2) { animation-delay: 3s; }
.is-animated .bird:nth-child(3) { animation-delay: 6s; }

.is-animated .clouds {
  animation: cloudFloat 20s ease-in-out infinite;
}

@keyframes buildingPulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.85;
  }
}

@keyframes fly {
  0% {
    transform: translateX(-50px) translateY(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateX(450px) translateY(-20px);
    opacity: 0;
  }
}

@keyframes cloudFloat {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(20px);
  }
}

/* 窗户闪烁效果 */
.is-animated rect[fill="url(#windowGlow)"] {
  animation: windowTwinkle 4s ease-in-out infinite;
}

.is-animated rect[fill="url(#windowGlow)"]:nth-child(2n) {
  animation-delay: 0.5s;
}

.is-animated rect[fill="url(#windowGlow)"]:nth-child(3n) {
  animation-delay: 1s;
}

@keyframes windowTwinkle {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

/* 响应式 */
@media (max-width: 1024px) {
  .campus-silhouette {
    opacity: 0.6;
  }
  
  .silhouette-svg {
    transform: scale(1.2);
    transform-origin: bottom center;
  }
}

@media (max-width: 768px) {
  .campus-silhouette {
    display: none;
  }
}
</style>
