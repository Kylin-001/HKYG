<template>
  <div class="level-list-container">
    <el-card class="box-card">
      <div slot="header" class="card-header">
        <span>用户等级管理</span>
        <el-button-group>
          <el-button :icon="Refresh" @click="refreshData">刷新</el-button>
          <el-button type="primary" @click="addLevel">添加等级</el-button>
          <el-button type="primary" :icon="Download" @click="exportLevels">导出等级</el-button>
        </el-button-group>
      </div>

      <!-- 搜索筛选区域 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="等级ID">
          <el-input
            v-model="searchForm.levelId"
            placeholder="请输入等级ID"
            clearable
            style="width: 150px"
          ></el-input>
        </el-form-item>
        <el-form-item label="等级名称">
          <el-input
            v-model="searchForm.levelName"
            placeholder="请输入等级名称"
            clearable
            style="width: 180px"
          ></el-input>
        </el-form-item>
        <el-form-item label="等级状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
            style="width: 120px"
          >
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 等级列表 -->
      <el-table
        v-loading="loading"
        :data="levelList"
        style="width: 100%"
        stripe
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="id" label="等级ID" width="100"></el-table-column>
        <el-table-column prop="levelName" label="等级名称" width="150"></el-table-column>
        <el-table-column prop="levelValue" label="等级值" width="100"></el-table-column>
        <el-table-column
          prop="minPoints"
          label="最低积分"
          width="120"
          align="right"
        ></el-table-column>
        <el-table-column
          prop="maxPoints"
          label="最高积分"
          width="120"
          align="right"
        ></el-table-column>
        <el-table-column prop="discountRate" label="折扣率" width="100" align="center">
          <template v-slot="scope">{{ (scope.row.discountRate * 100).toFixed(0) }}%</template>
        </el-table-column>
        <el-table-column label="特权说明" min-width="200">
          <template v-slot="scope">
            <el-tag
              v-for="(privilege, index) in scope.row.privileges"
              :key="index"
              size="small"
              style="margin-right: 4px; margin-bottom: 4px"
            >
              {{ privilege }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.status"
              @change="handleStatusChange(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="180"></el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template v-slot="scope">
            <el-button type="primary" size="small" @click="viewLevel(scope.row)"> 查看 </el-button>
            <el-button type="success" size="small" @click="editLevelDialog(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="deleteLevel(scope.row)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          background
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>

      <!-- 编辑等级对话框 -->
      <el-dialog
        :title="isEditMode ? '编辑等级' : '添加等级'"
        v-model:visible="editDialogVisible"
        width="600px"
      >
        <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="120px">
          <el-form-item label="等级名称" prop="levelName">
            <el-input v-model="editForm.levelName" placeholder="请输入等级名称"></el-input>
          </el-form-item>
          <el-form-item label="等级值" prop="levelValue">
            <el-input
              type="number"
              v-model="editForm.levelValue"
              placeholder="请输入等级值"
            ></el-input>
          </el-form-item>
          <el-form-item label="最低积分" prop="minPoints">
            <el-input
              type="number"
              v-model="editForm.minPoints"
              placeholder="请输入最低积分"
            ></el-input>
          </el-form-item>
          <el-form-item label="最高积分" prop="maxPoints">
            <el-input
              type="number"
              v-model="editForm.maxPoints"
              placeholder="请输入最高积分"
            ></el-input>
          </el-form-item>
          <el-form-item label="折扣率" prop="discountRate">
            <el-input-number
              v-model="editForm.discountRate"
              :min="0.1"
              :max="1"
              :step="0.01"
              :precision="2"
              placeholder="请输入折扣率"
            >
              <template #append>%</template>
            </el-input-number>
          </el-form-item>
          <el-form-item label="特权说明" prop="privileges">
            <el-input
              v-model="editForm.privilegesText"
              placeholder="请输入特权说明，多个特权用逗号分隔"
              type="textarea"
              rows="3"
            ></el-input>
          </el-form-item>
          <el-form-item label="等级状态" prop="status">
            <el-switch
              v-model="editForm.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
            ></el-switch>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              v-model="editForm.remark"
              placeholder="请输入备注"
              rows="3"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelEdit">取消</el-button>
          <el-button type="primary" @click="submitEdit" :loading="editForm.loading">提交</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 导入日志工具
import logger from '@/utils/logger'
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, Download } from '@element-plus/icons-vue'

// 导入类型定义
import { Level, LevelEditForm as EditForm } from '@/types/user'

// 导入API
import { userApi } from '@/api/user'

// 加载状态
const loading = ref(false)

// 搜索表单
const searchForm = reactive({
  levelId: '',
  levelName: '',
  status: '',
})

// 分页信息
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const levelList = ref<Level[]>([])

// 选中的等级ID
const selectedLevelIds = ref<number[]>([])
const selectedRows = ref<Level[]>([])

// 编辑对话框
const editDialogVisible = ref(false)
const isEditMode = ref(false)
const editForm = reactive<EditForm>({
  id: '',
  levelName: '',
  levelValue: 1,
  minPoints: 0,
  maxPoints: 0,
  discountRate: 1,
  privileges: [],
  privilegesText: '',
  status: '1',
  remark: '',
})

const editFormRef = ref()

// 监听特权文本变化，转换为数组
watch(
  () => editForm.privilegesText,
  newValue => {
    if (newValue) {
      editForm.privileges = newValue
        .split(',')
        .map(item => item.trim())
        .filter(item => item)
    } else {
      editForm.privileges = []
    }
  }
)

// 表单验证规则
const editRules = reactive({
  levelName: [
    { required: true, message: '请输入等级名称', trigger: 'blur' },
    { min: 2, max: 20, message: '等级名称长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  levelValue: [
    { required: true, message: '请输入等级值', trigger: 'blur' },
    { type: 'number', min: 1, message: '等级值必须大于等于1', trigger: 'blur' },
  ],
  minPoints: [
    { required: true, message: '请输入最低积分', trigger: 'blur' },
    { type: 'number', min: 0, message: '最低积分必须大于等于0', trigger: 'blur' },
  ],
  maxPoints: [
    { required: true, message: '请输入最高积分', trigger: 'blur' },
    { type: 'number', min: 0, message: '最高积分必须大于等于0', trigger: 'blur' },
    {
      validator: (rule: any, value: number, callback: any) => {
        if (value <= editForm.minPoints) {
          callback(new Error('最高积分必须大于最低积分'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  discountRate: [
    { required: true, message: '请输入折扣率', trigger: 'blur' },
    { type: 'number', min: 0.1, max: 1, message: '折扣率必须在0.1-1之间', trigger: 'blur' },
  ],
  privilegesText: [{ required: true, message: '请输入特权说明', trigger: 'blur' }],
})

// 页面加载时获取数据
onMounted(() => {
  getLevels()
})

// 获取等级列表
const getLevels = async () => {
  try {
    loading.value = true
    const params = {
      currentPage: currentPage.value,
      pageSize: pageSize.value,
      ...searchForm,
    }

    const response = await userApi.getLevelList(params)
    levelList.value = response.data.records
    total.value = response.data.total

    logger.info('获取等级列表成功', { count: levelList.value.length })
  } catch (error) {
    logger.error('获取等级列表失败', error)
    ElMessage.error('获取等级列表失败')
    levelList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 搜索等级
const search = () => {
  currentPage.value = 1
  getLevels()
}

// 重置搜索
const resetSearch = () => {
  searchForm.levelId = ''
  searchForm.levelName = ''
  searchForm.status = ''
  currentPage.value = 1
  getLevels()
}

// 刷新数据
const refreshData = () => {
  getLevels()
}

// 导出等级
const exportLevels = async () => {
  try {
    const params = {
      currentPage: 1,
      pageSize: 0, // 导出所有数据
      ...searchForm,
    }

    const blob = await userApi.exportLevelList(params)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `等级列表_${new Date().toISOString().slice(0, 10)}.xlsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    ElMessage.success('导出成功')
    logger.info('导出等级列表成功')
  } catch (error) {
    logger.error('导出等级列表失败', error)
    ElMessage.error('导出失败')
  }
}

// 处理选择变化
const handleSelectionChange = (selection: Level[]) => {
  selectedLevelIds.value = selection.map(item => item.id)
  selectedRows.value = selection
}

// 处理页码变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getLevels()
}

// 处理每页大小变化
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  getLevels()
}

// 查看等级
const viewLevel = (row: Level) => {
  ElMessage.success('查看详情功能开发中')
}

// 编辑等级
const editLevelDialog = (row: Level) => {
  isEditMode.value = true
  editForm.id = String(row.id)
  editForm.levelName = row.levelName
  editForm.levelValue = row.levelValue
  editForm.minPoints = row.minPoints
  editForm.maxPoints = row.maxPoints
  editForm.discountRate = row.discountRate
  editForm.privileges = [...row.privileges]
  editForm.privilegesText = row.privileges.join(',')
  editForm.status = row.status
  editForm.remark = row.remark || ''
  editDialogVisible.value = true
}

// 添加等级
const addLevel = () => {
  isEditMode.value = false
  editForm.id = ''
  editForm.levelName = ''
  editForm.levelValue = 1
  editForm.minPoints = 0
  editForm.maxPoints = 0
  editForm.discountRate = 1
  editForm.privileges = []
  editForm.privilegesText = ''
  editForm.status = '1'
  editForm.remark = ''
  editDialogVisible.value = true
}

// 取消编辑
const cancelEdit = () => {
  editDialogVisible.value = false
}

// 提交编辑
const submitEdit = async () => {
  try {
    editForm.loading = true

    if (isEditMode.value) {
      // 更新等级
      await userApi.updateLevel(editForm)
      ElMessage.success('等级更新成功')
      logger.info('更新等级成功', { levelId: editForm.id })
    } else {
      // 创建等级
      await userApi.createLevel(editForm)
      ElMessage.success('等级创建成功')
      logger.info('创建等级成功', { levelName: editForm.levelName })
    }

    editDialogVisible.value = false
    getLevels()
  } catch (error) {
    logger.error('保存等级失败', error)
    ElMessage.error('保存等级失败')
  } finally {
    editForm.loading = false
  }
}

// 处理状态变化
const handleStatusChange = (row: Level) => {
  ElMessageBox.confirm(
    `确定要${row.status === '1' ? '禁用' : '启用'}等级「${row.levelName}」吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        await userApi.updateLevelStatus(row.id, row.status)
        ElMessage.success('状态更新成功')
        logger.info(`${row.status === '1' ? '禁用' : '启用'}等级成功`, { levelId: row.id })
        getLevels()
      } catch (error) {
        logger.error('更新等级状态失败', error)
        ElMessage.error('状态更新失败')
      }
    })
    .catch(() => {
      // 取消操作
    })
}

// 删除等级
const deleteLevel = (row: Level) => {
  ElMessageBox.confirm(`确定要删除等级「${row.levelName}」吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await userApi.deleteLevel(row.id.toString())
        ElMessage.success('删除成功')
        logger.info('删除等级成功', { levelId: row.id })
        getLevels()
      } catch (error) {
        logger.error('删除等级失败', error)
        ElMessage.error('删除等级失败')
      }
    })
    .catch(() => {
      // 取消删除
    })
}
</script>

<style scoped>
.level-list-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.dialog-footer {
  text-align: center;
}
</style>
