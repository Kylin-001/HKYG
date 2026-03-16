<template>
  <div class="app-home">
    <div class="home-header">
      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索商品"
          @keyup.enter.native="handleSearch"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </template>
    </template>

    <div class="home-content">
      <el-row :gutter="10" class="category-grid">
        <el-col :span="6" v-for="cat in categories" :key="cat.id">
          <div class="category-item" @click="goCategory(cat)">
            <i :class="cat.icon"></i>
            <span>{{ cat.name }}</span>
          </template>
        </el-col>
      </el-row>

      <div class="section">
        <div class="section-header">
          <h3>二手好物</h3>
          <el-button type="text" @click="goSecondhandList">更多</el-button>
        </template>
        <el-row :gutter="10" v-if="secondhandProducts.length">
          <el-col :span="12" v-for="product in secondhandProducts" :key="product.id">
            <div class="product-card" @click="goSecondhandDetail(product.id)">
              <el-image :src="product.images ? product.images.split(',')[0] : ''" fit="cover" class="product-image" />
              <div class="product-info">
                <div class="product-name">{{ product.productName }}</template>
                <div class="product-price">¥{{ product.price }}</template>
                <div class="product-meta">
                  <span class="condition">{{ getConditionText(product.condition) }}</span>
                  <span class="views">{{ product.viewCount }}人浏览</span>
                </template>
              </template>
            </template>
          </el-col>
        </el-row>
        <div v-else class="empty-tip">暂无二手商品</template>
      </template>

      <div class="section">
        <div class="section-header">
          <h3>失物招领</h3>
          <el-button type="text" @click="goLostFoundList">更多</el-button>
        </template>
        <el-row :gutter="10" v-if="lostFoundList.length">
          <el-col :span="24" v-for="item in lostFoundList" :key="item.id">
            <div class="lostfound-card" @click="goLostFoundDetail(item.id)">
              <el-tag :type="item.type === 0 ? 'danger' : 'success'" size="small">
                {{ item.type === 0 ? '寻物' : '招领' }}
              </el-tag>
              <div class="lostfound-content">
                <div class="lostfound-title">{{ item.title }}</template>
                <div class="lostfound-meta">
                  <span>{{ item.location }}</span>
                  <span>{{ item.createTime }}</span>
                </template>
              </template>
            </template>
          </el-col>
        </el-row>
        <div v-else class="empty-tip">暂无失物招领信息</template>
      </template>

      <div class="section">
        <div class="section-header">
          <h3>热门商品</h3>
        </template>
        <el-row :gutter="10" v-if="hotProducts.length">
          <el-col :span="8" v-for="product in hotProducts" :key="product.id">
            <div class="product-card-small" @click="goProductDetail(product.id)">
              <el-image :src="product.image" fit="cover" class="product-image" />
              <div class="product-info">
                <div class="product-name">{{ product.name }}</template>
                <div class="product-price">¥{{ product.price }}</template>
              </template>
            </template>
          </el-col>
        </el-row>
      </template>
    </template>

    <div class="tab-bar">
      <div class="tab-item active">
        <i class="el-icon-home"></i>
        <span>首页</span>
      </template>
      <div class="tab-item" @click="goSecondhandList">
        <i class="el-icon-sell"></i>
        <span>二手</span>
      </template>
      <div class="tab-item" @click="goLostFoundList">
        <i class="el-icon-search"></i>
        <span>失物</span>
      </template>
      <div class="tab-item" @click="goUser">
        <i class="el-icon-user"></i>
        <span>我的</span>
      </template>
    </template>
  </template>
</template>

<script>
import { getSecondhandHot } from '@/api/secondhand'
import { getLostFoundHot } from '@/api/lostfound'

export default {
  name: 'AppHome',
  data() {
    return {
      searchKeyword: '',
      categories: [
        { id: 1, name: '二手商品', icon: 'el-icon-sell', path: '/app/secondhand' },
        { id: 2, name: '失物招领', icon: 'el-icon-search', path: '/app/lostfound' },
        { id: 3, name: '外卖点餐', icon: 'el-icon-soup', path: '/app/takeout' },
        { id: 4, name: '校园服务', icon: 'el-icon-location', path: '/app/campus' }
      ],
      secondhandProducts: [],
      lostFoundList: [],
      hotProducts: []
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      getSecondhandHot(4).then(response => {
        this.secondhandProducts = response.data || []
      }).catch(() => {
        this.secondhandProducts = []
      })

      getLostFoundHot(3).then(response => {
        this.lostFoundList = response.data || []
      }).catch(() => {
        this.lostFoundList = []
      })

      this.hotProducts = [
        { id: 1, name: 'iPhone 14 Pro', price: 5999, image: '' },
        { id: 2, name: 'MacBook Air', price: 7999, image: '' },
        { id: 3, name: 'AirPods Pro', price: 1999, image: '' }
      ]
    },
    handleSearch() {
      if (this.searchKeyword) {
        this.$router.push(`/app/product/search?keyword=${this.searchKeyword}`)
      }
    },
    goCategory(cat) {
      this.$router.push(cat.path)
    },
    goSecondhandList() {
      this.$router.push('/app/secondhand/list')
    },
    goSecondhandDetail(id) {
      this.$router.push(`/app/secondhand/detail/${id}`)
    },
    goLostFoundList() {
      this.$router.push('/app/lostfound/list')
    },
    goLostFoundDetail(id) {
      this.$router.push(`/app/lostfound/detail/${id}`)
    },
    goProductDetail(id) {
      this.$router.push(`/app/product/detail/${id}`)
    },
    goUser() {
      this.$router.push('/app/user/profile')
    },
    getConditionText(condition) {
      const texts = ['全新', '九成新', '八成新', '七成新', '六成新及以下']
      return texts[condition] || ''
    }
  }
}
</script>

<style scoped>
.app-home {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 60px;
}

.home-header {
  background: #409EFF;
  padding: 15px;
}

.search-bar {
  background: #fff;
  border-radius: 20px;
  padding: 5px 15px;
}

.home-content {
  padding: 15px;
}

.category-grid {
  margin-bottom: 20px;
}

.category-item {
  background: #fff;
  border-radius: 8px;
  padding: 15px 10px;
  text-align: center;
  margin-bottom: 10px;
}

.category-item i {
  font-size: 28px;
  color: #409EFF;
  display: block;
  margin-bottom: 5px;
}

.category-item span {
  font-size: 12px;
  color: #333;
}

.section {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.section-header h3 {
  font-size: 16px;
  margin: 0;
}

.product-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 10px;
}

.product-image {
  width: 100%;
  height: 120px;
}

.product-info {
  padding: 10px;
}

.product-name {
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  color: #F56C6C;
  font-size: 16px;
  font-weight: bold;
  margin: 5px 0;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
}

.condition {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
}

.product-card-small .product-image {
  height: 100px;
}

.lostfound-card {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.lostfound-content {
  margin-left: 10px;
  flex: 1;
}

.lostfound-title {
  font-size: 14px;
  font-weight: bold;
}

.lostfound-meta {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
}

.empty-tip {
  text-align: center;
  color: #909399;
  padding: 30px;
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  display: flex;
  border-top: 1px solid #eee;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  cursor: pointer;
}

.tab-item i {
  font-size: 20px;
  display: block;
  margin-bottom: 2px;
}

.tab-item span {
  font-size: 12px;
}

.tab-item.active {
  color: #409EFF;
}
</style>
