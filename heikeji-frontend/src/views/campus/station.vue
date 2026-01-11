<template>
  <div class="station-list-container">
    <div class="page-header">
      <h2>校园站点管理</h2>
      <el-button type="primary" @click="handleAddStation">
        <i class="el-icon-plus"></i> 添加站点
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
          <el-form-item label="站点名称">
            <el-input v-model="searchForm.name" placeholder="请输入站点名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="站点类型">
            <el-select v-model="searchForm.stationType" placeholder="请选择站点类型" clearable>
              <el-option label="外卖站点" value="1"></el-option>
              <el-option label="跑腿站点" value="2"></el-option>
              <el-option label="综合站点" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
              <el-option label="启用" value="1"></el-option>
              <el-option label="禁用" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <i class="el-icon-search"></i> 搜索
            </el-button>
            <el-button @click="resetSearch"> <i class="el-icon-refresh"></i> 重置 </el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table v-loading="loading" :data="stationList" style="width: 100%" stripe border>
        <el-table-column prop="id" label="站点ID" width="80"></el-table-column>
        <el-table-column prop="campusName" label="所属校区" width="150"></el-table-column>
        <el-table-column prop="name" label="站点名称" width="150"></el-table-column>
        <el-table-column prop="stationType" label="站点类型" width="120">
          <template #default="scope">
            <el-tag :type="getStationTypeTagType(scope.row.stationType)">
              {{ getStationTypeText(scope.row.stationType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="站点地址" width="250"></el-table-column>
        <el-table-column prop="contactPhone" label="联系电话" width="120"></el-table-column>
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
              @click="handleEditStation(scope.row)"
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
          :total="stationTotal"
          :page-sizes="[10, 20, 50, 100]"
          :current-page="pagination.currentPage"
          :page-size="pagination.pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 添加/编辑站点对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="stationForm" :rules="rules" ref="stationFormRef" label-width="120px">
        <el-form-item label="所属校区" prop="campusId">
          <el-select v-model="stationForm.campusId" placeholder="请选择校区">
            <el-option
              v-for="campus in campusList"
              :key="campus.id"
              :label="campus.name"
              :value="campus.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="站点名称" prop="name">
          <el-input v-model="stationForm.name" placeholder="请输入站点名称"></el-input>
        </el-form-item>
        <el-form-item label="站点类型" prop="stationType">
          <el-radio-group v-model="stationForm.stationType">
            <el-radio label="1">外卖站点</el-radio>
            <el-radio label="2">跑腿站点</el-radio>
            <el-radio label="3">综合站点</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="站点地址" prop="address">
          <el-input v-model="stationForm.address" placeholder="请输入站点地址"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="contactPhone">
          <el-input v-model="stationForm.contactPhone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="营业时间" prop="businessHours">
          <el-input
            v-model="stationForm.businessHours"
            placeholder="请输入营业时间，如：09:00-21:00"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="stationForm.remark"
            type="textarea"
            rows="3"
            placeholder="请输入备注信息"
          ></el-input>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useCampusStore } from '@/store/modules/campus'
import { ElMessage, ElMessageBox } from 'element-plus'

// 定义接口
interface Campus {
  id: string | number
  name: string
}

interface Station {
  id: string | number
  campusId: string | number
  campusName: string
  name: string
  stationType: number
  address: string
  contactPhone: string
  status: number
  createTime: string
  businessHours?: string
  remark?: string
}

interface SearchForm {
  campusId: string | number
  name: string
  stationType: string
  status: string
}

interface Pagination {
  currentPage: number
  pageSize: number
}

interface StationForm {
  id?: string | number
  campusId: string | number
  name: string
  stationType: string
  address: string
  contactPhone: string
  businessHours: string
  remark: string
}

// Pinia store
const campusStore = useCampusStore()

// 从store获取数据
const stationList = computed<Station[]>(() => campusStore.siteList || [])
const stationTotal = computed<number>(() => campusStore.siteTotal || 0)
const campusList = computed<Campus[]>(() => campusStore.campusList || [])

// 响应式数据
const loading = ref(false)
const searchForm = reactive<SearchForm>({
  campusId: '',
  name: '',
  stationType: '',
  status: '',
})

const pagination = reactive<Pagination>({
  currentPage: 1,
  pageSize: 10,
})

const dialogVisible = ref(false)
const dialogTitle = ref('')
const editingStation = ref<Station | null>(null)
const stationFormRef = ref()

const stationForm = reactive<StationForm>({
  campusId: '',
  name: '',
  stationType: '3', // 默认综合站点
  address: '',
  contactPhone: '',
  businessHours: '',
  remark: '',
})

const rules = reactive({
  campusId: [{ required: true, message: '请选择所属校区', trigger: 'change' }],
  name: [
    { required: true, message: '请输入站点名称', trigger: 'blur' },
    { min: 1, max: 50, message: '站点名称长度在 1 到 50 个字符', trigger: 'blur' },
  ],
  stationType: [{ required: true, message: '请选择站点类型', trigger: 'change' }],
  address: [
    { required: true, message: '请输入站点地址', trigger: 'blur' },
    { min: 1, max: 100, message: '站点地址长度在 1 到 100 个字符', trigger: 'blur' },
  ],
  contactPhone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
})

// 工具函数
const getStationTypeText = (type: number): string => {
  const typeMap: Record<number, string> = {
    1: '外卖站点',
    2: '跑腿站点',
    3: '综合站点',
  }
  return typeMap[type] || '未知类型'
}

const getStationTypeTagType = (type: number): string => {
  const colorMap: Record<number, string> = {
    1: 'primary',
    2: 'success',
    3: 'warning',
  }
  return colorMap[type] || 'info'
}

// 异步操作函数
const getStations = async (params: any) => {
  await campusStore.getSites(params)
}

const addNewStation = async (params: any) => {
  await campusStore.addNewSite(params)
}

const updateExistingStation = async (params: any) => {
  await campusStore.updateExistingSite(params)
}

const updateStationEnabledStatus = async (params: any) => {
  await campusStore.updateCampusEnabledStatus(params.id, params.status)
}

const getCampuses = async () => {
  await campusStore.getCampuses()
}

// 数据加载函数
const loadData = async () => {
  loading.value = true
  try {
    // 先加载校区列表
    await getCampuses()
    // 再加载站点列表
    await loadStationList()
  } catch (error) {
    ElMessage.error('数据加载失败')
  } finally {
    loading.value = false
  }
}

const loadStationList = async () => {
  try {
    await getStations({
      ...searchForm,
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
    })
  } catch (error) {
    ElMessage.error('获取站点列表失败')
  }
}

// 事件处理函数
const handleSearch = () => {
  pagination.currentPage = 1
  loadStationList()
}

const resetSearch = () => {
  searchForm.campusId = ''
  searchForm.name = ''
  searchForm.stationType = ''
  searchForm.status = ''
  handleSearch()
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadStationList()
}

const handleCurrentChange = (current: number) => {
  pagination.currentPage = current
  loadStationList()
}

const handleAddStation = () => {
  dialogTitle.value = '添加站点'
  editingStation.value = null
  stationForm.campusId = campusList.value.length > 0 ? campusList.value[0].id : ''
  stationForm.name = ''
  stationForm.stationType = '3'
  stationForm.address = ''
  stationForm.contactPhone = ''
  stationForm.businessHours = ''
  stationForm.remark = ''
  dialogVisible.value = true
}

const handleEditStation = (row: Station) => {
  dialogTitle.value = '编辑站点'
  editingStation.value = row
  stationForm.id = row.id
  stationForm.campusId = row.campusId
  stationForm.name = row.name
  stationForm.stationType = String(row.stationType) || '3'
  stationForm.address = row.address
  stationForm.contactPhone = row.contactPhone
  stationForm.businessHours = row.businessHours || ''
  stationForm.remark = row.remark || ''
  dialogVisible.value = true
}

const handleUpdateStatus = async (row: Station) => {
  const originalStatus = row.status
  const newStatus = originalStatus === 1 ? 0 : 1
  ElMessageBox.confirm(`确定要${newStatus === 1 ? '启用' : '禁用'}该站点吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await updateStationEnabledStatus({ id: row.id, status: newStatus })
        ElMessage.success(`${newStatus === 1 ? '启用' : '禁用'}成功`)
        // 重新加载列表以获取最新数据
        await loadStationList()
      } catch (error) {
        ElMessage.error(`${newStatus === 1 ? '启用' : '禁用'}失败`)
        // 恢复原状态
        row.status = originalStatus
      }
    })
    .catch(() => {
      // 取消操作
    })
}

const handleSubmit = async () => {
  stationFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      try {
        // 转换数据类型
        const submitData = {
          ...stationForm,
          stationType: Number(stationForm.stationType),
        }

        if (editingStation.value) {
          // 更新站点
          await updateExistingStation(submitData)
          ElMessage.success('站点更新成功')
        } else {
          // 添加站点
          await addNewStation(submitData)
          ElMessage.success('站点添加成功')
        }
        dialogVisible.value = false
      } catch (error) {
        ElMessage.error(editingStation.value ? '站点更新失败' : '站点添加失败')
      }
    }
  })
}

// 生命周期钩子
onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.station-list-container {
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
