<template>
  <div class="system-role-container">
    <el-card class="box-card">
      <template v-slot:header>
        <div class="clearfix">
          <span>角色管理</span>
          <el-button type="primary" size="small" @click="handleAdd">
            <i class="el-icon-plus"></i> 添加角色
          </el-button>
        </div>
      </template>

      <div class="table-container">
        <el-table :data="roleList" style="width: 100%" border stripe>
          <el-table-column prop="id" label="角色ID" width="100" align="center"></el-table-column>
          <el-table-column prop="name" label="角色名称" min-width="150"></el-table-column>
          <el-table-column prop="description" label="角色描述" min-width="200"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="180"></el-table-column>
          <el-table-column label="操作" width="200" align="center" fixed="right">
            <template v-slot:scope>
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">
                编辑
              </el-button>
              <el-button type="success" size="small" @click="handlePermission(scope.row)">
                权限配置
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="handleDelete(scope.row)"
                v-if="scope.row.id !== 1"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog :title="dialogTitle" v-model:visible="dialogVisible" width="600px">
      <el-form :model="formData" :rules="rules" ref="formRef">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            rows="3"
            placeholder="请输入角色描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 权限配置对话框 -->
    <el-dialog title="权限配置" v-model:visible="permissionVisible" width="800px">
      <div class="permission-tree">
        <el-tree
          :data="permissionTree"
          show-checkbox
          default-expand-all
          node-key="id"
          ref="permissionTree"
        ></el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="permissionVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSavePermission">保存配置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// 导入Vue 3 API
import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox, FormInstance, TreeInstance } from 'element-plus'
// 导入日志工具
import logger from '@/utils/logger'

// 定义TypeScript接口
interface Role {
  id: number | string
  name: string
  description: string
  createTime: string
}

interface FormData {
  id: string
  name: string
  description: string
}

interface Permission {
  id: number
  label: string
  children?: Permission[]
  disabled?: boolean
}

// Vuex store
const store = useStore()

// 响应式数据
const roleList = ref<Role[]>([])
const dialogVisible = ref(false)
const permissionVisible = ref(false)
const dialogTitle = ref('添加角色')
const currentRoleId = ref('')
const formData = reactive<FormData>({
  id: '',
  name: '',
  description: '',
})
const formRef = ref<FormInstance | null>(null)
const permissionTree = ref<Permission[]>([])
const permissionTreeRef = ref<TreeInstance | null>(null)

// 表单验证规则
const rules = reactive({
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
  ],
})

// 获取角色列表
const fetchRoleList = async () => {
  try {
    await store.dispatch('setLoading', true)
    await store.dispatch('getRoleList', {})
    ElMessage.success('角色列表加载成功')
  } catch (error) {
    ElMessage.error('获取角色列表失败')
    logger.error('获取角色列表失败', error)
  } finally {
    await store.dispatch('setLoading', false)
  }
}

// 获取权限树
const fetchPermissionTree = async () => {
  try {
    await store.dispatch('getPermissionList', {})
    // 这里需要根据实际API返回的数据结构来构建权限树
    permissionTree.value = buildPermissionTree()
  } catch (error) {
    ElMessage.error('获取权限列表失败')
    logger.error('获取权限列表失败', error)
  }
}

// 构建权限树结构
const buildPermissionTree = (): Permission[] => {
  // 这里需要根据实际API返回数据结构调整
  return [
    {
      id: 1,
      label: '首页',
      children: [{ id: 11, label: '查看仪表盘' }],
    },
    {
      id: 2,
      label: '商品管理',
      children: [
        { id: 21, label: '查看商品列表' },
        { id: 22, label: '添加商品' },
        { id: 23, label: '编辑商品' },
        { id: 24, label: '删除商品' },
        { id: 25, label: '管理分类' },
        { id: 26, label: '管理品牌' },
      ],
    },
    {
      id: 3,
      label: '订单管理',
      children: [
        { id: 31, label: '查看订单列表' },
        { id: 32, label: '查看订单详情' },
        { id: 33, label: '处理退款' },
      ],
    },
    {
      id: 4,
      label: '用户管理',
      children: [
        { id: 41, label: '查看用户列表' },
        { id: 42, label: '编辑用户信息' },
        { id: 43, label: '管理会员等级' },
        { id: 44, label: '管理用户地址' },
      ],
    },
    {
      id: 5,
      label: '系统管理',
      children: [
        { id: 51, label: '管理管理员', disabled: true },
        { id: 52, label: '管理角色', disabled: true },
        { id: 53, label: '管理菜单', disabled: true },
        { id: 54, label: '查看操作日志' },
      ],
    },
  ]
}

// 处理添加
const handleAdd = () => {
  dialogTitle.value = '添加角色'
  formData.id = ''
  formData.name = ''
  formData.description = ''
  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (row: Role) => {
  dialogTitle.value = '编辑角色'
  formData.id = row.id.toString()
  formData.name = row.name
  formData.description = row.description
  dialogVisible.value = true
}

// 处理提交
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    if (formData.id) {
      // 编辑操作
      const index = roleList.value.findIndex(item => item.id === formData.id)
      if (index !== -1) {
        roleList.value.splice(index, 1, {
          ...(formData as Role),
          createTime: roleList.value[index].createTime,
        })
        ElMessage.success('编辑成功')
      }
    } else {
      // 添加操作
      const newRole: Role = {
        ...(formData as Role),
        id: Date.now(),
        createTime: new Date().toLocaleString('zh-CN'),
      }
      roleList.value.push(newRole)
      ElMessage.success('添加成功')
    }
    dialogVisible.value = false
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(`操作失败: ${(error as any).message}` || '未知错误')
    }
  }
}

// 处理权限配置
const handlePermission = (row: Role) => {
  currentRoleId.value = row.id.toString()
  permissionVisible.value = true
  // 这里可以根据角色ID加载已配置的权限
  // 模拟选中部分权限
  if (permissionTreeRef.value) {
    permissionTreeRef.value.setCheckedNodes([])
    if (row.id === 1) {
      // 超级管理员全选
      permissionTreeRef.value.setCheckedKeys([
        1, 11, 2, 21, 22, 23, 24, 25, 26, 3, 31, 32, 33, 4, 41, 42, 43, 44, 5, 51, 52, 53, 54,
      ])
    } else if (row.id === 2) {
      // 运营管理员部分权限
      permissionTreeRef.value.setCheckedKeys([1, 11, 2, 21, 22, 23, 24, 25, 26, 3, 31, 32, 33])
    } else if (row.id === 3) {
      // 用户管理员部分权限
      permissionTreeRef.value.setCheckedKeys([1, 11, 4, 41, 42, 43, 44])
    }
  }
}

// 保存权限配置
const handleSavePermission = () => {
  if (!permissionTreeRef.value) return

  const checkedKeys = permissionTreeRef.value.getCheckedKeys(true)
  logger.debug('保存权限配置', checkedKeys)
  ElMessage.success('权限配置已保存')
  permissionVisible.value = false
}

// 处理删除
const handleDelete = (row: Role) => {
  ElMessageBox.confirm('确定要删除这个角色吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      const index = roleList.value.findIndex(item => item.id === row.id)
      if (index !== -1) {
        roleList.value.splice(index, 1)
        ElMessage.success('删除成功')
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

// 组件挂载时调用
onMounted(() => {
  fetchRoleList()
  fetchPermissionTree()
})
</script>

<style scoped>
.system-role-container {
  padding: 20px;
}

.table-container {
  margin-top: 20px;
}

.dialog-footer {
  text-align: center;
}

.permission-tree {
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
}
</style>
