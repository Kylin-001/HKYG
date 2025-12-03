<template>
  <div class="merchant-products">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2>商品管理</h2>
      <div class="header-actions">
        <el-button type="primary" @click="addProduct">
          <i class="el-icon-plus"></i>
          添加商品
        </el-button>
        <el-button @click="batchOperations">批量操作</el-button>
      </div>
    </div>

    <!-- 筛选和搜索 -->
    <el-card class="filter-card">
      <el-form :inline="true" :model="filterForm">
        <el-form-item label="商品分类">
          <el-select
            v-model="filterForm.category"
            placeholder="全部分类"
            @change="handleFilterChange"
          >
            <el-option label="全部分类" value=""></el-option>
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="商品状态">
          <el-select
            v-model="filterForm.status"
            placeholder="全部状态"
            @change="handleFilterChange"
          >
            <el-option label="全部状态" value=""></el-option>
            <el-option label="在售" value="在售"></el-option>
            <el-option label="已下架" value="已下架"></el-option>
            <el-option label="售罄" value="售罄"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品名称">
          <el-input
            v-model="filterForm.keyword"
            placeholder="搜索商品名称"
            clearable
            @input="handleSearch"
            style="width: 200px"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleFilterChange">搜索</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 分类管理 -->
    <el-card class="category-card">
      <template v-slot:header>
        <span>商品分类</span>
        <el-button type="text" @click="addCategoryDialog = true">
          <i class="el-icon-plus"></i>
          添加分类
        </el-button>
      </template>

      <div class="category-tabs">
        <el-tag
          v-for="category in allCategories"
          :key="category.id"
          :class="{ active: selectedCategoryId === category.id }"
          @click="selectCategory(category.id)"
          class="category-tag"
        >
          {{ category.name }}
          <span class="category-count">({{ category.count }})</span>
        </el-tag>
      </div>
    </el-card>

    <!-- 商品统计 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card total">
          <div class="stat-content">
            <div class="stat-icon">
              <i class="el-icon-goods"></i>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ productStats.total }}</div>
              <div class="stat-label">商品总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card selling">
          <div class="stat-content">
            <div class="stat-icon">
              <i class="el-icon-shopping-cart-full"></i>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ productStats.selling }}</div>
              <div class="stat-label">在售商品</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card soldout">
          <div class="stat-content">
            <div class="stat-icon">
              <i class="el-icon-circle-close"></i>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ productStats.soldout }}</div>
              <div class="stat-label">售罄商品</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card revenue">
          <div class="stat-content">
            <div class="stat-icon">
              <i class="el-icon-money"></i>
            </div>
            <div class="stat-info">
              <div class="stat-number">¥{{ productStats.revenue }}</div>
              <div class="stat-label">今日销售额</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 商品列表 -->
    <el-card class="products-card">
      <el-table
        :data="products"
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column prop="name" label="商品图片" width="100">
          <template v-slot="{ row }">
            <div class="product-image">
              <img :src="row.image || '/static/images/default-product.jpg'" :alt="row.name" />
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="商品名称" min-width="150">
          <template v-slot="{ row }">
            <div class="product-info">
              <div class="product-name">{{ row.name }}</div>
              <div class="product-desc">{{ row.description }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="categoryName" label="分类" width="100"></el-table-column>

        <el-table-column prop="price" label="价格" width="80">
          <template v-slot="{ row }">
            <span class="price">¥{{ row.price }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="stock" label="库存" width="80"></el-table-column>

        <el-table-column prop="sales" label="销量" width="80"></el-table-column>

        <el-table-column prop="status" label="状态" width="100">
          <template v-slot="{ row }">
            <el-switch
              v-model="row.isActive"
              active-text="在售"
              inactive-text="下架"
              @change="toggleProductStatus(row)"
            />
          </template>
        </el-table-column>

        <el-table-column prop="isRecommended" label="推荐" width="80">
          <template v-slot="{ row }">
            <el-tag
              :type="row.isRecommended ? 'warning' : 'info'"
              size="small"
              @click="toggleRecommend(row)"
            >
              {{ row.isRecommended ? '推荐' : '普通' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template v-slot="{ row }">
            <el-button size="mini" @click="editProduct(row)">编辑</el-button>
            <el-button v-if="row.stock > 0" size="mini" @click="updateStock(row)"> 库存 </el-button>
            <el-button v-if="row.stock === 0" size="mini" type="success" @click="updateStock(row)">
              添加库存
            </el-button>
            <el-button type="danger" size="mini" @click="deleteProduct(row)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
        />
      </div>
    </el-card>

    <!-- 添加/编辑商品对话框 -->
    <el-dialog
      :title="isEditing ? '编辑商品' : '添加商品'"
      v-model="productDialogVisible"
      width="800px"
      @close="resetProductForm"
    >
      <el-form :model="productForm" :rules="productRules" ref="productFormRef" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="productForm.name" placeholder="请输入商品名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品分类" prop="categoryId">
              <el-select v-model="productForm.categoryId" placeholder="选择分类">
                <el-option
                  v-for="category in categories"
                  :key="category.id"
                  :label="category.name"
                  :value="category.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="商品描述" prop="description">
          <el-input
            v-model="productForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入商品描述"
          />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="价格" prop="price">
              <el-input-number
                v-model="productForm.price"
                :min="0"
                :step="0.1"
                :precision="2"
                placeholder="价格"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="库存" prop="stock">
              <el-input-number v-model="productForm.stock" :min="0" placeholder="库存" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="推荐商品" prop="isRecommended">
              <el-switch v-model="productForm.isRecommended" active-text="是" inactive-text="否" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="商品图片">
          <el-upload
            class="upload-demo"
            action=""
            :show-file-list="false"
            :before-upload="beforeImageUpload"
          >
            <img v-if="productForm.image" :src="productForm.image" class="upload-image" />
            <div v-else class="upload-placeholder">
              <i class="el-icon-plus"></i>
              <p>点击上传图片</p>
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item label="规格选项">
          <div class="specifications">
            <div v-for="(spec, index) in productForm.specifications" :key="index" class="spec-item">
              <el-input
                v-model="spec.name"
                placeholder="规格名称（如：大份/小份）"
                style="width: 100px; margin-right: 10px"
              />
              <el-input-number
                v-model="spec.price"
                :min="0"
                :step="0.1"
                :precision="2"
                placeholder="价格"
                style="margin-right: 10px"
              />
              <el-input-number
                v-model="spec.stock"
                :min="0"
                placeholder="库存"
                style="margin-right: 10px"
              />
              <el-button
                type="danger"
                size="mini"
                @click="removeSpec(index)"
                v-if="productForm.specifications.length > 1"
              >
                删除
              </el-button>
            </div>
            <el-button size="mini" @click="addSpec">添加规格</el-button>
          </div>
        </el-form-item>
      </el-form>

      <template v-slot:footer>
        <el-button @click="productDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveProduct">保存</el-button>
      </template>
    </el-dialog>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加商品分类" v-model="addCategoryDialog" width="400px">
      <el-form :model="categoryForm" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="categoryForm.name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="分类描述">
          <el-input v-model="categoryForm.description" placeholder="请输入分类描述"></el-input>
        </el-form-item>
      </el-form>

      <template v-slot:footer>
        <el-button @click="addCategoryDialog = false">取消</el-button>
        <el-button type="primary" @click="saveCategory">保存</el-button>
      </template>
    </el-dialog>

    <!-- 库存管理对话框 -->
    <el-dialog title="库存管理" v-model="stockDialogVisible" width="400px">
      <el-form :model="stockForm" label-width="80px">
        <el-form-item label="商品名称">
          <span>{{ stockForm.productName }}</span>
        </el-form-item>
        <el-form-item label="当前库存">
          <span>{{ stockForm.currentStock }}</span>
        </el-form-item>
        <el-form-item label="操作类型">
          <el-select v-model="stockForm.operation" placeholder="选择操作">
            <el-option label="增加库存" value="increase"></el-option>
            <el-option label="减少库存" value="decrease"></el-option>
            <el-option label="设置库存" value="set"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量">
          <el-input-number
            v-model="stockForm.quantity"
            :min="0"
            :max="stockForm.operation === 'decrease' ? stockForm.currentStock : undefined"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="stockForm.remark"
            type="textarea"
            :rows="2"
            placeholder="库存变更原因（可选）"
          />
        </el-form-item>
      </el-form>

      <template v-slot:footer>
        <el-button @click="stockDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateProductStock">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

// 类型定义
interface Category {
  id: number | string
  name: string
  description?: string
  count?: number
}

interface Specification {
  name: string
  price: number
  stock: number
}

interface Product {
  id: number
  name: string
  description: string
  categoryId: number
  categoryName: string
  price: number
  stock: number
  sales: number
  image: string
  isActive: boolean
  isRecommended: boolean
  specifications?: Specification[]
}

interface ProductStats {
  total: number
  selling: number
  soldout: number
  revenue: number
}

interface FilterForm {
  category: string
  status: string
  keyword: string
}

interface Pagination {
  page: number
  size: number
  total: number
}

interface ProductForm {
  name: string
  categoryId: string | number
  description: string
  price: number
  stock: number
  image: string
  isRecommended: boolean
  specifications: Specification[]
}

interface CategoryForm {
  name: string
  description: string
}

interface StockForm {
  productId: string | number
  productName: string
  currentStock: number
  operation: string
  quantity: number
  remark: string
}

// 响应式数据
const loading = ref(false)
const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const productStats = ref<ProductStats>({
  total: 0,
  selling: 0,
  soldout: 0,
  revenue: 0,
})
const allCategories = ref<Category[]>([])
const selectedCategoryId = ref('')
const filterForm = reactive<FilterForm>({
  category: '',
  status: '',
  keyword: '',
})
const pagination = reactive<Pagination>({
  page: 1,
  size: 20,
  total: 0,
})
const selectedProducts = ref<Product[]>([])

// 商品对话框
const productDialogVisible = ref(false)
const isEditing = ref(false)
const productForm = reactive<ProductForm>({
  name: '',
  categoryId: '',
  description: '',
  price: 0,
  stock: 0,
  image: '',
  isRecommended: false,
  specifications: [{ name: '标准', price: 0, stock: 0 }],
})
const productFormRef = ref<FormInstance | null>(null)
const productRules = reactive<FormRules>({
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入库存', trigger: 'blur' }],
})

// 分类对话框
const addCategoryDialog = ref(false)
const categoryForm = reactive<CategoryForm>({
  name: '',
  description: '',
})

// 库存对话框
const stockDialogVisible = ref(false)
const stockForm = reactive<StockForm>({
  productId: '',
  productName: '',
  currentStock: 0,
  operation: 'increase',
  quantity: 0,
  remark: '',
})

// 加载分类
const loadCategories = () => {
  categories.value = [
    { id: 1, name: '面条类' },
    { id: 2, name: '小菜类' },
    { id: 3, name: '饮品类' },
    { id: 4, name: '小吃类' },
  ]
}

// 生成所有分类（包括统计）
const generateAllCategories = () => {
  allCategories.value = [
    { id: '', name: '全部', count: productStats.value.total },
    ...categories.value.map(cat => ({
      ...cat,
      count: products.value.filter(p => p.categoryId === cat.id).length,
    })),
  ]
}

// 选择分类
const selectCategory = (categoryId: string | number) => {
  selectedCategoryId.value = categoryId as string
  filterForm.category = categoryId as string
  loadProducts()
}

// 加载商品列表
const loadProducts = async () => {
  loading.value = true
  try {
    // 模拟数据
    products.value = [
      {
        id: 1,
        name: '兰州拉面',
        description: '正宗兰州拉面，汤清面劲',
        categoryId: 1,
        categoryName: '面条类',
        price: 15.0,
        stock: 50,
        sales: 156,
        image: '',
        isActive: true,
        isRecommended: true,
      },
      {
        id: 2,
        name: '牛肉拉面',
        description: '牛肉浓郁，口感鲜美',
        categoryId: 1,
        categoryName: '面条类',
        price: 18.0,
        stock: 30,
        sales: 89,
        image: '',
        isActive: true,
        isRecommended: false,
      },
      {
        id: 3,
        name: '凉拌三丝',
        description: '清爽开胃小菜',
        categoryId: 2,
        categoryName: '小菜类',
        price: 5.0,
        stock: 0,
        sales: 78,
        image: '',
        isActive: false,
        isRecommended: false,
      },
    ]
    pagination.total = products.value.length
  } catch (error) {
    ElMessage.error('加载商品失败')
  } finally {
    loading.value = false
  }
}

// 加载商品统计
const loadProductStats = () => {
  productStats.value = {
    total: 25,
    selling: 20,
    soldout: 5,
    revenue: 1234.5,
  }
}

// 处理筛选变化
const handleFilterChange = () => {
  pagination.page = 1
  loadProducts()
}

// 处理搜索
const handleSearch = () => {
  pagination.page = 1
  loadProducts()
}

// 重置筛选
const resetFilter = () => {
  filterForm.category = ''
  filterForm.status = ''
  filterForm.keyword = ''
  selectedCategoryId.value = ''
  loadProducts()
}

// 批量操作
const batchOperations = () => {
  if (selectedProducts.value.length === 0) {
    ElMessage.warning('请选择要操作的商品')
    return
  }
  ElMessage.info('批量操作功能开发中...')
}

// 添加商品
const addProduct = () => {
  isEditing.value = false
  resetProductForm()
  productDialogVisible.value = true
}

// 编辑商品
const editProduct = (product: Product) => {
  isEditing.value = true
  Object.assign(productForm, product)
  if (!productForm.specifications) {
    productForm.specifications = [{ name: '标准', price: product.price, stock: product.stock }]
  }
  productDialogVisible.value = true
}

// 删除商品
const deleteProduct = (product: Product) => {
  ElMessageBox.confirm(`确定要删除商品"${product.name}"吗？`, '提示', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    // 删除逻辑
    loadProducts()
    ElMessage.success('商品已删除')
  })
}

// 重置商品表单
const resetProductForm = () => {
  Object.assign(productForm, {
    name: '',
    categoryId: '',
    description: '',
    price: 0,
    stock: 0,
    image: '',
    isRecommended: false,
    specifications: [{ name: '标准', price: 0, stock: 0 }],
  })
}

// 保存商品
const saveProduct = () => {
  productFormRef.value?.validate(valid => {
    if (valid) {
      // 保存逻辑
      loadProducts()
      productDialogVisible.value = false
      ElMessage.success(isEditing.value ? '商品已更新' : '商品已添加')
    }
  })
}

// 切换商品状态
const toggleProductStatus = (product: Product) => {
  const status = product.isActive ? '上架' : '下架'
  ElMessage.success(`商品已${status}`)
}

// 切换推荐状态
const toggleRecommend = (product: Product) => {
  product.isRecommended = !product.isRecommended
  const status = product.isRecommended ? '设为推荐' : '取消推荐'
  ElMessage.success(`商品已${status}`)
}

// 添加规格
const addSpec = () => {
  productForm.specifications.push({
    name: '',
    price: 0,
    stock: 0,
  })
}

// 删除规格
const removeSpec = (index: number) => {
  productForm.specifications.splice(index, 1)
}

// 图片上传前处理
const beforeImageUpload = (file: File) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('上传头像只能是 JPG/PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('上传头像大小不能超过 2MB!')
    return false
  }

  // 这里应该实际处理上传
  ElMessage.success('图片上传功能开发中...')
  return false
}

// 更新库存
const updateStock = (product: Product) => {
  Object.assign(stockForm, {
    productId: product.id,
    productName: product.name,
    currentStock: product.stock,
    operation: 'increase',
    quantity: 0,
    remark: '',
  })
  stockDialogVisible.value = true
}

// 保存库存变更
const updateProductStock = () => {
  // 更新库存逻辑
  const product = products.value.find(p => p.id === stockForm.productId)
  if (product) {
    if (stockForm.operation === 'increase') {
      product.stock += stockForm.quantity
    } else if (stockForm.operation === 'decrease') {
      product.stock -= stockForm.quantity
    } else {
      product.stock = stockForm.quantity
    }
  }
  stockDialogVisible.value = false
  ElMessage.success('库存已更新')
  loadProductStats()
}

// 保存分类
const saveCategory = () => {
  if (!categoryForm.name) {
    ElMessage.warning('请输入分类名称')
    return
  }

  // 保存逻辑
  const newCategory: Category = {
    id: Date.now(),
    name: categoryForm.name,
    description: categoryForm.description,
  }
  categories.value.push(newCategory)
  addCategoryDialog.value = false
  Object.assign(categoryForm, { name: '', description: '' })
  ElMessage.success('分类已添加')
  generateAllCategories()
}

// 批量选择
const handleSelectionChange = (selection: Product[]) => {
  selectedProducts.value = selection
}

// 分页处理
const handleSizeChange = (size: number) => {
  pagination.size = size
  loadProducts()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  loadProducts()
}

// 组件挂载时
onMounted(() => {
  loadCategories()
  loadProducts()
  loadProductStats()
  generateAllCategories()
})
</script>

<style scoped>
.merchant-products {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.filter-card,
.category-card,
.products-card {
  border-radius: 8px;
  margin-bottom: 20px;
  border: none;
}

/* 分类管理 */
.category-tabs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.category-tag {
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-tag.active {
  background: #409eff;
  color: white;
}

.category-count {
  font-size: 11px;
  opacity: 0.8;
}

/* 统计卡片 */
.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 8px;
  border: none;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.stat-card.total .stat-icon {
  background: #409eff;
}
.stat-card.selling .stat-icon {
  background: #67c23a;
}
.stat-card.soldout .stat-icon {
  background: #e6a23c;
}
.stat-card.revenue .stat-icon {
  background: #f56c6c;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

/* 商品图片 */
.product-image {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  font-size: 12px;
}

.product-name {
  font-weight: bold;
  color: #333;
  margin-bottom: 2px;
}

.product-desc {
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.price {
  font-weight: bold;
  color: #ff4757;
}

/* 规格选项 */
.specifications {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 15px;
  background: #fafafa;
}

.spec-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

/* 图片上传 */
.upload-demo {
  width: 200px;
  height: 200px;
}

.upload-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.upload-placeholder {
  width: 100%;
  height: 100%;
  border: 2px dashed #dcdfe6;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  cursor: pointer;
}

.upload-placeholder i {
  font-size: 40px;
  margin-bottom: 10px;
}

/* 分页 */
.pagination-wrapper {
  margin-top: 20px;
  text-align: right;
}

/* 响应式 */
@media (max-width: 768px) {
  .merchant-products {
    padding: 10px;
  }

  .page-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .category-tabs {
    justify-content: center;
  }

  .stats-row .el-col {
    margin-bottom: 10px;
  }

  .spec-item {
    flex-wrap: wrap;
    gap: 5px;
  }
}
</style>
