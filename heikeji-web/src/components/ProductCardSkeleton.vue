<script setup lang="ts">
import Skeleton from './Skeleton.vue'

interface ProductCardSkeletonProps {
  count?: number
  showImage?: boolean
  showActions?: boolean
}

const props = withDefaults(defineProps<ProductCardSkeletonProps>(), {
  count: 1,
  showImage: true,
  showActions: true,
})
</script>

<template>
  <div class="product-card-skeleton-grid">
    <div v-for="i in count" :key="i" class="product-card-skeleton">
      <Skeleton 
        v-if="showImage"
        variant="rectangular"
        height="180px"
        class="product-card-skeleton__image"
      />
      
      <div class="product-card-skeleton__body">
        <Skeleton variant="text" height="16px" width="80%" />
        <Skeleton variant="text" height="14px" width="40%" style="margin-top: 8px;" />
        
        <div class="product-card-skeleton__price-row">
          <Skeleton variant="text" height="24px" width="80px" />
          <Skeleton variant="text" height="14px" width="60px" />
        </div>

        <div v-if="showActions" class="product-card-skeleton__actions">
          <Skeleton variant="rectangular" height="32px" width="80px" rounded />
          <Skeleton variant="circular" :width="32" :height="32" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card-skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 16px 0;
}

.product-card-skeleton {
  background: white;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-card-skeleton__image {
  border-radius: 8px;
}

.product-card-skeleton__body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.product-card-skeleton__price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 8px;
}

.product-card-skeleton__actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

@media (max-width: 768px) {
  .product-card-skeleton-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
  }

  .product-card-skeleton {
    padding: 8px;
  }
}
</style>
