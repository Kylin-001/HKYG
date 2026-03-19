<template>
  <div class="menu-management">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2>菜单管理</h2>
        <span class="subtitle">管理系统菜单结构</span>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleAddMenu">
          <el-icon><Plus /></el-icon>
          新增菜单
        </el-button>
        <el-button @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 菜单管理卡片 -->
    <el-card class="menu-card">
      <!-- 菜单树 -->
      <div class="menu-tree-container">
        <el-tree
          v-loading="loading"
          :data="menuTree"
          :props="defaultProps"
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
          @node-contextmenu="handleNodeContextMenu"
        >
          <template #default="{ node, data }">
            <div class="menu-node-content">
              <span>{{ node.label }}</span>
              <div class="node-actions">
                <el-button
                  type="primary"
                  size="small"
                  @click.stop="handleEditMenu(data)"
                  style="margin-right: 5px"
                >
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-button>
                <el-button
                  type="success"
                  size="small"
                  @click.stop="handleAddSubMenu(data)"
                  style="margin-right: 5px"
                >
                  <el-icon><CirclePlus /></el-icon>
                  新增子菜单
                </el-button>
                <el-button type="danger" size="small" @click.stop="handleDeleteMenu(data)">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </div>
            </div>
          </template>
        </el-tree>
      </div>
    </el-card>

    <!-- 新增/编辑菜单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑菜单' : isSubMenu ? '新增子菜单' : '新增菜单'"
      width="500px"
    >
      <el-form ref="menuFormRef" :model="menuForm" :rules="menuRules" label-width="100px">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="menuForm.name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单路径" prop="path">
          <el-input v-model="menuForm.path" placeholder="请输入菜单路径" />
        </el-form-item>
        <el-form-item label="组件路径" prop="component">
          <el-input v-model="menuForm.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <el-input v-model="menuForm.icon" placeholder="请输入Element Plus图标名称" />
        </el-form-item>
        <el-form-item label="菜单排序" prop="sort">
          <el-input-number
            v-model="menuForm.sort"
            :min="0"
            :max="100"
            :step="1"
            placeholder="请输入菜单排序"
          />
        </el-form-item>
        <el-form-item label="菜单状态" prop="status">
          <el-switch v-model="menuForm.status" active-value="1" inactive-value="0" />
        </el-form-item>
        <el-form-item label="是否隐藏" prop="hidden">
          <el-switch v-model="menuForm.hidden" active-value="1" inactive-value="0" />
        </el-form-item>
        <el-form-item label="权限标识" prop="permission">
          <el-input v-model="menuForm.permission" placeholder="请输入权限标识" />
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh, Edit, CirclePlus, Delete } from '@element-plus/icons-vue'
import * as systemApi from '@/api/system'

// 导入类型定义
interface Menu {
  id: string
  name: string
  path: string
  component: string
  icon: string
  sort: number
  status: string
  hidden: string
  permission: string
  parentId: string
  children?: Menu[]
}

// 响应式状态
const loading = ref(false)
const menuTree = ref<Menu[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const isSubMenu = ref(false)
const menuFormRef = ref()

// 菜单表单
const menuForm = reactive({
  id: '',
  name: '',
  path: '',
  component: '',
  icon: '',
  sort: 0,
  status: '1',
  hidden: '0',
  permission: '',
  parentId: '0',
})

// 表单验证规则
const menuRules = reactive({
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  path: [{ required: true, message: '请输入菜单路径', trigger: 'blur' }],
  sort: [{ required: true, message: '请输入菜单排序', trigger: 'blur' }],
})

// 树属性配置
const defaultProps = {
  children: 'children',
  label: 'name',
}

// 初始化数据
onMounted(() => {
  fetchMenuTree()
})

// 获取菜单树
const fetchMenuTree = async () => {
  loading.value = true
  try {
    const res = await systemApi.getMenuTree()
    menuTree.value = res.data || []
  } catch (error) {
    ElMessage.error('获取菜单树失败')
  } finally {
    loading.value = false
  }
}

// 刷新菜单树
const handleRefresh = () => {
  fetchMenuTree()
}

// 节点点击事件
const handleNodeClick = (data: Menu) => {
  console.log('Node clicked:', data)
}

// 节点右键菜单
const handleNodeContextMenu = (event: MouseEvent, data: Menu) => {
  event.preventDefault()
  console.log('Context menu:', data)
}

// 新增菜单
const handleAddMenu = () => {
  isEdit.value = false
  isSubMenu.value = false
  Object.assign(menuForm, {
    id: '',
    name: '',
    path: '',
    component: '',
    icon: '',
    sort: 0,
    status: '1',
    hidden: '0',
    permission: '',
    parentId: '0',
  })
  dialogVisible.value = true
}

// 新增子菜单
const handleAddSubMenu = (parentMenu: Menu) => {
  isEdit.value = false
  isSubMenu.value = true
  Object.assign(menuForm, {
    id: '',
    name: '',
    path: '',
    component: '',
    icon: '',
    sort: 0,
    status: '1',
    hidden: '0',
    permission: '',
    parentId: parentMenu.id,
  })
  dialogVisible.value = true
}

// 编辑菜单
const handleEditMenu = (menu: Menu) => {
  isEdit.value = true
  isSubMenu.value = false
  Object.assign(menuForm, menu)
  dialogVisible.value = true
}

// 删除菜单
const handleDeleteMenu = async (menu: Menu) => {
  try {
    await ElMessageBox.confirm('确定要删除该菜单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await systemApi.deleteMenu(menu.id)
    ElMessage.success('菜单删除成功')
    fetchMenuTree()
  } catch (error) {
    // 取消删除
  }
}

// 保存菜单
const handleSubmit = async () => {
  if (!menuFormRef.value) return
  try {
    await menuFormRef.value.validate()
    if (isEdit.value) {
      await systemApi.updateMenu(menuForm)
      ElMessage.success('菜单更新成功')
    } else {
      await systemApi.addMenu(menuForm)
      ElMessage.success('菜单新增成功')
    }
    dialogVisible.value = false
    fetchMenuTree()
  } catch (error) {
    // 表单验证失败或保存失败
  }
}
</script>

<style lang="scss" scoped>
.menu-management {
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

.menu-card {
  margin-bottom: 20px;
}

.menu-tree-container {
  max-height: 600px;
  overflow-y: auto;
}

.menu-node-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  .node-actions {
    display: none;
  }

  &:hover {
    .node-actions {
      display: flex;
    }
  }
}

.dialog-footer {
  text-align: right;
}
</style>
