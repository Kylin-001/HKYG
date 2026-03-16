<template>
  <div class="app-secondhand-publish">
    <div class="header">
      <div class="header-left" @click="goBack">
        <i class="el-icon-arrow-left"></i>
      </template>
      <div class="header-title">发布商品</template>
      <div class="header-right" @click="submitForm">
        <span>发布</span>
      </template>
    </template>

    <div class="content">
      <el-form ref="form" :model="form" :rules="rules" label-width="0">
        <div class="form-section">
          <div class="section-title">商品信息</template>
          <el-form-item prop="productName">
            <el-input v-model="form.productName" placeholder="商品名称" maxlength="100" show-word-limit />
          </el-form-item>
          <el-form-item prop="categoryId">
            <el-select v-model="form.categoryId" placeholder="选择分类" style="width: 100%">
              <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
            </el-select>
          </el-form-item>
        </template>

        <div class="form-section">
          <div class="section-title">价格设置</template>
          <el-form-item prop="price">
            <div class="price-input">
              <span class="currency">¥</span>
              <el-input-number v-model="form.price" :min="0" :precision="2" placeholder="输入价格" style="flex: 1" />
            </template>
          </el-form-item>
          <el-form-item>
            <div class="price-input">
              <span class="currency">原价</span>
              <el-input-number v-model="form.originalPrice" :min="0" :precision="2" placeholder="原价（可选）" style="flex: 1" />
            </template>
          </el-form-item>
        </template>

        <div class="form-section">
          <div class="section-title">商品成色</template>
          <el-radio-group v-model="form.condition" class="condition-group">
            <el-radio :label="0">全新</el-radio>
            <el-radio :label="1">九成新</el-radio>
            <el-radio :label="2">八成新</el-radio>
            <el-radio :label="3">七成新</el-radio>
            <el-radio :label="4">六成新及以下</el-radio>
          </el-radio-group>
        </template>

        <div class="form-section">
          <div class="section-title">商品描述</template>
          <el-form-item prop="productDesc">
            <el-input v-model="form.productDesc" type="textarea" :rows="4" placeholder="描述一下商品的情况..." maxlength="500" show-word-limit />
          </el-form-item>
        </template>

        <div class="form-section">
          <div class="section-title">商品图片 <span class="tip">（最多5张）</span></template>
          <el-upload
            action="/api/upload"
            list-type="picture-card"
            :file-list="imageList"
            :on-success="handleUploadSuccess"
            :on-remove="handleUploadRemove"
            :limit="5"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </template>

        <div class="form-section">
          <div class="section-title">交易方式</template>
          <el-checkbox-group v-model="tradeTypes" class="trade-group">
            <el-checkbox label="0">面交</el-checkbox>
            <el-checkbox label="1">快递</el-checkbox>
          </el-checkbox-group>
        </template>

        <div class="form-section">
          <div class="section-title">交易地点</template>
          <el-form-item>
            <el-input v-model="form.tradeLocation" placeholder="方便交易的地点" />
          </el-form-item>
        </template>

        <div class="form-section">
          <div class="section-title">商品标签 <span class="tip">（用逗号分隔）</span></template>
          <el-form-item>
            <el-input v-model="form.tags" placeholder="如：教科书、九成新、便宜" />
          </el-form-item>
        </template>
      </el-form>
    </template>
  </template>
</template>

<script>
import { publishSecondhand } from '@/api/secondhand'

export default {
  name: 'AppSecondhandPublish',
  data() {
    return {
      form: {
        productName: '',
        categoryId: null,
        price: null,
        originalPrice: null,
        condition: 0,
        productDesc: '',
        images: '',
        tags: '',
        tradeType: 2,
        tradeLocation: ''
      },
      rules: {
        productName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
        price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
        condition: [{ required: true, message: '请选择成色', trigger: 'change' }],
        productDesc: [{ required: true, message: '请输入商品描述', trigger: 'blur' }]
      },
      categories: [
        { id: 1, name: '电子产品' },
        { id: 2, name: '图书教材' },
        { id: 3, name: '生活用品' },
        { id: 4, name: '运动户外' },
        { id: 5, name: '服装鞋帽' },
        { id: 6, name: '美妆护肤' },
        { id: 7, name: '其他' }
      ],
      tradeTypes: ['0', '1'],
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
          const tradeType = this.tradeTypes.length === 2 ? 2 : (this.tradeTypes[0] === '0' ? 0 : 1)
          this.form.tradeType = tradeType
          
          publishSecondhand(this.form).then(() => {
            this.$message.success('发布成功，等待审核')
            this.$router.push('/app/secondhand/list')
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
.app-secondhand-publish {
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

.price-input {
  display: flex;
  align-items: center;
}

.price-input .currency {
  margin-right: 10px;
  font-size: 16px;
  color: #F56C6C;
}

.condition-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.condition-group .el-radio {
  margin-right: 0;
}

.trade-group {
  display: flex;
  gap: 20px;
}
</style>
