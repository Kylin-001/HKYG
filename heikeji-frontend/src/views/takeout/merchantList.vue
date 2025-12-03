<template>
  <div class="merchant-list-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1><i class="el-icon-shop"></i> 校园美食</h1>
        <p>精选优质商家，美味直达宿舍</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="$router.push('/takeout/cart')" class="cart-btn">
          <i class="el-icon-shopping-cart-2"></i>
          购物车 <span v-if="cartItemCount > 0" class="cart-badge">{{ cartItemCount }}</span>
        </el-button>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <el-card class="search-card">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索商家或美食..."
            prefix-icon="el-icon-search"
            clearable
            @keyup.enter.native="handleSearch"
          ></el-input>
        </el-col>
        <el-col :span="6">
          <el-select v-model="searchForm.category" placeholder="选择分类" clearable>
            <el-option label="全部美食" value=""></el-option>
            <el-option label="中式快餐" value="chinese"></el-option>
            <el-option label="西式简餐" value="western"></el-option>
            <el-option label="日韩料理" value="asian"></el-option>
            <el-option label="小吃饮品" value="snacks"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="searchForm.sortBy" placeholder="排序方式">
            <el-option label="综合排序" value="comprehensive"></el-option>
            <el-option label="销量优先" value="sales"></el-option>
            <el-option label="评分最高" value="rating"></el-option>
            <el-option label="配送最快" value="delivery"></el-option>
            <el-option label="起送价最低" value="minPrice"></el-option>
          </el-select>
        </el-col>
      </el-row>
    </el-card>

    <!-- 商家列表 -->
    <div class="merchant-grid">
      <el-row :gutter="20">
        <el-col
          v-for="merchant in merchantList"
          :key="merchant.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
        >
          <el-card class="merchant-card" @click.native="goToMerchant(merchant)">
            <!-- 商家图片 -->
            <div class="merchant-image">
              <img
                :src="merchant.image || '/static/images/default-merchant.jpg'"
                :alt="merchant.name"
              />
              <div class="merchant-badges">
                <span v-if="merchant.isNew" class="badge new">新店</span>
                <span v-if="merchant.isHot" class="badge hot">热销</span>
                <span v-if="merchant.isRecommended" class="badge recommended">推荐</span>
              </div>
            </div>

            <!-- 商家信息 -->
            <div class="merchant-info">
              <h3 class="merchant-name">{{ merchant.name }}</h3>
              <p class="merchant-desc">{{ merchant.description }}</p>

              <!-- 评分和销量 -->
              <div class="merchant-stats">
                <div class="rating">
                  <el-rate
                    v-model="merchant.rating"
                    disabled
                    show-score
                    text-color="#ff9900"
                    score-template="{value}"
                    :max="5"
                    :allow-half="true"
                  ></el-rate>
                </div>
                <div class="sales">月销 {{ merchant.monthlySales }}+</div>
              </div>

              <!-- 配送信息 -->
              <div class="delivery-info">
                <span class="delivery-fee">配送费 ¥{{ merchant.deliveryFee }}</span>
                <span class="min-order">起送 ¥{{ merchant.minOrderAmount }}</span>
                <span class="delivery-time">{{ merchant.deliveryTime }}分钟</span>
              </div>

              <!-- 优惠信息 -->
              <div class="promotions" v-if="merchant.promotions && merchant.promotions.length > 0">
                <div
                  v-for="promo in merchant.promotions.slice(0, 2)"
                  :key="promo.id"
                  class="promo-tag"
                >
                  {{ promo.title }}
                </div>
              </div>
            </div>

            <!-- 悬浮操作 -->
            <div class="merchant-actions">
              <el-button type="primary" size="mini" @click.stop="goToMerchant(merchant)">
                进入店铺
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 加载更多 -->
    <div class="load-more" v-if="hasMore">
      <el-button :loading="loadingMore" @click="loadMoreMerchants" type="text">
        {{ loadingMore ? '加载中...' : '加载更多商家' }}
      </el-button>
    </div>
  </div>
</template>

<script>
// 导入日志工具
import logger from '@/utils/logger'
// 导入Vuex状态管理
import { mapState } from 'vuex'

export default {
  name: 'MerchantList',
  data() {
    return {
      // 搜索表单
      searchForm: {
        keyword: '',
        category: '',
        sortBy: 'comprehensive',
      },

      // 商家列表
      merchantList: [],

      // 加载状态
      loading: false,
      loadingMore: false,

      // 分页
      pagination: {
        pageNum: 1,
        pageSize: 12,
        total: 0,
      },

      // 是否有更多
      hasMore: true,

      // 购物车商品数量
      cartItemCount: 0,
    }
  },

  computed: {
    // 从 Vuex 获取购物车商品数量
    ...mapState('cart', {
      cartCount: 'totalCount',
    }),
  },

  mounted() {
    this.fetchMerchants()
    this.updateCartCount()
  },

  methods: {
    // 获取商家列表
    async fetchMerchants() {
      this.loading = true
      try {
        // 模拟 API 调用
        const mockMerchants = this.generateMockMerchants()

        if (this.pagination.pageNum === 1) {
          this.merchantList = mockMerchants
        } else {
          this.merchantList.push(...mockMerchants)
        }

        this.pagination.total = 50 // 模拟总数据量
        this.hasMore = this.merchantList.length < this.pagination.total
      } catch (error) {
        this.$message.error('获取商家列表失败')
        logger.error('获取商家列表失败', error)
      } finally {
        this.loading = false
      }
    },

    // 搜索商家
    handleSearch() {
      this.pagination.pageNum = 1
      this.fetchMerchants()
    },

    // 加载更多商家
    async loadMoreMerchants() {
      if (this.loadingMore || !this.hasMore) return

      this.loadingMore = true
      this.pagination.pageNum++
      await this.fetchMerchants()
      this.loadingMore = false
    },

    // 进入商家页面
    goToMerchant(merchant) {
      this.$router.push(`/takeout/menu/${merchant.id}`)
    },

    // 更新购物车数量
    updateCartCount() {
      this.cartItemCount = this.cartCount
    },

    // 生成模拟商家数据
    generateMockMerchants() {
      const categories = ['chinese', 'western', 'asian', 'snacks']
      const names = [
        '兰州拉面',
        '黄焖鸡米饭',
        '沙县小吃',
        '麻辣烫',
        '重庆小面',
        '肯德基',
        '麦当劳',
        '必胜客',
        '汉堡王',
        '寿司道',
        '韩式烤肉',
        '日式料理',
        '奶茶工坊',
        '咖啡小站',
        '甜品屋',
        '果汁吧',
      ]

      const merchants = []
      for (let i = 0; i < this.pagination.pageSize; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)]
        const name = names[Math.floor(Math.random() * names.length)]

        merchants.push({
          id: (this.pagination.pageNum - 1) * this.pagination.pageSize + i + 1,
          name: `${name}${(this.pagination.pageNum - 1) * this.pagination.pageSize + i + 1}`,
          description: `专业${name}，新鲜制作，配送快速`,
          category,
          rating: 3.5 + Math.random() * 1.5,
          monthlySales: Math.floor(Math.random() * 2000) + 100,
          deliveryFee: 1 + Math.random() * 3,
          minOrderAmount: 10 + Math.random() * 20,
          deliveryTime: 20 + Math.floor(Math.random() * 30),
          image: '/static/images/default-merchant.jpg',
          isNew: Math.random() < 0.2,
          isHot: Math.random() < 0.3,
          isRecommended: Math.random() < 0.1,
          promotions: [
            { id: 1, title: '满20减5', type: 'discount' },
            { id: 2, title: '新用户立减10元', type: 'new_user' },
          ].filter(() => Math.random() < 0.5),
        })
      }

      return merchants
    },
  },

  watch: {
    // 监听购物车变化
    cartCount(newCount) {
      this.cartItemCount = newCount
    },
  },
}
</script>

<style scoped>
.merchant-list-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.header-content h1 {
  margin: 0;
  font-size: 28px;
  font-weight: bold;
}

.header-content p {
  margin: 5px 0 0 0;
  opacity: 0.9;
}

.header-actions {
  display: flex;
  align-items: center;
}

.cart-btn {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  font-size: 12px;
}

/* 搜索卡片 */
.search-card {
  margin-bottom: 20px;
}

/* 商家网格 */
.merchant-grid {
  margin-bottom: 20px;
}

.merchant-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.merchant-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* 商家图片 */
.merchant-image {
  position: relative;
  height: 160px;
  overflow: hidden;
}

.merchant-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.merchant-card:hover .merchant-image img {
  transform: scale(1.05);
}

.merchant-badges {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  gap: 4px;
}

.badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  color: white;
}

.badge.new {
  background: #ff6b6b;
}

.badge.hot {
  background: #ff9500;
}

.badge.recommended {
  background: #5cb85c;
}

/* 商家信息 */
.merchant-info {
  padding: 12px;
}

.merchant-name {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.merchant-desc {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.merchant-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.rating {
  flex: 1;
}

.sales {
  font-size: 12px;
  color: #999;
}

.delivery-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.promotions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.promo-tag {
  background: #ff4757;
  color: white;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 10px;
}

/* 悬浮操作 */
.merchant-actions {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.merchant-card:hover .merchant-actions {
  opacity: 1;
}

/* 加载更多 */
.load-more {
  text-align: center;
  margin: 30px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .merchant-list-container {
    padding: 10px;
  }
}
</style>
