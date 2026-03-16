<template>
  <div class="secondhand-publish-container">
    <el-card>
      <div slot="header">
        <span>{{ isEdit ? '编辑商品' : '发布商品' }}</span>
      </template>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="form.productName" placeholder="请输入商品名称" maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="商品分类" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="请选择分类">
            <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input-number v-model="form.price" :min="0" :precision="2" placeholder="请输入价格" />
          <span style="margin-left: 10px">元</span>
        </el-form-item>
        <el-form-item label="商品原价">
          <el-input-number v-model="form.originalPrice" :min="0" :precision="2" placeholder="请输入原价" />
          <span style="margin-left: 10px">元</span>
        </el-form-item>
        <el-form-item label="商品成色" prop="condition">
          <el-radio-group v-model="form.condition">
            <el-radio :label="0">全新</el-radio>
            <el-radio :label="1">九成新</el-radio>
            <el-radio :label="2">八成新</el-radio>
            <el-radio :label="3">七成新</el-radio>
            <el-radio :label="4">六成新及以下</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品描述" prop="productDesc">
          <el-input v-model="form.productDesc" type="textarea" :rows="5" placeholder="请输入商品描述" maxlength="500" show-word-limit />
        </el-form-item>
        <el-form-item label="商品图片">
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
          <div class="upload-tip">最多上传5张图片</template>
        </el-form-item>
        <el-form-item label="商品标签">
          <el-input v-model="form.tags" placeholder="多个标签用逗号分隔" />
        </el-form-item>
        <el-form-item label="交易方式" prop="tradeType">
          <el-checkbox-group v-model="tradeTypes">
            <el-checkbox label="0">面交</el-checkbox>
            <el-checkbox label="1">快递</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="交易地点">
          <el-input v-model="form.tradeLocation" placeholder="请输入交易地点" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </template>
</template>

<script>
import { publishSecondhand, getSecondhandDetail, updateSecondhand } from '@/api/secondhand'

export default {
  name: 'SecondhandPublish',
  data() {
    return {
      isEdit: false,
      form: {
        id: null,
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
        categoryId: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
        price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        condition: [{ required: true, message: '请选择商品成色', trigger: 'change' }],
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
      tradeTypes: [],
      imageList: []
    }
  },
  created() {
    const id = this.$route.params.id
    if (id) {
      this.isEdit = true
      this.getDetail(id)
    }
  },
  methods: {
    getDetail(id) {
      getSecondhandDetail(id).then(response => {
        this.form = response.data
        this.imageList = this.form.images ? this.form.images.split(',').map((url, index) => ({
          uid: index,
          url: url
        })) : []
        this.tradeTypes = this.form.tradeType !== null ? String(this.form.tradeType).split('') : []
      })
    },
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
          
          const action = this.isEdit ? updateSecondhand(this.form) : publishSecondhand(this.form)
          action.then(() => {
            this.$message.success(this.isEdit ? '修改成功' : '发布成功')
            this.$router.push('/secondhand/list')
          })
        }
      })
    },
    cancel() {
      this.$router.push('/secondhand/list')
    }
  }
}
</script>

<style scoped>
.secondhand-publish-container {
  padding: 20px;
}
.upload-tip {
  color: #909399;
  font-size: 12px;
  margin-top: 5px;
}
</style>
