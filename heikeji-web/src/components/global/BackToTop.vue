<template>
  <Transition name="back-to-top">
    <button
      v-show="visible"
      class="fixed right-5 bottom-24 md:bottom-8 z-[var(--z-back-to-top)] w-11 h-11 rounded-full bg-white shadow-brand border border-primary-100 flex items-center justify-center text-text-tertiary hover:text-primary hover:border-primary-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-300 group"
      :title="'返回顶部'"
      @click="scrollToTop"
    >
      <el-icon
        :size="20"
        class="group-hover:-translate-y-0.5 transition-transform"
      >
        <Top />
      </el-icon>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Top } from '@element-plus/icons-vue'

const visible = ref(false)

function handleScroll() {
  visible.value = window.scrollY > 300
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.back-to-top-enter-active { transition: all 0.3s ease-out; }
.back-to-top-leave-active { transition: all 0.2s ease-in; }
.back-to-top-enter-from { opacity: 0; transform: scale(0.8) translateY(10px); }
.back-to-top-leave-to { opacity: 0; transform: scale(0.8); }
</style>
