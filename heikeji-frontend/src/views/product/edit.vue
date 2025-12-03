<template>
  <div class="product-edit-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ isEdit ? '编辑商品' : '添加商品' }}</span>
      </div>

      <el-form :model="productForm" :rules="rules" ref="productForm" label-width="120px">
        <!-- 基本信息 -->
        <el-form-item label="商品名称" prop="name">
          <el-input
            v-model="productForm.name"
            placeholder="请输入商品名称"
            :maxlength="100"
            show-word-limit
          ></el-input>
        </el-form-item>

        <el-form-item label="商品分类" prop="categoryId">
          <el-cascader
            v-model="categoryPath"
            :options="categoryOptions"
            placeholder="请选择商品分类"
            :props="{ expandTrigger: 'hover', checkStrictly: false }"
            @change="handleCategoryChange"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="商品品牌" prop="brandId">
          <el-select v-model="productForm.brandId" placeholder="请选择商品品牌">
            <el-option
              v-for="brand in brandList"
              :key="brand.id"
              :label="brand.name"
              :value="brand.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品价格" prop="price">
          <el-input-number
            v-model="productForm.price"
            :min="0"
            :precision="2"
            :step="0.01"
            style="width: 100%"
            placeholder="请输入商品价格"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="商品库存" prop="stock">
          <el-input-number
            v-model="productForm.stock"
            :min="0"
            :step="1"
            style="width: 100%"
            placeholder="请输入商品库存"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="商品销量" prop="sales">
          <el-input-number
            v-model="productForm.sales"
            :min="0"
            :step="1"
            style="width: 100%"
            placeholder="请输入商品销量"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="商品状态" prop="status">
          <el-switch
            v-model="productForm.status"
            active-text="上架"
            inactive-text="下架"
            active-value="1"
            inactive-value="0"
          ></el-switch>
        </el-form-item>

        <!-- 商品图片 -->
        <el-form-item label="商品图片" prop="images">
          <el-upload
            :action="'/api' + uploadProductImageUrl"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :limit="8"
            :auto-upload="true"
            :before-upload="beforeUpload"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :http-request="handleHttpRequest"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
          <div class="upload-tip">
            <el-tooltip placement="top" effect="dark">
              <div slot="content">
                <p>1. 支持JPG、PNG格式图片</p>
                <p>2. 单个图片不超过2MB</p>
                <p>3. 最多上传8张图片</p>
                <p>4. 第一张图片将作为商品主图</p>
              </div>
              <span class="tip-text">图片上传说明</span>
            </el-tooltip>
          </div>
        </el-form-item>

        <!-- 商品描述 -->
        <el-form-item label="商品描述" prop="description">
          <el-input
            v-model="productForm.description"
            type="textarea"
            rows="5"
            placeholder="请输入商品描述"
            :maxlength="500"
            show-word-limit
          ></el-input>
        </el-form-item>

        <!-- 商品详情 -->
        <el-form-item label="商品详情">
          <div class="editor-container">
            <!-- 这里可以集成富文本编辑器，暂时使用简单的文本域 -->
            <el-input
              v-model="productForm.detail"
              type="textarea"
              rows="10"
              placeholder="请输入商品详情（支持HTML）"
            ></el-input>
          </div>
        </el-form-item>

        <!-- 商品参数 -->
        <el-form-item label="商品参数">
          <el-table :data="productForm.params" style="width: 100%">
            <el-table-column prop="key" label="参数名" width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.key" placeholder="参数名"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="value" label="参数值">
              <template slot-scope="scope">
                <el-input v-model="scope.row.value" placeholder="参数值"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="handleDeleteParam(scope.$index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" size="small" @click="handleAddParam">添加参数</el-button>
        </el-form-item>

        <!-- 底部按钮 -->
        <el-form-item>
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 导入日志工具
import logger from '@/utils/logger'

import {
  getProductDetail,
  addProduct,
  updateProduct,
  getCategoryList,
  getBrandList,
  uploadProductImage,
} from '@/api/product'

export default {
  name: 'ProductEdit',
  data() {
    return {
      isEdit: false,
      productForm: {
        id: '',
        name: '',
        categoryId: null,
        brandId: null,
        price: 0,
        stock: 0,
        sales: 0,
        status: '1',
        images: [],
        description: '',
        detail: '',
        params: [],
      },
      categoryOptions: [],
      categoryPath: [],
      brandList: [],
      fileList: [],
      dialogVisible: false,
      dialogImageUrl: '',
      uploadProductImageUrl: '/product/upload/image',
      rules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 1, max: 100, message: '名称长度在 1 到 100 个字符', trigger: 'blur' },
        ],
        categoryId: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
        brandId: [{ required: true, message: '请选择商品品牌', trigger: 'change' }],
        price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
          { type: 'number', min: 0, message: '价格不能小于0', trigger: 'blur' },
        ],
        stock: [
          { required: true, message: '请输入商品库存', trigger: 'blur' },
          { type: 'number', min: 0, message: '库存不能小于0', trigger: 'blur' },
        ],
      },
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    // 初始化数据
    initData() {
      // 获取路由参数
      const { id } = this.$route.params
      if (id) {
        this.isEdit = true
        this.fetchProductDetail(id)
      }

      // 加载分类和品牌数据
      this.loadCategoryAndBrand()
    },

    // 加载分类和品牌数据
    loadCategoryAndBrand() {
      // 获取分类数据
      getCategoryList()
        .then(response => {
          this.categoryOptions = response.data
        })
        .catch(error => {
          logger.error('获取分类数据失败', error)
          this.$message.error('获取分类数据失败')
          // 使用模拟数据作为备份
          this.categoryOptions = this.getMockCategoryOptions()
        })

      // 获取品牌数据
      getBrandList()
        .then(response => {
          this.brandList = response.data
        })
        .catch(error => {
          logger.error('获取品牌数据失败', error)
          this.$message.error('获取品牌数据失败')
          // 使用模拟数据作为备份
          this.brandList = this.getMockBrandList()
        })
    },

    // 获取模拟分类数据
    getMockCategoryOptions() {
      return [
        {
          value: 1,
          label: '手机数码',
          children: [
            {
              value: 11,
              label: '智能手机',
              children: [
                { value: 111, label: '华为' },
                { value: 112, label: '小米' },
                { value: 113, label: '苹果' },
              ],
            },
            { value: 12, label: '笔记本电脑' },
            { value: 13, label: '平板电脑' },
          ],
        },
        {
          value: 2,
          label: '家用电器',
          children: [
            { value: 21, label: '冰箱' },
            { value: 22, label: '洗衣机' },
          ],
        },
      ]
    },

    // 获取模拟品牌数据
    getMockBrandList() {
      return [
        { id: 1, name: '华为' },
        { id: 2, name: '小米' },
        { id: 3, name: '苹果' },
        { id: 4, name: '三星' },
        { id: 5, name: '联想' },
      ]
    },

    // 获取商品详情
    fetchProductDetail(id) {
      getProductDetail(id)
        .then(response => {
          const product = response.data
          this.productForm = {
            id: product.id,
            name: product.name,
            categoryId: product.categoryId,
            brandId: product.brandId,
            price: product.price,
            stock: product.stock,
            sales: product.sales,
            status: product.status,
            description: product.description,
            detail: product.detail,
            params: product.params || [],
          }

          // 设置分类路径
          this.setCategoryPath(product.categoryId)

          // 设置图片列表
          this.fileList = (product.images || []).map((url, index) => ({
            name: `商品图片${index + 1}`,
            url,
          }))
        })
        .catch(error => {
          logger.error('获取商品详情失败', error)
          this.$message.error('获取商品详情失败')
          // 使用模拟数据作为备份
          this.setMockProductData(id)
        })
    },

    // 设置分类路径
    setCategoryPath(categoryId) {
      // 在实际项目中，应该根据分类ID构建完整路径
      // 这里简化处理
      if (categoryId >= 111 && categoryId <= 113) {
        this.categoryPath = [1, 11, categoryId]
      } else if (categoryId >= 11 && categoryId <= 13) {
        this.categoryPath = [1, categoryId]
      } else if (categoryId >= 1 && categoryId <= 2) {
        this.categoryPath = [categoryId]
      }
    },

    // 设置模拟商品数据
    setMockProductData(id) {
      this.productForm = {
        id,
        name: 'iPhone 13 Pro 256GB 远峰蓝色',
        categoryId: 113,
        brandId: 3,
        price: 7999.0,
        stock: 100,
        sales: 500,
        status: '1',
        description: '全新A15芯片，超强性能，专业级相机系统',
        detail:
          '<p>iPhone 13 Pro 搭载全新的 A15 仿生芯片，性能更加强大。配备 ProMotion 自适应刷新率技术，带来流畅的视觉体验。专业级相机系统，支持电影模式拍摄，让你轻松创作电影级作品。</p>',
        params: [
          { key: '屏幕尺寸', value: '6.1英寸' },
          { key: '处理器', value: 'A15仿生芯片' },
          { key: '存储容量', value: '256GB' },
          { key: '摄像头', value: '1200万像素三摄像头' },
        ],
      }

      // 设置分类路径
      this.categoryPath = [1, 11, 113]

      // 设置图片列表
      this.fileList = [
        { name: '图片1.jpg', url: 'https://placehold.co/400x400?text=iPhone13Pro' },
        { name: '图片2.jpg', url: 'https://placehold.co/400x400?text=iPhone13Pro-2' },
      ]
    },

    // 处理分类选择
    handleCategoryChange(value) {
      if (value && value.length > 0) {
        this.productForm.categoryId = value[value.length - 1]
      } else {
        this.productForm.categoryId = null
      }
    },

    // 处理图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    // 处理图片删除
    handleRemove(file, fileList) {
      // 在实际项目中，这里可能需要删除服务器上的图片
      logger.debug('删除图片', file)
      this.fileList = fileList
    },

    // 处理图片上传前的校验
    beforeUpload(file) {
      const isJPG =
        file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }

      return isJPG && isLt2M
    },

    // 处理图片上传成功
    handleUploadSuccess(response, file) {
      if (response.code === 200) {
        file.url = response.data.url
      } else {
        this.$message.error('图片上传失败')
      }
    },

    // 处理图片上传失败
    handleUploadError(error) {
      this.$message.error('图片上传失败')
    },

    // 自定义HTTP请求
    handleHttpRequest(options) {
      // 使用axios上传图片
      const formData = new FormData()
      formData.append('file', options.file)

      uploadProductImage(formData)
        .then(response => {
          if (response.code === 200) {
            options.onSuccess(response, options.file)
          } else {
            options.onError(response)
          }
        })
        .catch(error => {
          options.onError(error)
        })
    },

    // 添加参数
    handleAddParam() {
      this.productForm.params.push({ key: '', value: '' })
    },

    // 删除参数
    handleDeleteParam(index) {
      this.productForm.params.splice(index, 1)
    },

    // 处理提交
    handleSubmit() {
      this.$refs.productForm.validate(valid => {
        if (valid) {
          // 准备提交数据
          const submitData = {
            ...this.productForm,
            // 处理图片数据
            images: this.fileList.map(file => file.url),
          }

          // 提交表单
          const submitPromise = this.isEdit ? updateProduct(submitData) : addProduct(submitData)

          submitPromise
            .then(response => {
              if (response.code === 200) {
                this.$message.success(this.isEdit ? '编辑商品成功' : '添加商品成功')
                this.$router.push('/product/list')
              } else {
                this.$message.error(this.isEdit ? '编辑商品失败' : '添加商品失败')
              }
            })
            .catch(error => {
              logger.error(this.isEdit ? '编辑商品失败' : '添加商品失败', error)
              this.$message.error(this.isEdit ? '编辑商品失败' : '添加商品失败')
            })
        }
      })
    },

    // 处理取消
    handleCancel() {
      this.$confirm('确定要取消编辑吗？未保存的修改将丢失。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$router.push('/product/list')
      })
    },
  },
}
</script>

<style scoped>
.product-edit-container {
  padding: 20px;
}

.editor-container {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 10px;
  min-height: 300px;
}

.el-form-item {
  margin-bottom: 24px;
}

.el-upload--picture-card {
  width: 100px;
  height: 100px;
}

.upload-tip {
  margin-top: 10px;
}

.tip-text {
  color: #606266;
  font-size: 12px;
  cursor: pointer;
}

.tip-text:hover {
  color: #409eff;
  text-decoration: underline;
}
</style>
