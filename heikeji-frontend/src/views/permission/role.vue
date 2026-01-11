<template>
  <div class="role-management">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2>角色管理</h2>
        <span class="subtitle">管理系统角色和权限</span>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleAddRole">
          <el-icon><Plus /></el-icon>
          新增角色
        </el-button>
        <el-button @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 角色列表 -->
    <el-card class="role-list-card">
      <!-- 搜索和筛选 -->
      <div class="search-filter">
        <el-input
          v-model="searchParams.keyword"
          placeholder="角色名称"
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

      <!-- 角色表格 -->
      <el-table
        v-loading="loading"
        :data="roleList"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="角色ID" width="100" align="center" />
        <el-table-column prop="name" label="角色名称" width="150" align="center" />
        <el-table-column prop="code" label="角色编码" width="150" align="center" />
        <el-table-column prop="description" label="角色描述" align="center" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="1"
              inactive-value="0"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" align="center" />
        <el-table-column prop="updateTime" label="更新时间" width="180" align="center" />
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleEditRole(scope.row)"
              style="margin-right: 5px"
            >
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button
              type="success"
              size="small"
              @click="handlePermissionConfig(scope.row)"
              style="margin-right: 5px"
            >
              <el-icon><Lock /></el-icon>
              权限配置
            </el-button>
            <el-button type="danger" size="small" @click="handleDeleteRole(scope.row.id)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑角色对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑角色' : '新增角色'" width="500px">
      <el-form ref="roleFormRef" :model="roleForm" :rules="roleRules" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="roleForm.code" placeholder="请输入角色编码" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
            v-model="roleForm.description"
            placeholder="请输入角色描述"
            type="textarea"
            rows="3"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="roleForm.status" active-value="1" inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 权限配置对话框 -->
    <el-dialog v-model="permissionDialogVisible" title="权限配置" width="800px">
      <div class="permission-config">
        <el-tree
          v-model="selectedPermissions"
          :data="permissionTree"
          :props="treeProps"
          show-checkbox
          default-expand-all
          node-key="id"
          check-strictly
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="permissionDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSavePermission">保存权限</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh, Search, Edit, Lock, Delete } from '@element-plus/icons-vue'

// 导入类型定义
interface Role {
  id: string
  name: string
  code: string
  description: string
  status: string
  createTime: string
  updateTime: string
}

interface Permission {
  id: string
  name: string
  code: string
  parentId: string
  level: number
  children?: Permission[]
}

// 响应式状态
const loading = ref(false)
const roleList = ref<Role[]>([])
const total = ref(0)
const selectedRoles = ref<string[]>([])
const dialogVisible = ref(false)
const permissionDialogVisible = ref(false)
const isEdit = ref(false)
const roleFormRef = ref()

// 搜索参数
const searchParams = reactive({
  keyword: '',
})

// 分页参数
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
})

// 角色表单
const roleForm = reactive({
  id: '',
  name: '',
  code: '',
  description: '',
  status: '1',
})

// 表单验证规则
const roleRules = reactive({
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
})

// 权限树数据
const permissionTree = ref<Permission[]>([
  {
    id: '1',
    name: '系统管理',
    code: 'system',
    parentId: '0',
    level: 1,
    children: [
      {
        id: '1-1',
        name: '用户管理',
        code: 'user',
        parentId: '1',
        level: 2,
        children: [
          { id: '1-1-1', name: '查看用户', code: 'user:view', parentId: '1-1', level: 3 },
          { id: '1-1-2', name: '新增用户', code: 'user:add', parentId: '1-1', level: 3 },
          { id: '1-1-3', name: '编辑用户', code: 'user:edit', parentId: '1-1', level: 3 },
          { id: '1-1-4', name: '删除用户', code: 'user:delete', parentId: '1-1', level: 3 },
        ],
      },
      {
        id: '1-2',
        name: '角色管理',
        code: 'role',
        parentId: '1',
        level: 2,
        children: [
          { id: '1-2-1', name: '查看角色', code: 'role:view', parentId: '1-2', level: 3 },
          { id: '1-2-2', name: '新增角色', code: 'role:add', parentId: '1-2', level: 3 },
          { id: '1-2-3', name: '编辑角色', code: 'role:edit', parentId: '1-2', level: 3 },
          { id: '1-2-4', name: '删除角色', code: 'role:delete', parentId: '1-2', level: 3 },
        ],
      },
      {
        id: '1-3',
        name: '菜单管理',
        code: 'menu',
        parentId: '1',
        level: 2,
        children: [
          { id: '1-3-1', name: '查看菜单', code: 'menu:view', parentId: '1-3', level: 3 },
          { id: '1-3-2', name: '新增菜单', code: 'menu:add', parentId: '1-3', level: 3 },
          { id: '1-3-3', name: '编辑菜单', code: 'menu:edit', parentId: '1-3', level: 3 },
          { id: '1-3-4', name: '删除菜单', code: 'menu:delete', parentId: '1-3', level: 3 },
        ],
      },
    ],
  },
  {
    id: '2',
    name: '商品管理',
    code: 'product',
    parentId: '0',
    level: 1,
    children: [
      {
        id: '2-1',
        name: '商品列表',
        code: 'product:list',
        parentId: '2',
        level: 2,
      },
      {
        id: '2-2',
        name: '商品分类',
        code: 'product:category',
        parentId: '2',
        level: 2,
      },
      {
        id: '2-3',
        name: '品牌管理',
        code: 'product:brand',
        parentId: '2',
        level: 2,
      },
    ],
  },
  {
    id: '3',
    name: '订单管理',
    code: 'order',
    parentId: '0',
    level: 1,
    children: [
      {
        id: '3-1',
        name: '订单列表',
        code: 'order:list',
        parentId: '3',
        level: 2,
      },
      {
        id: '3-2',
        name: '订单统计',
        code: 'order:stat',
        parentId: '3',
        level: 2,
      },
    ],
  },
])

const selectedPermissions = ref<string[]>([])
const treeProps = {
  children: 'children',
  label: 'name',
}

// 初始化数据
onMounted(() => {
  fetchRoleList()
})

// 获取角色列表
const fetchRoleList = async () => {
  loading.value = true
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500))
    // 模拟数据
    const mockData: Role[] = [
      {
        id: '1',
        name: '超级管理员',
        code: 'admin',
        description: '拥有系统所有权限',
        status: '1',
        createTime: '2026-01-01 10:00:00',
        updateTime: '2026-01-01 10:00:00',
      },
      {
        id: '2',
        name: '商品管理员',
        code: 'product_admin',
        description: '管理商品相关权限',
        status: '1',
        createTime: '2026-01-02 14:30:00',
        updateTime: '2026-01-02 14:30:00',
      },
      {
        id: '3',
        name: '订单管理员',
        code: 'order_admin',
        description: '管理订单相关权限',
        status: '1',
        createTime: '2026-01-03 09:15:00',
        updateTime: '2026-01-03 09:15:00',
      },
    ]
    roleList.value = mockData
    total.value = mockData.length
  } catch (error) {
    ElMessage.error('获取角色列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索角色
const handleSearch = () => {
  pagination.currentPage = 1
  fetchRoleList()
}

// 刷新角色列表
const handleRefresh = () => {
  searchParams.keyword = ''
  pagination.currentPage = 1
  fetchRoleList()
}

// 分页变化处理
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  fetchRoleList()
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
  fetchRoleList()
}

// 选择角色变化
const handleSelectionChange = (selection: any[]) => {
  selectedRoles.value = selection.map(item => item.id)
}

// 新增角色
const handleAddRole = () => {
  isEdit.value = false
  // 重置表单
  Object.assign(roleForm, {
    id: '',
    name: '',
    code: '',
    description: '',
    status: '1',
  })
  dialogVisible.value = true
}

// 编辑角色
const handleEditRole = (role: Role) => {
  isEdit.value = true
  // 填充表单数据
  Object.assign(roleForm, role)
  dialogVisible.value = true
}

// 配置权限
const handlePermissionConfig = (role: Role) => {
  // 模拟获取角色权限
  selectedPermissions.value = ['1', '1-1', '1-1-1', '1-1-2', '1-1-3', '1-1-4']
  permissionDialogVisible.value = true
}

// 删除角色
const handleDeleteRole = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要删除该角色吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500))
    // 更新本地数据
    roleList.value = roleList.value.filter(item => item.id !== id)
    total.value = roleList.value.length
    ElMessage.success('角色删除成功')
  } catch (error) {
    // 取消删除
  }
}

// 保存角色
const handleSubmit = async () => {
  if (!roleFormRef.value) return
  try {
    await roleFormRef.value.validate()
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500))
    if (isEdit.value) {
      // 更新角色
      const index = roleList.value.findIndex(item => item.id === roleForm.id)
      if (index !== -1) {
        roleList.value[index] = {
          ...roleList.value[index],
          ...roleForm,
          updateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        }
      }
      ElMessage.success('角色更新成功')
    } else {
      // 新增角色
      const newRole: Role = {
        ...roleForm,
        id: Date.now().toString(),
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      }
      roleList.value.unshift(newRole)
      total.value = roleList.value.length
      ElMessage.success('角色新增成功')
    }
    dialogVisible.value = false
  } catch (error) {
    // 表单验证失败或保存失败
  }
}

// 保存权限配置
const handleSavePermission = async () => {
  // 模拟API请求
  await new Promise(resolve => setTimeout(resolve, 500))
  ElMessage.success('权限配置保存成功')
  permissionDialogVisible.value = false
}

// 切换角色状态
const handleStatusChange = async (role: Role) => {
  // 模拟API请求
  await new Promise(resolve => setTimeout(resolve, 500))
  ElMessage.success('角色状态更新成功')
}
</script>

<style lang="scss" scoped>
.role-management {
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

.role-list-card {
  margin-bottom: 20px;
}

.search-filter {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.permission-config {
  max-height: 500px;
  overflow-y: auto;
}
</style>
