<template>
  <div class="lostfound-detail-container">
    <el-card v-loading="loading">
      <div slot="header">
        <span>失物招领详情</span>
        <el-button style="float: right;" type="text" @click="goBack">返回</el-button>
      </template>
      <div v-if="item" class="detail-content">
        <div class="header-section">
          <el-tag :type="item.type === 0 ? 'danger' : 'success'" size="large">
            {{ item.type === 0 ? '失物' : '招领' }}
          </el-tag>
          <h2>{{ item.title }}</h2>
        </template>
        
        <el-divider />
        
        <el-row :gutter="20">
          <el-col :span="16">
            <div class="info-grid">
              <div class="info-item">
                <span class="label">物品名称：</span>
                <span class="value">{{ item.itemName }}</span>
              </template>
              <div class="info-item">
                <span class="label">分类：</span>
                <span class="value">{{ item.categoryName || '-' }}</span>
              </template>
              <div class="info-item">
                <span class="label">{{ item.type === 0 ? '丢失' : '拾取' }}地点：</span>
                <span class="value">{{ item.location }}</span>
              </template>
              <div class="info-item">
                <span class="label">{{ item.type === 0 ? '丢失' : '拾取' }}时间：</span>
                <span class="value">{{ item.lostTime || '-' }}</span>
              </template>
              <div class="info-item">
                <span class="label">联系方式：</span>
                <span class="value">{{ item.contact }}</span>
              </template>
              <div v-if="item.reward" class="info-item">
                <span class="label">悬赏金额：</span>
                <span class="value reward">¥{{ item.reward }}</span>
              </template>
              <div class="info-item">
                <span class="label">状态：</span>
                <el-tag v-if="item.status === 0" type="warning">待审核</el-tag>
                <el-tag v-else-if="item.status === 1" type="primary">进行中</el-tag>
                <el-tag v-else-if="item.status === 2" type="success">已找到</el-tag>
                <el-tag v-else type="info">已过期</el-tag>
              </template>
              <div class="info-item">
                <span class="label">浏览量：</span>
                <span class="value">{{ item.viewCount }}</span>
              </template>
              <div class="info-item">
                <span class="label">发布时间：</span>
                <span class="value">{{ item.createTime }}</span>
              </template>
            </template>
            
            <el-divider />
            
            <div class="desc-section">
              <h4>详细描述</h4>
              <p>{{ item.description }}</p>
            </template>
          </el-col>
          
          <el-col :span="8">
            <div v-if="item.images" class="image-section">
              <el-image
                v-for="(img, index) in item.images.split(',')"
                :key="index"
                :src="img"
                style="width: 100%; margin-bottom: 10px"
                fit="contain"
              />
            </template>
          </el-col>
        </el-row>
        
        <div class="action-buttons">
          <el-button v-if="item.status === 1" type="primary" size="large" @click="handleContact">联系{{ item.type === 0 ? '失主' : '拾取者' }}</el-button>
          <el-button v-if="item.type === 0 && item.status === 1" size="large" @click="handleFound">我找到了</el-button>
          <el-button v-if="item.type === 1 && item.status === 1" size="large" @click="handleClaim">我已领取</el-button>
          <el-button size="large" @click="handleEdit">编辑</el-button>
          <el-button size="large" @click="shareToMoment">分享到朋友圈</el-button>
        </template>
      </template>
    </el-card>
  </template>
</template>

<script>
import { getLostFoundDetail } from '@/api/lostfound'

export default {
  name: 'LostFoundDetail',
  data() {
    return {
      loading: true,
      item: null
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
      this.$router.push('/lostfound/list')
    },
    handleContact() {
      this.$prompt('请输入留言内容', '联系对方', {
        confirmButtonText: '发送',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.$message.success('留言已发送')
      })
    },
    handleFound() {
      this.$confirm('确认物品已找到吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('已标记为已找到')
        this.getDetail(this.item.id)
      })
    },
    handleClaim() {
      this.$confirm('确认已领取物品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('已标记为已领取')
        this.getDetail(this.item.id)
      })
    },
    handleEdit() {
      this.$router.push(`/lostfound/edit/${this.item.id}`)
    },
    shareToMoment() {
      this.$message.info('分享功能开发中')
    }
  }
}
</script>

<style scoped>
.lostfound-detail-container {
  padding: 20px;
}
.header-section {
  margin-bottom: 20px;
}
.header-section h2 {
  margin-top: 15px;
  font-size: 24px;
}
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}
.info-item {
  display: flex;
  align-items: center;
}
.label {
  color: #909399;
  min-width: 100px;
}
.value {
  color: #606266;
}
.reward {
  color: #F56C6C;
  font-size: 18px;
  font-weight: bold;
}
.desc-section {
  margin-top: 20px;
}
.desc-section h4 {
  margin-bottom: 10px;
}
.desc-section p {
  line-height: 1.8;
  color: #606266;
}
.image-section {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
}
.action-buttons {
  margin-top: 30px;
  text-align: center;
}
.action-buttons .el-button {
  margin: 0 10px;
}
</style>
