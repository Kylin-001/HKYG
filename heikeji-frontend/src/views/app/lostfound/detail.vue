<template>
  <div class="app-lostfound-detail">
    <div class="header">
      <div class="header-left" @click="goBack">
        <i class="el-icon-arrow-left"></i>
      </template>
      <div class="header-title">详情</template>
      <div class="header-right" @click="showShare = true">
        <i class="el-icon-share"></i>
      </template>
    </template>

    <div v-loading="loading" class="content">
      <div v-if="item" class="detail-content">
        <div class="status-bar">
          <el-tag :type="item.type === 0 ? 'danger' : 'success'" size="large">
            {{ item.type === 0 ? '寻物' : '招领' }}
          </el-tag>
          <el-tag v-if="item.status === 2" type="success" size="large">已找到</el-tag>
          <el-tag v-else type="primary" size="large">进行中</el-tag>
        </template>

        <div class="title-section">
          <h1>{{ item.title }}</h1>
        </template>

        <div class="info-list">
          <div class="info-item">
            <i class="el-icon-goods"></i>
            <div class="info-content">
              <div class="label">物品名称</template>
              <div class="value">{{ item.itemName || '-' }}</template>
            </template>
          </template>
          <div class="info-item">
            <i class="el-icon-location"></i>
            <div class="info-content">
              <div class="label">{{ item.type === 0 ? '丢失' : '拾取' }}地点</template>
              <div class="value">{{ item.location }}</template>
            </template>
          </template>
          <div class="info-item" v-if="item.lostTime">
            <i class="el-icon-time"></i>
            <div class="info-content">
              <div class="label">{{ item.type === 0 ? '丢失' : '拾取' }}时间</template>
              <div class="value">{{ item.lostTime }}</template>
            </template>
          </template>
          <div class="info-item">
            <i class="el-icon-phone"></i>
            <div class="info-content">
              <div class="label">联系方式</template>
              <div class="value">{{ item.contact }}</template>
            </template>
          </template>
          <div class="info-item" v-if="item.reward">
            <i class="el-icon-money"></i>
            <div class="info-content">
              <div class="label">悬赏金额</template>
              <div class="value reward">¥{{ item.reward }}</template>
            </template>
          </template>
        </template>

        <div class="desc-section" v-if="item.description">
          <h3>详细描述</h3>
          <p>{{ item.description }}</p>
        </template>

        <div class="image-section" v-if="item.images">
          <el-image
            v-for="(img, index) in item.images.split(',')"
            :key="index"
            :src="img"
            :preview-src-list="item.images.split(',')"
            fit="contain"
            style="width: 100%; margin-bottom: 10px"
          />
        </template>

        <div class="user-section">
          <el-avatar :size="50" icon="el-icon-user"></el-avatar>
          <div class="user-info">
            <div class="user-name">发布人</template>
            <div class="user-time">{{ item.createTime }}</template>
          </template>
        </template>
      </template>
    </template>

    <div class="bottom-bar">
      <div class="action-icons">
        <div class="icon-item" @click="handleCollect">
          <i :class="isCollected ? 'el-icon-star-on' : 'el-icon-star-off'"></i>
          <span>收藏</span>
        </template>
        <div class="icon-item" @click="handleShare">
          <i class="el-icon-share"></i>
          <span>分享</span>
        </template>
      </template>
      <div class="action-buttons">
        <el-button @click="handleContact">联系我</el-button>
        <el-button v-if="item && item.type === 0" type="primary" @click="handleFound">我找到了</el-button>
        <el-button v-if="item && item.type === 1" type="primary" @click="handleClaim">我已领取</el-button>
      </template>
    </template>
  </template>
</template>

<script>
import { getLostFoundDetail } from '@/api/lostfound'

export default {
  name: 'AppLostFoundDetail',
  data() {
    return {
      loading: true,
      item: null,
      isCollected: false,
      showShare: false
    }
  },
  created() {
    const id = this.$route.params.id
    if (id) {
      this.getDetail(id)
    }
  },
  methods: {
    getDetail(id) {
      this.loading = true
      getLostFoundDetail(id).then(response => {
        this.item = response.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    goBack() {
      this.$router.back()
    },
    handleCollect() {
      this.isCollected = !this.isCollected
      this.$message.success(this.isCollected ? '收藏成功' : '已取消收藏')
    },
    handleShare() {
      this.$message.info('分享功能开发中')
    },
    handleContact() {
      this.$prompt('请输入留言内容', '联系对方', {
        confirmButtonText: '发送',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.$message.success('留言已发送')
      }).catch(() => {})
    },
    handleFound() {
      this.$confirm('确认物品已找到吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('已标记为已找到')
        this.getDetail(this.item.id)
      }).catch(() => {})
    },
    handleClaim() {
      this.$confirm('确认已领取物品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('已标记为已领取')
        this.getDetail(this.item.id)
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.app-lostfound-detail {
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

.detail-content {
  background: #fff;
}

.status-bar {
  padding: 15px;
  display: flex;
  gap: 10px;
}

.title-section {
  padding: 0 15px 15px;
  border-bottom: 1px solid #eee;
}

.title-section h1 {
  font-size: 20px;
  margin: 0;
  line-height: 1.4;
}

.info-list {
  padding: 15px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item i {
  font-size: 20px;
  color: #409EFF;
  width: 30px;
}

.info-content {
  flex: 1;
}

.info-content .label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.info-content .value {
  font-size: 15px;
}

.info-content .reward {
  color: #F56C6C;
  font-size: 18px;
  font-weight: bold;
}

.desc-section {
  padding: 15px;
  border-top: 10px solid #f5f5f5;
}

.desc-section h3 {
  font-size: 16px;
  margin: 0 0 10px 0;
}

.desc-section p {
  line-height: 1.8;
  color: #666;
}

.image-section {
  padding: 15px;
  border-top: 10px solid #f5f5f5;
}

.user-section {
  padding: 15px;
  border-top: 10px solid #f5f5f5;
  display: flex;
  align-items: center;
}

.user-info {
  margin-left: 12px;
}

.user-name {
  font-size: 14px;
  font-weight: bold;
}

.user-time {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  border-top: 1px solid #eee;
  z-index: 100;
}

.action-icons {
  display: flex;
  margin-right: 15px;
}

.icon-item {
  text-align: center;
  margin-right: 20px;
  cursor: pointer;
}

.icon-item i {
  font-size: 20px;
  display: block;
}

.icon-item span {
  font-size: 12px;
  color: #666;
}

.action-buttons {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.action-buttons .el-button {
  margin-left: 10px;
}
</style>
