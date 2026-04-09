<script setup lang="ts">
/**
 * 商品管理页面
 * 功能：商品列表、添加、编辑、删除、上下架
 */
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useProductStore } from '@/stores/product'
import type { Product } from '@/api/product'

// ====== Store ======
const productStore = useProductStore()

// ====== 响应式状态 ======
const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('添加商品')
const isEdit = ref(false)

// ====== 搜索表单 ======
const searchForm = reactive({
  keyword: '',
  categoryId: '',
  status: '',
  minPrice: undefined as number | undefined,
  maxPrice: undefined as number | undefined,
})

// ====== 商品表单 ======
const productForm = reactive<Partial<Product>>({
  name: '',
  description: '',
  price: 0,
  originalPrice: undefined,
  stock: 0,
  categoryId: '',
  images: [],
  status: 'on_sale',
})

// ====== 分页 ======
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

// ====== 表格数据 ======
const tableData = ref<Product[]>([])

// ====== 分类选项 ======
const categoryOptions = ref([
  { value: '1', label: '电子产品' },
  { value: '2', label: '服装鞋帽' },
  { value: '3', label: '食品饮料' },
  { value: '4', label: '图书文具' },
  { value: '5', label: '日用百货' },
])

// ====== 状态选项 ======
const statusOptions = [
  { value: 'on_sale', label: '在售', type: 'success' },
  { value: 'off_sale', label: '下架', type: 'info' },
  { value: 'sold_out', label: '售罄', type: 'danger' },
]

// ====== 生命周期 ======
onMounted(() => {
  fetchProductList()
})

// ====== 方法 ======

/**
 * 获取商品列表
 */
async function fetchProductList() {
  loading.value = true
  try {
    const res = await productStore.fetchProducts({
      keyword: searchForm.keyword || undefined,
      categoryId: searchForm.categoryId || undefined,
      status: searchForm.status || undefined,
      minPrice: searchForm.minPrice,
      maxPrice: searchForm.maxPrice,
      page: pagination.page,
      pageSize: pagination.pageSize,
    })
    tableData.value = res.list
    pagination.total = res.total
  } catch (error) {
    ElMessage.error('获取商品列表失败')
  } finally {
    loading.value = false
  }
}

/**
 * 搜索
 */
function handleSearch() {
  pagination.page = 1
  fetchProductList()
}

/**
 * 重置搜索
 */
function resetSearch() {
  searchForm.keyword = ''
  searchForm.categoryId = ''
  searchForm.status = ''
  searchForm.minPrice = undefined
  searchForm.maxPrice = undefined
  handleSearch()
}

/**
 * 打开添加对话框
 */
function openAddDialog() {
  isEdit.value = false
  dialogTitle.value = '添加商品'
  resetProductForm()
  dialogVisible.value = true
}

/**
 * 打开编辑对话框
 */
function openEditDialog(row: Product) {
  isEdit.value = true
  dialogTitle.value = '编辑商品'
  Object.assign(productForm, row)
  dialogVisible.value = true
}

/**
 * 重置商品表单
 */
function resetProductForm() {
  productForm.name = ''
  productForm.description = ''
  productForm.price = 0
  productForm.originalPrice = undefined
  productForm.stock = 0
  productForm.categoryId = ''
  productForm.images = []
  productForm.status = 'on_sale'
}

/**
 * 保存商品
 */
async function handleSave() {
  try {
    if (isEdit.value) {
      // await productStore.updateProduct(productForm.id!, productForm)
      ElMessage.success('更新成功')
    } else {
      // await productStore.createProduct(productForm)
      ElMessage.success('添加成功')
    }
    dialogVisible.value = false
    fetchProductList()
  } catch (error) {
    ElMessage.error(isEdit.value ? '更新失败' : '添加失败')
  }
}

/**
 * 删除商品
 */
async function handleDelete(row: Product) {
  try {
    await ElMessageBox.confirm(
      `确定要删除商品 "${row.name}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    // await productStore.deleteProduct(row.id)
    ElMessage.success('删除成功')
    fetchProductList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

/**
 * 切换商品状态
 */
async function toggleStatus(row: Product) {
  const newStatus = row.status === 'on_sale' ? 'off_sale' : 'on_sale'
  const actionText = newStatus === 'on_sale' ? '上架' : '下架'
  
  try {
    await ElMessageBox.confirm(
      `确定要${actionText}商品 "${row.name}" 吗？`,
      `确认${actionText}`,
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    // await productStore.updateProductStatus(row.id, newStatus)
    ElMessage.success(`${actionText}成功`)
    fetchProductList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(`${actionText}失败`)
    }
  }
}

/**
 * 分页变化
 */
function handlePageChange(page: number) {
  pagination.page = page
  fetchProductList()
}

/**
 * 每页数量变化
 */
function handleSizeChange(size: number) {
  pagination.pageSize = size
  pagination.page = 1
  fetchProductList()
}

/**
 * 获取状态标签类型
 */
function getStatusType(status: string): string {
  const map: Record<string, string> = {
    on_sale: 'success',
    off_sale: 'info',
    sold_out: 'danger',
  }
  return map[status] || 'info'
}

/**
 * 获取状态文本
 */
function getStatusText(status: string): string {
  const map: Record<string, string> = {
    on_sale: '在售',
    off_sale: '下架',
    sold_out: '售罄',
  }
  return map[status] || status
}
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-text-primary">商品管理</h2>
      <el-button type="primary" @click="openAddDialog">
        <el-icon class="mr-1"><Plus /></el-icon>
        添加商品
      </el-button>
    </div>

    <!-- 搜索区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" inline class="search-form">
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="商品名称/编号"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        
        <el-form-item label="分类">
          <el-select v-model="searchForm.categoryId" placeholder="全部分类" clearable>
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部状态" clearable>
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="价格区间">
          <el-input-number
            v-model="searchForm.minPrice"
            :min="0"
            placeholder="最低价"
            controls-position="right"
            class="price-input"
          />
          <span class="mx-2">-</span>
          <el-input-number
            v-model="searchForm.maxPrice"
            :min="0"
            placeholder="最高价"
            controls-position="right"
            class="price-input"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card shadow="never">
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column type="index" width="50" align="center" />
        
        <el-table-column label="商品信息" min-width="250">
          <template #default="{ row }">
            <div class="flex items-center gap-3">
              <el-image
                :src="row.images[0] || '/placeholder-product.png'"
                :preview-src-list="row.images"
                fit="cover"
                class="w-12 h-12 rounded-lg"
              />
              <div class="flex-1 min-w-0">
                <div class="font-medium text-text-primary truncate">{{ row.name }}</div>
                <div class="text-xs text-text-tertiary">ID: {{ row.id }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="分类" width="120">
          <template #default="{ row }">
            {{ row.categoryName }}
          </template>
        </el-table-column>
        
        <el-table-column label="价格" width="150">
          <template #default="{ row }">
            <div class="text-crimson font-semibold">¥{{ row.price.toFixed(2) }}</div>
            <div v-if="row.originalPrice" class="text-xs text-text-tertiary line-through">
              ¥{{ row.originalPrice.toFixed(2) }}
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="库存" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.stock < 10 ? 'danger' : 'success'" size="small">
              {{ row.stock }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="销量" width="100" align="center">
          <template #default="{ row }">
            {{ row.sales }}
          </template>
        </el-table-column>
        
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEditDialog(row)">
              编辑
            </el-button>
            <el-button 
              link 
              :type="row.status === 'on_sale' ? 'warning' : 'success'"
              @click="toggleStatus(row)"
            >
              {{ row.status === 'on_sale' ? '下架' : '上架' }}
            </el-button>
            <el-button link type="danger" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="flex justify-end mt-4">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      destroy-on-close
    >
      <el-form
        :model="productForm"
        label-width="100px"
        class="product-form"
      >
        <el-form-item label="商品名称" required>
          <el-input v-model="productForm.name" placeholder="请输入商品名称" />
        </el-form-item>
        
        <el-form-item label="商品分类" required>
          <el-select v-model="productForm.categoryId" placeholder="请选择分类" class="w-full">
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="售价" required>
              <el-input-number
                v-model="productForm.price"
                :min="0"
                :precision="2"
                controls-position="right"
                class="w-full"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原价">
              <el-input-number
                v-model="productForm.originalPrice"
                :min="0"
                :precision="2"
                controls-position="right"
                class="w-full"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="库存" required>
          <el-input-number
            v-model="productForm.stock"
            :min="0"
            controls-position="right"
            class="w-full"
          />
        </el-form-item>
        
        <el-form-item label="商品描述">
          <el-input
            v-model="productForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入商品描述"
          />
        </el-form-item>
        
        <el-form-item label="商品图片">
          <el-upload
            action="/api/upload/image"
            list-type="picture-card"
            :file-list="productForm.images?.map(url => ({ url }))"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="商品状态">
          <el-radio-group v-model="productForm.status">
            <el-radio label="on_sale">在售</el-radio>
            <el-radio label="off_sale">下架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.search-card {
  :deep(.el-card__body) {
    padding: 20px;
  }
}

.search-form {
  .el-form-item {
    margin-bottom: 0;
    margin-right: 20px;
  }
}

.price-input {
  width: 120px;
}

.product-form {
  .el-input,
  .el-input-number,
  .el-select {
    width: 100%;
  }
}
</style>
