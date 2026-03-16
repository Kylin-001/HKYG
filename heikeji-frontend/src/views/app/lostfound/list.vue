<template>
  <div class="app-lostfound-list">
    <div class="header">
      <div class="header-left" @click="goBack">
        <i class="el-icon-arrow-left"></i>
      </template>
      <div class="header-title">失物招领</template>
      <div class="header-right">
        <i class="el-icon-search" @click="showSearch = true"></i>
      </template>
    </template>

    <div class="tabs">
      <div
        :class="['tab-item', { active: currentTab === 0 }]"
        @click="handleTab(0)"
      >
        寻物
      </template>
      <div
        :class="['tab-item', { active: currentTab === 1 }]"
        @click="handleTab(1)"
      >
        招领
      </template>
    </template>

    <div class="content">
      <div v-if="list.length" class="list">
        <div v-for="item in list" :key="item.id" class="item-card" @click="goDetail(item.id)">
          <div class="item-header">
            <el-tag :type="item.type === 0 ? 'danger' : 'success'" size="small">
              {{ item.type === 0 ? '寻物' : '招领' }}
            </el-tag>
            <el-tag v-if="item.status === 2" type="success" size="small">已找到</el-tag>
            <el-tag v-else type="primary" size="small">进行中</el-tag>
          </template>
          <div class="item-title">{{ item.title }}</template>
          <div class="item-desc" v-if="item.description">{{ item.description }}</template>
          <div class="item-meta">
            <div class="meta-left">
              <span><i class="el-icon-location"></i> {{ item.location }}</span>
              <span><i class="el-icon-time"></i> {{ item.createTime }}</span>
            </template>
            <div class="meta-right">
              <span><i class="el-icon-view"></i> {{ item.viewCount }}</span>
            </template>
          </template>
          <div v-if="item.reward" class="reward-tag">
            悬赏 ¥{{ item.reward }}
          </template>
        </template>
      </template>
      <div v-else class="empty-tip">
        <i class="el-icon-search" style="font-size: 60px; color: #ddd;"></i>
        <p>暂无{{ currentTab === 0 ? '寻物' : '招领' }}信息</p>
      </template>

      <div v-if="loading" class="loading-tip">加载中...</template>
      <div v-if="noMore" class="no-more">没有更多了</template>
    </template>

    <div class="publish-btn" @click="goPublish">
      <i class="el-icon-plus"></i>
    </template>

    <el-drawer title="搜索" :visible.sync="showSearch" direction="top" size="50%">
      <div class="search-box">
        <el-input v-model="searchKeyword" placeholder="搜索标题/描述" clearable>
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-button type="primary" @click="handleSearch" style="margin-top: 10px; width: 100%">搜索</el-button>
      </template>
    </el-drawer>
  </template>
</template>

<script>
import { getLostFoundList } from '@/api/lostfound'

export default {
  name: 'AppLostFoundList',
  data() {
    return {
      loading: false,
      noMore: false,
      currentTab: 0,
      list: [],
      searchKeyword: '',
      showSearch: false,
      queryParams: {
        page: 1,
        pageSize: 10,
        type: 0
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      if (this.loading || this.noMore) return
      this.loading = true
      getLostFoundList(this.queryParams).then(response => {
        const data = response.data?.records || []
        if (this.queryParams.page === 1) {
          this.list = data
        } else {
          this.list = [...this.list, ...data]
        }
        if (data.length < this.queryParams.pageSize) {
          this.noMore = true
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleTab(type) {
      this.currentTab = type
      this.queryParams.type = type
      this.queryParams.page = 1
      this.noMore = false
      this.loadData()
    },
    handleSearch() {
      this.queryParams.keyword = this.searchKeyword
      this.queryParams.page = 1
      this.noMore = false
      this.showSearch = false
      this.loadData()
    },
    goDetail(id) {
      this.$router.push(`/app/lostfound/detail/${id}`)
    },
    goPublish() {
      this.$router.push('/app/lostfound/publish')
    },
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style scoped>
.app-lostfound-list {
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

.tabs {
  background: #fff;
  display: flex;
  border-bottom: 1px solid #eee;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-size: 14px;
  cursor: pointer;
  position: relative;
}

.tab-item.active {
  color: #409EFF;
  font-weight: bold;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 2px;
  background: #409EFF;
}

.content {
  padding: 10px;
}

.item-card {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  position: relative;
}

.item-header {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.item-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
}

.item-desc {
  font-size: 14px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 10px;
}

.item-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
}

.meta-left {
  display: flex;
  gap: 15px;
}

.meta-left span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.reward-tag {
  position: absolute;
  right: 15px;
  top: 15px;
  background: #F56C6C;
  color: #fff;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
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
</style>
