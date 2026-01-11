<template>
  <div class="stats-card">
    <div class="stats-icon-container" :style="{ background: iconBgStyle }">
      <i :class="['stats-icon', icon]"></i>
    </div>
    <div class="stats-content">
      <h3 class="stats-value">{{ value }}</h3>
      <p class="stats-title">{{ title }}</p>
      <div class="stats-trend" :class="{ positive: trend > 0, negative: trend < 0 }">
        <i :class="trendIcon"></i>
        <span class="trend-value">{{ Math.abs(trend) }}%</span>
        <span class="trend-text">{{ trendText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, withDefaults } from 'vue'

// 定义组件名称
const name = 'StatsCard'

// 定义属性
const props = withDefaults(
  defineProps<{
    icon: string
    title: string
    value: string | number
    trend?: number
    trendIcon?: string
    trendText?: string
  }>(),
  {
    icon: 'el-icon-data-line',
    trend: 0,
    trendIcon: 'el-icon-caret-top',
    trendText: '',
  }
)

// 为不同类型的卡片生成不同的背景色
const iconBgStyle = computed(() => {
  const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  ]
  return colors[Math.abs(props.title.charCodeAt(0)) % colors.length]
})
</script>

<style lang="scss" scoped>
.stats-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }
}

.stats-icon-container {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stats-icon {
  font-size: 28px;
  color: #fff;
}

.stats-content {
  flex: 1;
}

.stats-value {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: #303133;
  line-height: 1.2;
}

.stats-title {
  font-size: 14px;
  color: #909399;
  margin: 6px 0 10px;
}

.stats-trend {
  display: flex;
  align-items: center;
  font-size: 12px;
  &.positive {
    color: #67c23a;
  }
  &.negative {
    color: #f56c6c;
  }
}

.trend-value {
  font-weight: 600;
  margin: 0 4px;
}

.trend-text {
  color: #909399;
}

// 响应式适配
@media screen and (max-width: 768px) {
  .stats-card {
    padding: 16px;
  }

  .stats-icon-container {
    width: 48px;
    height: 48px;
    margin-right: 16px;
  }

  .stats-icon {
    font-size: 24px;
  }

  .stats-value {
    font-size: 20px;
  }
}
</style>
