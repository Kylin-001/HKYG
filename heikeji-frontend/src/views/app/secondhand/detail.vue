<template>
  <div class="app-secondhand-detail">
    <div class="header">
      <div class="header-left" @click="goBack">
        <i class="el-icon-arrow-left"></i>
      </template>
      <div class="header-title">商品详情</template>
      <div class="header-right" @click="showShare = true">
        <i class="el-icon-share"></i>
      </template>
    </template>

    <div v-loading="loading" class="content">
      <div v-if="product" class="detail-content">
        <div class="image-swiper" v-if="product.images">
          <el-image
            v-for="(img, index) in product.images.split(',')"
            :key="index"
            :src="img"
            fit="contain"
            class="detail-image"
          />
        </template>
        <div v-else class="no-image">暂无图片</template>

        <div class="price-section">
          <span class="price">¥{{ product.price }}</span>
          <span v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice }}</span>
        </template>

        <div class="title-section">
          <h1>{{ product.productName }}</h1>
          <div class="meta">
            <span class="condition">{{ getConditionText(product.condition) }}</span>
            <span class="views">{{ product.viewCount }}人浏览</span>
          </template>
        </template>

        <div class="info-list">
          <div class="info-item">
            <span class="label">交易方式</span>
            <span class="value">
              <span v-if="product.tradeType === 0">仅面交</span>
              <span v-else-if="product.tradeType === 1">仅快递</span>
              <span v-else>面交/快递均可</span>
            </span>
          </template>
          <div class="info-item" v-if="product.tradeLocation">
            <span class="label">交易地点</span>
            <span class="value">{{ product.tradeLocation }}</span>
          </template>
        </template>

        <div class="desc-section">
          <h3>商品描述</h3>
          <p>{{ product.productDesc }}</p>
        </template>

        <div class="tags-section" v-if="product.tags">
          <el-tag v-for="tag in product.tags.split(',')" :key="tag" style="margin-right: 8px; margin-bottom: 8px">
            {{ tag }}
          </el-tag>
        </template>

        <div class="user-section">
          <el-avatar :size="50" icon="el-icon-user"></el-avatar>
          <div class="user-info">
            <div class="user-name">卖家昵称</template>
            <div class="user-desc">信誉良好</template>
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
        <div class="icon-item" @click="handleMessage">
          <i class="el-icon-chat-dot-round"></i>
          <span>私信</span>
        </template>
      </template>
      <div class="action-buttons">
        <el-button @click="handleContact">联系卖家</el-button>
        <el-button type="primary" @click="handleBuy">立即购买</el-button>
      </template>
    </template>

    <el-drawer title="分享" :visible.sync="showShare" direction="bottom" size="30%">
      <div class="share-options">
        <div class="share-item">
          <i class="el-icon-chat" style="color: #07C160;"></i>
          <span>微信好友</span>
        </template>
        <div class="share-item">
          <i class="el-icon-picture" style="color: #FFCA28;"></i>
          <span>朋友圈</span>
        </template>
        <div class="share-item">
          <i class="el-icon-link" style="color: #1890FF;"></i>
          <span>复制链接</span>
        </template>
      </template>
    </el-drawer>
  </template>
</template>

<script>
import { getSecondhandDetail } from '@/api/secondhand'

export default {
  name: 'AppSecondhandDetail',
  data() {
    return {
      loading: true,
      product: null,
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
      getSecondhandDetail(id).then(response => {
        this.product = response.data
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
    handleMessage() {
      this.$message.info('私信功能开发中')
    },
    handleContact() {
      this.$prompt('请输入留言内容', '联系卖家', {
        confirmButtonText: '发送',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.$message.success('留言已发送')
      }).catch(() => {})
    },
    handleBuy() {
      this.$confirm('确定要购买此商品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$message.success('购买流程开发中')
      }).catch(() => {})
    },
    getConditionText(condition) {
      const texts = ['全新', '九成新', '八成新', '七成新', '六成新及以下']
      return texts[condition] || ''
    }
  }
}
</script>

<style scoped>
.app-secondhand-detail {
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

.image-swiper {
  width: 100%;
  height: 350px;
}

.detail-image {
  width: 100%;
  height: 350px;
}

.no-image {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  color: #909399;
}

.price-section {
  padding: 15px;
  background: #fff;
}

.price {
  font-size: 28px;
  color: #F56C6C;
  font-weight: bold;
}

.original-price {
  font-size: 16px;
  color: #909399;
  text-decoration: line-through;
  margin-left: 15px;
}

.title-section {
  padding: 15px;
  background: #fff;
  border-bottom: 1px solid #eee;
}

.title-section h1 {
  font-size: 18px;
  margin: 0 0 10px 0;
  line-height: 1.4;
}

.meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
}

.condition {
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 4px;
}

.info-list {
  background: #fff;
  padding: 0 15px;
}

.info-item {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item .label {
  width: 80px;
  color: #909399;
}

.info-item .value {
  flex: 1;
}

.desc-section {
  background: #fff;
  padding: 15px;
  margin-top: 10px;
}

.desc-section h3 {
  font-size: 16px;
  margin: 0 0 10px 0;
}

.desc-section p {
  line-height: 1.8;
  color: #666;
}

.tags-section {
  background: #fff;
  padding: 15px;
  margin-top: 10px;
}

.user-section {
  background: #fff;
  padding: 15px;
  margin-top: 10px;
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

.user-desc {
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

.share-options {
  display: flex;
  justify-content: space-around;
  padding: 20px;
}

.share-item {
  text-align: center;
  cursor: pointer;
}

.share-item i {
  font-size: 40px;
  display: block;
  margin-bottom: 10px;
}

.share-item span {
  font-size: 12px;
  color: #666;
}
</style>
