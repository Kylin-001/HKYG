<template>
  <div class="coupons-page">
    <div class="container">
      <!-- 页面标题 -->
      <div class="page-header">
        <div class="header-title">
          <div class="header-icon">
            <el-icon :size="28" color="#fff"><Ticket /></el-icon>
          </div>
          <div class="header-text">
            <h1>我的优惠券</h1>
            <p>共 <span class="highlight">{{ coupons.length }}</span> 张优惠券</p>
          </div>
        </div>
      </div>

      <!-- Tab 分类 -->
      <div class="tab-bar">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="activeTab = tab.value"
          class="tab-btn"
          :class="{ active: activeTab === tab.value }"
        >
          <span>{{ tab.label }}</span>
          <span v-if="tab.count > 0" class="tab-badge">{{ tab.count }}</span>
        </button>
      </div>

      <!-- 优惠券列表 -->
      <div v-if="filteredCoupons.length > 0" class="coupons-list">
        <div
          v-for="coupon in filteredCoupons"
          :key="coupon.id"
          class="coupon-card"
          :class="{ expired: coupon.status === 'expired' || coupon.status === 'used' }"
        >
          <div class="coupon-content">
            <!-- 左侧金额区 -->
            <div class="coupon-amount">
              <div class="amount-bg"></div>
              <div class="amount-content">
                <template v-if="coupon.type === 'cash'">
                  <div class="amount-value">
                    <span class="currency">¥</span>
                    <span class="number">{{ coupon.value }}</span>
                  </div>
                </template>
                <template v-else-if="coupon.type === 'discount'">
                  <div class="amount-value">
                    <span class="number">{{ coupon.value }}</span>
                    <span class="unit">折</span>
                  </div>
                </template>
                <template v-else>
                  <div class="amount-value">
                    <span class="text">免运费</span>
                  </div>
                </template>
                <div class="amount-condition">
                  {{ coupon.minOrder > 0 ? `满${coupon.minOrder}元可用` : '无门槛' }}
                </div>
              </div>
              <!-- 缺口装饰 -->
              <div class="notch notch-top"></div>
              <div class="notch notch-bottom"></div>
            </div>

            <!-- 右侧信息区 -->
            <div class="coupon-info">
              <div class="info-header">
                <span class="type-tag">{{ getTypeLabel(coupon) }}</span>
                <h3 class="coupon-name">{{ coupon.name }}</h3>
              </div>
              <p class="coupon-desc">{{ coupon.description || '全场通用' }}</p>
              <div class="coupon-meta">
                <div class="meta-item">
                  <el-icon :size="12"><Clock /></el-icon>
                  <span>{{ formatDate(coupon.validTo) }} 到期</span>
                </div>
                <span v-if="isExpiringSoon(coupon)" class="expiring-tag">
                  剩{{ daysLeft(coupon) }}天
                </span>
              </div>
              <div class="coupon-action">
                <button
                  v-if="coupon.status === 'available'"
                  @click="useCoupon(coupon)"
                  class="use-btn"
                >
                  立即使用
                </button>
                <button v-else class="disabled-btn" disabled>
                  {{ coupon.status === 'expired' ? '已过期' : '已使用' }}
                </button>
              </div>
            </div>
          </div>

          <!-- 过期/已使用水印 -->
          <div v-if="coupon.status === 'expired' || coupon.status === 'used'" class="watermark">
            <div class="watermark-text">
              {{ coupon.status === 'expired' ? '已过期' : '已使用' }}
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <el-icon :size="48" color="#d1d5db"><Ticket /></el-icon>
        </div>
        <h3>{{ emptyText }}</h3>
        <p>快去领券中心看看有什么优惠吧~</p>
        <button @click="scrollToClaimCenter" class="claim-btn">
          <el-icon :size="18"><Present /></el-icon>
          去领券
        </button>
      </div>

      <!-- 领券中心 -->
      <div id="claimCenter" class="claim-section">
        <div class="section-header">
          <div class="section-title">
            <div class="title-icon">
              <el-icon :size="22" color="#fff"><Present /></el-icon>
            </div>
            <div class="title-text">
              <h3>领券中心</h3>
              <p>限时好券，先到先得</p>
            </div>
          </div>
          <button class="view-more">
            查看更多
            <el-icon :size="14"><ArrowRight /></el-icon>
          </button>
        </div>

        <!-- 分类标签 -->
        <div class="category-tabs">
          <button
            v-for="cat in categories"
            :key="cat.value"
            @click="activeCategory = cat.value"
            class="category-btn"
            :class="{ active: activeCategory === cat.value }"
          >
            {{ cat.label }}
          </button>
        </div>

        <!-- 可领取优惠券 -->
        <div class="claim-grid">
          <div
            v-for="item in filteredClaimableCoupons"
            :key="item.id"
            class="claim-card"
          >
            <div class="claim-image">
              <img :src="item.image" :alt="item.name" width="120" height="120" loading="lazy" />
              <div class="claim-tag">{{ item.tag }}</div>
            </div>
            <div class="claim-content">
              <div class="claim-info">
                <h4>{{ item.name }}</h4>
                <p>{{ item.scope }}</p>
              </div>
              <div class="claim-footer">
                <div class="claim-price">
                  <span class="currency">¥</span>
                  <span class="number">{{ item.value }}</span>
                </div>
                <div class="claim-meta">
                  满{{ item.condition }}可用 · 剩{{ item.remaining }}张
                </div>
                <button @click="claimCoupon(item)" class="claim-btn-small">
                  立即抢
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Ticket, Clock, Present, ArrowRight } from '@element-plus/icons-vue'
import { useCommunityStore } from '@/stores/community'

const router = useRouter()
const route = useRoute()
const communityStore = useCommunityStore()

const activeTab = ref('available')
const activeCategory = ref('all')

// Tab 配置
const tabs = computed(() => {
  const coupons = communityStore.coupons
  const now = new Date()

  return [
    { label: '全部可用', value: 'available', count: coupons.filter(c => c.status === 'available').length },
    {
      label: '即将过期',
      value: 'expiring_soon',
      count: coupons.filter(c => {
        if (c.status !== 'available') return false
        const expDate = new Date(c.validTo)
        const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        return diffDays <= 3 && diffDays > 0
      }).length
    },
    { label: '已使用', value: 'used', count: coupons.filter(c => c.status === 'used').length },
    { label: '已过期', value: 'expired', count: coupons.filter(c => c.status === 'expired').length }
  ]
})

// 分类
const categories = [
  { label: '全部', value: 'all' },
  { label: '食品生鲜', value: 'food' },
  { label: '运动户外', value: 'outdoor' },
  { label: '数码家电', value: 'digital' },
  { label: '服饰美妆', value: 'fashion' }
]

const coupons = computed(() => communityStore.coupons)

// 可领取的优惠券
const claimableCoupons = [
  {
    id: 101,
    name: '食品加补券',
    type: 'cash',
    value: 4,
    condition: 40,
    remaining: 128,
    scope: '限食品生鲜部分商品可用',
    category: 'food',
    tag: '热卖',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=200&fit=crop'
  },
  {
    id: 102,
    name: '食品加补券',
    type: 'cash',
    value: 5,
    condition: 50,
    remaining: 56,
    scope: '限食品生鲜部分商品可用',
    category: 'food',
    tag: '限时',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop'
  },
  {
    id: 103,
    name: '户外加补券',
    type: 'cash',
    value: 110,
    condition: 900,
    remaining: 342,
    scope: '限运动户外指定商品可用',
    category: 'outdoor',
    tag: '大额',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=200&h=200&fit=crop'
  },
  {
    id: 104,
    name: '户外加补券',
    type: 'cash',
    value: 70,
    condition: 600,
    remaining: 89,
    scope: '限运动户外指定商品可用',
    category: 'outdoor',
    tag: '推荐',
    image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=200&h=200&fit=crop'
  },
  {
    id: 105,
    name: '数码加补券',
    type: 'cash',
    value: 240,
    condition: 2000,
    remaining: 45,
    scope: '限数码家电指定商品可用',
    category: 'digital',
    tag: '大额',
    image: 'https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?w=200&h=200&fit=crop'
  },
  {
    id: 106,
    name: '数码加补券',
    type: 'cash',
    value: 160,
    condition: 1300,
    remaining: 78,
    scope: '限数码家电指定商品可用',
    category: 'digital',
    tag: '热卖',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop'
  }
]

// 过滤可领取优惠券
const filteredClaimableCoupons = computed(() => {
  if (activeCategory.value === 'all') return claimableCoupons
  return claimableCoupons.filter(c => c.category === activeCategory.value)
})

// 过滤后的优惠券列表
const filteredCoupons = computed(() => {
  const now = new Date()
  let result = coupons.value

  if (activeTab.value === 'expiring_soon') {
    result = result.filter(c => {
      if (c.status !== 'available') return false
      const expDate = new Date(c.validTo)
      const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return diffDays <= 3 && diffDays > 0
    })
  } else {
    result = result.filter(c => c.status === activeTab.value)
  }

  return result
})

// 空状态文本
const emptyText = computed(() => {
  switch (activeTab.value) {
    case 'available': return '暂无可用优惠券'
    case 'expiring_soon': return '暂无即将过期的优惠券'
    case 'used': return '暂无已使用优惠券'
    case 'expired': return '暂无已过期优惠券'
    default: return '暂无优惠券'
  }
})

// 判断是否即将过期（<= 3天）
function isExpiringSoon(coupon: any): boolean {
  if (coupon.status !== 'available') return false
  const expDate = new Date(coupon.validTo)
  const now = new Date()
  const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diffDays <= 3 && diffDays > 0
}

// 获取剩余天数
function daysLeft(coupon: any): number {
  const now = new Date()
  const exp = new Date(coupon.validTo)
  const diff = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff)
}

// 获取类型标签文本
function getTypeLabel(coupon: any): string {
  if (coupon.type === 'cash') return '现金券'
  if (coupon.type === 'discount') return '折扣券'
  if (coupon.type === 'free_shipping') return '免运费券'
  return '通用券'
}

// 格式化日期
function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  } catch {
    return dateStr
  }
}

// 使用优惠券
function useCoupon(coupon: any) {
  // 存储选中的优惠券到本地存储
  localStorage.setItem('selectedCoupon', JSON.stringify(coupon))
  ElMessage.success(`已选择「${coupon.name}」，正在跳转到购物车...`)
  // 跳转到购物车页面
  router.push('/cart')
}

// 领取优惠券
async function claimCoupon(item: any) {
  try {
    await communityStore.claimCoupon(String(item.id))
    ElMessage.success(`成功领取「${item.name}」！`)
    await communityStore.fetchCoupons()
  } catch (err: any) {
    ElMessage.error(err.message || '领取失败')
  }
}

// 滚动到领券中心
function scrollToClaimCenter() {
  document.getElementById('claimCenter')?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(async () => {
  try {
    await communityStore.fetchCoupons()
  } catch (err: any) {
    ElMessage.error(err.message || '获取优惠券列表失败')
  }
})
</script>

<style scoped>
.coupons-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  padding: 32px 0;
}

.container {
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 16px;
}

/* 页面标题 */
.page-header {
  margin-bottom: 24px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #f97316 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px -5px rgba(244, 63, 94, 0.3);
}

.header-text h1 {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px 0;
}

.header-text p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.header-text .highlight {
  color: #f43f5e;
  font-weight: 600;
}

/* Tab 栏 */
.tab-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.tab-btn:hover {
  border-color: #f43f5e;
  color: #f43f5e;
}

.tab-btn.active {
  background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 4px 6px -1px rgba(244, 63, 94, 0.2);
}

.tab-badge {
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
}

/* 优惠券列表 */
.coupons-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 48px;
}

.coupon-card {
  position: relative;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f3f4f6;
  transition: transform 0.2s, box-shadow 0.2s;
}

.coupon-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.coupon-card.expired {
  opacity: 0.6;
  filter: grayscale(0.5);
}

.coupon-content {
  display: flex;
  min-height: 140px;
}

/* 左侧金额区 */
.coupon-amount {
  position: relative;
  width: 140px;
  flex-shrink: 0;
  background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  overflow: hidden;
}

.amount-bg {
  position: absolute;
  inset: 0;
  opacity: 0.1;
}

.amount-bg::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 50%;
}

.amount-bg::after {
  content: '';
  position: absolute;
  bottom: -50%;
  left: -50%;
  width: 80%;
  height: 80%;
  background: #fff;
  border-radius: 50%;
}

.amount-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.amount-value {
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.amount-value .currency {
  font-size: 16px;
  font-weight: 600;
  margin-top: 4px;
}

.amount-value .number {
  font-size: 36px;
  font-weight: 700;
  line-height: 1;
}

.amount-value .unit {
  font-size: 16px;
  font-weight: 600;
  margin-left: 2px;
}

.amount-value .text {
  font-size: 18px;
  font-weight: 700;
}

.amount-condition {
  margin-top: 8px;
  padding: 4px 10px;
  font-size: 11px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
}

.notch {
  position: absolute;
  right: -8px;
  width: 16px;
  height: 16px;
  background: #f9fafb;
  border-radius: 50%;
}

.notch-top {
  top: -8px;
}

.notch-bottom {
  bottom: -8px;
}

/* 右侧信息区 */
.coupon-info {
  flex: 1;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.info-header {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}

.type-tag {
  flex-shrink: 0;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  color: #f43f5e;
  background: #ffe4e6;
  border-radius: 9999px;
}

.coupon-name {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  line-height: 1.4;
}

.coupon-desc {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 12px 0;
}

.coupon-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #9ca3af;
}

.expiring-tag {
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 500;
  color: #f97316;
  background: #ffedd5;
  border-radius: 9999px;
}

.coupon-action {
  display: flex;
  justify-content: flex-end;
}

.use-btn {
  padding: 8px 20px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%);
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(244, 63, 94, 0.2);
  transition: box-shadow 0.2s;
}

.use-btn:hover {
  box-shadow: 0 10px 15px -3px rgba(244, 63, 94, 0.3);
}

.disabled-btn {
  padding: 8px 20px;
  font-size: 13px;
  font-weight: 600;
  color: #9ca3af;
  background: #f3f4f6;
  border: none;
  border-radius: 9999px;
  cursor: not-allowed;
}

/* 水印 */
.watermark {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.3);
  pointer-events: none;
}

.watermark-text {
  width: 80px;
  height: 80px;
  border: 3px solid #9ca3af;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #9ca3af;
  transform: rotate(-15deg);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: #fff;
  border-radius: 16px;
  margin-bottom: 48px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ffe4e6 0%, #fce7f3 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 20px 0;
}

.claim-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 32px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%);
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(244, 63, 94, 0.2);
  transition: box-shadow 0.2s;
}

.claim-btn:hover {
  box-shadow: 0 10px 15px -3px rgba(244, 63, 94, 0.3);
}

/* 领券中心 */
.claim-section {
  margin-top: 48px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f97316 0%, #f43f5e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px -1px rgba(249, 115, 22, 0.2);
}

.title-text h3 {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 2px 0;
}

.title-text p {
  font-size: 13px;
  color: #9ca3af;
  margin: 0;
}

.view-more {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.view-more:hover {
  color: #f43f5e;
}

/* 分类标签 */
.category-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.category-btn {
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.category-btn:hover {
  border-color: #f43f5e;
  color: #f43f5e;
}

.category-btn.active {
  background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%);
  color: #fff;
  border-color: transparent;
}

/* 领券网格 */
.claim-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 16px;
}

@media (min-width: 640px) {
  .claim-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .claim-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.claim-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f3f4f6;
  transition: transform 0.2s, box-shadow 0.2s;
}

.claim-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.claim-image {
  position: relative;
  width: 100%;
  padding-bottom: 60%;
  overflow: hidden;
}

.claim-image img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.claim-card:hover .claim-image img {
  transform: scale(1.05);
}

.claim-tag {
  position: absolute;
  top: 12px;
  left: 0;
  padding: 4px 12px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%);
  border-radius: 0 9999px 9999px 0;
  box-shadow: 0 2px 4px rgba(244, 63, 94, 0.2);
}

.claim-content {
  padding: 16px;
}

.claim-info h4 {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
}

.claim-info p {
  font-size: 12px;
  color: #9ca3af;
  margin: 0 0 12px 0;
}

.claim-footer {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.claim-price {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.claim-price .currency {
  font-size: 14px;
  font-weight: 600;
  color: #f43f5e;
}

.claim-price .number {
  font-size: 24px;
  font-weight: 700;
  color: #f43f5e;
}

.claim-meta {
  font-size: 12px;
  color: #9ca3af;
}

.claim-btn-small {
  width: 100%;
  padding: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(244, 63, 94, 0.2);
  transition: box-shadow 0.2s;
  margin-top: 8px;
}

.claim-btn-small:hover {
  box-shadow: 0 10px 15px -3px rgba(244, 63, 94, 0.3);
}
</style>