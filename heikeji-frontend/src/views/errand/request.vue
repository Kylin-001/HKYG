<template>
  <div class="errand-request-container">
    <div class="page-header">
      <h2>跑腿服务管理</h2>
    </div>

    <el-card class="mt-20">
      <div class="search-form">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="请求编号">
            <el-input
              v-model="searchForm.requestNo"
              placeholder="请输入请求编号"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table v-loading="loading" :data="requestList" style="width: 100%">
        <el-table-column prop="id" label="请求ID" width="80"></el-table-column>
        <el-table-column prop="requestNo" label="请求编号" width="180"></el-table-column>
        <el-table-column prop="userName" label="用户名称" width="120"></el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleViewDetail(scope.row)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          :current-page.sync="pagination.currentPage"
          :page-size.sync="pagination.pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useCampusStore } from '@/store/modules/campus'
import { ElMessage } from 'element-plus'

// 初始化store
const campusStore = useCampusStore()

// 状态定义
const loading = ref(false)
const searchForm = reactive({
  requestNo: '',
  userName: '',
})
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
})

// 计算属性
const total = computed(() => campusStore.deliveryRequestTotal)
const requestList = computed(() => campusStore.deliveryRequestList)

// 生命周期钩子
onMounted(() => {
  loadData()
})

// 加载数据
async function loadData() {
  loading.value = true
  try {
    await loadRequestList()
  } catch (error) {
    ElMessage.error('数据加载失败')
  } finally {
    loading.value = false
  }
}

// 加载请求列表
async function loadRequestList() {
  try {
    const searchParams = {
      ...searchForm,
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
    }
    await campusStore.getDeliveryRequests(searchParams)
  } catch (error) {
    ElMessage.error('获取请求列表失败')
  }
}

// 搜索
function handleSearch() {
  pagination.currentPage = 1
  loadRequestList()
}

// 重置搜索
function resetSearch() {
  searchForm.requestNo = ''
  searchForm.userName = ''
  handleSearch()
}

// 分页大小变化
function handleSizeChange(size: number) {
  pagination.pageSize = size
  loadRequestList()
}

// 分页页码变化
function handleCurrentChange(current: number) {
  pagination.currentPage = current
  loadRequestList()
}

// 查看请求详情
function handleViewDetail(row: any) {
  ElMessage.info('查看详情功能待实现')
}
</script>

<style lang="scss" scoped>
.errand-request-container {
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
