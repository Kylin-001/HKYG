<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  clickable?: boolean
  useOfficialLogo?: boolean // 是否使用官方校徽
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showText: true,
  clickable: true,
  useOfficialLogo: true // 默认使用官方校徽
})

const router = useRouter()

const logoSizeClasses = computed(() => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
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
    <!-- 官方校徽版本 -->
    <template v-if="useOfficialLogo">
      <img 
        src="/logo-new.png" 
        alt="黑龙江科技大学校徽"
        :class="['usth-logo group-hover:scale-105 transition-all duration-300 object-contain']"
        style="width: 48px; height: 48px;"
      />
    </template>
    
    <!-- 简约文字版本（备用） -->
    <template v-else>
      <div 
        :class="['usth-logo rounded-xl bg-gradient-to-br from-primary via-primary-light to-primary-400 flex items-center justify-center shadow-brand group-hover:shadow-lg group-hover:scale-105 transition-all duration-300 relative overflow-hidden', logoSizeClasses]"
      >
        <span :class="['text-white font-bold tracking-tight', textSizeClasses]">黑科</span>
        <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
      </div>
    </template>
    
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
