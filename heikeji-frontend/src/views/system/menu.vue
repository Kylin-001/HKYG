<template>
  <div class="system-menu-container">
    <el-card class="box-card">
      <template v-slot:header>
        <div class="clearfix">
          <span>菜单管理</span>
          <el-button type="primary" size="small" @click="handleAdd">
            <i class="el-icon-plus"></i> 添加菜单
          </el-button>
        </div>
      </template>
      <div class="menu-tree-container">
        <el-tree
          :data="menuTree"
          node-key="id"
          :props="defaultProps"
          @node-click="handleNodeClick"
          @node-contextmenu="handleContextMenu"
          default-expand-all
        >
          <template v-slot="{ node, data }">
            <span class="menu-item">
              <span v-if="data.icon" class="menu-icon">
                <i :class="data.icon"></i>
              </span>
              <span>{{ data.name }}</span>
              <div class="menu-actions">
                <el-button size="mini" type="primary" @click.stop="handleAddSubmenu(data)"
                  >添加子菜单</el-button
                >
                <el-button size="mini" @click.stop="handleEdit(data)">编辑</el-button>
                <el-button size="mini" type="danger" @click.stop="handleDelete(data)"
                  >删除</el-button
                >
              </div>
            </span>
          </template>
        </el-tree>
      </div>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog :title="dialogTitle" v-model:visible="dialogVisible" width="600px">
      <el-form :model="formData" :rules="rules" ref="formRef">
        <el-form-item label="上级菜单" prop="parentId">
          <el-cascader
            v-model="parentPath"
            :options="cascaderOptions"
            :props="{ expandTrigger: 'hover', checkStrictly: true, emitPath: false }"
            placeholder="请选择上级菜单"
            @change="handleCascaderChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <el-input v-model="formData.icon" placeholder="请输入菜单图标类名"></el-input>
        </el-form-item>
        <el-form-item label="路由地址" prop="path">
          <el-input v-model="formData.path" placeholder="请输入路由地址"></el-input>
        </el-form-item>
        <el-form-item label="组件路径" prop="component">
          <el-input v-model="formData.component" placeholder="请输入组件路径"></el-input>
        </el-form-item>
        <el-form-item label="是否隐藏" prop="hidden">
          <el-radio-group v-model="formData.hidden">
            <el-radio :label="false">显示</el-radio>
            <el-radio :label="true">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否固定" prop="affix">
          <el-radio-group v-model="formData.affix">
            <el-radio :label="false">不固定</el-radio>
            <el-radio :label="true">固定</el-radio>
          </el-radio-group>
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
// 导入Vue 3 API
import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus'
// 导入日志工具
import logger from '@/utils/logger'

// 定义TypeScript接口
interface Menu {
  id: string | number
  parentId: string | number
  name: string
  icon: string
  path: string
  component: string
  hidden: boolean
  affix: boolean
  children?: Menu[]
}

interface FormData {
  id: string
  parentId: string | number
  name: string
  icon: string
  path: string
  component: string
  hidden: boolean
  affix: boolean
  children: Menu[]
}

interface CascaderOption {
  value: string | number
  label: string
  children?: CascaderOption[]
}

// Vuex store
const store = useStore()

// 响应式数据
const menuTree = ref<Menu[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('添加菜单')
const currentParentId = ref(0)
const parentPath = ref<string[]>([])
const cascaderOptions = ref<CascaderOption[]>([])
const formData = reactive<FormData>({
  id: '',
  parentId: 0,
  name: '',
  icon: '',
  path: '',
  component: '',
  hidden: false,
  affix: false,
  children: [],
})
const formRef = ref<FormInstance | null>(null)
const loading = ref(false)

// 表单验证规则
const rules = reactive({
  name: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' },
    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
  ],
  path: [{ required: true, message: '请输入路由地址', trigger: 'blur' }],
})

// 树节点默认属性
const defaultProps = reactive({
  children: 'children',
  label: 'name',
})

// 获取菜单树
const fetchMenuTree = async () => {
  try {
    loading.value = true
    // 调用Vuex Store中的getMenuList方法
    const menuList = await store.dispatch('system/getMenuList', {
      page: 1,
      pageSize: 100,
    })

    // 构建树形结构
    menuTree.value = buildTree((menuList as any).data || [])

    // 构建级联选择器选项
    cascaderOptions.value = buildCascaderOptions(menuTree.value)
  } catch (error) {
    ElMessage.error(`获取菜单列表失败: ${(error as any).message}` || '未知错误')
  } finally {
    loading.value = false
  }
}

// 构建树形结构
const buildTree = (list: Menu[]): Menu[] => {
  const tree: Menu[] = []
  const map: Record<string | number, Menu> = {}

  // 创建映射
  list.forEach(item => {
    map[item.id] = { ...item, children: [] }
  })

  // 构建父子关系
  list.forEach(item => {
    if (item.parentId === 0) {
      tree.push(map[item.id])
    } else if (map[item.parentId]) {
      map[item.parentId].children?.push(map[item.id])
    }
  })

  return tree
}

// 构建级联选择器选项
const buildCascaderOptions = (menuTree: Menu[]): CascaderOption[] => {
  const options: CascaderOption[] = []
  menuTree.forEach(menu => {
    const option: CascaderOption = {
      value: menu.id,
      label: menu.name,
      children:
        menu.children && menu.children.length > 0 ? buildCascaderOptions(menu.children) : [],
    }
    options.push(option)
  })
  return options
}

// 处理节点点击
const handleNodeClick = (data: Menu) => {
  logger.debug('点击节点', data)
}

// 处理右键菜单
const handleContextMenu = (event: MouseEvent, data: Menu) => {
  event.preventDefault()
  logger.debug('右键菜单', data)
}

// 处理添加菜单
const handleAdd = () => {
  dialogTitle.value = '添加菜单'
  formData.id = ''
  formData.parentId = 0
  formData.name = ''
  formData.icon = ''
  formData.path = ''
  formData.component = ''
  formData.hidden = false
  formData.affix = false
  formData.children = []
  parentPath.value = []
  dialogVisible.value = true
}

// 处理添加子菜单
const handleAddSubmenu = (data: Menu) => {
  dialogTitle.value = '添加子菜单'
  formData.id = ''
  formData.parentId = data.id
  formData.name = ''
  formData.icon = ''
  formData.path = ''
  formData.component = ''
  formData.hidden = false
  formData.affix = false
  formData.children = []
  parentPath.value = [data.id.toString()]
  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (data: Menu) => {
  dialogTitle.value = '编辑菜单'
  formData.id = data.id.toString()
  formData.parentId = data.parentId
  formData.name = data.name
  formData.icon = data.icon
  formData.path = data.path
  formData.component = data.component
  formData.hidden = data.hidden
  formData.affix = data.affix
  formData.children = []
  if (data.parentId) {
    parentPath.value = [data.parentId.toString()]
  } else {
    parentPath.value = []
  }
  dialogVisible.value = true
}

// 处理级联选择变化
const handleCascaderChange = (value: string[]) => {
  formData.parentId = value.length > 0 ? Number(value[value.length - 1]) : 0
}

// 处理提交
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    const submitData = { ...formData }

    if (formData.id) {
      // 编辑操作
      await store.dispatch('system/updateMenu', submitData)
      ElMessage.success('编辑成功')
    } else {
      // 添加操作
      await store.dispatch('system/addMenu', submitData)
      ElMessage.success('添加成功')
    }

    fetchMenuTree() // 重新加载菜单树
    dialogVisible.value = false
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(`操作失败: ${(error as any).message}` || '未知错误')
    }
  }
}

// 处理删除
const handleDelete = (data: Menu) => {
  ElMessageBox.confirm(`确定要删除菜单"${data.name}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        // 检查是否有子菜单
        const hasChildren = checkHasChildren(menuTree.value, data.id)
        if (hasChildren) {
          ElMessage.warning('该菜单下还有子菜单，无法删除')
          return
        }

        // 调用删除API
        await store.dispatch('system/deleteMenu', data.id)

        fetchMenuTree() // 重新加载菜单树
        ElMessage.success('删除成功')
      } catch (error) {
        ElMessage.error(`删除失败: ${(error as any).message}` || '未知错误')
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

// 检查是否有子菜单
const checkHasChildren = (tree: Menu[], parentId: string | number): boolean => {
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].id === parentId && tree[i].children && tree[i].children.length > 0) {
      return true
    }
    if (tree[i].children && tree[i].children.length > 0) {
      if (checkHasChildren(tree[i].children, parentId)) {
        return true
      }
    }
  }
  return false
}

// 组件挂载时调用
onMounted(() => {
  fetchMenuTree()
})
</script>

<style scoped>
.system-menu-container {
  padding: 20px;
}

.menu-tree-container {
  margin-top: 20px;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.menu-icon {
  margin-right: 5px;
}

.menu-actions {
  display: none;
}

.menu-item:hover .menu-actions {
  display: inline-block;
}

.menu-actions .el-button {
  margin-left: 5px;
}

.dialog-footer {
  text-align: center;
}
</style>
