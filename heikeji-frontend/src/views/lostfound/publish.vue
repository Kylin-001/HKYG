<template>
  <div class="lostfound-publish-container">
    <el-card>
      <div slot="header">
        <span>{{ isEdit ? '编辑信息' : '发布失物招领' }}</span>
      </template>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="信息类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio :label="0">失物</el-radio>
            <el-radio :label="1">招领</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.categoryId" placeholder="请选择分类">
            <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="物品名称" prop="itemName">
          <el-input v-model="form.itemName" placeholder="请输入物品名称" />
        </el-form-item>
        <el-form-item label="丢失/拾取地点" prop="location">
          <el-input v-model="form.location" placeholder="请输入地点" />
        </el-form-item>
        <el-form-item label="丢失/拾取时间">
          <el-date-picker v-model="form.lostTime" type="datetime" placeholder="选择时间" value-format="yyyy-MM-dd HH:mm:ss" />
        </el-form-item>
        <el-form-item label="详细描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="5" placeholder="请输入详细描述" maxlength="500" show-word-limit />
        </el-form-item>
        <el-form-item label="图片">
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
          <div class="upload-tip">最多上传3张图片</template>
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="form.contact" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="悬赏金额">
          <el-input-number v-model="form.reward" :min="0" :precision="2" placeholder="请输入悬赏金额" />
          <span style="margin-left: 10px">元</span>
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
import { publishLostFound, getLostFoundDetail, updateLostFound } from '@/api/lostfound'

export default {
  name: 'LostFoundPublish',
  data() {
    return {
      isEdit: false,
      form: {
        id: null,
        type: 0,
        title: '',
        categoryId: null,
        itemName: '',
        location: '',
        lostTime: null,
        description: '',
        images: '',
        contact: '',
        reward: null
      },
      rules: {
        type: [{ required: true, message: '请选择信息类型', trigger: 'change' }],
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        itemName: [{ required: true, message: '请输入物品名称', trigger: 'blur' }],
        location: [{ required: true, message: '请输入地点', trigger: 'blur' }],
        description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
        contact: [{ required: true, message: '请输入联系方式', trigger: 'blur' }]
      },
      categories: [
        { id: 1, name: '证件证明' },
        { id: 2, name: '电子产品' },
        { id: 3, name: '钱包/银行卡' },
        { id: 4, name: '钥匙' },
        { id: 5, name: '书籍/资料' },
        { id: 6, name: '其他' }
      ],
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
      getLostFoundDetail(id).then(response => {
        this.form = response.data
        this.imageList = this.form.images ? this.form.images.split(',').map((url, index) => ({
          uid: index,
          url: url
        })) : []
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
          const action = this.isEdit ? updateLostFound(this.form) : publishLostFound(this.form)
          action.then(() => {
            this.$message.success(this.isEdit ? '修改成功' : '发布成功')
            this.$router.push('/lostfound/list')
          })
        }
      })
    },
    cancel() {
      this.$router.push('/lostfound/list')
    }
  }
}
</script>

<style scoped>
.lostfound-publish-container {
  padding: 20px;
}
.upload-tip {
  color: #909399;
  font-size: 12px;
  margin-top: 5px;
}
</style>
