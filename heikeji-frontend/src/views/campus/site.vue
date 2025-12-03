<template>
  <div class="site-management">
    <div class="page-header">
      <h2>校园站点管理</h2>
      <el-button type="primary" @click="handleAdd">
        <i class="el-icon-plus"></i> 添加站点
      </el-button>
    </div>

    <!-- 搜索表单 -->
    <el-card class="search-card">
      <el-form :model="searchForm" :inline="$deviceSize !== 'xs'">
        <el-form-item label="站点名称" :label-width="$deviceSize === 'xs' ? '80px' : ''">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入站点名称"
            clearable
            :style="{ width: $deviceSize === 'xs' ? '100%' : '200px' }"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="站点类型" :label-width="$deviceSize === 'xs' ? '80px' : ''">
          <el-select
            v-model="searchForm.type"
            placeholder="请选择站点类型"
            clearable
            :style="{ width: $deviceSize === 'xs' ? '100%' : '150px' }"
          >
            <el-option label="教学楼" value="teaching"></el-option>
            <el-option label="宿舍楼" value="dormitory"></el-option>
            <el-option label="食堂" value="canteen"></el-option>
            <el-option label="图书馆" value="library"></el-option>
            <el-option label="体育馆" value="gym"></el-option>
            <el-option label="其他" value="other"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 - 添加响应式容器 -->
    <el-card class="table-card">
      <div class="responsive-table-container">
        <el-table
          :data="tableData"
          style="width: 100%"
          v-loading="loading"
          element-loading-text="加载中..."
        >
          <el-table-column prop="id" label="ID" width="80"></el-table-column>
          <el-table-column prop="name" label="站点名称" width="200"></el-table-column>
          <el-table-column prop="type" label="站点类型" width="120">
            <template #default="{ row }">
              <el-tag :type="getTypeTagType(row.type)">
                {{ getTypeText(row.type) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="详细地址" min-width="250"></el-table-column>
          <el-table-column prop="coordinates" label="坐标" width="180"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
                {{ row.status === 'active' ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button size="mini" @click="handleEdit(row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form :model="formData" :rules="formRules" ref="siteFormRef" label-width="100px">
        <el-form-item label="站点名称" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="站点类型" prop="type">
          <el-select v-model="formData.type" style="width: 100%">
            <el-option label="教学楼" value="teaching"></el-option>
            <el-option label="宿舍楼" value="dormitory"></el-option>
            <el-option label="食堂" value="canteen"></el-option>
            <el-option label="图书馆" value="library"></el-option>
            <el-option label="体育馆" value="gym"></el-option>
            <el-option label="其他" value="other"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="formData.address"></el-input>
        </el-form-item>
        <el-form-item label="坐标" prop="coordinates">
          <el-input v-model="formData.coordinates" placeholder="经度,纬度"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 定义接口
interface Site {
  id: number
  name: string
  type: string
  address: string
  coordinates: string
  status: 'active' | 'inactive'
  createTime: string
}

interface SearchForm {
  name: string
  type: string
}

interface Pagination {
  pageNum: number
  pageSize: number
  total: number
}

// 响应式数据
const loading = ref(false)
const searchForm = reactive<SearchForm>({
  name: '',
  type: '',
})

const tableData = ref<Site[]>([
  {
    id: 1,
    name: '第一教学楼',
    type: 'teaching',
    address: '东北校区中心大道1号',
    coordinates: '123.456,45.678',
    status: 'active',
    createTime: '2024-01-15 10:30:00',
  },
  {
    id: 2,
    name: '学生宿舍A栋',
    type: 'dormitory',
    address: '东北校区学生生活区',
    coordinates: '123.457,45.679',
    status: 'active',
    createTime: '2024-01-15 11:00:00',
  },
  {
    id: 3,
    name: '第一食堂',
    type: 'canteen',
    address: '东北校区学生生活区',
    coordinates: '123.458,45.680',
    status: 'active',
    createTime: '2024-01-15 11:30:00',
  },
])

const pagination = reactive<Pagination>({
  pageNum: 1,
  pageSize: 10,
  total: 3,
})

const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)
const siteFormRef = ref()

const formData = reactive<Site>({
  id: 0,
  name: '',
  type: '',
  address: '',
  coordinates: '',
  status: 'active',
  createTime: '',
})

const formRules = reactive({
  name: [{ required: true, message: '请输入站点名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择站点类型', trigger: 'change' }],
  address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
})

// 工具函数
const getTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    teaching: '教学楼',
    dormitory: '宿舍楼',
    canteen: '食堂',
    library: '图书馆',
    gym: '体育馆',
    other: '其他',
  }
  return typeMap[type] || type
}

const getTypeTagType = (type: string): string => {
  const typeMap: Record<string, string> = {
    teaching: 'primary',
    dormitory: 'success',
    canteen: 'warning',
    library: 'info',
    gym: 'danger',
    other: '',
  }
  return typeMap[type] || ''
}

// 事件处理函数
const handleSearch = () => {
  fetchData()
}

const handleReset = () => {
  searchForm.name = ''
  searchForm.type = ''
  fetchData()
}

const fetchData = () => {
  loading.value = true
  // 模拟API调用
  setTimeout(() => {
    loading.value = false
    // 这里应该是实际的API调用
  }, 500)
}

const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '添加站点'
  resetFormData()
  dialogVisible.value = true
}

const handleEdit = (row: Site) => {
  isEdit.value = true
  dialogTitle.value = '编辑站点'
  Object.assign(formData, { ...row })
  dialogVisible.value = true
}

const handleDelete = (row: Site) => {
  ElMessageBox.confirm('确定要删除这个站点吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 这里应该是实际的删除API调用
      ElMessage.success('删除成功')
      fetchData()
    })
    .catch(() => {
      // 取消删除
    })
}

const handleSubmit = () => {
  siteFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      // 这里应该是实际的保存API调用
      ElMessage.success(isEdit.value ? '更新成功' : '添加成功')
      dialogVisible.value = false
      fetchData()
    }
  })
}

const handleDialogClose = () => {
  resetFormData()
  siteFormRef.value?.resetFields()
}

const resetFormData = () => {
  formData.id = 0
  formData.name = ''
  formData.type = ''
  formData.address = ''
  formData.coordinates = ''
  formData.status = 'active'
  formData.createTime = ''
}

const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  fetchData()
}

const handleCurrentChange = (val: number) => {
  pagination.pageNum = val
  fetchData()
}

// 生命周期
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.site-management {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  color: #303133;
}

.search-card {
  margin-bottom: 20px;
}

.table-card {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}
/* 响应式表格容器 */
.responsive-table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.responsive-table-container::-webkit-scrollbar {
  height: 8px;
}

.responsive-table-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.responsive-table-container::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 4px;
}

.responsive-table-container::-webkit-scrollbar-thumb:hover {
  background: #909399;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .site-management {
    padding: 10px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .pagination-container {
    margin-top: 15px;
    display: flex;
    justify-content: center;
  }

  .el-pagination {
    font-size: 12px;
  }
}
</style>
