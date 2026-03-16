<template>
  <div class="app-secondhand-list">
    <div class="header">
      <div class="header-left" @click="goBack">
        <i class="el-icon-arrow-left"></i>
      </template>
      <div class="header-title">二手市场</template>
      <div class="header-right">
        <i class="el-icon-search" @click="showSearch = true"></i>
      </template>
    </template>

    <div class="filter-bar">
      <div
        v-for="filter in filters"
        :key="filter.value"
        :class="['filter-item', { active: currentFilter === filter.value }]"
        @click="handleFilter(filter.value)"
      >
        {{ filter.label }}
      </template>
    </template>

    <div class="content">
      <el-row :gutter="10" v-if="productList.length">
        <el-col :span="12" v-for="product in productList" :key="product.id">
          <div class="product-card" @click="goDetail(product.id)">
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
      <div v-else class="empty-tip">
        <i class="el-icon-sell" style="font-size: 60px; color: #ddd;"></i>
        <p>暂无二手商品</p>
      </template>

      <div v-if="loading" class="loading-tip">加载中...</template>
      <div v-if="noMore" class="no-more">没有更多了</template>
    </template>

    <div class="publish-btn" @click="goPublish">
      <i class="el-icon-plus"></i>
    </template>

    <el-drawer title="搜索" :visible.sync="showSearch" direction="top" size="50%">
      <div class="search-box">
        <el-input v-model="searchKeyword" placeholder="搜索商品名称" clearable>
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-button type="primary" @click="handleSearch" style="margin-top: 10px; width: 100%">搜索</el-button>
      </template>
      <div class="search-history" v-if="searchHistory.length">
        <div class="history-header">
          <span>搜索历史</span>
          <i class="el-icon-delete" @click="clearHistory"></i>
        </template>
        <div class="history-tags">
          <el-tag v-for="(tag, index) in searchHistory" :key="index" @click="searchKeyword = tag" style="margin-right: 8px; margin-bottom: 8px">
            {{ tag }}
          </el-tag>
        </template>
      </template>
    </el-drawer>
  </template>
</template>

<script>
import { getSecondhandList } from '@/api/secondhand'

export default {
  name: 'AppSecondhandList',
  data() {
    return {
      loading: false,
      noMore: false,
      productList: [],
      currentFilter: 'newest',
      searchKeyword: '',
      showSearch: false,
      searchHistory: [],
      filters: [
        { label: '最新', value: 'newest' },
        { label: '价格低', value: 'price_asc' },
        { label: '价格高', value: 'price_desc' },
        { label: '热门', value: 'hot' }
      ],
      queryParams: {
        page: 1,
        size: 10,
        sort: 'newest'
      }
    }
  },
  created() {
    const history = localStorage.getItem('secondhandSearchHistory')
    if (history) {
      this.searchHistory = JSON.parse(history)
    }
    this.loadData()
  },
  methods: {
    loadData() {
      if (this.loading || this.noMore) return
      this.loading = true
      getSecondhandList(this.queryParams).then(response => {
        const list = response.data?.records || []
        if (this.queryParams.page === 1) {
          this.productList = list
        } else {
          this.productList = [...this.productList, ...list]
        }
        if (list.length < this.queryParams.size) {
          this.noMore = true
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleFilter(value) {
      this.currentFilter = value
      this.queryParams.sort = value
      this.queryParams.page = 1
      this.noMore = false
      this.loadData()
    },
    handleSearch() {
      if (this.searchKeyword) {
        const history = this.searchHistory.filter(h => h !== this.searchKeyword)
        history.unshift(this.searchKeyword)
        this.searchHistory = history.slice(0, 10)
        localStorage.setItem('secondhandSearchHistory', JSON.stringify(this.searchHistory))
      }
      this.queryParams.keyword = this.searchKeyword
      this.queryParams.page = 1
      this.noMore = false
      this.showSearch = false
      this.loadData()
    },
    clearHistory() {
      this.searchHistory = []
      localStorage.removeItem('secondhandSearchHistory')
    },
    goDetail(id) {
      this.$router.push(`/app/secondhand/detail/${id}`)
    },
    goPublish() {
      this.$router.push('/app/secondhand/publish')
    },
    goBack() {
      this.$router.back()
    },
    getConditionText(condition) {
      const texts = ['全新', '九成新', '八成新', '七成新', '六成新']
      return texts[condition] || ''
    }
  }
}
</script>

<style scoped>
.app-secondhand-list {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 60px;
}

.header {
  background: #409EFF;
  color: #fff;
  padding: 12px 15px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left, .header-right {
  width: 40px;
  font-size: 20px;
  cursor: pointer;
}

.header-title {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}

.filter-bar {
  background: #fff;
  padding: 10px 15px;
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid #eee;
}

.filter-item {
  font-size: 14px;
  color: #666;
  cursor: pointer;
  padding: 5px 10px;
}

.filter-item.active {
  color: #409EFF;
  font-weight: bold;
}

.content {
  padding: 10px;
}

.product-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 10px;
}

.product-image {
  width: 100%;
  height: 150px;
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
  font-size: 18px;
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

.empty-tip {
  text-align: center;
  padding: 60px 0;
  color: #909399;
}

.loading-tip, .no-more {
  text-align: center;
  padding: 20px;
  color: #909399;
}

.publish-btn {
  position: fixed;
  right: 20px;
  bottom: 80px;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background: #409EFF;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  box-shadow: 0 4px 10px rgba(64, 158, 255, 0.4);
  cursor: pointer;
}

.search-box {
  padding: 15px;
}

.search-history {
  padding: 15px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  color: #909399;
}

.history-tags {
  margin-top: 10px;
}
</style>
