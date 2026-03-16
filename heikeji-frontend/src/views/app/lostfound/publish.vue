<template>
  <div class="app-lostfound-publish">
    <div class="header">
      <div class="header-left" @click="goBack">
        <i class="el-icon-arrow-left"></i>
      </template>
      <div class="header-title">发布{{ form.type === 0 ? '寻物' : '招领' }}信息</template>
      <div class="header-right" @click="submitForm">
        <span>发布</span>
      </template>
    </template>

    <div class="content">
      <el-form ref="form" :model="form" :rules="rules" label-width="0">
        <div class="form-section">
          <div class="section-title">信息类型</template>
          <el-radio-group v-model="form.type" class="type-group">
            <el-radio :label="0">寻物</el-radio>
            <el-radio :label="1">招领</el-radio>
          </el-radio-group>
        </template>

        <div class="form-section">
          <div class="section-title">基本信息</template>
          <el-form-item prop="title">
            <el-input v-model="form.title" placeholder="标题" maxlength="100" show-word-limit />
          </el-form-item>
          <el-form-item prop="itemName">
            <el-input v-model="form.itemName" placeholder="物品名称" />
          </el-form-item>
          <el-form-item prop="location">
            <el-input v-model="form.location" placeholder="丢失/拾取地点" />
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="form.lostTime"
              type="datetime"
              placeholder="选择时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%"
            />
          </el-form-item>
        </template>

        <div class="form-section">
          <div class="section-title">详细信息</template>
          <el-form-item prop="description">
            <el-input v-model="form.description" type="textarea" :rows="4" placeholder="详细描述物品特征..." maxlength="500" show-word-limit />
          </el-form-item>
        </template>

        <div class="form-section">
          <div class="section-title">图片 <span class="tip">（最多3张）</span></template>
          <el-upload
            action="/api/upload"
            list-type="picture-card"
            :file-list="imageList"
            :on-success="handleUploadSuccess"
            :on-remove="handleUploadRemove"
            :limit="3"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </template>

        <div class="form-section">
          <div class="section-title">联系方式</template>
          <el-form-item prop="contact">
            <el-input v-model="form.contact" placeholder="手机号/微信号" />
          </el-form-item>
        </template>

        <div class="form-section">
          <div class="section-title">悬赏金额 <span class="tip">（可选）</span></template>
          <el-form-item>
            <div class="price-input">
              <span class="currency">¥</span>
              <el-input-number v-model="form.reward" :min="0" :precision="2" placeholder="悬赏金额" style="flex: 1" />
            </template>
          </el-form-item>
        </template>
      </el-form>
    </template>
  </template>
</template>

<script>
import { publishLostFound } from '@/api/lostfound'

export default {
  name: 'AppLostFoundPublish',
  data() {
    return {
      form: {
        type: 0,
        title: '',
        itemName: '',
        location: '',
        lostTime: null,
        description: '',
        images: '',
        contact: '',
        reward: null
      },
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        itemName: [{ required: true, message: '请输入物品名称', trigger: 'blur' }],
        location: [{ required: true, message: '请输入地点', trigger: 'blur' }],
        description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
        contact: [{ required: true, message: '请输入联系方式', trigger: 'blur' }]
      },
      imageList: []
    }
  },
  methods: {
    handleUploadSuccess(response, file) {
      const images = this.form.images ? this.form.images.split(',') : []
      images.push(response.url)
      this.form.images = images.join(',')
    },
    handleUploadRemove(file, fileList) {
      const images = fileList.map(f => f.url || f.response?.url).filter(Boolean)
      this.form.images = images.join(',')
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          publishLostFound(this.form).then(() => {
            this.$message.success('发布成功，等待审核')
            this.$router.push('/app/lostfound/list')
          }).catch(() => {
            this.$message.error('发布失败')
          })
        }
      })
    },
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style scoped>
.app-lostfound-publish {
  min-height: 100vh;
  background: #f5f5f5;
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

.header-left {
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

.header-right {
  width: 50px;
  text-align: right;
  cursor: pointer;
}

.content {
  padding: 15px;
}

.form-section {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #333;
}

.section-title .tip {
  font-weight: normal;
  color: #999;
  font-size: 12px;
}

.type-group {
  display: flex;
  gap: 20px;
}

.price-input {
  display: flex;
  align-items: center;
}

.price-input .currency {
  margin-right: 10px;
  font-size: 16px;
  color: #F56C6C;
}
</style>
