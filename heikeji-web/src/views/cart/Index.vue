<template>
  <div class="min-h-screen bg-[#f5f5f5] pb-32">
    <!-- 顶部导航栏 - 淘宝风格 -->
    <div class="bg-white sticky top-0 z-40 shadow-sm">
      <div class="max-w-6xl mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <h1 class="text-lg font-bold text-gray-800">购物车</h1>
            <span v-if="cartStore.items.length > 0" class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              共 {{ cartStore.items.length }} 种
            </span>
          </div>
          <button v-if="cartStore.items.length > 0" @click="isEditMode = !isEditMode" 
            class="text-sm font-medium transition-colors px-3 py-1.5 rounded-full"
            :class="isEditMode ? 'text-orange-500 bg-orange-50' : 'text-gray-600 hover:text-orange-500 hover:bg-gray-50'">
            {{ isEditMode ? '完成' : '管理' }}
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 py-4">
      <!-- 空购物车状态 -->
      <div v-if="cartStore.items.length === 0" class="bg-white rounded-2xl shadow-sm py-20 text-center">
        <div class="w-36 h-36 mx-auto mb-8 bg-gradient-to-br from-orange-100 via-orange-50 to-white rounded-full flex items-center justify-center shadow-inner">
          <svg class="w-16 h-16 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
        </div>
        <h3 class="text-xl font-medium text-gray-800 mb-2">购物车还是空的</h3>
        <p class="text-sm text-gray-400 mb-10">快去挑选心仪的商品吧～</p>
        <div class="flex justify-center gap-4">
          <button @click="$router.push('/')" 
            class="px-8 py-3 rounded-full border-2 border-gray-200 text-gray-600 font-medium hover:border-orange-500 hover:text-orange-500 transition-all">
            去首页
          </button>
          <button @click="$router.push('/products')" 
            class="px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 hover:scale-105 transition-all">
            去逛逛
          </button>
        </div>
      </div>

      <div v-else class="space-y-3">
        <!-- 筛选和搜索栏 -->
        <div class="bg-white rounded-xl shadow-sm px-4 py-3">
          <!-- 筛选标签 -->
          <div class="flex items-center gap-4 sm:gap-6 mb-3 border-b border-gray-100 pb-3 overflow-x-auto scrollbar-hide">
            <button v-for="tab in filterTabs" :key="tab.key"
              @click="activeTab = tab.key"
              class="flex items-center gap-1 text-sm font-medium transition-colors relative pb-1 whitespace-nowrap"
              :class="activeTab === tab.key ? 'text-orange-500' : 'text-gray-600 hover:text-gray-800'">
              <svg v-if="tab.icon" class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path v-if="tab.icon === 'grid'" d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                <path v-if="tab.icon === 'tag'" fill-rule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
                <path v-if="tab.icon === 'lightning'" fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
                <path v-if="tab.icon === 'trending'" fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd"/>
              </svg>
              <span class="whitespace-nowrap">{{ tab.label }}</span>
              <span v-if="tab.count" class="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full shrink-0">{{ tab.count }}</span>
              <div v-if="activeTab === tab.key" class="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full"></div>
            </button>
          </div>
          <!-- 批量操作和搜索 -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="allChecked" :indeterminate="isIndeterminate" @change="toggleAll"
                  class="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500">
                <span class="text-sm text-gray-700">全选</span>
              </label>
              <button v-if="isEditMode" @click="batchMoveToFav" :disabled="selectedCount === 0"
                class="text-sm text-gray-600 hover:text-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                移入收藏
              </button>
              <button v-if="isEditMode" @click="batchDeleteSelected" :disabled="selectedCount === 0"
                class="text-sm text-gray-600 hover:text-red-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                删除
              </button>
            </div>
            <div class="flex items-center gap-3">
              <!-- 分类下拉 - 淘宝风格 -->
              <div class="relative">
                <button @click="showCategoryDropdown = !showCategoryDropdown" 
                  class="flex items-center gap-1 text-sm text-gray-600 hover:text-orange-500 transition-colors border border-gray-200 rounded-lg px-3 py-1.5 bg-white">
                  <span>分类</span>
                  <svg class="w-4 h-4 transition-transform" :class="showCategoryDropdown ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                <!-- 分类下拉菜单 -->
                <div v-if="showCategoryDropdown" class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px] p-3">
                  <div class="grid grid-cols-3 gap-2">
                    <button v-for="cat in categoryOptions" :key="cat.key" 
                      @click="selectedCategory = cat.key; showCategoryDropdown = false"
                      class="text-xs text-center py-2 px-1 rounded hover:bg-orange-50 hover:text-orange-500 transition-colors"
                      :class="selectedCategory === cat.key ? 'bg-orange-50 text-orange-500' : 'text-gray-600'">
                      {{ cat.label }} {{ cat.count }}
                    </button>
                  </div>
                </div>
              </div>
              <!-- 状态下拉 - 淘宝风格 -->
              <div class="relative">
                <button @click="showStatusDropdown = !showStatusDropdown" 
                  class="flex items-center gap-1 text-sm text-gray-600 hover:text-orange-500 transition-colors border border-gray-200 rounded-lg px-3 py-1.5 bg-white">
                  <span>状态</span>
                  <svg class="w-4 h-4 transition-transform" :class="showStatusDropdown ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                <!-- 状态下拉菜单 -->
                <div v-if="showStatusDropdown" class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[120px]">
                  <button v-for="status in statusOptions" :key="status.key" 
                    @click="selectedStatus = status.key; showStatusDropdown = false"
                    class="w-full text-left px-4 py-2 text-sm hover:bg-orange-50 hover:text-orange-500 transition-colors flex items-center gap-2"
                    :class="selectedStatus === status.key ? 'bg-orange-50 text-orange-500' : 'text-gray-600'">
                    <svg v-if="status.icon" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path v-if="status.icon === 'alert'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                      <path v-if="status.icon === 'x'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                    {{ status.label }}
                  </button>
                </div>
              </div>
              <!-- 搜索框 -->
              <div class="relative">
                <input v-model="searchKeyword" type="text" placeholder="搜索购物车商品" 
                  class="text-sm border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 w-48 outline-none focus:border-orange-500">
                <svg class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- 促销信息横幅 -->
        <div style="background: linear-gradient(to right, #f97316, #ef4444); border-radius: 12px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; color: white;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <svg style="width: 20px; height: 20px; color: white;" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
            </svg>
            <span style="font-size: 14px; font-weight: 500;">限时优惠</span>
            <span style="font-size: 12px; opacity: 0.9;">满99减10，满199减30</span>
          </div>
          <button style="font-size: 12px; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 9999px; border: none; color: white; cursor: pointer;">
            去凑单 &gt;
          </button>
        </div>

        <!-- 店铺卡片 - 淘宝风格 -->
        <div v-for="(store, storeIdx) in storeGroups" :key="store.storeId" class="bg-white rounded-xl shadow-sm overflow-hidden">
          <!-- 店铺头部 -->
          <div class="px-4 py-3 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
            <input type="checkbox" v-model="store.checked" :indeterminate="store.indeterminate" @change="toggleStore(store)"
              class="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 focus:ring-2">
            <div class="w-6 h-6 rounded bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-sm">
              <svg class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
              </svg>
            </div>
            <span class="font-semibold text-gray-800 text-sm">{{ store.storeName }}</span>
            <span class="px-2 py-0.5 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] font-medium">官方自营</span>
            <!-- 店铺级批量操作 -->
            <div v-if="isEditMode && store.items.some(i => i.checked)" class="flex items-center gap-2 ml-4">
              <button @click="batchMoveStoreToFav(store)" class="text-xs text-gray-500 hover:text-orange-500 transition-colors">
                移入收藏
              </button>
              <span class="text-gray-300">|</span>
              <button @click="batchDeleteStore(store)" class="text-xs text-gray-500 hover:text-red-500 transition-colors">
                删除
              </button>
            </div>
            <button class="ml-auto text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>

          <!-- 商品列表 -->
          <div class="divide-y divide-gray-100">
            <div v-for="(item, itemIdx) in store.items" :key="item.id" 
              class="flex items-start gap-3 px-4 py-4 hover:bg-orange-50/30 transition-colors group"
              :class="{ 'bg-orange-50/20': item.checked }">
              <div class="pt-5 flex flex-col items-center gap-2">
                <input type="checkbox" v-model="item.checked" @change="updateCheckState(storeIdx)"
                  class="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 focus:ring-2 cursor-pointer">
                <!-- 对比按钮 -->
                <button @click.stop="toggleCompare(item)" 
                  class="text-[10px] px-1.5 py-0.5 rounded border transition-colors"
                  :class="isInCompare(item) ? 'bg-orange-500 text-white border-orange-500' : 'text-gray-400 border-gray-200 hover:text-orange-500 hover:border-orange-500'"
                  title="加入对比">
                  对比
                </button>
              </div>

              <!-- 商品图片 - 固定尺寸 -->
              <div class="relative w-[100px] h-[100px] shrink-0 rounded-xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100 flex items-center justify-center group/image"
                @click="$router.push(`/products/${item.productId}`)"
                @mouseenter="showImagePreview(item)"
                @mouseleave="hideImagePreview">
                <img v-if="item.image" :src="item.image" :alt="item.name"
                  class="w-full h-full object-cover group-hover/image:scale-110 transition-transform duration-500"
                  @error="$event.target.style.display='none'; $event.target.nextElementSibling.style.display='flex'">
                <!-- 图片加载失败或无图片时显示 -->
                <div class="w-full h-full flex flex-col items-center justify-center text-gray-400" :style="item.image ? 'display: none' : 'display: flex'">
                  <svg class="w-10 h-10 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <span class="text-[10px]">暂无图片</span>
                </div>
                <!-- 促销标签 -->
                <div v-if="item.tag" class="absolute top-0 left-0 px-2 py-0.5 text-[10px] text-white font-bold rounded-br-lg z-10"
                  :class="item.tag === '秒杀' ? 'bg-gradient-to-r from-red-500 to-red-600' : item.tag === '热卖' ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-gradient-to-r from-green-500 to-green-600'">
                  {{ item.tag }}
                </div>
                <!-- 图片标签（如款式缺货） -->
                <div v-if="item.imageTag" class="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-1 z-10">
                  {{ item.imageTag }}
                </div>
                <!-- 失效遮罩 -->
                <div v-if="item.invalid" class="absolute inset-0 bg-gray-500/60 flex items-center justify-center z-10">
                  <span class="text-white text-xs font-medium px-2 py-1 bg-gray-600/80 rounded">已失效</span>
                </div>
                <!-- 找同款按钮 -->
                <div class="absolute bottom-1 right-1 z-20 opacity-0 group-hover/image:opacity-100 transition-opacity">
                  <button @click.stop="findSameStyle(item)" class="bg-white/90 hover:bg-white text-gray-700 text-[10px] px-2 py-1 rounded-full shadow-md flex items-center gap-1 transition-all">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    找同款
                  </button>
                </div>
              </div>

              <!-- 商品信息 -->
              <div class="flex-1 min-w-0 py-0.5 flex gap-3">
                <!-- 左侧：商品详情 -->
                <div class="flex-1 min-w-0 overflow-hidden">
                  <!-- 商品标签 + 名称 -->
                  <div class="flex items-start gap-1">
                    <span v-if="item.tag" class="shrink-0 px-1 py-0.5 text-[10px] text-white font-medium rounded"
                      :class="item.tag === '超级88' ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-gradient-to-r from-orange-500 to-red-500'">
                      {{ item.tag }}
                    </span>
                    <h3 class="text-sm text-gray-800 line-clamp-2 leading-relaxed cursor-pointer hover:text-orange-500 transition-colors font-medium" 
                      @click="$router.push(`/products/${item.productId}`)">
                      {{ item.name }}
                    </h3>
                  </div>
                  
                  <!-- 规格详情 -->
                  <div class="mt-2 space-y-1">
                    <div class="text-xs text-gray-500">
                      <span v-if="item.specSize">尺码: {{ item.specSize }}</span>
                      <span v-if="item.specColor" class="ml-2">颜色: {{ item.specColor }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-500 cursor-pointer hover:bg-orange-50 hover:text-orange-500 transition-colors"
                        @click.stop="openSpecSelector(item)">
                        <span class="line-clamp-1 max-w-[120px]">{{ item.spec || '默认规格' }}</span>
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                      </div>
                      <button @click.stop="openSpecSelector(item)" class="text-xs text-gray-400 hover:text-orange-500 transition-colors border border-gray-200 rounded px-2 py-0.5 hover:border-orange-500">
                        修改
                      </button>
                    </div>
                  </div>

                  <!-- 优惠券信息 -->
                  <div v-if="item.coupon" class="flex items-center gap-1 mt-1">
                    <span class="text-[10px] text-red-500 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">{{ item.coupon }}</span>
                  </div>

                  <!-- 优惠和服务标签 -->
                  <div class="flex items-center gap-1.5 mt-2 flex-wrap">
                    <!-- 超级88标签 -->
                    <span v-if="item.tag === '超级88'" class="text-[10px] text-white bg-gradient-to-r from-red-500 to-pink-500 px-1.5 py-0.5 rounded font-medium">
                      超级88
                    </span>
                    <!-- 官方立减 -->
                    <span v-if="item.officialDiscount" class="text-[10px] text-white bg-gradient-to-r from-red-500 to-red-600 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
                      <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
                      </svg>
                      官方立减
                    </span>
                    <!-- 超级立减 -->
                    <span v-if="item.superDiscount" class="text-[10px] text-white bg-gradient-to-r from-orange-500 to-red-500 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
                      <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
                      </svg>
                      超级立减
                    </span>
                    <!-- 降价标识 -->
                    <span v-if="item.priceDropped" class="text-[10px] text-white bg-gradient-to-r from-green-500 to-green-600 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
                      <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd"/>
                      </svg>
                      降价
                    </span>
                    <!-- 具体优惠信息 -->
                    <span v-if="item.discountAmount" class="text-[10px] text-red-500 bg-red-50 px-1 py-0.5 rounded border border-red-100">首降{{ item.discountAmount }}元</span>
                    <span v-if="item.priceProtection" class="text-[10px] text-orange-600 bg-orange-50 px-1 py-0.5 rounded border border-orange-100">15天价保</span>
                    <span class="text-[10px] text-orange-600 bg-orange-50 px-1 py-0.5 rounded border border-orange-100">大促价保</span>
                    <span class="text-[10px] text-orange-600 bg-orange-50 px-1 py-0.5 rounded border border-orange-100">极速退款</span>
                    <span class="text-[10px] text-orange-600 bg-orange-50 px-1 py-0.5 rounded border border-orange-100">7天无理由</span>
                  </div>

                  <!-- 价格和库存状态 -->
                  <div class="flex items-center gap-2 mt-3">
                    <span class="text-[10px] text-red-500 font-medium">券后价</span>
                    <div class="flex items-baseline">
                      <span class="text-xs text-red-500 font-bold">¥</span>
                      <span class="text-lg font-bold text-red-500">{{ formatPrice(item.price).full }}</span>
                    </div>
                    <span v-if="Number(item.originalPrice) > Number(item.price)" class="text-xs text-gray-400 line-through">
                      ¥{{ formatPrice(item.originalPrice).full }}
                    </span>
                    <!-- 库存紧张标识 -->
                    <span v-if="item.lowStock" class="text-[10px] text-red-500 bg-red-50 px-1.5 py-0.5 rounded">库存紧张</span>
                  </div>
                </div>

                <!-- 右侧：数量和操作 -->
                <div class="flex flex-col items-end justify-between shrink-0 w-[80px]">
                  <!-- 数量选择器 - 淘宝风格（圆形按钮） -->
                  <div class="flex items-center justify-end gap-1.5 w-full">
                    <button :disabled="item.quantity <= 1" @click="changeQty(item, -1)"
                      class="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-orange-500 hover:text-orange-500 disabled:border-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors bg-white shrink-0">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                      </svg>
                    </button>
                    <div class="w-6 text-center text-sm font-medium text-gray-700 select-none shrink-0">
                      {{ item.quantity }}
                    </div>
                    <button :disabled="item.quantity >= 99" @click="changeQty(item, 1)"
                      class="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-orange-500 hover:text-orange-500 disabled:border-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors bg-white shrink-0">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                    </button>
                  </div>

                  <!-- 操作按钮 -->
                  <div class="flex flex-col items-end gap-1 mt-2">
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
          </div>

          <!-- 店铺小计 -->
          <div class="px-4 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            <span class="text-xs text-gray-500">小计</span>
            <span class="text-sm font-bold text-orange-500">¥{{ formatPrice(storeTotal(store)).full }}</span>
          </div>
        </div>

        <!-- 猜你喜欢 - 淘宝风格 -->
        <div class="mt-6">
          <div class="flex items-center justify-center gap-2 mb-4">
            <div class="h-px w-12 bg-gradient-to-r from-transparent to-gray-300"></div>
            <div class="flex items-center gap-2 text-gray-600">
              <svg class="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
              </svg>
              <span class="text-sm font-medium">猜你喜欢</span>
            </div>
            <div class="h-px w-12 bg-gradient-to-l from-transparent to-gray-300"></div>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div v-for="rec in recommendations" :key="rec.id" 
              class="cursor-pointer group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              @click="$router.push(`/products/${rec.id}`)">
              <div class="aspect-square overflow-hidden bg-gray-100">
                <img :src="rec.image" width="160" height="160" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
              </div>
              <div class="p-2">
                <p class="text-xs text-gray-700 line-clamp-2 group-hover:text-orange-500 transition-colors mb-1 h-8">{{ rec.name }}</p>
                <div class="flex items-center justify-between">
                  <span class="text-sm font-bold text-orange-500">¥{{ rec.price }}</span>
                  <button @click.stop="addToCart(rec)" class="w-6 h-6 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页加载 -->
        <div v-if="hasMoreItems" class="text-center py-4">
          <button @click="loadMore" :disabled="loading" 
            class="px-6 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:text-orange-500 hover:border-orange-500 transition-colors disabled:opacity-50">
            {{ loading ? '加载中...' : '加载更多' }}
          </button>
        </div>
        <div v-else-if="cartStore.items.length > 10" class="text-center py-4 text-sm text-gray-400">
          没有更多了
        </div>
      </div>
    </div>

    <!-- 商品图片预览浮层 -->
    <div v-if="previewItem" class="fixed z-[60] pointer-events-none"
      :style="{ left: previewPosition.x + 'px', top: previewPosition.y + 'px' }">
      <div class="bg-white rounded-xl shadow-2xl p-3 pointer-events-auto">
        <img :src="previewItem.image" class="w-[280px] h-[280px] object-cover rounded-lg">
        <div class="mt-2 text-center">
          <p class="text-sm text-gray-700 line-clamp-1">{{ previewItem.name }}</p>
          <p class="text-orange-500 font-bold mt-1">¥{{ formatPrice(previewItem.price).full }}</p>
        </div>
      </div>
    </div>

    <!-- 规格选择弹窗 -->
    <div v-if="showSpecModal" class="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center" @click.self="closeSpecModal">
      <div class="bg-white rounded-2xl w-[480px] max-w-[90vw] max-h-[80vh] overflow-hidden shadow-2xl">
        <!-- 弹窗头部 -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 class="text-lg font-bold text-gray-800">选择规格</h3>
          <button @click="closeSpecModal" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <!-- 弹窗内容 -->
        <div class="p-6 overflow-y-auto max-h-[50vh]">
          <!-- 商品信息 -->
          <div class="flex gap-4 mb-6 pb-4 border-b border-gray-100">
            <img :src="selectedItem?.image" class="w-20 h-20 rounded-lg object-cover bg-gray-100">
            <div class="flex-1">
              <p class="text-sm text-gray-800 line-clamp-2 font-medium">{{ selectedItem?.name }}</p>
              <div class="mt-2 flex items-baseline gap-1">
                <span class="text-xs text-red-500">¥</span>
                <span class="text-xl font-bold text-red-500">{{ formatPrice(selectedItem?.price).int }}</span>
                <span class="text-sm text-red-500">.{{ formatPrice(selectedItem?.price).dec }}</span>
              </div>
            </div>
          </div>
          <!-- 规格选项 -->
          <div v-for="(spec, specName) in availableSpecs" :key="specName" class="mb-5">
            <h4 class="text-sm font-medium text-gray-700 mb-3">{{ specName }}</h4>
            <div class="flex flex-wrap gap-2">
              <button v-for="option in spec.options" :key="option.value"
                @click="selectSpec(specName as string, option.value)"
                class="px-4 py-2 rounded-lg text-sm border transition-all"
                :class="selectedSpecs[specName as string] === option.value
                  ? 'border-orange-500 bg-orange-50 text-orange-600'
                  : 'border-gray-200 text-gray-600 hover:border-orange-300'"
                :disabled="!option.available">
                {{ option.value }}
                <span v-if="option.priceDiff > 0" class="text-xs text-red-500 ml-1">+¥{{ option.priceDiff }}</span>
                <span v-if="option.priceDiff < 0" class="text-xs text-green-500 ml-1">-¥{{ Math.abs(option.priceDiff) }}</span>
              </button>
            </div>
          </div>
          <!-- 数量选择 -->
          <div class="mb-4">
            <h4 class="text-sm font-medium text-gray-700 mb-3">数量</h4>
            <div class="flex items-center gap-3">
              <button @click="modalQuantity > 1 && modalQuantity--"
                class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-orange-500 hover:text-orange-500 disabled:opacity-40 transition-colors"
                :disabled="modalQuantity <= 1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                </svg>
              </button>
              <span class="w-12 text-center text-base font-medium text-gray-700">{{ modalQuantity }}</span>
              <button @click="modalQuantity < 99 && modalQuantity++"
                class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-orange-500 hover:text-orange-500 disabled:opacity-40 transition-colors"
                :disabled="modalQuantity >= 99">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
              </button>
              <span class="text-xs text-gray-400 ml-2">库存 {{ selectedItem?.stock || 99 }} 件</span>
            </div>
          </div>
        </div>
        <!-- 弹窗底部 -->
        <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex gap-3">
          <button @click="closeSpecModal" class="flex-1 py-3 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors">
            取消
          </button>
          <button @click="confirmSpecChange"
            class="flex-1 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium hover:shadow-lg transition-all"
            :disabled="!isSpecValid">
            确定
          </button>
        </div>
      </div>
    </div>

    <!-- 优惠明细弹窗 -->
    <div v-if="showPriceDetail" class="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center" @click.self="showPriceDetail = false">
      <div class="bg-white rounded-2xl w-[400px] max-w-[90vw] shadow-2xl overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 class="text-lg font-bold text-gray-800">优惠明细</h3>
          <button @click="showPriceDetail = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="p-6">
          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">商品总价</span>
              <span class="text-gray-800">¥{{ formatPrice(originalTotalPrice).full }}</span>
            </div>
            <div v-if="savedAmount > 0" class="flex justify-between text-sm">
              <span class="text-red-500">商品优惠</span>
              <span class="text-red-500">-¥{{ formatPrice(savedAmount).full }}</span>
            </div>
            <div v-if="couponAmount > 0" class="flex justify-between text-sm">
              <span class="text-red-500">优惠券</span>
              <span class="text-red-500">-¥{{ formatPrice(couponAmount).full }}</span>
            </div>
            <div v-if="promotionAmount > 0" class="flex justify-between text-sm">
              <span class="text-red-500">促销活动</span>
              <span class="text-red-500">-¥{{ formatPrice(promotionAmount).full }}</span>
            </div>
            <div class="border-t border-gray-100 pt-3 mt-3">
              <div class="flex justify-between items-center">
                <span class="text-base font-medium text-gray-800">合计</span>
                <div class="flex items-baseline gap-1">
                  <span class="text-sm text-red-500">¥</span>
                  <span class="text-2xl font-bold text-red-500">{{ formatPrice(totalPrice).int }}</span>
                  <span class="text-sm text-red-500">.{{ formatPrice(totalPrice).dec }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 商品对比浮层 -->
    <div v-if="compareList.length > 0" class="fixed bottom-20 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-2xl z-50 p-4 min-w-[400px] max-w-[600px]">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-medium text-gray-800">商品对比 ({{ compareList.length }})</h3>
        <button @click="clearCompare" class="text-xs text-gray-400 hover:text-gray-600">清空</button>
      </div>
      <div class="flex gap-4 mb-3">
        <div v-for="item in compareList" :key="item.id" class="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
          <img :src="item.image" class="w-10 h-10 rounded object-cover">
          <div class="text-xs">
            <p class="text-gray-700 line-clamp-1 w-20">{{ item.name }}</p>
            <p class="text-orange-500 font-medium">¥{{ item.price }}</p>
          </div>
          <button @click="toggleCompare(item)" class="text-gray-400 hover:text-red-500 ml-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="flex gap-2">
        <button @click="startCompare" :disabled="compareList.length < 2"
          class="flex-1 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-medium rounded-lg disabled:opacity-40">
          开始对比
        </button>
      </div>
    </div>

    <!-- 右侧悬浮工具栏 -->
    <div class="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
      <button @click="showCustomerService" class="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-orange-500 hover:shadow-xl transition-all" title="客服">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      </button>
      <button @click="$router.push('/cart')" class="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-orange-500 hover:shadow-xl transition-all relative" title="购物车">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
        <span v-if="cartStore.items.length > 0" class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
          {{ cartStore.items.length > 99 ? '99+' : cartStore.items.length }}
        </span>
      </button>
      <button @click="scrollToTop" class="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-orange-500 hover:shadow-xl transition-all" title="回到顶部">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
        </svg>
      </button>
    </div>

    <!-- 底部结算栏 - 淘宝风格 -->
    <div v-if="cartStore.items.length > 0" 
      style="position: fixed; bottom: 0; left: 0; right: 0; background: white; border-top: 1px solid #e5e7eb; box-shadow: 0 -4px 20px rgba(0,0,0,0.1); z-index: 9999;">
      <div style="max-width: 72rem; margin: 0 auto; padding: 12px 16px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <!-- 左侧：全选 -->
          <div style="display: flex; align-items: center; gap: 16px;">
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="checkbox" v-model="allChecked" :indeterminate="isIndeterminate" @change="toggleAll"
                style="width: 16px; height: 16px;">
              <span style="font-size: 14px; color: #374151; font-weight: 500;">全选</span>
            </label>
          </div>

          <!-- 右侧：合计和结算 -->
          <div style="display: flex; align-items: center; gap: 16px;">
            <!-- 合计金额 -->
            <div v-if="!isEditMode" style="display: flex; align-items: baseline; gap: 4px;">
              <span style="font-size: 14px; color: #374151;">合计:</span>
              <span style="font-size: 12px; color: #f97316; font-weight: 700;">¥</span>
              <span style="font-size: 24px; color: #f97316; font-weight: 700;">{{ formatPrice(totalPrice).int }}</span>
              <span style="font-size: 14px; color: #f97316; font-weight: 700;">.{{ formatPrice(totalPrice).dec }}</span>
              <!-- 优惠明细 -->
              <button v-if="savedAmount > 0" @click="showPriceDetail = true"
                style="font-size: 12px; color: #f97316; margin-left: 4px; background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 2px;">
                优惠明细
                <svg style="width: 12px; height: 12px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
            </div>

            <!-- 结算按钮 -->
            <button v-if="isEditMode" @click="batchDeleteSelected" :disabled="selectedCount === 0"
              style="padding: 12px 32px; border-radius: 9999px; background: #ef4444; color: white; font-size: 16px; font-weight: 500; border: none; cursor: pointer; min-width: 100px;"
              :style="selectedCount === 0 ? 'opacity: 0.4; cursor: not-allowed;' : ''">
              删除
            </button>
            <button v-else @click="goCheckout" :disabled="selectedCount === 0"
              style="padding: 12px 40px; border-radius: 9999px; background: linear-gradient(to right, #ff6b35, #ff4500); color: white; font-size: 16px; font-weight: 600; border: none; cursor: pointer; min-width: 120px; box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);"
              :style="selectedCount === 0 ? 'opacity: 0.4; cursor: not-allowed;' : ''">
              结算({{ selectedCount }})
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const cartStore = useCartStore()

// 编辑模式
const isEditMode = ref(false)

// 筛选和搜索
const activeTab = ref('all')
const selectedCategory = ref('')
const selectedStatus = ref('')
const searchKeyword = ref('')
const showCategoryDropdown = ref(false)
const showStatusDropdown = ref(false)

// 分页加载
const loading = ref(false)
const hasMoreItems = ref(false)
const currentPage = ref(1)

// 商品对比
const compareList = ref<CartItemExt[]>([])

// 图片预览
const previewItem = ref<CartItemExt | null>(null)
const previewPosition = ref({ x: 0, y: 0 })

// 规格选择弹窗
const showSpecModal = ref(false)
const selectedItem = ref<CartItemExt | null>(null)
const selectedSpecs = ref<Record<string, string>>({})
const modalQuantity = ref(1)

// 模拟规格数据
const availableSpecs = ref<Record<string, { options: { value: string; available: boolean; priceDiff: number }[] }>>({
  '颜色': {
    options: [
      { value: '黑色', available: true, priceDiff: 0 },
      { value: '白色', available: true, priceDiff: 0 },
      { value: '蓝色', available: true, priceDiff: 10 },
      { value: '红色', available: false, priceDiff: 0 }
    ]
  },
  '尺码': {
    options: [
      { value: 'S', available: true, priceDiff: 0 },
      { value: 'M', available: true, priceDiff: 0 },
      { value: 'L', available: true, priceDiff: 5 },
      { value: 'XL', available: true, priceDiff: 5 },
      { value: 'XXL', available: false, priceDiff: 0 }
    ]
  },
  '套餐': {
    options: [
      { value: '标准版', available: true, priceDiff: 0 },
      { value: '豪华版', available: true, priceDiff: 50 },
      { value: '至尊版', available: true, priceDiff: 100 }
    ]
  }
})

// 优惠明细
const showPriceDetail = ref(false)
const couponAmount = ref(0)
const promotionAmount = ref(0)

// 计算属性：规格是否有效
const isSpecValid = computed(() => {
  return Object.keys(availableSpecs.value).every(specName => selectedSpecs.value[specName])
})

// 计算属性：原始总价
const originalTotalPrice = computed(() => {
  return selectedItems.value.reduce((sum, i) => sum + (Number(i.originalPrice) || Number(i.price) || 0) * (Number(i.quantity) || 1), 0)
})

// 分类选项（带数量）
const categoryOptions = [
  { key: 'digital', label: '数码', count: 2 },
  { key: 'food', label: '食品', count: 3 },
  { key: 'daily', label: '日用', count: 2 },
  { key: 'sports', label: '运动', count: 1 },
  { key: 'clothing', label: '服饰', count: 0 },
  { key: 'beauty', label: '美妆', count: 0 },
  { key: 'home', label: '家居', count: 0 },
  { key: 'study', label: '文具', count: 0 },
  { key: 'accessories', label: '配饰', count: 0 },
]

// 状态选项
const statusOptions = [
  { key: 'normal', label: '正常' },
  { key: 'lowstock', label: '即将售罄', icon: 'alert' },
  { key: 'invalid', label: '失效', icon: 'x' }
]

const filterTabs = [
  { key: 'all', label: '全部商品', icon: 'grid', count: computed(() => cartStore.items.length) },
  { key: 'discount', label: '官方立减', icon: 'tag' },
  { key: 'sale', label: '超级立减', icon: 'lightning' },
  { key: 'reduce', label: '降价', icon: 'trending' }
]

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
  invalid?: boolean
  coupon?: string
  lowStock?: boolean
  specSize?: string
  specColor?: string
  discountAmount?: number
  priceProtection?: boolean
  imageTag?: string
  stock?: number
  // 新增促销标签
  officialDiscount?: boolean
  superDiscount?: boolean
  priceDropped?: boolean
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
    tag: (item as any).tag,
    invalid: (item as any).invalid,
    stock: item.product?.stock ?? 99,
    // 促销标签
    officialDiscount: (item as any).officialDiscount ?? Math.random() > 0.7,
    superDiscount: (item as any).superDiscount ?? Math.random() > 0.8,
    priceDropped: (item as any).priceDropped ?? Math.random() > 0.6,
    discountAmount: (item as any).discountAmount ?? (Math.random() > 0.5 ? Math.floor(Math.random() * 20) : 0),
    priceProtection: (item as any).priceProtection ?? true,
    coupon: (item as any).coupon,
    lowStock: (item as any).lowStock ?? (item.product?.stock ?? 99) < 10
  })) as CartItemExt[]

  const allItemsChecked = items.length > 0 && items.every(i => i.checked)
  const someItemsChecked = items.some(i => i.checked)

  return [{
    storeId: 1,
    storeName: '黑科易购官方旗舰店',
    checked: allItemsChecked,
    indeterminate: someItemsChecked && !allItemsChecked,
    items
  }]
})

const selectedItems = computed(() => storeGroups.value[0]?.items.filter(i => i.checked) ?? [])
const selectedCount = computed(() => selectedItems.value.length)
const totalPrice = computed(() => selectedItems.value.reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 1), 0))
const savedAmount = computed(() => selectedItems.value.reduce((sum, i) => sum + ((Number(i.originalPrice) || 0) - (Number(i.price) || 0)) * (Number(i.quantity) || 1), 0))

// 购物车总件数（考虑每个商品的quantity）
const totalItemCount = computed(() => {
  return cartStore.items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0)
})

// 价格格式化函数
function formatPrice(price: number | string | undefined) {
  const num = Number(price) || 0
  const full = num.toFixed(2)
  const [int, dec] = full.split('.')
  return { int, dec, full }
}

const allChecked = computed({
  get: () => {
    const items = cartStore.items
    return items.length > 0 && items.every(i => i.selected)
  },
  set: async (val: boolean) => {
    try {
      await cartStore.selectAll(val)
    } catch (err: any) {
      ElMessage.error(err.message || '操作失败')
    }
  }
})

const isIndeterminate = computed(() => {
  const items = cartStore.items
  const selectedCount = items.filter(i => i.selected).length
  return selectedCount > 0 && selectedCount < items.length
})

function storeTotal(store: any) {
  return store.items
    .filter((i: CartItemExt) => i.checked)
    .reduce((sum: number, i: CartItemExt) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 1), 0)
}

async function toggleStore(store: any) {
  const val = store.checked
  for (const i of store.items as CartItemExt[]) {
    try {
      await cartStore.updateItem(String(i.id), undefined, val)
    } catch (err: any) {
      ElMessage.error(err.message || '更新失败')
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
    for (const item of store.items) {
      try {
        await cartStore.updateItem(String(item.id), undefined, item.checked)
      } catch (err: any) {
        ElMessage.error(err.message || '更新失败')
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
    await ElMessageBox.confirm('确定删除该商品吗？', '提示', { 
      confirmButtonText: '确认', 
      cancelButtonText: '取消', 
      type: 'warning' 
    })
    await cartStore.removeItem(String(item.id))
    ElMessage.success('已删除')
  } catch {}
}

async function moveToFav(item: CartItemExt) {
  try {
    await cartStore.batchMoveToFavorites([String(item.id)])
    ElMessage.success('已移入收藏夹')
  } catch (err: any) {
    ElMessage.error(err.message || '操作失败')
  }
}

async function batchDeleteSelected() {
  const ids = selectedItems.value.map(i => String(i.id))
  if (ids.length === 0) return
  try {
    await ElMessageBox.confirm(`确定删除选中的 ${ids.length} 个商品吗？`, '提示', { 
      confirmButtonText: '确认', 
      cancelButtonText: '取消', 
      type: 'warning' 
    })
    await cartStore.batchRemove(ids)
    ElMessage.success('删除成功')
  } catch {}
}

function goCheckout() {
  if (selectedCount.value === 0) return
  router.push('/orders/checkout')
}

async function addToCart(rec: any) {
  try {
    await cartStore.addItem(rec.id, 1)
    ElMessage.success('已加入购物车')
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

// 店铺级批量操作
async function batchMoveStoreToFav(store: any) {
  const ids = store.items.filter((i: CartItemExt) => i.checked).map((i: CartItemExt) => String(i.id))
  if (ids.length === 0) return
  try {
    await cartStore.batchMoveToFavorites(ids)
    ElMessage.success(`已将 ${ids.length} 件商品移入收藏夹`)
  } catch (err: any) {
    ElMessage.error(err.message || '操作失败')
  }
}

async function batchDeleteStore(store: any) {
  const ids = store.items.filter((i: CartItemExt) => i.checked).map((i: CartItemExt) => String(i.id))
  if (ids.length === 0) return
  try {
    await ElMessageBox.confirm(`确定删除该店铺选中的 ${ids.length} 个商品吗？`, '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await cartStore.batchRemove(ids)
    ElMessage.success('删除成功')
  } catch {}
}

// 分页加载
async function loadMore() {
  if (loading.value) return
  loading.value = true
  try {
    // 模拟加载更多数据
    await new Promise(resolve => setTimeout(resolve, 500))
    currentPage.value++
    // 这里应该调用API加载更多数据
    hasMoreItems.value = false // 根据实际情况设置
  } finally {
    loading.value = false
  }
}

// 商品图片预览
function showImagePreview(item: CartItemExt) {
  if (!item.image) return
  previewItem.value = item
  // 计算预览位置（在图片右侧）
  const rect = (event?.target as HTMLElement)?.getBoundingClientRect()
  if (rect) {
    previewPosition.value = {
      x: rect.right + 10,
      y: Math.max(10, rect.top - 50)
    }
  }
}

function hideImagePreview() {
  previewItem.value = null
}

// 找同款
function findSameStyle(item: CartItemExt) {
  ElMessage.success(`正在搜索 "${item.name}" 的同款商品...`)
  // 这里可以跳转到搜索结果页
  router.push({
    path: '/products',
    query: { keyword: item.name, searchType: 'same' }
  })
}

// 规格选择弹窗
function openSpecSelector(item: CartItemExt) {
  selectedItem.value = item
  modalQuantity.value = item.quantity
  // 初始化已选规格
  selectedSpecs.value = {}
  // 从当前规格字符串解析
  if (item.spec) {
    const specPairs = item.spec.split(' ')
    specPairs.forEach(pair => {
      const [key, value] = pair.split(':')
      if (key && value) {
        selectedSpecs.value[key] = value
      }
    })
  }
  showSpecModal.value = true
}

function closeSpecModal() {
  showSpecModal.value = false
  selectedItem.value = null
  selectedSpecs.value = {}
}

function selectSpec(specName: string, value: string) {
  selectedSpecs.value[specName] = value
}

async function confirmSpecChange() {
  if (!selectedItem.value) return
  const newSpec = Object.entries(selectedSpecs.value)
    .map(([key, value]) => `${key}:${value}`)
    .join(' ')

  try {
    // 更新规格和数量
    await cartStore.updateItem(String(selectedItem.value.id), modalQuantity.value)
    ElMessage.success('规格修改成功')
    closeSpecModal()
  } catch (err: any) {
    ElMessage.error(err.message || '修改失败')
  }
}

// 商品对比
function toggleCompare(item: CartItemExt) {
  const index = compareList.value.findIndex(i => i.id === item.id)
  if (index > -1) {
    compareList.value.splice(index, 1)
  } else {
    if (compareList.value.length >= 4) {
      ElMessage.warning('最多对比4个商品')
      return
    }
    compareList.value.push(item)
  }
}

function isInCompare(item: CartItemExt) {
  return compareList.value.some(i => i.id === item.id)
}

function clearCompare() {
  compareList.value = []
}

function startCompare() {
  if (compareList.value.length < 2) {
    ElMessage.warning('请至少选择2个商品进行对比')
    return
  }
  // 打开对比页面或弹窗
  ElMessage.success(`开始对比 ${compareList.value.length} 个商品`)
  // 这里可以跳转到对比页面或打开对比弹窗
}

// 右侧工具栏功能
function showCustomerService() {
  ElMessage.info('客服功能开发中...')
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const recommendations = [
  { id: 201, name: 'AirPods Pro 2 主动降噪无线蓝牙耳机', price: 1799, image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=150&h=150&fit=crop' },
  { id: 202, name: 'Kindle Paperwhite 电子书阅读器', price: 1069, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150&h=150&fit=crop' },
  { id: 203, name: 'Nintendo Switch OLED 游戏主机', price: 2399, image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=150&h=150&fit=crop' },
  { id: 204, name: 'Apple Watch Ultra 智能手表', price: 6499, image: 'https://images.unsplash.com/photo-1434493789847-202f1e128b55?w=150&h=150&fit=crop' },
  { id: 205, name: 'Bose QC Ultra 头戴式降噪耳机', price: 2999, image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=150&h=150&fit=crop' },
  { id: 206, name: '极米 H6 Pro 4K投影仪', price: 5699, image: 'https://images.unsplash.com/photo-1585771724684-38269d6639cb?w=150&h=150&fit=crop' }
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
.line-clamp-1 { 
  display: -webkit-box; 
  -webkit-line-clamp: 1; 
  -webkit-box-orient: vertical; 
  overflow: hidden; 
}
.line-clamp-2 { 
  display: -webkit-box; 
  -webkit-line-clamp: 2; 
  -webkit-box-orient: vertical; 
  overflow: hidden; 
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* 自定义复选框样式 */
input[type="checkbox"] {
  accent-color: #f97316;
}

/* 数量输入框样式优化 */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
