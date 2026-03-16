<template>
  <div class="secondhand-detail-container">
    <el-card v-loading="loading">
      <div slot="header">
        <span>商品详情</span>
        <el-button style="float: right;" type="text" @click="goBack">返回</el-button>
      </template>
      <div v-if="product" class="detail-content">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-image v-if="product.images" :src="product.images.split(',')[0]" style="width: 100%; height: 400px" fit="contain" />
            <div v-else class="no-image">暂无图片</template>
            <div v-if="product.images && product.images.split(',').length > 1" class="image-list">
              <el-image
                v-for="(img, index) in product.images.split(',').slice(1)"
                :key="index"
                :src="img"
                style="width: 80px; height: 80px; margin-right: 10px"
                fit="cover"
              />
            </template>
          </el-col>
          <el-col :span="14">
            <h2>{{ product.productName }}</h2>
            <div class="price-row">
              <span class="price">¥{{ product.price }}</span>
              <span v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice }}</span>
            </template>
            <el-divider />
            <div class="info-row">
              <span class="label">商品分类：</span>
              <span>{{ product.categoryName || '-' }}</span>
            </template>
            <div class="info-row">
              <span class="label">商品成色：</span>
              <el-tag v-if="product.condition === 0" type="success">全新</el-tag>
              <el-tag v-else-if="product.condition === 1">九成新</el-tag>
              <el-tag v-else-if="product.condition === 2">八成新</el-tag>
              <el-tag v-else-if="product.condition === 3">七成新</el-tag>
              <el-tag v-else type="info">六成新及以下</el-tag>
            </template>
            <div class="info-row">
              <span class="label">交易方式：</span>
              <span v-if="product.tradeType === 0">面交</span>
              <span v-else-if="product.tradeType === 1">快递</span>
              <span v-else>面交、快递均可</span>
            </template>
            <div v-if="product.tradeLocation" class="info-row">
              <span class="label">交易地点：</span>
              <span>{{ product.tradeLocation }}</span>
            </template>
            <div class="info-row">
              <span class="label">商品状态：</span>
              <el-tag v-if="product.status === 0" type="warning">待审核</el-tag>
              <el-tag v-else-if="product.status === 1" type="success">上架</el-tag>
              <el-tag v-else-if="product.status === 2">下架</el-tag>
              <el-tag v-else-if="product.status === 3" type="info">已售出</el-tag>
              <el-tag v-else type="danger">审核失败</el-tag>
            </template>
            <div class="info-row">
              <span class="label">浏览量：</span>
              <span>{{ product.viewCount }}</span>
            </template>
            <div class="info-row">
              <span class="label">发布时间：</span>
              <span>{{ product.createTime }}</span>
            </template>
            <el-divider />
            <div class="desc-section">
              <h4>商品描述</h4>
              <p>{{ product.productDesc }}</p>
            </template>
            <div v-if="product.tags" class="tags-section">
              <el-tag v-for="tag in product.tags.split(',')" :key="tag" style="margin-right: 8px">{{ tag }}</el-tag>
            </template>
            <div class="action-buttons">
              <el-button v-if="product.status === 1" type="primary" size="large">联系卖家</el-button>
              <el-button v-if="product.status === 1" size="large">立即购买</el-button>
              <el-button v-if="product.status === 0 || product.status === 2" size="large" @click="handleEdit">编辑</el-button>
            </template>
          </el-col>
        </el-row>
      </template>
    </el-card>
  </template>
</template>

<script>
import { getSecondhandDetail } from '@/api/secondhand'

export default {
  name: 'SecondhandDetail',
  data() {
    return {
      loading: true,
      product: null
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
      this.$router.push('/secondhand/list')
    },
    handleEdit() {
      this.$router.push(`/secondhand/edit/${this.product.id}`)
    }
  }
}
</script>

<style scoped>
.secondhand-detail-container {
  padding: 20px;
}
.detail-content {
  padding: 20px 0;
}
.no-image {
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  color: #909399;
}
.image-list {
  margin-top: 10px;
}
.price-row {
  margin: 20px 0;
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
.info-row {
  margin: 15px 0;
  font-size: 14px;
}
.label {
  color: #909399;
  display: inline-block;
  width: 100px;
}
.desc-section {
  margin: 20px 0;
}
.desc-section h4 {
  margin-bottom: 10px;
}
.desc-section p {
  line-height: 1.8;
  color: #606266;
}
.tags-section {
  margin: 20px 0;
}
.action-buttons {
  margin-top: 30px;
}
</style>
