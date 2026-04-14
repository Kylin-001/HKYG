<template>
  <!-- 校园地图轮廓背景 - 用于装饰性展示 -->
  <div class="campus-map-bg" :class="{ 'is-animated': animated }">
    <svg 
      viewBox="0 0 800 600" 
      class="campus-map-svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <!-- 渐变定义 -->
        <linearGradient id="mapGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" :stop-color="primaryColor" stop-opacity="0.08"/>
          <stop offset="100%" :stop-color="primaryColor" stop-opacity="0.02"/>
        </linearGradient>
        <linearGradient id="mapGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" :stop-color="secondaryColor" stop-opacity="0.06"/>
          <stop offset="100%" :stop-color="secondaryColor" stop-opacity="0.01"/>
        </linearGradient>
      </defs>
      
      <!-- 主校区轮廓 - 简化的校园地图形状 -->
      <path 
        class="campus-outline"
        d="M 150 100 
           L 350 80 
           L 550 90 
           L 700 150 
           L 720 300 
           L 680 450 
           L 500 520 
           L 300 500 
           L 120 420 
           L 80 280 
           L 100 150 
           Z"
        fill="url(#mapGradient1)"
        :stroke="primaryColor"
        stroke-width="1"
        stroke-opacity="0.15"
      />
      
      <!-- 内部道路/区域划分 -->
      <path 
        class="campus-road"
        d="M 200 180 L 600 200"
        :stroke="primaryColor"
        stroke-width="2"
        stroke-opacity="0.1"
        stroke-dasharray="8,4"
        fill="none"
      />
      <path 
        class="campus-road"
        d="M 180 300 L 650 320"
        :stroke="primaryColor"
        stroke-width="2"
        stroke-opacity="0.1"
        stroke-dasharray="8,4"
        fill="none"
      />
      <path 
        class="campus-road"
        d="M 350 120 L 380 480"
        :stroke="primaryColor"
        stroke-width="2"
        stroke-opacity="0.1"
        stroke-dasharray="8,4"
        fill="none"
      />
      
      <!-- 主要建筑标记点 -->
      <g class="building-markers">
        <!-- 教学楼 -->
        <circle cx="280" cy="220" r="8" :fill="primaryColor" fill-opacity="0.12"/>
        <circle cx="480" cy="240" r="8" :fill="primaryColor" fill-opacity="0.12"/>
        
        <!-- 图书馆 -->
        <rect x="360" y="280" width="20" height="20" rx="4" :fill="secondaryColor" fill-opacity="0.15"/>
        
        <!-- 体育馆 -->
        <circle cx="580" cy="380" r="12" :fill="primaryColor" fill-opacity="0.1"/>
        
        <!-- 宿舍区 -->
        <rect x="180" y="350" width="16" height="16" rx="2" :fill="primaryColor" fill-opacity="0.08"/>
        <rect x="210" y="360" width="16" height="16" rx="2" :fill="primaryColor" fill-opacity="0.08"/>
        <rect x="190" y="390" width="16" height="16" rx="2" :fill="primaryColor" fill-opacity="0.08"/>
        
        <!-- 食堂 -->
        <polygon points="520,180 540,160 560,180 540,200" :fill="secondaryColor" fill-opacity="0.12"/>
        
        <!-- 校门 -->
        <rect x="100" y="250" width="30" height="6" rx="3" :fill="primaryColor" fill-opacity="0.2"/>
      </g>
      
      <!-- 装饰性连接线 -->
      <g class="connection-lines" stroke-dasharray="4,6">
        <line x1="280" y1="220" x2="370" y2="290" :stroke="primaryColor" stroke-width="1" stroke-opacity="0.08"/>
        <line x1="480" y1="240" x2="370" y2="290" :stroke="primaryColor" stroke-width="1" stroke-opacity="0.08"/>
        <line x1="370" y1="290" x2="580" y2="380" :stroke="primaryColor" stroke-width="1" stroke-opacity="0.08"/>
      </g>
      
      <!-- 外围装饰圆环 -->
      <circle cx="400" cy="300" r="280" :stroke="primaryColor" stroke-width="1" stroke-opacity="0.05" fill="none"/>
      <circle cx="400" cy="300" r="320" :stroke="primaryColor" stroke-width="0.5" stroke-opacity="0.03" fill="none"/>
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
.campus-map-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.campus-map-svg {
  width: 100%;
  height: 100%;
  opacity: 0.6;
}

.campus-outline {
  transform-origin: center;
}

.campus-road {
  stroke-linecap: round;
}

.building-markers circle,
.building-markers rect,
.building-markers polygon {
  transform-box: fill-box;
  transform-origin: center;
  transition: all 0.3s ease;
}

/* 动画效果 */
.is-animated .campus-outline {
  animation: mapPulse 8s ease-in-out infinite;
}

.is-animated .building-markers circle,
.is-animated .building-markers rect,
.is-animated .building-markers polygon {
  animation: buildingGlow 4s ease-in-out infinite;
}

.is-animated .building-markers > *:nth-child(1) { animation-delay: 0s; }
.is-animated .building-markers > *:nth-child(2) { animation-delay: 0.5s; }
.is-animated .building-markers > *:nth-child(3) { animation-delay: 1s; }
.is-animated .building-markers > *:nth-child(4) { animation-delay: 1.5s; }
.is-animated .building-markers > *:nth-child(5) { animation-delay: 2s; }
.is-animated .building-markers > *:nth-child(6) { animation-delay: 2.5s; }
.is-animated .building-markers > *:nth-child(7) { animation-delay: 3s; }
.is-animated .building-markers > *:nth-child(8) { animation-delay: 3.5s; }

@keyframes mapPulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.01);
  }
}

@keyframes buildingGlow {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .campus-map-svg {
    opacity: 0.4;
    transform: scale(1.2);
  }
}
</style>
