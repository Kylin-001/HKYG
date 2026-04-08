<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showText: true,
  clickable: true
})

const router = useRouter()

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'w-8 h-8 text-[10px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-12 h-12 text-sm'
  }
  return sizes[props.size]
})

const textSizeClasses = computed(() => {
  const sizes = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm'
  }
  return sizes[props.size]
})

function handleClick() {
  if (props.clickable) {
    router.push('/')
  }
}
</script>

<template>
  <div 
    class="usth-logo-wrapper flex items-center gap-2.5 shrink-0 group"
    :class="{ 'cursor-pointer': clickable }"
    @click="handleClick"
  >
    <div 
      :class="['usth-logo rounded-xl bg-gradient-to-br from-primary via-primary-light to-primary-400 flex items-center justify-center shadow-brand group-hover:shadow-lg group-hover:scale-105 transition-all duration-300 relative overflow-hidden', sizeClasses]"
    >
      <span :class="['text-white font-bold tracking-tight', textSizeClasses]">黑科</span>
      <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
    </div>
    
    <div v-if="showText" class="hidden sm:flex flex-col">
      <span class="font-bold text-lg bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent leading-none">黑科易购</span>
      <span class="text-[9px] text-text-tertiary tracking-widest mt-0.5">HLJUST CAMPUS</span>
    </div>
  </div>
</template>

<style scoped>
.usth-logo-wrapper {
  user-select: none;
}

.usth-logo {
  position: relative;
}

.motto-text {
  position: relative;
  letter-spacing: 0.2em;
}
</style>
