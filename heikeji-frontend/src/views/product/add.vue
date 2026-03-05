<template>
  <div class="product-add-container">
    <el-card class="box-card">
      <template #header>
        <div class="clearfix">
          <span>添加商品</span>
          <el-button-group>
            <el-button size="small" @click="resetForm">重置表单</el-button>
            <el-button size="small" @click="previewProduct">预览商品</el-button>
            <el-button size="small" type="primary" @click="handleSubmit">保存商品</el-button>
          </el-button-group>
        </div>
      </template>

      <el-form :model="formData" :rules="rules" ref="formDataRef" label-width="100px">
        <el-steps :active="activeStep" finish-status="success" class="mb-20">
          <el-step title="基本信息" description="设置商品基本参数"></el-step>
          <el-step title="商品图片" description="上传商品主图和详情图"></el-step>
          <el-step title="商品详情" description="设置商品详细描述"></el-step>
          <el-step title="参数配置" description="设置商品参数和规格"></el-step>
        </el-steps>

        <!-- 步骤1：基本信息 -->
        <div v-if="activeStep === 0" class="step-content">
          <el-form-item label="商品分类" prop="categoryId">
            <el-cascader
              v-model="formData.categoryId"
              :options="categoryOptions"
              :props="{ expandTrigger: 'hover', value: 'id', label: 'name', children: 'children' }"
              placeholder="请选择商品分类"
              @change="handleCategoryChange"
            ></el-cascader>
          </el-form-item>

          <el-form-item label="商品品牌" prop="brandId">
            <el-select v-model="formData.brandId" placeholder="请选择商品品牌">
              <el-option
                v-for="brand in brandOptions"
                :key="brand.id"
                :label="brand.name"
                :value="brand.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="商品名称" prop="name">
            <el-input
              v-model="formData.name"
              placeholder="请输入商品名称"
              maxlength="100"
              show-word-limit
            ></el-input>
          </el-form-item>

          <el-form-item label="商品关键词" prop="keywords">
            <el-input
              v-model="formData.keywords"
              placeholder="请输入商品关键词，多个关键词用逗号分隔"
              maxlength="200"
              show-word-limit
            ></el-input>
          </el-form-item>

          <el-form-item label="商品售价" prop="price">
            <el-input-number
              v-model="formData.price"
              :min="0.01"
              :precision="2"
              :step="0.01"
              style="width: 100%"
              placeholder="请输入商品售价"
            >
              <template #prepend>¥</template>
            </el-input-number>
          </el-form-item>

          <el-form-item label="商品库存" prop="stock">
            <el-input-number
              v-model="formData.stock"
              :min="0"
              :step="1"
              style="width: 100%"
              placeholder="请输入商品库存"
            ></el-input-number>
          </el-form-item>

          <el-form-item label="销量" prop="sales" v-if="isEdit">
            <el-input-number
              v-model="formData.sales"
              :min="0"
              :step="1"
              style="width: 100%"
              placeholder="请输入商品销量"
            ></el-input-number>
          </el-form-item>

          <el-form-item label="商品重量" prop="weight">
            <el-input-number
              v-model="formData.weight"
              :min="0"
              :precision="2"
              :step="0.01"
              style="width: 100%"
              placeholder="请输入商品重量(kg)"
            >
              <template #append>kg</template>
            </el-input-number>
          </el-form-item>

          <el-form-item label="商品状态" prop="status">
            <el-switch
              v-model="formData.status"
              active-text="上架"
              inactive-text="下架"
              active-value="1"
              inactive-value="0"
            ></el-switch>
          </el-form-item>

          <el-form-item label="是否新品" prop="isNew">
            <el-switch
              v-model="formData.isNew"
              active-text="是"
              inactive-text="否"
              active-value="1"
              inactive-value="0"
            ></el-switch>
          </el-form-item>

          <el-form-item label="是否热销" prop="isHot">
            <el-switch
              v-model="formData.isHot"
              active-text="是"
              inactive-text="否"
              active-value="1"
              inactive-value="0"
            ></el-switch>
          </el-form-item>

          <el-form-item label="商品简介" prop="brief">
            <el-input
              v-model="formData.brief"
              type="textarea"
              rows="3"
              placeholder="请输入商品简介"
              maxlength="200"
              show-word-limit
            ></el-input>
          </el-form-item>
        </div>

        <!-- 步骤2：商品图片 -->
        <div v-if="activeStep === 1" class="step-content">
          <el-form-item label="商品主图" prop="mainImages">
            <el-upload
              v-model:file-list="formData.mainImages"
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :multiple="true"
              :limit="8"
              :on-change="handleMainImageChange"
              :on-remove="handleMainImageRemove"
              :on-preview="handleMainImagePreview"
              accept="image/*"
            >
              <i class="el-icon-plus"></i>
              <template #tip>
                <div>请上传商品主图，最多8张，支持jpg/png格式，单张图片不超过2MB</div>
              </template>
            </el-upload>
          </el-form-item>

          <el-form-item label="详情图片" prop="detailImages">
            <el-upload
              v-model:file-list="formData.detailImages"
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :multiple="true"
              :limit="20"
              :on-change="handleDetailImageChange"
              :on-remove="handleDetailImageRemove"
              :on-preview="handleDetailImagePreview"
              accept="image/*"
            >
              <i class="el-icon-plus"></i>
              <template #tip>
                <div>请上传商品详情图片，最多20张，支持jpg/png格式，单张图片不超过2MB</div>
              </template>
            </el-upload>
          </el-form-item>
        </div>

        <!-- 步骤3：商品详情 -->
        <div v-if="activeStep === 2" class="step-content">
          <el-form-item label="商品描述" prop="description">
            <div class="editor-container">
              <el-input
                v-model="formData.description"
                type="textarea"
                rows="10"
                placeholder="请输入商品详细描述"
                maxlength="10000"
                show-word-limit
              ></el-input>
              <p class="editor-tip">提示：您可以输入HTML内容来丰富商品详情展示效果</p>
            </div>
          </el-form-item>
        </div>

        <!-- 步骤4：参数配置 -->
        <div v-if="activeStep === 3" class="step-content">
          <el-form-item label="商品参数" prop="params">
            <div v-for="(param, index) in formData.params" :key="index" class="param-item">
              <el-input
                v-model="param.name"
                placeholder="参数名称"
                style="width: 200px; margin-right: 10px"
              ></el-input>
              <el-input
                v-model="param.value"
                placeholder="参数值"
                style="flex: 1; margin-right: 10px"
              ></el-input>
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="removeParam(index)"
                v-if="index > 0"
              ></el-button>
            </div>
            <el-button type="primary" size="small" @click="addParam" class="mt-10">
              <i class="el-icon-plus"></i> 添加参数
            </el-button>
          </el-form-item>

          <el-form-item label="商品规格" prop="specs">
            <div v-if="formData.specs.length > 0" class="spec-container">
              <div v-for="(spec, specIndex) in formData.specs" :key="specIndex" class="spec-item">
                <h4 class="spec-title">规格{{ specIndex + 1 }}: {{ spec.name }}</h4>
                <div class="spec-values">
                  <el-tag
                    v-for="(value, valueIndex) in spec.values"
                    :key="valueIndex"
                    closable
                    :disable-transitions="false"
                    @close="removeSpecValue(specIndex, valueIndex)"
                    class="spec-value-tag"
                    >{{ value }}</el-tag
                  >
                  <el-input
                    v-model="spec.newValue"
                    placeholder="输入规格值"
                    style="width: 150px; margin-left: 10px"
                    @keyup.enter="addSpecValue(specIndex)"
                  ></el-input>
                  <el-button size="small" @click="addSpecValue(specIndex)">添加</el-button>
                </div>
              </div>

              <el-button type="primary" size="small" @click="addSpec" class="mt-10 mb-10">
                <i class="el-icon-plus"></i> 添加规格
              </el-button>

              <div v-if="hasSpecCombinations" class="sku-table-container">
                <h4 class="spec-title">规格组合价格库存设置</h4>
                <el-table :data="formData.skus" style="width: 100%" border>
                  <el-table-column
                    v-for="(spec, index) in formData.specs"
                    :key="index"
                    :label="spec.name"
                    min-width="120"
                  ></el-table-column>
                  <el-table-column prop="price" label="价格" width="100" align="center">
                    <template #default="scope">
                      <el-input-number
                        v-model="scope.row.price"
                        :min="0.01"
                        :precision="2"
                        :step="0.01"
                        style="width: 100px"
                      ></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column prop="stock" label="库存" width="100" align="center">
                    <template #default="scope">
                      <el-input-number
                        v-model="scope.row.stock"
                        :min="0"
                        :step="1"
                        style="width: 100px"
                      ></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column prop="skuCode" label="SKU编码" width="180" align="center">
                    <template #default="scope">
                      <el-input v-model="scope.row.skuCode" placeholder="SKU编码" />
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div v-else class="no-specs">暂无规格，点击"添加规格"按钮开始设置</div>
          </el-form-item>
        </div>

        <el-form-item class="step-navigation">
          <el-button @click="prevStep" v-if="activeStep > 0">上一步</el-button>
          <el-button type="primary" @click="nextStep" v-else-if="activeStep < 3">下一步</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog
      v-model="previewDialogVisible"
      :show-close="false"
      class="image-preview-dialog"
    >
      <img :src="previewImageSrc" class="preview-image" alt="预览图片" />
      <span class="el-dialog__close" @click="previewDialogVisible = false">×</span>
    </el-dialog>

    <!-- 保存确认对话框 -->
    <el-dialog title="保存确认" v-model="saveConfirmVisible" width="400px">
      <div class="save-confirm-content">
        <p>确认保存商品信息吗？</p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="saveConfirmVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmSave">确认保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules, UploadUserFile, UploadFile } from 'element-plus'
import logger from '@/utils/logger'

interface ProductParam {
  name: string
  value: string
}

interface ProductSpec {
  name: string
  values: string[]
  newValue: string
}

interface ProductSku {
  id: number
  specs: string[]
  price: number
  stock: number
  skuCode: string
}

interface FormData {
  id: string
  name: string
  keywords: string
  categoryId: number[]
  brandId: number | null
  price: number
  stock: number
  sales: number
  weight: number
  status: string
  isNew: string
  isHot: string
  brief: string
  mainImages: UploadUserFile[]
  detailImages: UploadUserFile[]
  description: string
  params: ProductParam[]
  specs: ProductSpec[]
  skus: ProductSku[]
}

interface Brand {
  id: number
  name: string
}

interface Category {
  id: number
  name: string
  children?: Category[]
}

const route = useRoute()
const router = useRouter()

const formDataRef = ref<FormInstance>()
const activeStep = ref(0)
const isEdit = ref(false)
const productId = ref('')
const categoryOptions = ref<Category[]>([])
const brandOptions = ref<Brand[]>([])
const previewDialogVisible = ref(false)
const previewImageSrc = ref('')
const saveConfirmVisible = ref(false)

const formData = reactive<FormData>({
  id: '',
  name: '',
  keywords: '',
  categoryId: [],
  brandId: null,
  price: 0,
  stock: 0,
  sales: 0,
  weight: 0,
  status: '1',
  isNew: '0',
  isHot: '0',
  brief: '',
  mainImages: [],
  detailImages: [],
  description: '',
  params: [{ name: '', value: '' }],
  specs: [],
  skus: [],
})

const rules: FormRules = {
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { max: 100, message: '名称长度不能超过100个字符', trigger: 'blur' },
  ],
  categoryId: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
  brandId: [{ required: true, message: '请选择商品品牌', trigger: 'change' }],
  price: [
    { required: true, message: '请输入商品售价', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '价格必须大于0', trigger: 'blur' },
  ],
  stock: [
    { required: true, message: '请输入商品库存', trigger: 'blur' },
    { type: 'number', min: 0, message: '库存不能小于0', trigger: 'blur' },
  ],
  mainImages: [{ required: true, message: '请至少上传一张商品主图', trigger: 'change' }],
}

const hasSpecCombinations = computed(() => {
  return (
    formData.specs.length > 0 &&
    formData.specs.every((spec) => spec.values.length > 0) &&
    formData.skus.length > 0
  )
})

const initData = () => {
  categoryOptions.value = [
    {
      id: 1,
      name: '手机数码',
      children: [
        {
          id: 101,
          name: '手机',
          children: [
            { id: 10101, name: 'iPhone' },
            { id: 10102, name: 'Android手机' },
          ],
        },
        {
          id: 102,
          name: '耳机音箱',
          children: [
            { id: 10201, name: '蓝牙耳机' },
            { id: 10202, name: '有线耳机' },
          ],
        },
      ],
    },
    {
      id: 2,
      name: '家用电器',
      children: [
        { id: 201, name: '冰箱', children: [] },
        { id: 202, name: '空调', children: [] },
      ],
    },
  ]

  brandOptions.value = [
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Samsung' },
    { id: 3, name: 'Huawei' },
    { id: 4, name: 'Xiaomi' },
    { id: 5, name: 'OPPO' },
    { id: 6, name: 'vivo' },
  ]
}

const fetchProductDetail = () => {
  setTimeout(() => {
    Object.assign(formData, {
      id: productId.value,
      name: 'Apple iPhone 15 Pro',
      keywords: 'iPhone,苹果,手机,Pro',
      categoryId: [1, 101, 10101],
      brandId: 1,
      price: 8999.0,
      stock: 100,
      sales: 50,
      weight: 0.2,
      status: '1',
      isNew: '1',
      isHot: '1',
      brief: '最新款iPhone，搭载A17 Pro芯片，钛金属设计，支持USB-C接口。',
      mainImages: [
        { url: 'https://via.placeholder.com/400' },
        { url: 'https://via.placeholder.com/400' },
      ],
      detailImages: [
        { url: 'https://via.placeholder.com/800x600' },
        { url: 'https://via.placeholder.com/800x600' },
      ],
      description: '<p>这是商品详细描述，支持HTML格式</p>',
      params: [
        { name: '颜色', value: '钛原色' },
        { name: '存储', value: '256GB' },
      ],
      specs: [
        {
          name: '颜色',
          values: ['钛原色', '蓝色钛金属', '白色钛金属', '黑色钛金属'],
          newValue: '',
        },
        {
          name: '存储容量',
          values: ['128GB', '256GB', '512GB', '1TB'],
          newValue: '',
        },
      ],
      skus: [],
    })

    generateSkuCombinations()
  }, 500)
}

const getCombinations = (arrays: string[][]): string[][] => {
  if (arrays.length === 0) return [[]]
  if (arrays.length === 1) return arrays[0].map((item) => [item])

  const result: string[][] = []
  const rest = getCombinations(arrays.slice(1))

  arrays[0].forEach((item) => {
    rest.forEach((combination) => {
      result.push([item].concat(combination))
    })
  })

  return result
}

const generateSkuCombinations = () => {
  const specs = formData.specs.filter((spec) => spec.values.length > 0)
  if (specs.length === 0) {
    formData.skus = []
    return
  }

  const combinations = getCombinations(specs.map((spec) => spec.values))

  formData.skus = combinations.map((combo) => ({
    id: Date.now() + Math.random(),
    specs: combo,
    price: formData.price,
    stock: 0,
    skuCode: combo.join('-'),
  }))
}

const nextStep = () => {
  if (validateCurrentStep()) {
    if (activeStep.value < 3) {
      activeStep.value++
      if (activeStep.value === 3) {
        generateSkuCombinations()
      }
    }
  }
}

const prevStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--
  }
}

const validateCurrentStep = (): boolean => {
  const step = activeStep.value
  let valid = true

  if (step === 0) {
    formDataRef.value?.validateField(['name', 'categoryId', 'brandId', 'price', 'stock'])
  } else if (step === 1) {
    if (formData.mainImages.length === 0) {
      ElMessage.warning('请至少上传一张商品主图')
      valid = false
    }
  }

  return valid
}

const resetForm = () => {
  formDataRef.value?.resetFields()
  activeStep.value = 0
  Object.assign(formData, {
    id: '',
    name: '',
    keywords: '',
    categoryId: [],
    brandId: null,
    price: 0,
    stock: 0,
    sales: 0,
    weight: 0,
    status: '1',
    isNew: '0',
    isHot: '0',
    brief: '',
    mainImages: [],
    detailImages: [],
    description: '',
    params: [{ name: '', value: '' }],
    specs: [],
    skus: [],
  })
}

const previewProduct = () => {
  ElMessage.info('预览功能开发中...')
}

const handleSubmit = () => {
  saveConfirmVisible.value = true
}

const confirmSave = async () => {
  if (!formDataRef.value) return

  await formDataRef.value.validate((valid) => {
    if (valid) {
      setTimeout(() => {
        ElMessage.success('商品保存成功！')
        saveConfirmVisible.value = false
        router.push('/product/list')
      }, 1000)
    } else {
      ElMessage.error('请完善表单信息')
      saveConfirmVisible.value = false
    }
  })
}

const handleCategoryChange = (value: number[]) => {
  logger.log('分类选择:', value)
}

const addParam = () => {
  formData.params.push({ name: '', value: '' })
}

const removeParam = (index: number) => {
  formData.params.splice(index, 1)
}

const addSpec = () => {
  formData.specs.push({
    name: '',
    values: [],
    newValue: '',
  })
}

const removeSpec = (index: number) => {
  formData.specs.splice(index, 1)
  generateSkuCombinations()
}

const addSpecValue = (specIndex: number) => {
  const spec = formData.specs[specIndex]
  if (spec.newValue && !spec.values.includes(spec.newValue)) {
    spec.values.push(spec.newValue)
    spec.newValue = ''
    generateSkuCombinations()
  }
}

const removeSpecValue = (specIndex: number, valueIndex: number) => {
  formData.specs[specIndex].values.splice(valueIndex, 1)
  generateSkuCombinations()
}

const handleMainImageChange = (file: UploadFile, fileList: UploadUserFile[]) => {
  formData.mainImages = fileList
}

const handleMainImageRemove = (file: UploadFile, fileList: UploadUserFile[]) => {
  formData.mainImages = fileList
}

const handleMainImagePreview = (file: UploadFile) => {
  previewImageSrc.value = file.url!
  previewDialogVisible.value = true
}

const handleDetailImageChange = (file: UploadFile, fileList: UploadUserFile[]) => {
  formData.detailImages = fileList
}

const handleDetailImageRemove = (file: UploadFile, fileList: UploadUserFile[]) => {
  formData.detailImages = fileList
}

const handleDetailImagePreview = (file: UploadFile) => {
  previewImageSrc.value = file.url!
  previewDialogVisible.value = true
}

onMounted(() => {
  initData()
  productId.value = (route.params.id as string) || (route.query.id as string) || ''
  if (productId.value) {
    isEdit.value = true
    fetchProductDetail()
  }
})
</script>

<style scoped>
.product-add-container {
  padding: 20px;
}

.mb-20 {
  margin-bottom: 20px;
}

.mt-10 {
  margin-top: 10px;
}

.mb-10 {
  margin-bottom: 10px;
}

.step-content {
  padding: 20px 0;
}

.param-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.spec-container {
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  padding: 20px;
  margin-top: 10px;
}

.spec-item {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.spec-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.spec-title {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 14px;
  font-weight: bold;
}

.spec-values {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.spec-value-tag {
  margin-right: 0;
}

.no-specs {
  text-align: center;
  color: #909399;
  font-style: italic;
  padding: 40px 20px;
  border: 2px dashed #e6e6e6;
  border-radius: 4px;
  margin-top: 10px;
}

.sku-table-container {
  margin-top: 20px;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  padding: 15px;
}

.editor-container {
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  padding: 15px;
}

.editor-tip {
  color: #909399;
  font-size: 12px;
  margin-top: 8px;
  margin-bottom: 0;
}

.step-navigation {
  margin-top: 30px;
  text-align: center;
}

.image-preview-dialog :deep(.el-dialog__body) {
  text-align: center;
}

.preview-image {
  max-width: 100%;
  max-height: 80vh;
}

.save-confirm-content {
  text-align: center;
  padding: 20px 0;
}

.save-confirm-content p {
  font-size: 16px;
  color: #303133;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}
</style>
