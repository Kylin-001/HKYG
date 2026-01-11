<template>
  <div class="system-log-container">
    <el-card class="box-card">
      <template v-slot:header>
        <div class="clearfix">
          <span>操作日志</span>
        </div>
      </template>
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="操作用户">
          <el-input v-model="searchForm.username" placeholder="请输入操作用户名"></el-input>
        </el-form-item>
        <el-form-item label="操作类型">
          <el-select v-model="searchForm.actionType" placeholder="请选择操作类型">
            <el-option label="登录" value="login"></el-option>
            <el-option label="新增" value="create"></el-option>
            <el-option label="编辑" value="update"></el-option>
            <el-option label="删除" value="delete"></el-option>
            <el-option label="查询" value="query"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作时间">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <div class="table-container">
        <div class="responsive-table-container">
          <el-table :data="logList" style="width: 100%" border stripe>
            <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
            <el-table-column prop="username" label="操作用户" min-width="120"></el-table-column>
            <el-table-column prop="actionType" label="操作类型" min-width="100" align="center">
              <template v-slot="scope">
                <el-tag :type="getActionTypeTagType(scope.row.actionType)">
                  {{ getActionTypeText(scope.row.actionType) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="module"
              label="操作模块"
              min-width="120"
              align="center"
            ></el-table-column>
            <el-table-column prop="description" label="操作描述" min-width="250"></el-table-column>
            <el-table-column
              prop="ip"
              label="IP地址"
              min-width="120"
              align="center"
            ></el-table-column>
            <el-table-column prop="userAgent" label="浏览器" min-width="150"></el-table-column>
            <el-table-column prop="createTime" label="操作时间" min-width="180"></el-table-column>
            <el-table-column label="操作" width="120" align="center" fixed="right">
              <template v-slot="scope">
                <el-button type="primary" size="small" @click="handleView(scope.row)">
                  详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div class="pagination-container">
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          :total="total"
          :page-size="pageSize"
          :current-page="currentPage"
          v-model:page-size="pageSize"
          v-model:current-page="currentPage"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 日志详情对话框 -->
    <el-dialog title="操作日志详情" v-model:visible="dialogVisible" width="600px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="日志ID">{{ detailData.id }}</el-descriptions-item>
        <el-descriptions-item label="操作用户">{{ detailData.username }}</el-descriptions-item>
        <el-descriptions-item label="操作类型">
          <el-tag :type="getActionTypeTagType(detailData.actionType)">
            {{ getActionTypeText(detailData.actionType) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="操作模块">{{ detailData.module }}</el-descriptions-item>
        <el-descriptions-item label="操作描述">{{ detailData.description }}</el-descriptions-item>
        <el-descriptions-item label="请求参数">
          <pre v-if="detailData.params">{{
            JSON.stringify(JSON.parse(detailData.params), null, 2)
          }}</pre>
          <span v-else>-无-</span>
        </el-descriptions-item>
        <el-descriptions-item label="IP地址">{{ detailData.ip }}</el-descriptions-item>
        <el-descriptions-item label="浏览器">{{ detailData.userAgent }}</el-descriptions-item>
        <el-descriptions-item label="操作系统">{{ detailData.os }}</el-descriptions-item>
        <el-descriptions-item label="操作时间">{{ detailData.createTime }}</el-descriptions-item>
      </el-descriptions>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// 导入Vue 3 API
import { ref, reactive, onMounted } from 'vue'
import { useSystemStore } from '@/store/modules/system'
import { ElMessage } from 'element-plus'
// 导入日志工具
import logger from '@/utils/logger'

// 定义TypeScript接口
interface Log {
  id: string
  username: string
  actionType: string
  module: string
  description: string
  params: string
  ip: string
  userAgent: string
  os: string
  createTime: string
}

interface SearchForm {
  username: string
  actionType: string
}

// Pinia store
const systemStore = useSystemStore()

// 响应式数据
const logList = ref<Log[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const searchForm = reactive<SearchForm>({
  username: '',
  actionType: '',
})
const dateRange = ref<string[]>([])
const dialogVisible = ref(false)
const detailData = ref<Log>({} as Log)

// 获取日志列表
const fetchLogList = async () => {
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      username: searchForm.username,
      actionType: searchForm.actionType,
      startDate: dateRange.value && dateRange.value.length === 2 ? dateRange.value[0] : '',
      endDate: dateRange.value && dateRange.value.length === 2 ? dateRange.value[1] : '',
    }
    const result = await systemStore.getLogList(params)
    logList.value = result.data || []
    total.value = result.total || 0
    ElMessage.success('日志列表加载成功')
  } catch (error) {
    ElMessage.error('获取日志列表失败')
    logger.error('获取日志列表失败', error)
  }
}

// 处理查询
const handleSearch = () => {
  currentPage.value = 1
  fetchLogList()
}

// 重置搜索
const resetSearch = () => {
  searchForm.username = ''
  searchForm.actionType = ''
  dateRange.value = []
  currentPage.value = 1
  fetchLogList()
}

// 处理页码变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchLogList()
}

// 处理每页大小变化
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  fetchLogList()
}

// 查看详情
const handleView = (row: Log) => {
  detailData.value = { ...row }
  dialogVisible.value = true
}

// 获取操作类型标签类型
const getActionTypeTagType = (type: string): string => {
  const typeMap: Record<string, string> = {
    login: 'info',
    create: 'success',
    update: 'primary',
    delete: 'danger',
    query: 'warning',
  }
  return typeMap[type] || 'info'
}

// 获取操作类型文本
const getActionTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    login: '登录',
    create: '新增',
    update: '编辑',
    delete: '删除',
    query: '查询',
  }
  return typeMap[type] || type
}

// 组件挂载时调用
onMounted(() => {
  fetchLogList()
})
</script>

<style scoped>
.system-log-container {
  padding: 20px;
}

.table-container {
  margin-top: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  text-align: center;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  font-size: 12px;
}
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
</style>
