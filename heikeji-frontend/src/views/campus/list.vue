<template>
  <div class="campus-list-container">
    <div class="page-header">
      <h2>校区管理</h2>
      <el-button type="primary" @click="handleAddCampus">
        <i class="el-icon-plus"></i> 添加校区
      </el-button>
    </div>

    <el-card class="mt-20">
      <div class="search-form">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="校区名称">
            <el-input v-model="searchForm.name" placeholder="请输入校区名称" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <i class="el-icon-search"></i> 搜索
            </el-button>
            <el-button @click="resetSearch"> <i class="el-icon-refresh"></i> 重置 </el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table
        v-loading="campusStore.campusLoading"
        :data="campusStore.campusList"
        style="width: 100%"
        stripe
        border
      >
        <el-table-column prop="id" label="校区ID" width="80"></el-table-column>
        <el-table-column prop="name" label="校区名称" width="180"></el-table-column>
        <el-table-column prop="code" label="校区编码" width="120"></el-table-column>
        <el-table-column prop="address" label="校区地址"></el-table-column>
        <el-table-column prop="contactPhone" label="联系电话" width="150"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleEditCampus(scope.row)"
              :disabled="!scope.row.status"
            >
              编辑
            </el-button>
            <el-button
              :type="scope.row.status === 1 ? 'danger' : 'success'"
              size="small"
              @click="handleUpdateStatus(scope.row)"
            >
              {{ scope.row.status === 1 ? '禁用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :total="campusStore.campusTotal"
          :page-sizes="[10, 20, 50, 100]"
          :current-page="pagination.currentPage"
          :page-size="pagination.pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 添加/编辑校区对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="campusForm" :rules="rules" ref="campusFormRef" label-width="120px">
        <el-form-item label="校区名称" prop="name">
          <el-input v-model="campusForm.name" placeholder="请输入校区名称"></el-input>
        </el-form-item>
        <el-form-item label="校区编码" prop="code">
          <el-input v-model="campusForm.code" placeholder="请输入校区编码"></el-input>
        </el-form-item>
        <el-form-item label="校区地址" prop="address">
          <el-input
            v-model="campusForm.address"
            type="textarea"
            rows="2"
            placeholder="请输入校区地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="contactPhone">
          <el-input v-model="campusForm.contactPhone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="campusForm.remark"
            type="textarea"
            rows="3"
            placeholder="请输入备注信息"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCampusStore, type Campus } from '@/store/modules/campus'

const campusStore = useCampusStore()

// 表单引用
const campusFormRef = ref()

// 搜索表单
const searchForm = reactive({
  name: '',
})

// 分页配置
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
})

// 对话框配置
const dialogVisible = ref(false)
const dialogTitle = ref('')
const editingCampus = ref<Campus | null>(null)

// 表单数据
const campusForm = reactive({
  id: 0,
  name: '',
  code: '',
  address: '',
  contactPhone: '',
  remark: '',
})

// 表单验证规则
const rules = reactive({
  name: [
    { required: true, message: '请输入校区名称', trigger: 'blur' },
    { min: 2, max: 50, message: '校区名称长度在 2 到 50 个字符', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入校区编码', trigger: 'blur' },
    { min: 2, max: 20, message: '校区编码长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  address: [{ required: true, message: '请输入校区地址', trigger: 'blur' }],
  contactPhone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
})

// 加载校区列表
const loadCampusList = async () => {
  try {
    await campusStore.getCampuses()
  } catch (error) {
    ElMessage.error('获取校区列表失败')
  }
}

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  loadCampusList()
}

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  handleSearch()
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadCampusList()
}

// 分页页码变化
const handleCurrentChange = (current: number) => {
  pagination.currentPage = current
  loadCampusList()
}

// 添加校区
const handleAddCampus = () => {
  dialogTitle.value = '添加校区'
  editingCampus.value = null
  Object.assign(campusForm, {
    id: 0,
    name: '',
    code: '',
    address: '',
    contactPhone: '',
    remark: '',
  })
  dialogVisible.value = true
}

// 编辑校区
const handleEditCampus = (row: Campus) => {
  dialogTitle.value = '编辑校区'
  editingCampus.value = row
  Object.assign(campusForm, {
    id: row.id,
    name: row.name,
    code: row.code,
    address: row.address,
    contactPhone: row.contactPhone,
    remark: row.remark || '',
  })
  dialogVisible.value = true
}

// 更新状态
const handleUpdateStatus = async (row: Campus) => {
  const newStatus = row.status === 1 ? 0 : 1
  try {
    await ElMessageBox.confirm(`确定要${newStatus === 1 ? '启用' : '禁用'}该校区吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await campusStore.updateCampusEnabledStatus(row.id, newStatus)
    ElMessage.success(`${newStatus === 1 ? '启用' : '禁用'}成功`)
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(`${newStatus === 1 ? '启用' : '禁用'}失败`)
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!campusFormRef.value) return

  try {
    await campusFormRef.value.validate()

    if (editingCampus.value) {
      // 更新校区
      await campusStore.updateExistingCampus(campusForm as Campus)
      ElMessage.success('校区更新成功')
    } else {
      // 添加校区
      await campusStore.addNewCampus(campusForm)
      ElMessage.success('校区添加成功')
    }
    dialogVisible.value = false
  } catch (error: any) {
    if (error !== false) {
      ElMessage.error(editingCampus.value ? '校区更新失败' : '校区添加失败')
    }
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadCampusList()
})
</script>

<style lang="scss" scoped>
.campus-list-container {
  padding: 20px;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }
  }

  .search-form {
    margin-bottom: 20px;
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
