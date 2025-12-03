<template>
  <div class="building-list-container">
    <div class="page-header">
      <h2>楼栋管理</h2>
      <el-button type="primary" @click="handleAddBuilding">
        <i class="el-icon-plus"></i> 添加楼栋
      </el-button>
    </div>

    <el-card class="mt-20">
      <div class="search-form">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="所属校区">
            <el-select v-model="searchForm.campusId" placeholder="请选择校区" clearable>
              <el-option
                v-for="campus in campusList"
                :key="campus.id"
                :label="campus.name"
                :value="campus.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="楼栋名称">
            <el-input v-model="searchForm.name" placeholder="请输入楼栋名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="楼栋编码">
            <el-input v-model="searchForm.code" placeholder="请输入楼栋编码" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <i class="el-icon-search"></i> 搜索
            </el-button>
            <el-button @click="resetSearch"> <i class="el-icon-refresh"></i> 重置 </el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table v-loading="loading" :data="buildingList" style="width: 100%" stripe border>
        <el-table-column prop="id" label="楼栋ID" width="80"></el-table-column>
        <el-table-column prop="campusName" label="所属校区" width="150"></el-table-column>
        <el-table-column prop="name" label="楼栋名称" width="150"></el-table-column>
        <el-table-column prop="code" label="楼栋编码" width="120"></el-table-column>
        <el-table-column prop="floorCount" label="楼层数" width="100"></el-table-column>
        <el-table-column prop="buildingType" label="楼栋类型" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.buildingType === 1 ? 'primary' : 'success'">
              {{ scope.row.buildingType === 1 ? '男生公寓' : '女生公寓' }}
            </el-tag>
          </template>
        </el-table-column>
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
              @click="handleEditBuilding(scope.row)"
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
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 添加/编辑楼栋对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="buildingForm" :rules="rules" ref="buildingFormRef" label-width="120px">
        <el-form-item label="所属校区" prop="campusId">
          <el-select v-model="buildingForm.campusId" placeholder="请选择校区">
            <el-option
              v-for="campus in campusList"
              :key="campus.id"
              :label="campus.name"
              :value="campus.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="楼栋名称" prop="name">
          <el-input v-model="buildingForm.name" placeholder="请输入楼栋名称"></el-input>
        </el-form-item>
        <el-form-item label="楼栋编码" prop="code">
          <el-input v-model="buildingForm.code" placeholder="请输入楼栋编码"></el-input>
        </el-form-item>
        <el-form-item label="楼层数" prop="floorCount">
          <el-input-number
            v-model="buildingForm.floorCount"
            :min="1"
            :max="20"
            placeholder="请输入楼层数"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="楼栋类型" prop="buildingType">
          <el-radio-group v-model="buildingForm.buildingType">
            <el-radio label="1">男生公寓</el-radio>
            <el-radio label="2">女生公寓</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="buildingForm.remark"
            type="textarea"
            rows="3"
            placeholder="请输入备注信息"
          ></el-input>
        </el-form-item>
      </el-form>
      <div #footer class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'

// 定义类型
interface Building {
  id: number
  campusId: number
  campusName: string
  name: string
  code: string
  floorCount: number
  buildingType: number
  status: number
  createTime: string
  remark?: string
}

interface Campus {
  id: number
  name: string
}

interface SearchForm {
  campusId: string
  name: string
  code: string
}

interface Pagination {
  currentPage: number
  pageSize: number
}

interface BuildingForm {
  id?: number
  campusId: string
  name: string
  code: string
  floorCount: number
  buildingType: string
  remark?: string
}

// 初始化 Store
const store = useStore()

// 响应式数据
const loading = ref(false)
const searchForm = ref<SearchForm>({
  campusId: '',
  name: '',
  code: '',
})

const pagination = ref<Pagination>({
  currentPage: 1,
  pageSize: 10,
})

const dialogVisible = ref(false)
const dialogTitle = ref('')
const editingBuilding = ref<Building | null>(null)

const buildingForm = ref<BuildingForm>({
  campusId: '',
  name: '',
  code: '',
  floorCount: 1,
  buildingType: '1',
  remark: '',
})

const buildingFormRef = ref()

const rules = {
  campusId: [{ required: true, message: '请选择所属校区', trigger: 'change' }],
  name: [
    { required: true, message: '请输入楼栋名称', trigger: 'blur' },
    { min: 1, max: 50, message: '楼栋名称长度在 1 到 50 个字符', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入楼栋编码', trigger: 'blur' },
    { min: 1, max: 20, message: '楼栋编码长度在 1 到 20 个字符', trigger: 'blur' },
  ],
  floorCount: [{ required: true, message: '请输入楼层数', trigger: 'blur' }],
  buildingType: [{ required: true, message: '请选择楼栋类型', trigger: 'change' }],
}

// 从 store 获取状态
const buildingList = computed(() => store.state.campus.buildingList || [])
const buildingTotal = computed(() => store.state.campus.buildingTotal || 0)
const campusList = computed(() => store.state.campus.campusList || [])
const total = computed(() => buildingTotal.value)

// 从 store 获取 actions
const getBuildings = (params: any) => store.dispatch('campus/getBuildings', params)
async function addNewBuilding(params: any) {
  return store.dispatch('campus/addNewBuilding', params)
}
async function updateExistingBuilding(params: any) {
  return store.dispatch('campus/updateExistingBuilding', params)
}
async function updateBuildingEnabledStatus(params: any) {
  return store.dispatch('campus/updateBuildingEnabledStatus', params)
}
async function getCampuses() {
  return store.dispatch('campus/getCampuses')
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    // 先加载校区列表
    await getCampuses()
    // 再加载楼栋列表
    await loadBuildingList()
  } catch (error) {
    ElMessage.error('数据加载失败')
  } finally {
    loading.value = false
  }
}

// 加载楼栋列表
const loadBuildingList = async () => {
  try {
    await getBuildings({
      ...searchForm.value,
      page: pagination.value.currentPage,
      pageSize: pagination.value.pageSize,
    })
  } catch (error) {
    ElMessage.error('获取楼栋列表失败')
  }
}

// 搜索
const handleSearch = () => {
  pagination.value.currentPage = 1
  loadBuildingList()
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    campusId: '',
    name: '',
    code: '',
  }
  handleSearch()
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.value.pageSize = size
  loadBuildingList()
}

// 分页页码变化
const handleCurrentChange = (current: number) => {
  pagination.value.currentPage = current
  loadBuildingList()
}

// 添加楼栋
const handleAddBuilding = () => {
  dialogTitle.value = '添加楼栋'
  editingBuilding.value = null
  buildingForm.value = {
    campusId: campusList.value.length > 0 ? String(campusList.value[0].id) : '',
    name: '',
    code: '',
    floorCount: 1,
    buildingType: '1',
    remark: '',
  }
  dialogVisible.value = true
}

// 编辑楼栋
const handleEditBuilding = (row: Building) => {
  dialogTitle.value = '编辑楼栋'
  editingBuilding.value = row
  buildingForm.value = {
    id: row.id,
    campusId: String(row.campusId),
    name: row.name,
    code: row.code,
    floorCount: row.floorCount || 1,
    buildingType: String(row.buildingType) || '1',
    remark: row.remark || '',
  }
  dialogVisible.value = true
}

// 更新状态
const handleUpdateStatus = async (row: Building) => {
  const originalStatus = row.status
  const newStatus = originalStatus === 1 ? 0 : 1
  try {
    await ElMessageBox.confirm(`确定要${newStatus === 1 ? '启用' : '禁用'}该楼栋吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await updateBuildingEnabledStatus({ id: row.id, status: newStatus })
    ElMessage.success(`${newStatus === 1 ? '启用' : '禁用'}成功`)
    // 重新加载列表以获取最新数据
    loadBuildingList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(`${newStatus === 1 ? '启用' : '禁用'}失败`)
      // 恢复原状态
      row.status = originalStatus
    }
    // 取消操作不处理
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!buildingFormRef.value) return

  try {
    await buildingFormRef.value.validate()

    // 转换数据类型
    const submitData = {
      ...buildingForm.value,
      floorCount: Number(buildingForm.value.floorCount),
      buildingType: Number(buildingForm.value.buildingType),
    }

    if (editingBuilding.value) {
      // 更新楼栋
      await updateExistingBuilding(submitData)
      ElMessage.success('楼栋更新成功')
    } else {
      // 添加楼栋
      await addNewBuilding(submitData)
      ElMessage.success('楼栋添加成功')
    }
    dialogVisible.value = false
  } catch (error) {
    // 验证失败或提交失败不处理，已通过表单验证和API返回处理
  }
}

// 生命周期钩子
onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.building-list-container {
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
