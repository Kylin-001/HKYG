<template>
  <div class="product-edit-container">
    <el-card class="box-card">
      <template #header>
        <div class="clearfix">
          <span>{{ isEdit ? '编辑商品' : '添加商品' }}</span>
        </div>
      </template>

      <el-form :model="productForm" :rules="rules" ref="productFormRef" label-width="120px">
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
          <el-dialog v-model="dialogVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
          <div class="upload-tip">
            <el-tooltip placement="top" effect="dark">
              <template #content>
                <p>1. 支持JPG、PNG格式图片</p>
                <p>2. 单个图片不超过2MB</p>
                <p>3. 最多上传8张图片</p>
                <p>4. 第一张图片将作为商品主图</p>
              </template>
              <span class="tip-text">图片上传说明</span>
            </el-tooltip>
          </div>
        </el-form-item>

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

        <el-form-item label="商品详情">
          <div class="editor-container">
            <el-input
              v-model="productForm.detail"
              type="textarea"
              rows="10"
              placeholder="请输入商品详情（支持HTML）"
            ></el-input>
          </div>
        </el-form-item>

        <el-form-item label="商品参数">
          <el-table :data="productForm.params" style="width: 100%">
            <el-table-column prop="key" label="参数名" width="180">
              <template #default="scope">
                <el-input v-model="scope.row.key" placeholder="参数名"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="value" label="参数值">
              <template #default="scope">
                <el-input v-model="scope.row.value" placeholder="参数值"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button type="danger" size="small" @click="handleDeleteParam(scope.$index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" size="small" @click="handleAddParam">添加参数</el-button>
        </el-form-item>

        <el-form-item>
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules, UploadUserFile, UploadProps } from 'element-plus'
import logger from '@/utils/logger'
import {
  getProductDetail,
  addProduct,
  updateProduct,
  getCategoryList,
  getBrandList,
  uploadProductImage,
} from '@/api/product'

interface ProductParam {
  key: string
  value: string
}

interface ProductForm {
  id: string
  name: string
  categoryId: number | null
  brandId: number | null
  price: number
  stock: number
  sales: number
  status: string
  images: string[]
  description: string
  detail: string
  params: ProductParam[]
}

interface Brand {
  id: number
  name: string
}

interface CategoryOption {
  value: number
  label: string
  children?: CategoryOption[]
}

const route = useRoute()
const router = useRouter()

const productFormRef = ref<FormInstance>()
const isEdit = ref(false)
const categoryOptions = ref<CategoryOption[]>([])
const categoryPath = ref<number[]>([])
const brandList = ref<Brand[]>([])
const fileList = ref<UploadUserFile[]>([])
const dialogVisible = ref(false)
const dialogImageUrl = ref('')
const uploadProductImageUrl = '/product/upload/image'

const productForm = reactive<ProductForm>({
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
})

const rules: FormRules = {
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
}

const initData = () => {
  const { id } = route.params
  if (id) {
    isEdit.value = true
    fetchProductDetail(id as string)
  }

  loadCategoryAndBrand()
}

const loadCategoryAndBrand = () => {
  getCategoryList()
    .then((response: any) => {
      categoryOptions.value = response.data
    })
    .catch((error: any) => {
      logger.error('获取分类数据失败', error)
      ElMessage.error('获取分类数据失败')
      categoryOptions.value = getMockCategoryOptions()
    })

  getBrandList()
    .then((response: any) => {
      brandList.value = response.data
    })
    .catch((error: any) => {
      logger.error('获取品牌数据失败', error)
      ElMessage.error('获取品牌数据失败')
      brandList.value = getMockBrandList()
    })
}

const getMockCategoryOptions = (): CategoryOption[] => {
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
}

const getMockBrandList = (): Brand[] => {
  return [
    { id: 1, name: '华为' },
    { id: 2, name: '小米' },
    { id: 3, name: '苹果' },
    { id: 4, name: '三星' },
    { id: 5, name: '联想' },
  ]
}

const fetchProductDetail = (id: string) => {
  getProductDetail(id)
    .then((response: any) => {
      const product = response.data
      Object.assign(productForm, {
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
      })

      setCategoryPath(product.categoryId)

      fileList.value = (product.images || []).map((url: string, index: number) => ({
        name: `商品图片${index + 1}`,
        url,
      }))
    })
    .catch((error: any) => {
      logger.error('获取商品详情失败', error)
      ElMessage.error('获取商品详情失败')
      setMockProductData(id)
    })
}

const setCategoryPath = (categoryId: number) => {
  if (categoryId >= 111 && categoryId <= 113) {
    categoryPath.value = [1, 11, categoryId]
  } else if (categoryId >= 11 && categoryId <= 13) {
    categoryPath.value = [1, categoryId]
  } else if (categoryId >= 1 && categoryId <= 2) {
    categoryPath.value = [categoryId]
  }
}

const setMockProductData = (id: string) => {
  Object.assign(productForm, {
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
  })

  categoryPath.value = [1, 11, 113]

  fileList.value = [
    { name: '图片1.jpg', url: 'https://placehold.co/400x400?text=iPhone13Pro' },
    { name: '图片2.jpg', url: 'https://placehold.co/400x400?text=iPhone13Pro-2' },
  ]
}

const handleCategoryChange = (value: number[]) => {
  if (value && value.length > 0) {
    productForm.categoryId = value[value.length - 1]
  } else {
    productForm.categoryId = null
  }
}

const handlePictureCardPreview: UploadProps['onPreview'] = file => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const handleRemove: UploadProps['onRemove'] = (file, uploadFileList) => {
  logger.debug('删除图片', file)
  fileList.value = uploadFileList
}

const beforeUpload: UploadProps['beforeUpload'] = file => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('上传图片只能是 JPG/PNG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 2MB!')
  }

  return isJPG && isLt2M
}

const handleUploadSuccess: UploadProps['onSuccess'] = (response, file) => {
  if (response.code === 200) {
    file.url = response.data.url
  } else {
    ElMessage.error('图片上传失败')
  }
}

const handleUploadError: UploadProps['onError'] = error => {
  ElMessage.error('图片上传失败')
  logger.error('图片上传失败', error)
}

const handleHttpRequest = (options: any) => {
  const formData = new FormData()
  formData.append('file', options.file)

  uploadProductImage(formData)
    .then((response: any) => {
      if (response.code === 200) {
        options.onSuccess(response, options.file)
      } else {
        options.onError(response)
      }
    })
    .catch((error: any) => {
      options.onError(error)
    })
}

const handleAddParam = () => {
  productForm.params.push({ key: '', value: '' })
}

const handleDeleteParam = (index: number) => {
  productForm.params.splice(index, 1)
}

const handleSubmit = async () => {
  if (!productFormRef.value) return

  await productFormRef.value.validate(valid => {
    if (valid) {
      const submitData = {
        ...productForm,
        images: fileList.value.map(file => file.url),
      }

      const submitPromise = isEdit.value ? updateProduct(submitData) : addProduct(submitData)

      submitPromise
        .then((response: any) => {
          if (response.code === 200) {
            ElMessage.success(isEdit.value ? '编辑商品成功' : '添加商品成功')
            router.push('/product/list')
          } else {
            ElMessage.error(isEdit.value ? '编辑商品失败' : '添加商品失败')
          }
        })
        .catch((error: any) => {
          logger.error(isEdit.value ? '编辑商品失败' : '添加商品失败', error)
          ElMessage.error(isEdit.value ? '编辑商品失败' : '添加商品失败')
        })
    }
  })
}

const handleCancel = () => {
  ElMessageBox.confirm('确定要取消编辑吗？未保存的修改将丢失。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    router.push('/product/list')
  })
}

onMounted(() => {
  initData()
})
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

:deep(.el-upload--picture-card) {
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
