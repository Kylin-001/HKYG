<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="70%"
    :before-close="handleClose"
    destroy-on-close
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      label-position="right"
    >
      <el-tabs v-model="activeTab">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="basic">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="商品名称" prop="name">
                <el-input v-model="formData.name" placeholder="请输入商品名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商品编号" prop="code">
                <el-input v-model="formData.code" placeholder="请输入商品编号" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="商品分类" prop="categoryId">
            <el-select
              v-model="formData.categoryId"
              placeholder="请选择商品分类"
              style="width: 100%"
            >
              <el-option
                v-for="category in categories"
                :key="category.id"
                :label="category.name"
                :value="category.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="商品描述">
            <el-input
              v-model="formData.description"
              type="textarea"
              :rows="3"
              placeholder="请输入商品描述"
            />
          </el-form-item>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="销售价格" prop="price">
                <el-input-number
                  v-model="formData.price"
                  :precision="2"
                  :min="0"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="原价">
                <el-input-number
                  v-model="formData.originalPrice"
                  :precision="2"
                  :min="0"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="成本价">
                <el-input-number
                  v-model="formData.costPrice"
                  :precision="2"
                  :min="0"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="库存数量" prop="stock">
                <el-input-number
                  v-model="formData.stock"
                  :min="0"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="排序">
                <el-input-number
                  v-model="formData.sort"
                  :min="0"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品状态" prop="status">
                <el-radio-group v-model="formData.status">
                  <el-radio :label="1">上架</el-radio>
                  <el-radio :label="2">下架</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="商品标签">
            <el-tag
              v-for="tag in formData.tags"
              :key="tag"
              closable
              @close="removeTag(tag)"
              style="margin-right: 8px; margin-bottom: 8px"
            >
              {{ tag }}
            </el-tag>
            <el-input
              v-if="inputVisible"
              ref="inputRef"
              v-model="inputValue"
              size="small"
              style="width: 120px"
              @keyup.enter="handleInputConfirm"
              @blur="handleInputConfirm"
            />
            <el-button v-else size="small" @click="showInput">+ 添加标签</el-button>
          </el-form-item>

          <el-form-item label="特殊属性">
            <el-checkbox v-model="formData.isHot">热销商品</el-checkbox>
            <el-checkbox v-model="formData.isNew">新品</el-checkbox>
            <el-checkbox v-model="formData.isRecommended">推荐商品</el-checkbox>
          </el-form-item>
        </el-tab-pane>

        <!-- 商品图片 -->
        <el-tab-pane label="商品图片" name="images">
          <el-form-item label="商品主图" prop="image">
            <ImageUpload v-model="formData.image" :limit="1" />
          </el-form-item>

          <el-form-item label="商品图库">
            <ImageUpload v-model="formData.images" :limit="9" />
          </el-form-item>
        </el-tab-pane>

        <!-- 商品规格 -->
        <el-tab-pane label="商品规格" name="specifications">
          <div class="specifications-container">
            <div
              v-for="(spec, index) in formData.specifications"
              :key="index"
              class="specification-item"
            >
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-input v-model="spec.name" placeholder="规格名称" />
                </el-col>
                <el-col :span="12">
                  <el-input v-model="spec.value" placeholder="规格值" />
                </el-col>
                <el-col :span="2">
                  <el-input-number
                    v-model="spec.sort"
                    :min="0"
                    style="width: 100%"
                  />
                </el-col>
                <el-col :span="2">
                  <el-button
                    type="danger"
                    icon="Delete"
                    circle
                    size="small"
                    @click="removeSpecification(index)"
                  />
                </el-col>
              </el-row>
            </div>
            <el-button type="primary" @click="addSpecification">添加规格</el-button>
          </div>
        </el-tab-pane>

        <!-- SEO信息 -->
        <el-tab-pane label="SEO信息" name="seo">
          <el-form-item label="SEO关键词">
            <el-input
              v-model="formData.seoKeywords"
              placeholder="请输入SEO关键词，多个关键词用逗号分隔"
            />
          </el-form-item>
          <el-form-item label="SEO描述">
            <el-input
              v-model="formData.seoDescription"
              type="textarea"
              :rows="3"
              placeholder="请输入SEO描述"
            />
          </el-form-item>
        </el-tab-pane>

        <!-- 商品详情 -->
        <el-tab-pane label="商品详情" name="details">
          <el-form-item label="详情内容">
            <Editor v-model="formData.details" />
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          {{ mode === 'add' ? '创建' : '更新' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { ElMessage, ElForm } from 'element-plus'
import { createProduct, updateProduct, getProductDetail, getProductCategories } from '@/api/product'
import ImageUpload from '@/components/ImageUpload/index.vue'
import Editor from '@/components/Editor/index.vue'
import type { ProductForm, ProductCategory, ProductSpecification } from '@/types/product'

interface Props {
  visible: boolean
  productId: string | null
  mode: 'add' | 'edit'
}

interface Emits {
  (e: 'update:visible', visible: boolean): void
  (e: 'refresh'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formRef = ref<InstanceType<typeof ElForm>>()
const inputRef = ref()

const submitLoading = ref(false)
const activeTab = ref('basic')
const categories = ref<ProductCategory[]>([])
const inputVisible = ref(false)
const inputValue = ref('')

const formData = reactive<ProductForm>({
  name: '',
  code: '',
  description: '',
  image: '',
  images: [],
  categoryId: '',
  price: 0,
  originalPrice: undefined,
  costPrice: undefined,
  stock: 0,
  status: 1,
  isHot: false,
  isNew: false,
  isRecommended: false,
  tags: [],
  specifications: [],
  details: '',
  seoKeywords: '',
  seoDescription: '',
  sort: 0,
})

const formRules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入商品编号', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
  price: [{ required: true, message: '请输入销售价格', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入库存数量', trigger: 'blur' }],
  status: [{ required: true, message: '请选择商品状态', trigger: 'change' }],
  image: [{ required: true, message: '请上传商品主图', trigger: 'change' }],
}

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

const dialogTitle = computed(() => {
  return props.mode === 'add' ? '新增商品' : '编辑商品'
})

const loadCategories = async () => {
  try {
    const res = await getProductCategories()
    categories.value = res.data
  } catch (error) {
    console.error('获取分类列表失败', error)
  }
}

const loadProductDetail = async () => {
  if (!props.productId) return
  
  try {
    const res = await getProductDetail(props.productId)
    const product = res.data
    
    // 填充表单数据
    Object.keys(formData).forEach(key => {
      if (key in product) {
        formData[key] = product[key]
      }
    })
    
    // 确保数组字段有默认值
    if (!formData.tags) formData.tags = []
    if (!formData.specifications) formData.specifications = []
    if (!formData.images) formData.images = []
  } catch (error) {
    ElMessage.error('获取商品详情失败')
    console.error(error)
  }
}

const resetForm = () => {
  Object.keys(formData).forEach(key => {
    if (Array.isArray(formData[key])) {
      formData[key] = []
    } else if (typeof formData[key] === 'boolean') {
      formData[key] = false
    } else if (typeof formData[key] === 'number') {
      formData[key] = 0
    } else {
      formData[key] = ''
    }
  })
  
  formData.status = 1
  formData.specifications = []
  formData.tags = []
  formData.images = []
}

const handleClose = () => {
  dialogVisible.value = false
  resetForm()
  activeTab.value = 'basic'
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    submitLoading.value = true
    
    if (props.mode === 'add') {
      await createProduct(formData)
      ElMessage.success('商品创建成功')
    } else {
      await updateProduct(props.productId!, formData)
      ElMessage.success('商品更新成功')
    }
    
    emit('refresh')
    handleClose()
  } catch (error) {
    if (error !== false) {
      ElMessage.error(props.mode === 'add' ? '商品创建失败' : '商品更新失败')
      console.error(error)
    }
  } finally {
    submitLoading.value = false
  }
}

const removeTag = (tag: string) => {
  const index = formData.tags.indexOf(tag)
  if (index > -1) {
    formData.tags.splice(index, 1)
  }
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value && !formData.tags.includes(inputValue.value)) {
    formData.tags.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}

const addSpecification = () => {
  formData.specifications.push({
    id: '',
    productId: '',
    name: '',
    value: '',
    sort: formData.specifications.length,
  })
}

const removeSpecification = (index: number) => {
  formData.specifications.splice(index, 1)
}

// 监听对话框显示状态
watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      loadCategories()
      if (props.mode === 'edit' && props.productId) {
        loadProductDetail()
      } else if (props.mode === 'add') {
        resetForm()
      }
    }
  }
)
</script>

<style lang="scss" scoped>
.specifications-container {
  .specification-item {
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
  }
}

.dialog-footer {
  text-align: right;
}
</style>