<template>
  <div class="page min-h-screen">
    <div class="max-w-screen-xl mx-auto px-4 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-text-primary">我的收藏</h1>
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-400">共 {{ favorites.length }} 件商品</span>
          <button v-if="selectedIds.length > 0" @click="batchDelete" class="px-4 py-1.5 rounded-full text-sm bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
            删除选中 ({{ selectedIds.length }})
          </button>
        </div>
      </div>

      <div v-if="favorites.length > 0" class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 overflow-hidden">
        <div class="p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          <div v-for="item in favorites" :key="item.id"
            :class="['group relative rounded-2xl border overflow-hidden transition-all duration-300 cursor-pointer',
              selectedIds.includes(item.id) ? 'border-indigo-300 ring-2 ring-indigo-100 bg-indigo-50/30' : 'border-gray-100 hover:border-rose-200 hover:shadow-xl']"
            @click="toggleSelect(item.id)">
            <div v-if="isEditMode" class="absolute top-3 left-3 z-10">
              <div :class="['w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all',
                selectedIds.includes(item.id) ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300 bg-white group-hover:border-indigo-300']">
                <svg v-if="selectedIds.includes(item.id)" class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              </div>
            </div>

            <button @click.stop="removeFavorite(item)" class="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/50">
              <el-icon class="text-white text-sm"><Close /></el-icon>
            </button>

            <div class="relative aspect-square overflow-hidden bg-gray-50">
              <img :src="item.image" :alt="item.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>

            <div class="p-3">
              <h3 class="text-sm font-medium text-text-primary line-clamp-2 leading-snug mb-2 group-hover:text-rose-600 transition-colors">{{ item.name }}</h3>
              <div class="flex items-baseline justify-between">
                <span class="font-bold text-base text-red-500">¥{{ item.price }}</span>
                <span class="text-xs text-gray-400 line-through">¥{{ item.originalPrice }}</span>
              </div>
              <div class="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                <span class="text-[11px] text-gray-400">{{ item.soldCount }}人付款</span>
                <button @click.stop="addToCart(item)" class="text-xs px-2.5 py-1 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 font-medium transition-colors">
                  加入购物车
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 py-20 text-center">
        <div class="w-28 h-28 mx-auto mb-5 bg-gradient-to-br from-rose-50 to-pink-50 rounded-full flex items-center justify-center">
          <el-icon :size="48" class="text-rose-300"><Star /></el-icon>
        </div>
        <h3 class="text-lg font-medium text-text-primary mb-2">还没有收藏任何商品</h3>
        <p class="text-sm text-gray-400 mb-6">去发现心仪的商品吧~</p>
        <el-button type="primary" round class="!rounded-full !px-8" @click="$router.push('/')">去逛逛</el-button>
      </div>

      <div class="mt-6 flex justify-center gap-4">
        <button @click="isEditMode = !isEditMode" :class="['px-6 py-2.5 rounded-full text-sm font-medium transition-all',
          isEditMode ? 'bg-indigo-100 text-indigo-600' : 'border border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-500']">
          {{ isEditMode ? '完成管理' : '管理收藏' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Star, Close } from '@element-plus/icons-vue'
import { useCommunityStore } from '@/stores/community'

const communityStore = useCommunityStore()

const isEditMode = ref(false)
const selectedIds = ref<number[]>([])

const favorites = computed(() => communityStore.favorites)

function toggleSelect(id: number) {
  if (!isEditMode.value) return
  const idx = selectedIds.value.indexOf(id)
  if (idx >= 0) selectedIds.value.splice(idx, 1)
  else selectedIds.value.push(id)
}

async function removeFavorite(item: any) {
  try {
    await communityStore.removeFavorite(item.id)
    ElMessage.success('已取消收藏')
  } catch (err: any) {
    ElMessage.error(err.message || '取消收藏失败')
  }
}

function addToCart(item: any) {
  ElMessage.success(`${item.name.substring(0, 15)}... 已加入购物车`)
}

async function batchDelete() {
  try {
    await ElMessageBox.confirm(`确定删除选中的 ${selectedIds.value.length} 个商品吗？`, '批量删除', { confirmButtonText: '确认删除', cancelButtonText: '取消', type: 'warning' })
    for (const id of selectedIds.value) {
      await communityStore.removeFavorite(id)
    }
    selectedIds.value = []
    isEditMode.value = false
    ElMessage.success('批量删除成功')
  } catch (err: any) {
    if (err !== 'cancel') {
      ElMessage.error(err.message || '批量删除失败')
    }
  }
}

onMounted(async () => {
  try {
    await communityStore.fetchFavorites()
  } catch (err: any) {
    ElMessage.error(err.message || '获取收藏列表失败')
  }
})
</script>

<style scoped>
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
