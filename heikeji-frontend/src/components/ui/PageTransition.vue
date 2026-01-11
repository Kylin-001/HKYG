<template>
  <transition
    :name="transitionName"
    :mode="mode"
    :duration="duration"
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="afterLeave"
  >
    <slot></slot>
  </transition>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

// 定义过渡动画类型
const transitionTypes = {
  fade: 'fade',
  slide: 'slide',
  scale: 'scale',
  slideFade: 'slide-fade',
  zoom: 'zoom'
} as const

// 定义属性类型
interface Props {
  type?: keyof typeof transitionTypes
  mode?: 'in-out' | 'out-in' | 'default'
  duration?: number
  direction?: 'left' | 'right' | 'up' | 'down'
  route?: RouteLocationNormalized
}

// 定义属性默认值
const props = withDefaults(defineProps<Props>(), {
  type: 'fade',
  mode: 'out-in',
  duration: 300,
  direction: 'left',
  route: undefined
})

// 从provide/inject获取当前路由（如果没有通过props传递）
const injectedRoute = inject<RouteLocationNormalized>('route', undefined)
const currentRoute = props.route || injectedRoute

// 定义关键页面的过渡配置
const pageTransitionConfig = {
  '/dashboard': { type: 'zoom' as const, duration: 400 },
  '/product/list': { type: 'slide' as const, duration: 300, direction: 'right' },
  '/product/add': { type: 'slideFade' as const, duration: 300 },
  '/product/edit': { type: 'slideFade' as const, duration: 300 },
  '/order/list': { type: 'slide' as const, duration: 300, direction: 'left' },
  '/user/list': { type: 'scale' as const, duration: 350 },
  '/login': { type: 'fade' as const, duration: 500 },
  '/404': { type: 'fade' as const, duration: 500 }
}

// 计算当前页面的过渡配置
const pageConfig = computed(() => {
  if (!currentRoute) return {}
  return pageTransitionConfig[currentRoute.path as keyof typeof pageTransitionConfig] || {}
})

// 计算最终的过渡类型
const finalType = computed(() => pageConfig.value.type || props.type)

// 计算最终的过渡方向
const finalDirection = computed(() => (pageConfig.value as any).direction || props.direction)

// 计算最终的过渡时长
const finalDuration = computed(() => pageConfig.value.duration || props.duration)

// 计算实际的过渡名称
const transitionName = computed(() => {
  if (finalType.value === 'slide') {
    return `slide-${finalDirection.value}`
  }
  return finalType.value
})

// 过渡钩子函数
const beforeEnter = (el: HTMLElement) => {
  el.style.setProperty('--transition-duration', `${finalDuration.value}ms`)
  console.log('Transition before-enter')
}

const enter = (el: HTMLElement, done: () => void) => {
  console.log('Transition enter')
  done()
}

const afterEnter = (el: HTMLElement) => {
  console.log('Transition after-enter')
}

const beforeLeave = (el: HTMLElement) => {
  el.style.setProperty('--transition-duration', `${finalDuration.value}ms`)
  console.log('Transition before-leave')
}

const leave = (el: HTMLElement, done: () => void) => {
  console.log('Transition leave')
  done()
}

const afterLeave = (el: HTMLElement) => {
  console.log('Transition after-leave')
}
</script>

<style scoped>
/* 淡入淡出效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-duration, 0.3s) ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 缩放效果 */
.scale-enter-active,
.scale-leave-active {
  transition: all var(--transition-duration, 0.3s) ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* 放大缩小效果 */
.zoom-enter-active,
.zoom-leave-active {
  transition: all var(--transition-duration, 0.3s) cubic-bezier(0.25, 0.8, 0.25, 1);
}

.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* 滑动淡入淡出效果 */
.slide-fade-enter-active {
  transition: all var(--transition-duration, 0.3s) ease;
}

.slide-fade-leave-active {
  transition: all var(--transition-duration, 0.3s) cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

/* 向左滑动 */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all var(--transition-duration, 0.3s) ease;
}

.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* 向右滑动 */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all var(--transition-duration, 0.3s) ease;
}

.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* 向上滑动 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all var(--transition-duration, 0.3s) ease;
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* 向下滑动 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all var(--transition-duration, 0.3s) ease;
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>