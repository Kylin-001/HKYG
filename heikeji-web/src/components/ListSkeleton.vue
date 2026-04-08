<script setup lang="ts">
import Skeleton from './Skeleton.vue'

interface ListSkeletonProps {
  rows?: number
  showAvatar?: boolean
  showAction?: boolean
  variant?: 'default' | 'compact' | 'detailed'
}

const props = withDefaults(defineProps<ListSkeletonProps>(), {
  rows: 5,
  showAvatar: true,
  showAction: true,
  variant: 'default',
})
</script>

<template>
  <div class="list-skeleton" :class="`list-skeleton--${variant}`">
    <div v-for="i in rows" :key="i" class="list-skeleton-item">
      <Skeleton 
        v-if="showAvatar"
        variant="circular"
        :width="variant === 'compact' ? 36 : 48"
        :height="variant === 'compact' ? 36 : 48"
        class="list-skeleton-item__avatar"
      />

      <div class="list-skeleton-item__content">
        <Skeleton 
          variant="text" 
          :height="variant === 'compact' ? '14px' : '16px'"
          :width="variant === 'detailed' ? '70%' : '85%'"
        />
        <Skeleton 
          v-if="variant !== 'compact'"
          variant="text" 
          height="13px"
          width="55%"
          style="margin-top: 6px;"
        />
        <Skeleton 
          v-if="variant === 'detailed'"
          variant="text" 
          height="12px"
          width="40%"
          style="margin-top: 6px;"
        />
      </div>

      <Skeleton 
        v-if="showAction && variant !== 'compact'"
        variant="rectangular"
        :width="variant === 'detailed' ? 70 : 60"
        :height="28"
        rounded
        class="list-skeleton-item__action"
      />
    </div>
  </div>
</template>

<style scoped>
.list-skeleton {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 12px;
}

.list-skeleton-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.list-skeleton-item:last-child {
  border-bottom: none;
}

.list-skeleton-item__avatar {
  flex-shrink: 0;
}

.list-skeleton-item__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.list-skeleton-item__action {
  flex-shrink: 0;
}

.list-skeleton--compact .list-skeleton-item {
  gap: 10px;
  padding: 6px 0;
}

.list-skeleton--compact .list-skeleton-item__content {
  gap: 2px;
}

.list-skeleton--detailed .list-skeleton-item {
  padding: 12px 0;
  gap: 14px;
}

@media (max-width: 768px) {
  .list-skeleton {
    gap: 12px;
    padding: 12px;
  }

  .list-skeleton-item {
    gap: 10px;
  }
}
</style>
