<template>
  <div class="user-level-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>会员等级管理</span>
        <div class="header-actions">
          <el-input
            v-model="searchParams.name"
            placeholder="请输入等级名称"
            style="width: 200px; margin-right: 10px"
            clearable
          ></el-input>
          <el-select
            v-model="searchParams.status"
            placeholder="选择状态"
            style="width: 120px; margin-right: 10px"
            clearable
          >
            <el-option label="启用" value="true"></el-option>
            <el-option label="禁用" value="false"></el-option>
          </el-select>
          <el-button size="small" @click="handleSearch">搜索</el-button>
          <el-button size="small" @click="handleReset">重置</el-button>
          <el-button size="small" @click="handleExport">导出</el-button>
          <el-button type="primary" size="small" @click="handleAdd" :icon="Plus">
            添加等级
          </el-button>
        </div>
      </div>

      <div class="table-container">
        <el-table :data="filteredLevelList" style="width: 100%" border stripe v-loading="loading">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="id" label="等级ID" width="100" align="center"></el-table-column>
          <el-table-column prop="name" label="等级名称" min-width="150"></el-table-column>
          <el-table-column
            prop="minPoints"
            label="最低积分"
            width="120"
            align="center"
          ></el-table-column>
          <el-table-column prop="discount" label="折扣系数" width="120" align="center">
            <template v-slot="scope"> {{ (scope.row.discount * 10).toFixed(1) }}折 </template>
          </el-table-column>
          <el-table-column prop="description" label="等级描述" min-width="200"></el-table-column>
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template v-slot="scope">
              <el-tag :type="scope.row.status ? 'success' : 'danger'" size="small">
                {{ scope.row.status ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220" align="center" fixed="right">
            <template v-slot="scope">
              <el-button
                type="primary"
                size="small"
                @click="handleEdit(scope.row)"
                style="margin-right: 5px"
              >
                编辑
              </el-button>
              <el-button
                type="warning"
                size="small"
                @click="handleToggleStatus(scope.row)"
                style="margin-right: 5px"
              >
                {{ scope.row.status ? '禁用' : '启用' }}
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="handleDelete(scope.row)"
                :disabled="scope.row.id === 1"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <div class="pagination-container">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="filteredLevelList.length"
            :page-size="pageSize"
            :page-sizes="[5, 10, 20, 50]"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            v-if="filteredLevelList.length > 0"
          ></el-pagination>
          <div v-else class="no-data">
            <el-empty description="暂无数据"></el-empty>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog :title="dialogTitle" v-model:visible="dialogVisible" width="600px">
      <el-form :model="formData" :rules="rules" ref="formRef">
        <el-form-item label="等级名称" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入等级名称"
            maxlength="20"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="最低积分" prop="minPoints">
          <el-input-number
            v-model="formData.minPoints"
            :min="0"
            :step="100"
            placeholder="请输入最低积分"
            style="width: 100%"
          ></el-input-number>
          <div v-if="formData.id" class="form-tip">
            提示：修改最低积分时请确保等级间的积分范围不重叠
          </div>
        </el-form-item>
        <el-form-item label="折扣系数" prop="discount">
          <el-input-number
            v-model="formData.discount"
            :min="0.1"
            :max="1"
            :step="0.05"
            placeholder="请输入折扣系数"
            style="width: 100%"
          ></el-input-number>
          <div class="form-tip">提示：1.0表示无折扣，0.9表示9折，以此类推</div>
        </el-form-item>
        <el-form-item label="等级描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            rows="3"
            placeholder="请输入等级描述"
            maxlength="200"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="formData.status"
            active-text="启用"
            inactive-text="禁用"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// 导入日志工具
import logger from '@/utils/logger'
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// 定义类型接口
interface Level {
  id: number | string
  name: string
  minPoints: number
  discount: number
  description: string
  status: boolean
}

interface SearchParams {
  name: string
  status: string
}

interface FormData {
  id: number | string
  name: string
  minPoints: number
  discount: number
  description: string
  status: boolean
}

// 状态管理
const levelList = ref<Level[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('添加会员等级')
const loading = ref(false)
const searchParams = reactive<SearchParams>({
  name: '',
  status: '',
})
const currentPage = ref(1)
const pageSize = ref(10)
const formData = reactive<FormData>({
  id: '',
  name: '',
  minPoints: 0,
  discount: 1,
  description: '',
  status: true,
})
const formRef = ref<FormInstance>()

// 验证规则
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入等级名称', trigger: 'blur' },
    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
    { validator: validateLevelName, trigger: 'blur' },
  ],
  minPoints: [
    { required: true, message: '请输入最低积分', trigger: 'blur' },
    { type: 'number', min: 0, message: '最低积分不能小于0', trigger: 'blur' },
    { validator: validatePointsRange, trigger: 'blur' },
  ],
  discount: [
    { required: true, message: '请输入折扣系数', trigger: 'blur' },
    { type: 'number', min: 0.1, max: 1, message: '折扣系数应在0.1-1之间', trigger: 'blur' },
  ],
})

// 过滤后的等级列表
const filteredLevelList = computed(() => {
  let result = [...levelList.value]

  // 按名称过滤
  if (searchParams.name) {
    result = result.filter(item =>
      item.name.toLowerCase().includes(searchParams.name.toLowerCase())
    )
  }

  // 按状态过滤
  if (searchParams.status !== '') {
    const statusBool = searchParams.status === 'true'
    result = result.filter(item => item.status === statusBool)
  }

  // 按积分排序
  result.sort((a, b) => a.minPoints - b.minPoints)

  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return result.slice(start, end)
})

// 获取等级列表
const fetchLevelList = async () => {
  try {
    loading.value = true
    // 使用真实API调用
    // const response = await store.dispatch('user/getLevels', {
    //   name: searchParams.name,
    //   status: searchParams.status
    // })

    // 模拟数据
    const response = {
      data: {
        records: Array.from({ length: 20 }, (_, i) => ({
          id: i + 1,
          name: `等级${i + 1}`,
          minPoints: i * 1000,
          discount: 1 - i * 0.05,
          description: `这是第${i + 1}个会员等级的描述`,
          status: i % 2 === 0,
        })),
      },
    }

    levelList.value = response.data.records || []
  } catch (error) {
    logger.error('获取会员等级列表失败', error)
    ElMessage.error('获取会员等级列表失败')
    levelList.value = []
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchLevelList()
}

// 重置
const handleReset = () => {
  searchParams.name = ''
  searchParams.status = ''
  currentPage.value = 1
  fetchLevelList()
}

// 导出
const handleExport = () => {
  ElMessageBox.confirm('确定要导出会员等级数据吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info',
  })
    .then(() => {
      ElMessage.success('导出成功')
      // 实际项目中这里应该调用导出接口
    })
    .catch(() => {
      // 用户取消操作
    })
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

// 当前页码变化
const handleCurrentChange = (current: number) => {
  currentPage.value = current
}

// 验证等级名称是否重复
const validateLevelName = (rule: any, value: string, callback: Function) => {
  const exists = levelList.value.some(item => item.name === value && item.id !== formData.id)
  if (exists) {
    callback(new Error('该等级名称已存在'))
  } else {
    callback()
  }
}

// 验证积分范围是否合理
const validatePointsRange = (rule: any, value: number, callback: Function) => {
  // 获取除当前编辑项外的其他等级
  const otherLevels = levelList.value.filter(item => item.id !== formData.id)

  // 检查积分范围是否重叠
  const hasOverlap = otherLevels.some(item => {
    // 对于编辑操作，需要考虑其他等级的积分范围
    if (formData.id) {
      // 查找当前等级的上一个和下一个等级
      const sortedLevels = [...levelList.value].sort((a, b) => a.minPoints - b.minPoints)
      const currentIndex = sortedLevels.findIndex(item => item.id === formData.id)

      // 检查是否有等级的积分范围与当前编辑的等级重叠
      if (currentIndex > 0 && value <= sortedLevels[currentIndex - 1].minPoints) {
        return true
      }
      if (
        currentIndex < sortedLevels.length - 1 &&
        value >= sortedLevels[currentIndex + 1].minPoints
      ) {
        return true
      }
    } else {
      // 新增操作，检查是否与现有等级的积分范围重叠
      return item.minPoints === value
    }
    return false
  })

  if (hasOverlap) {
    callback(new Error('该积分值已存在或与其他等级积分范围重叠'))
  } else {
    callback()
  }
}

// 处理添加
const handleAdd = () => {
  dialogTitle.value = '添加会员等级'
  // 重置表单数据
  formData.id = ''
  formData.name = ''
  formData.minPoints = 0
  formData.discount = 1
  formData.description = ''
  formData.status = true

  // 重置表单验证
  nextTick(() => {
    formRef.value?.resetFields()
  })

  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (row: Level) => {
  dialogTitle.value = '编辑会员等级'
  // 复制数据到表单
  formData.id = row.id
  formData.name = row.name
  formData.minPoints = row.minPoints
  formData.discount = row.discount
  formData.description = row.description
  formData.status = row.status

  // 重置表单验证
  nextTick(() => {
    formRef.value?.clearValidate()
  })

  dialogVisible.value = true
}

// 处理提交
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate()
    if (valid) {
      try {
        if (formData.id) {
          // 编辑操作 - 使用真实API
          // await store.dispatch('user/updateLevel', {
          //   levelId: formData.id,
          //   ...formData
          // })
          ElMessage.success('编辑成功')
        } else {
          // 添加操作 - 使用真实API
          // await store.dispatch('user/addLevel', formData)
          ElMessage.success('添加成功')
        }
        dialogVisible.value = false
        fetchLevelList()
      } catch (error) {
        logger.error('操作失败', error)
        ElMessage.error('操作失败')
      }
    }
  } catch (error) {
    // 验证失败
    console.log('表单验证失败:', error)
  }
}

// 切换状态
const handleToggleStatus = async (row: Level) => {
  try {
    const newStatus = !row.status
    const statusText = newStatus ? '启用' : '禁用'

    // 使用真实API更新状态
    // await store.dispatch('user/updateLevelStatus', {
    //   levelId: row.id,
    //   status: newStatus
    // })

    row.status = newStatus
    ElMessage.success(`状态已更新为${statusText}`)
  } catch (error) {
    logger.error('状态更新失败:', error)
    ElMessage.error('状态更新失败')
  }
}

// 处理删除
const handleDelete = async (row: Level) => {
  if (row.id === 1) {
    ElMessage.warning('默认等级不能删除')
    return
  }

  try {
    await ElMessageBox.confirm('确定要删除这个会员等级吗？删除后无法恢复', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    // 使用真实API删除
    // await store.dispatch('user/deleteLevel', {
    //   levelId: row.id
    // })

    // 从列表中移除
    levelList.value = levelList.value.filter(item => item.id !== row.id)
    ElMessage.success('删除成功')
  } catch (error: any) {
    if (error !== 'cancel') {
      logger.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchLevelList()
})
</script>

<style scoped>
.user-level-container {
  padding: 20px;
}

.header-actions {
  float: right;
  display: flex;
  align-items: center;
}

.table-container {
  margin-top: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.dialog-footer {
  text-align: center;
}

.no-data {
  width: 100%;
  padding: 40px 0;
}

.form-tip {
  color: #909399;
  font-size: 12px;
  margin-top: 5px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-actions {
    float: none;
    margin-top: 10px;
    flex-wrap: wrap;
  }

  .header-actions .el-input,
  .header-actions .el-select {
    margin-bottom: 10px;
  }

  .pagination-container {
    justify-content: center;
  }
}
</style>
