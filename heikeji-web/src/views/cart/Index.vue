<template>
  <div class="page min-h-screen">
    <div class="max-w-screen-xl mx-auto px-4 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-text-primary">{{ t('cart.title') }}</h1>
        <span v-if="cartStore.items.length > 0" class="text-sm text-gray-400">共 {{ cartStore.items.length }} 件商品</span>
      </div>

      <div v-if="cartStore.items.length > 0" class="space-y-5">
        <div v-for="(store, storeIdx) in storeGroups" :key="store.storeId"
          class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 overflow-hidden">
          <div class="px-6 py-3.5 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 border-b border-gray-100 flex items-center gap-3">
            <el-checkbox v-model="store.checked" :indeterminate="store.indeterminate" @change="toggleStore(store)" size="large" />
            <el-icon class="text-indigo-500"><Shop /></el-icon>
            <span class="font-semibold text-text-primary text-sm">{{ store.storeName }}</span>
            <span class="px-2 py-0.5 rounded bg-indigo-100 text-indigo-600 text-[10px] font-medium">官方自营</span>
          </div>

          <div class="divide-y divide-gray-50">
            <div v-for="item in store.items" :key="item.id"
              class="flex items-center gap-4 px-6 py-5 hover:bg-gray-50/30 transition-colors group">
              <el-checkbox v-model="item.checked" @change="updateCheckState(storeIdx)" size="large" />

              <div class="relative w-28 h-28 shrink-0 rounded-xl overflow-hidden bg-gray-50 cursor-pointer" @click="$router.push(`/products/${item.productId}`)">
                <img :src="item.image" :alt="item.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <span v-if="item.tag" class="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold text-white"
                  :class="item.tag === '秒杀' ? 'bg-red-500' : item.tag === '热卖' ? 'bg-orange-500' : 'bg-emerald-500'">
                  {{ item.tag }}
                </span>
              </div>

              <div class="min-w-0 flex-1 min-h-[112px] flex flex-col justify-between py-0.5">
                <div>
                  <h3 class="font-medium text-sm text-text-primary line-clamp-2 leading-snug cursor-pointer hover:text-indigo-600 transition-colors"
                    @click="$router.push(`/products/${item.productId}`)">
                    {{ item.name }}
                  </h3>
                  <p class="text-xs text-gray-400 mt-1 line-clamp-1">{{ item.spec }}</p>
                </div>

                <div class="flex items-end justify-between mt-3">
                  <div class="flex items-baseline gap-2">
                    <span class="text-lg font-bold text-red-500">¥{{ item.price.toFixed(2) }}</span>
                    <span v-if="item.originalPrice > item.price" class="text-xs text-gray-300 line-through">¥{{ item.originalPrice.toFixed(2) }}</span>
                  </div>

                  <div class="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                    <button :disabled="item.quantity <= 1"
                      @click="changeQty(item, -1)"
                      :class="['w-7 h-7 rounded-md flex items-center justify-center text-sm transition-colors',
                        item.quantity <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-white hover:text-red-500']">
                      −
                    </button>
                    <input type="number" v-model.number="item.quantity" min="1" max="99"
                      @change="validateQty(item)"
                      class="w-10 h-7 text-center text-sm font-medium bg-transparent border-none outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                    <button :disabled="item.quantity >= 99"
                      @click="changeQty(item, 1)"
                      :class="['w-7 h-7 rounded-md flex items-center justify-center text-sm transition-colors',
                        item.quantity >= 99 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-white hover:text-red-500']">
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div class="shrink-0 flex flex-col items-end gap-2 ml-2">
                <button @click="moveToFav(item)" class="text-xs text-gray-400 hover:text-orange-500 transition-colors whitespace-nowrap">
                  移入收藏
                </button>
                <button @click="removeItem(item)" class="text-xs text-gray-400 hover:text-red-500 transition-colors whitespace-nowrap">
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 px-6 py-4 sticky bottom-4 z-20">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <el-checkbox v-model="allChecked" :indeterminate="isIndeterminate" @change="toggleAll" size="large">
                <span class="text-sm font-medium">{{ t('cart.allSelected') || '全选' }}</span>
              </el-checkbox>
              <button @click="batchDeleteSelected" :disabled="selectedCount === 0"
                class="text-sm text-gray-400 hover:text-red-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                删除选中 ({{ selectedCount }})
              </button>
              <button @click="clearInvalid" class="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                清理失效
              </button>
            </div>

            <div class="flex items-center gap-6">
              <div class="text-right">
                <p class="text-xs text-gray-400">
                  已选 <span class="text-indigo-600 font-semibold text-base">{{ selectedCount }}</span> 件
                </p>
                <p class="mt-0.5">
                  {{ t('cart.total') || '合计' }}：
                  <span class="text-xl font-bold text-red-500">¥{{ totalPrice.toFixed(2) }}</span>
                </p>
                <p class="text-[11px] text-gray-400" v-if="savedAmount > 0">
                  已省 ¥{{ savedAmount.toFixed(2) }}
                </p>
              </div>
              <button @click="goCheckout"
                :disabled="selectedCount === 0"
                :class="['px-8 py-3 rounded-xl font-bold text-base whitespace-nowrap transition-all duration-300',
                  selectedCount > 0
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed']">
                {{ t('cart.checkout') || '结算' }} ({{ selectedCount }})
              </button>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-5">
          <h3 class="font-bold text-blue-700 mb-3 flex items-center gap-2">💡 猜你喜欢</h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <div v-for="rec in recommendations" :key="rec.id"
              class="bg-white rounded-xl p-2.5 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group"
              @click="addToCart(rec)">
              <div class="aspect-square rounded-lg overflow-hidden bg-gray-50 mb-2">
                <img :src="rec.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <p class="text-xs text-text-primary line-clamp-1 group-hover:text-blue-600 transition-colors">{{ rec.name }}</p>
              <p class="text-xs font-bold text-red-500 mt-1">¥{{ rec.price }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 py-20 text-center">
        <div class="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full flex items-center justify-center relative">
          <el-icon :size="56" class="text-indigo-200"><ShoppingCart /></el-icon>
          <div class="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span class="text-[10px] text-white font-bold">0</span>
          </div>
        </div>
        <h3 class="text-xl font-medium text-text-primary mb-2">{{ t('cart.empty') || '购物车是空的' }}</h3>
        <p class="text-sm text-gray-400 mb-8">{{ t('cart.emptyTip') || '快去挑选心仪的商品吧~' }}</p>
        <div class="flex justify-center gap-4">
          <el-button round class="!rounded-full !px-8" size="large" @click="$router.push('/')">去逛逛</el-button>
          <el-button type="primary" round class="!rounded-full !px-8" size="large" @click="$router.push('/products')">浏览商品</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ShoppingCart, Shop } from '@element-plus/icons-vue'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const { t } = useI18n()
const cartStore = useCartStore()

interface CartItemExt {
  id: number | string
  productId: number | string
  name: string
  spec: string
  image: string
  price: number
  originalPrice: number
  quantity: number
  checked: boolean
  tag?: string
}

const storeGroups = computed(() => {
  const items = cartStore.items.map(item => ({
    id: item.id,
    productId: item.productId || item.product?.id,
    name: item.product?.name || item.name || '',
    spec: item.specifications ? Object.entries(item.specifications).map(([k, v]) => `${k}:${v}`).join(' ') : '',
    image: item.product?.image || '',
    price: item.product?.price ?? 0,
    originalPrice: item.product?.originalPrice ?? 0,
    quantity: item.quantity,
    checked: item.selected ?? true,
    tag: (item as any).tag
  })) as CartItemExt[]

  return [{
    storeId: 1,
    storeName: '黑科易购官方旗舰店',
    checked: allChecked.value,
    indeterminate: isIndeterminate.value,
    items
  }]
})

const selectedItems = computed(() => {
  return storeGroups.value[0]?.items.filter(i => i.checked) ?? []
})
const selectedCount = computed(() => selectedItems.value.length)
const totalPrice = computed(() => selectedItems.value.reduce((sum, i) => sum + i.price * i.quantity, 0))
const savedAmount = computed(() => selectedItems.value.reduce((sum, i) => sum + (i.originalPrice - i.price) * i.quantity, 0))

const allChecked = computed({
  get: () => {
    const items = storeGroups.value[0]?.items ?? []
    return items.length > 0 && items.every(i => i.checked)
  },
  set: async (val: boolean) => {
    try {
      await cartStore.selectAll(val)
      ElMessage.success(val ? '已全选' : '已取消全选')
    } catch (err: any) {
      ElMessage.error(err.message || '操作失败')
    }
  }
})

const isIndeterminate = computed(() => {
  const items = storeGroups.value[0]?.items ?? []
  const some = items.some(i => i.checked)
  const every = items.every(i => i.checked)
  return some && !every
})

async function toggleStore(store: any) {
  const val = store.checked
  for (const i of store.items as CartItemExt[]) {
    try {
      await cartStore.updateItem(String(i.id), undefined, val)
    } catch (err: any) {
      ElMessage.error(err.message || '更新选中状态失败')
    }
  }
}

async function updateCheckState(storeIdx: number) {
  const store = storeGroups.value[storeIdx]
  if (store) {
    const allChecked = store.items.every(i => i.checked)
    const someChecked = store.items.some(i => i.checked)
    store.checked = allChecked
    store.indeterminate = someChecked && !allChecked
    // 同步选中状态到 cartStore
    for (const item of store.items) {
      try {
        await cartStore.updateItem(String(item.id), undefined, item.checked)
      } catch (err: any) {
        ElMessage.error(err.message || '更新选中状态失败')
      }
    }
  }
}

async function changeQty(item: CartItemExt, delta: number) {
  const newQty = item.quantity + delta
  if (newQty >= 1 && newQty <= 99) {
    try {
      await cartStore.updateItem(String(item.id), newQty)
    } catch (err: any) {
      ElMessage.error(err.message || '更新数量失败')
    }
  }
}

async function validateQty(item: CartItemExt) {
  let qty = item.quantity
  if (!qty || qty < 1) qty = 1
  else if (qty > 99) qty = 99
  else qty = Math.round(qty)

  if (qty !== item.quantity) {
    try {
      await cartStore.updateItem(String(item.id), qty)
    } catch (err: any) {
      ElMessage.error(err.message || '更新数量失败')
    }
  }
}

async function removeItem(item: CartItemExt) {
  try {
    await ElMessageBox.confirm('确定从购物车中移除该商品吗？', '提示', { confirmButtonText: '确认删除', cancelButtonText: '取消', type: 'warning' })
    await cartStore.removeItem(String(item.id))
    ElMessage.success('已移除')
  } catch {}
}

async function moveToFav(item: CartItemExt) {
  try {
    await cartStore.batchMoveToFavorites([String(item.id)])
    ElMessage.success(`已移入收藏夹`)
  } catch (err: any) {
    ElMessage.error(err.message || '操作失败')
  }
}

async function batchDeleteSelected() {
  const ids = selectedItems.value.map(i => String(i.id))
  if (ids.length === 0) return

  try {
    await ElMessageBox.confirm(`确定删除选中的 ${ids.length} 个商品吗？`, '批量删除', { confirmButtonText: '确认删除', cancelButtonText: '取消', type: 'warning' })
    await cartStore.batchRemove(ids)
    ElMessage.success('批量删除成功')
  } catch {}
}

function clearInvalid() {
  ElMessage.info('没有失效商品')
}

function goCheckout() {
  if (selectedCount.value === 0) return
  router.push('/orders/checkout')
}

async function addToCart(rec: any) {
  try {
    await cartStore.addItem(rec.id, 1)
    ElMessage.success(`${rec.name} 已加入购物车`)
  } catch (err: any) {
    ElMessage.error(err.message || '添加失败')
  }
}

async function toggleAll(val: boolean | string | number) {
  try {
    await cartStore.selectAll(!!val)
  } catch (err: any) {
    ElMessage.error(err.message || '操作失败')
  }
}

const recommendations = [
  { id: 201, name: 'AirPods Pro 2', price: 1799, image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=150&h=150&fit=crop' },
  { id: 202, name: 'Kindle Paperwhite', price: 1069, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150&h=150&fit=crop' },
  { id: 203, name: 'Switch OLED', price: 2399, image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=150&h=150&fit=crop' },
  { id: 204, name: 'Apple Watch Ultra', price: 6499, image: 'https://images.unsplash.com/photo-1434493789847-202f1e128b55?w=150&h=150&fit=crop' },
  { id: 205, name: 'Bose QC Ultra', price: 2999, image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=150&h=150&fit=crop' },
  { id: 206, name: '极米 H6 Pro', price: 5699, image: 'https://images.unsplash.com/photo-1585771724684-38269d6639cb?w=150&h=150&fit=crop' }
]

onMounted(async () => {
  try {
    await cartStore.fetchCart()
  } catch (err: any) {
    ElMessage.error(err.message || '获取购物车数据失败')
  }
})
</script>

<style scoped>
.line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
