<template>
  <div class="product-category-container">
    <el-card class="box-card">
      <template v-slot:header>
        <div class="clearfix">
          <span>商品分类管理</span>
          <el-button type="primary" size="small" @click="handleAdd">
            <i class="el-icon-plus"></i> 添加分类
          </el-button>
        </div>
      </template>
      <div class="category-tree-container">
        <el-tree
          :data="categoryTree"
          node-key="id"
          :props="defaultProps"
          @node-click="handleNodeClick"
          @node-contextmenu="handleContextMenu"
          default-expand-all
        >
          <span class="category-item">
            <span v-if="data.icon" class="category-icon">
              <i :class="data.icon"></i>
            </span>
            <span>{{ data.name }} (ID: {{ data.id }})</span>
            <span v-if="data.level" class="category-level">
              {{ getLevelText(data.level) }}
            </span>
            <div class="category-actions">
              <el-button
                size="mini"
                type="primary"
                @click.stop="handleAddSubcategory(data)"
                v-if="data.level < 3"
                >添加子分类</el-button
              >
              <el-button size="mini" @click.stop="handleEdit(data)">编辑</el-button>
              <el-button size="mini" type="danger" @click.stop="handleDelete(data)">删除</el-button>
            </div>
          </span>
        </el-tree>
      </div>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="600px">
      <el-form :model="formData" :rules="rules" ref="formDataRef">
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
          <el-input v-model="formData.icon" placeholder="请输入分类图标类名"></el-input>
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
          ></el-input-number>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// 导入必要的API和类型
import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import { FormInstance, FormRules } from 'element-plus'

// 导入日志工具
import logger from '@/utils/logger'

// 类型定义
interface Category {
  id: string | number
  parentId: string | number
  name: string
  icon: string
  description: string
  sort: number
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

const formData = reactive<FormData>({
  id: '',
  parentId: 0,
  name: '',
  icon: '',
  description: '',
  sort: 0,
  level: 1,
  children: [],
})

const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
  ],
})

const defaultProps = reactive({
  children: 'children',
  label: 'name',
})

// 表单引用
const formDataRef = ref<FormInstance | null>(null)

// 状态管理
const store = useStore()

// 生命周期钩子
onMounted(() => {
  fetchCategoryTree()
})

// 获取分类树
async function fetchCategoryTree() {
  try {
    // 真实API调用
    const response = await store.dispatch('category/getCategoryTree')
    categoryTree.value = response.data || []

    // 构建级联选择器选项
    cascaderOptions.value = buildCascaderOptions(categoryTree.value)
  } catch (error) {
    logger.error('获取分类树失败:', error)
    ElMessage.error('获取分类树失败')
    categoryTree.value = []
    cascaderOptions.value = []
  }
}

// 处理提交
async function handleSubmit() {
  if (!formDataRef.value) return

  try {
    await formDataRef.value.validate()
    loading.value = true

    if (formData.id) {
      // 编辑操作 - 真实API调用
      await store.dispatch('category/updateCategory', formData)
      ElMessage.success('编辑成功')
    } else {
      // 添加操作 - 真实API调用
      await store.dispatch('category/addCategory', {
        ...formData,
        children: [],
      })
      ElMessage.success('添加成功')
    }

    fetchCategoryTree() // 重新加载分类树
    dialogVisible.value = false
  } catch (error) {
    logger.error('分类操作失败:', error)
    ElMessage.error('操作失败，请重试')
  } finally {
    loading.value = false
  }
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
  if (process.env.NODE_ENV === 'development') {
    logger.debug('点击节点:', data)
  }
}

// 处理右键菜单
function handleContextMenu(event: MouseEvent, data: Category) {
  event.preventDefault()
  if (process.env.NODE_ENV === 'development') {
    logger.debug('右键菜单:', data)
  }
}

// 处理添加分类
function handleAdd() {
  dialogTitle.value = '添加分类'
  Object.assign(formData, {
    id: '',
    parentId: 0,
    name: '',
    icon: '',
    description: '',
    sort: 0,
    level: 1,
    children: [],
  })
  parentPath.value = []
  dialogVisible.value = true
}

// 处理添加子分类
function handleAddSubcategory(data: Category) {
  dialogTitle.value = '添加子分类'
  Object.assign(formData, {
    id: '',
    parentId: data.id,
    name: '',
    icon: '',
    description: '',
    sort: 0,
    level: data.level + 1,
    children: [],
  })
  parentPath.value = [data.id]
  dialogVisible.value = true
}

// 处理编辑
function handleEdit(data: Category) {
  dialogTitle.value = '编辑分类'
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

    // 真实API调用
    await store.dispatch('category/deleteCategory', {
      id: data.id,
    })

    ElMessage.success('删除成功')
    fetchCategoryTree() // 重新加载分类树
  } catch (error) {
    if (error !== 'cancel') {
      logger.error('删除分类失败:', error)
      ElMessage.error('删除分类失败')
    } else {
      ElMessage.info('已取消删除')
    }
  }
}
</script>

<style scoped>
.product-category-container {
  padding: 20px;
}

.category-tree-container {
  margin-top: 20px;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.category-icon {
  margin-right: 5px;
}

.category-level {
  font-size: 12px;
  color: #909399;
  margin-left: 10px;
}

.category-actions {
  display: none;
}

.category-item:hover .category-actions {
  display: inline-block;
}

.category-actions .el-button {
  margin-left: 5px;
}

.dialog-footer {
  text-align: center;
}
</style>
