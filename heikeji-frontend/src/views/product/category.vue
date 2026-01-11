<template>
  <div class="product-category-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2>商品分类管理</h2>
        <span class="subtitle">管理商品分类的层级结构</span>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增分类
        </el-button>
        <el-button @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 商品分类列表 -->
    <el-card class="category-card">
      <!-- 搜索和筛选 -->
      <div class="search-filter">
        <el-input
          v-model="searchParams.keyword"
          placeholder="分类名称"
          clearable
          size="small"
          style="width: 200px; margin-right: 10px"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" size="small" @click="handleSearch">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
      </div>

      <!-- 分类树 -->
      <div class="category-tree-container">
        <el-tree
          v-loading="loading"
          :data="categoryTree"
          node-key="id"
          :props="defaultProps"
          @node-click="handleNodeClick"
          @node-contextmenu="handleContextMenu"
          default-expand-all
        >
          <template #default="{ data }">
            <div class="category-item">
              <span v-if="data.icon" class="category-icon">
                <el-icon><component :is="data.icon" /></el-icon>
              </span>
              <span>{{ data.name }} (ID: {{ data.id }})</span>
              <span v-if="data.level" class="category-level">
                {{ getLevelText(data.level) }}
              </span>
              <div class="category-actions">
                <el-button
                  size="small"
                  type="primary"
                  @click.stop="handleAddSubcategory(data)"
                  v-if="data.level < 3"
                >
                  <el-icon><CirclePlus /></el-icon>
                  添加子分类
                </el-button>
                <el-button size="small" @click.stop="handleEdit(data)">
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-button>
                <el-button size="small" type="danger" @click.stop="handleDelete(data)">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </div>
            </div>
          </template>
        </el-tree>
      </div>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form ref="formDataRef" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="上级分类" prop="parentId">
          <el-cascader
            v-model="parentPath"
            :options="cascaderOptions"
            :props="{ expandTrigger: 'hover', checkStrictly: true, emitPath: false }"
            placeholder="请选择上级分类"
            @change="handleCascaderChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="分类图标" prop="icon">
          <el-input v-model="formData.icon" placeholder="请输入Element Plus图标名称"></el-input>
          <div class="icon-preview" v-if="formData.icon">
            <el-icon><component :is="formData.icon" /></el-icon>
            <span>{{ formData.icon }}</span>
          </div>
        </el-form-item>
        <el-form-item label="分类描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            rows="3"
            placeholder="请输入分类描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="formData.sort"
            :min="0"
            :step="1"
            placeholder="请输入排序值"
            style="width: 100%"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="formData.status" active-value="1" inactive-value="0"></el-switch>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// 导入必要的API和类型
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { FormInstance, FormRules } from 'element-plus'
import { Plus, Refresh, Search, Edit, CirclePlus, Delete } from '@element-plus/icons-vue'

// 导入类型定义
interface Category {
  id: string | number
  parentId: string | number
  name: string
  icon: string
  description: string
  sort: number
  status: string
  level: number
  children: Category[]
}

interface FormData {
  id: string | number
  parentId: string | number
  name: string
  icon: string
  description: string
  sort: number
  status: string
  level: number
  children: Category[]
}

interface CascaderOption {
  value: string | number
  label: string
  children?: CascaderOption[]
}

// 响应式数据
const categoryTree = ref<Category[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('添加分类')
const parentPath = ref<(string | number)[]>([])
const cascaderOptions = ref<CascaderOption[]>([])
const loading = ref(false)

// 搜索参数
const searchParams = reactive({
  keyword: '',
})

// 表单数据
const formData = reactive<FormData>({
  id: '',
  parentId: 0,
  name: '',
  icon: '',
  description: '',
  sort: 0,
  status: '1',
  level: 1,
  children: [],
})

// 表单验证规则
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
  ],
})

// 树属性配置
const defaultProps = reactive({
  children: 'children',
  label: 'name',
})

// 表单引用
const formDataRef = ref<FormInstance | null>(null)

// 初始化数据
onMounted(() => {
  fetchCategoryTree()
})

// 获取分类树
async function fetchCategoryTree() {
  loading.value = true
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500))
    // 模拟数据
    const mockData: Category[] = [
      {
        id: '1',
        parentId: '0',
        name: '数码产品',
        icon: 'Mobile',
        description: '手机、电脑等数码产品',
        sort: 1,
        status: '1',
        level: 1,
        children: [
          {
            id: '1-1',
            parentId: '1',
            name: '手机',
            icon: 'Smartphone',
            description: '智能手机',
            sort: 1,
            status: '1',
            level: 2,
            children: [
              {
                id: '1-1-1',
                parentId: '1-1',
                name: '苹果手机',
                icon: '',
                description: 'Apple iPhone',
                sort: 1,
                status: '1',
                level: 3,
                children: [],
              },
              {
                id: '1-1-2',
                parentId: '1-1',
                name: '安卓手机',
                icon: '',
                description: 'Android手机',
                sort: 2,
                status: '1',
                level: 3,
                children: [],
              },
            ],
          },
          {
            id: '1-2',
            parentId: '1',
            name: '电脑',
            icon: 'Monitor',
            description: '笔记本电脑和台式机',
            sort: 2,
            status: '1',
            level: 2,
            children: [],
          },
        ],
      },
      {
        id: '2',
        parentId: '0',
        name: '生活用品',
        icon: 'HomeFilled',
        description: '日常生活用品',
        sort: 2,
        status: '1',
        level: 1,
        children: [],
      },
      {
        id: '3',
        parentId: '0',
        name: '食品饮料',
        icon: 'Coffee',
        description: '各类食品和饮料',
        sort: 3,
        status: '1',
        level: 1,
        children: [],
      },
    ]
    categoryTree.value = mockData

    // 构建级联选择器选项
    cascaderOptions.value = buildCascaderOptions(categoryTree.value)
  } catch (error) {
    ElMessage.error('获取分类树失败')
    categoryTree.value = []
    cascaderOptions.value = []
  } finally {
    loading.value = false
  }
}

// 刷新分类树
const handleRefresh = () => {
  fetchCategoryTree()
}

// 搜索分类
const handleSearch = () => {
  // 简单的本地搜索实现
  console.log('搜索分类:', searchParams.keyword)
}

// 构建级联选择器选项
function buildCascaderOptions(categoryTree: Category[], maxLevel = 2): CascaderOption[] {
  const options: CascaderOption[] = []
  categoryTree.forEach(category => {
    if (category.level < maxLevel) {
      const option: CascaderOption = {
        value: category.id,
        label: category.name,
        children: category.children ? buildCascaderOptions(category.children, maxLevel) : [],
      }
      options.push(option)
    }
  })
  return options
}

// 获取级别文本
function getLevelText(level: number): string {
  const levelMap: Record<number, string> = {
    1: '一级分类',
    2: '二级分类',
    3: '三级分类',
  }
  return levelMap[level] || `未知级别(${level})`
}

// 处理节点点击
function handleNodeClick(data: Category) {
  console.log('Node clicked:', data)
}

// 处理右键菜单
function handleContextMenu(event: MouseEvent, data: Category) {
  event.preventDefault()
  console.log('Context menu:', data)
}

// 处理添加分类
function handleAdd() {
  dialogTitle.value = '添加分类'
  // 重置表单
  Object.assign(formData, {
    id: '',
    parentId: 0,
    name: '',
    icon: '',
    description: '',
    sort: 0,
    status: '1',
    level: 1,
    children: [],
  })
  parentPath.value = []
  dialogVisible.value = true
}

// 处理添加子分类
function handleAddSubcategory(data: Category) {
  dialogTitle.value = '添加子分类'
  // 重置表单
  Object.assign(formData, {
    id: '',
    parentId: data.id,
    name: '',
    icon: '',
    description: '',
    sort: 0,
    status: '1',
    level: data.level + 1,
    children: [],
  })
  parentPath.value = [data.id]
  dialogVisible.value = true
}

// 处理编辑
function handleEdit(data: Category) {
  dialogTitle.value = '编辑分类'
  // 填充表单数据
  Object.assign(formData, { ...data })
  if (data.parentId) {
    parentPath.value = [data.parentId]
  } else {
    parentPath.value = []
  }
  dialogVisible.value = true
}

// 处理级联选择变化
function handleCascaderChange(value: (string | number)[]) {
  const parentId = value.length > 0 ? value[value.length - 1] : 0
  formData.parentId = parentId

  // 根据父分类确定级别
  if (parentId === 0) {
    formData.level = 1
  } else {
    const parentCategory = findCategoryById(categoryTree.value, parentId)
    formData.level = parentCategory ? parentCategory.level + 1 : 2
  }
}

// 根据ID查找分类
function findCategoryById(tree: Category[], id: string | number): Category | null {
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].id === id) {
      return tree[i]
    }
    if (tree[i].children && tree[i].children.length > 0) {
      const found = findCategoryById(tree[i].children, id)
      if (found) {
        return found
      }
    }
  }
  return null
}

// 保存分类
async function handleSubmit() {
  if (!formDataRef.value) return

  try {
    await formDataRef.value.validate()
    loading.value = true

    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500))

    if (formData.id) {
      // 编辑操作
      updateCategoryInTree(categoryTree.value, formData)
      ElMessage.success('分类编辑成功')
    } else {
      // 添加操作
      const newCategory: Category = {
        ...formData,
        id: Date.now().toString(),
        children: [],
      }
      if (formData.parentId === 0) {
        // 一级分类
        categoryTree.value.push(newCategory)
      } else {
        // 子分类
        addSubcategoryToTree(categoryTree.value, newCategory)
      }
      ElMessage.success('分类添加成功')
    }

    // 更新级联选择器选项
    cascaderOptions.value = buildCascaderOptions(categoryTree.value)
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error('操作失败，请重试')
  } finally {
    loading.value = false
  }
}

// 在树中更新分类
function updateCategoryInTree(tree: Category[], category: Category): boolean {
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].id === category.id) {
      tree[i] = { ...tree[i], ...category }
      return true
    }
    if (tree[i].children && tree[i].children.length > 0) {
      const found = updateCategoryInTree(tree[i].children, category)
      if (found) {
        return true
      }
    }
  }
  return false
}

// 向树中添加子分类
function addSubcategoryToTree(tree: Category[], category: Category): boolean {
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].id === category.parentId) {
      if (!tree[i].children) {
        tree[i].children = []
      }
      tree[i].children.push(category)
      return true
    }
    if (tree[i].children && tree[i].children.length > 0) {
      const found = addSubcategoryToTree(tree[i].children, category)
      if (found) {
        return true
      }
    }
  }
  return false
}

// 处理删除
async function handleDelete(data: Category) {
  // 检查是否有子分类
  if (data.children && data.children.length > 0) {
    ElMessage.warning('该分类下还有子分类，无法删除')
    return
  }

  try {
    await ElMessageBox.confirm(`确定要删除分类"${data.name}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500))

    // 从树中删除分类
    deleteCategoryFromTree(categoryTree.value, data.id)
    // 更新级联选择器选项
    cascaderOptions.value = buildCascaderOptions(categoryTree.value)

    ElMessage.success('删除成功')
  } catch (error) {
    // 取消删除
  }
}

// 从树中删除分类
function deleteCategoryFromTree(tree: Category[], id: string | number): boolean {
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].id === id) {
      tree.splice(i, 1)
      return true
    }
    if (tree[i].children && tree[i].children.length > 0) {
      const found = deleteCategoryFromTree(tree[i].children, id)
      if (found) {
        return true
      }
    }
  }
  return false
}
</script>

<style scoped>
.product-category-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 60px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #333;
  }

  .subtitle {
    display: block;
    margin-top: 5px;
    font-size: 14px;
    color: #999;
  }

  .header-right {
    display: flex;
    gap: 10px;
  }
}

.category-card {
  margin-bottom: 20px;
}

.search-filter {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.category-tree-container {
  margin-top: 20px;
  max-height: 600px;
  overflow-y: auto;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 5px 0;
}

.category-icon {
  margin-right: 8px;
  color: #003366;
}

.category-level {
  font-size: 12px;
  color: #909399;
  margin-left: 10px;
  background-color: #f0f8ff;
  padding: 2px 8px;
  border-radius: 10px;
}

.category-actions {
  display: none;
  gap: 5px;
}

.category-item:hover .category-actions {
  display: flex;
}

.category-actions .el-button {
  margin-left: 5px;
}

.dialog-footer {
  text-align: right;
}

.icon-preview {
  margin-top: 10px;
  padding: 10px;
  background-color: #f0f8ff;
  border-radius: 4px;
  display: flex;
  align-items: center;

  .el-icon {
    font-size: 20px;
    margin-right: 10px;
    color: #003366;
  }
}
</style>
