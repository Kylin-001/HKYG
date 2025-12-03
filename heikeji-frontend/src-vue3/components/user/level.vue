<template>
  <div class="level-container">
    <el-card class="box-card">
      <div slot="header" class="card-header">
        <span>等级管理</span>
        <el-button-group>
          <el-button :icon="Refresh" @click="refreshData">刷新</el-button>
          <el-button type="primary" @click="addLevel">添加等级</el-button>
          <el-button type="primary" :icon="Download" @click="exportLevels">导出等级</el-button>
        </el-button-group>
      </div>

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
        <el-table-column prop="level" label="等级值" width="100"></el-table-column>
        <el-table-column label="等级图标" width="100">
          <template v-slot="scope">
            <el-image
              :src="scope.row.icon || 'https://via.placeholder.com/40'"
              style="width: 40px; height: 40px; border-radius: 50%"
              fit="cover"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="minScore"
          label="最低积分"
          width="120"
          align="right"
        ></el-table-column>
        <el-table-column
          prop="maxScore"
          label="最高积分"
          width="120"
          align="right"
        ></el-table-column>
        <el-table-column prop="discount" label="折扣(%)" width="120" align="right">
          <template v-slot="scope"> {{ scope.row.discount || 100 }}% </template>
        </el-table-column>
        <el-table-column prop="description" label="等级描述" width="250"></el-table-column>
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
            <el-button type="primary" size="small" @click="editLevel(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteLevel(scope.row)">删除</el-button>
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
          <el-form-item label="等级值" prop="level">
            <el-input-number
              v-model="editForm.level"
              :min="1"
              :max="10"
              placeholder="请输入等级值"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="等级图标" prop="icon">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="editForm.icon" :src="editForm.icon" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item label="最低积分" prop="minScore">
            <el-input-number
              v-model="editForm.minScore"
              :min="0"
              placeholder="请输入最低积分"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="最高积分" prop="maxScore">
            <el-input-number
              v-model="editForm.maxScore"
              :min="0"
              placeholder="请输入最高积分"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="折扣(%)" prop="discount">
            <el-input-number
              v-model="editForm.discount"
              :min="1"
              :max="100"
              :precision="0"
              placeholder="请输入折扣"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="等级描述" prop="description">
            <el-input
              type="textarea"
              v-model="editForm.description"
              placeholder="请输入等级描述"
              rows="3"
            ></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-switch
              v-model="editForm.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
            ></el-switch>
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, Download, Plus } from '@element-plus/icons-vue'

// 定义类型接口
interface Level {
  id: number
  levelName: string
  level: number
  icon?: string
  minScore: number
  maxScore: number
  discount: number
  description?: string
  status: string
  createTime?: string
  updateTime?: string
}

interface EditForm {
  id: string
  levelName: string
  level: number
  icon: string
  minScore: number
  maxScore: number
  discount: number
  description: string
  status: string
  loading?: boolean
}

// 路由和日志
const router = useRouter()
const route = useRoute()

// 加载状态
const loading = ref(false)

// 分页信息
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const levelList = ref<Level[]>([])

// 选中的等级ID
const selectedLevelIds = ref<number[]>([])

// 编辑对话框
const editDialogVisible = ref(false)
const isEditMode = ref(false)
const editForm = reactive<EditForm>({
  id: '',
  levelName: '',
  level: 1,
  icon: '',
  minScore: 0,
  maxScore: 0,
  discount: 100,
  description: '',
  status: '1',
})

const editFormRef = ref()

// 表单验证规则
const editRules = reactive({
  levelName: [{ required: true, message: '请输入等级名称', trigger: 'blur' }],
  level: [{ required: true, message: '请输入等级值', trigger: 'blur' }],
  minScore: [{ required: true, message: '请输入最低积分', trigger: 'blur' }],
  maxScore: [{ required: true, message: '请输入最高积分', trigger: 'blur' }],
})

// 页面加载时获取数据
onMounted(() => {
  getLevels()
})

// 获取等级列表
const getLevels = async () => {
  try {
    loading.value = true
    // 使用真实API调用
    // const response = await levelApi.getLevels({
    //   currentPage: currentPage.value,
    //   pageSize: pageSize.value
    // })

    // 模拟数据
    const mockData: Level[] = []
    for (let i = 0; i < pageSize.value; i++) {
      const index = (currentPage.value - 1) * pageSize.value + i
      mockData.push({
        id: index + 1,
        levelName: `等级${index + 1}`,
        level: index + 1,
        icon: `https://via.placeholder.com/40?text=LV${index + 1}`,
        minScore: index * 1000,
        maxScore: (index + 1) * 1000 - 1,
        discount: 100 - index * 5,
        description: `这是等级${index + 1}的描述信息`,
        status: '1',
        createTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updateTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
    }

    levelList.value = mockData
    total.value = 10
  } catch (error) {
    logger.error('获取等级列表失败', error)
    ElMessage.error('获取等级列表失败')
    levelList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 刷新数据
const refreshData = () => {
  getLevels()
}

// 导出等级
const exportLevels = () => {
  ElMessage.success('导出功能开发中')
}

// 处理选择变化
const handleSelectionChange = (selection: Level[]) => {
  selectedLevelIds.value = selection.map(item => item.id)
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

// 编辑等级
const editLevel = (row: Level) => {
  isEditMode.value = true
  editForm.id = String(row.id)
  editForm.levelName = row.levelName
  editForm.level = row.level
  editForm.icon = row.icon || ''
  editForm.minScore = row.minScore
  editForm.maxScore = row.maxScore
  editForm.discount = row.discount
  editForm.description = row.description || ''
  editForm.status = row.status
  editDialogVisible.value = true
}

// 添加等级
const addLevel = () => {
  isEditMode.value = false
  editForm.id = ''
  editForm.levelName = ''
  editForm.level = 1
  editForm.icon = ''
  editForm.minScore = 0
  editForm.maxScore = 0
  editForm.discount = 100
  editForm.description = ''
  editForm.status = '1'
  editDialogVisible.value = true
}

// 取消编辑
const cancelEdit = () => {
  editDialogVisible.value = false
}

// 提交编辑
const submitEdit = async () => {
  try {
    // 使用真实API调用
    // const response = await levelApi.saveLevel(editForm)
    editForm.loading = true
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('保存成功')
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
  ElMessage.success('状态更新功能开发中')
}

// 删除等级
const deleteLevel = (row: Level) => {
  ElMessage.success('删除等级功能开发中')
}

// 头像上传成功处理
const handleAvatarSuccess = (response: any, file: any) => {
  editForm.icon = URL.createObjectURL(file.raw)
  ElMessage.success('上传成功')
}

// 头像上传前验证
const beforeAvatarUpload = (file: any) => {
  const isJPG = file.type === 'image/jpeg'
  const isPNG = file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG && !isPNG) {
    ElMessage.error('上传头像图片只能是 JPG/PNG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
  }
  return (isJPG || isPNG) && isLt2M
}
</script>

<style scoped>
.level-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.dialog-footer {
  text-align: center;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
}
</style>
