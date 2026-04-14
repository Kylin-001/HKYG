<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { batchInsertStudents, generateStudents } from '@/api/studentBatch'

// 表单数据
const form = reactive({
  startNum: 1,
  count: 100,
  defaultPassword: 'auth123456',
  prefix: '202202',
})

const loading = ref(false)
const result = ref<any>(null)

// 生成并插入学生
async function handleInsert() {
  try {
    await ElMessageBox.confirm(
      `确定要批量插入 ${form.count} 个学生账号吗？\n学号范围：${form.prefix}${String(form.startNum).padStart(4, '0')} - ${form.prefix}${String(form.startNum + form.count - 1).padStart(4, '0')}`,
      '确认插入',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    loading.value = true

    // 生成学生数据
    const students = generateStudents(form.startNum, form.count, form.defaultPassword)

    // 批量插入
    const res = await batchInsertStudents(students)
    result.value = res

    if (res.successCount > 0) {
      ElMessage.success(`成功插入 ${res.successCount} 个学生账号`)
    }
    if (res.failCount > 0) {
      ElMessage.warning(`${res.failCount} 个账号插入失败`)
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('批量插入失败:', error)
      ElMessage.error('批量插入失败: ' + (error.message || '未知错误'))
    }
  } finally {
    loading.value = false
  }
}

// 预览生成的数据
const previewData = ref<any[]>([])
const showPreview = ref(false)

function handlePreview() {
  previewData.value = generateStudents(form.startNum, Math.min(form.count, 10), form.defaultPassword)
  showPreview.value = true
}
</script>

<template>
  <div class="student-batch-insert">
    <el-card class="insert-card">
      <template #header>
        <div class="card-header">
          <h2>批量添加学生账号</h2>
          <p class="subtitle">学号格式：202202xxxx，初始密码：auth123456</p>
        </div>
      </template>

      <el-form :model="form" label-width="120px" class="insert-form">
        <el-form-item label="学号前缀">
          <el-input v-model="form.prefix" placeholder="如：202202" maxlength="6" />
        </el-form-item>

        <el-form-item label="起始编号">
          <el-input-number v-model="form.startNum" :min="1" :max="9999" />
          <span class="form-tip">学号将从 {{ form.prefix }}{{ String(form.startNum).padStart(4, '0') }} 开始</span>
        </el-form-item>

        <el-form-item label="生成数量">
          <el-input-number v-model="form.count" :min="1" :max="100" />
          <span class="form-tip">单次最多 100 个</span>
        </el-form-item>

        <el-form-item label="初始密码">
          <el-input v-model="form.defaultPassword" show-password />
          <span class="form-tip">所有学生的初始密码</span>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handlePreview" :disabled="loading">
            预览前10条
          </el-button>
          <el-button type="success" @click="handleInsert" :loading="loading">
            批量插入
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 预览表格 -->
    <el-card v-if="showPreview" class="preview-card">
      <template #header>
        <span>数据预览（前10条）</span>
      </template>
      <el-table :data="previewData" border style="width: 100%">
        <el-table-column prop="username" label="学号/用户名" width="120" />
        <el-table-column prop="studentNo" label="学号" width="120" />
        <el-table-column prop="nickname" label="昵称" width="120" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="college" label="学院" width="180" />
        <el-table-column prop="major" label="专业" width="150" />
        <el-table-column prop="grade" label="年级" width="100" />
      </el-table>
    </el-card>

    <!-- 结果展示 -->
    <el-card v-if="result" class="result-card">
      <template #header>
        <span>插入结果</span>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="总数量">{{ result.totalCount }}</el-descriptions-item>
        <el-descriptions-item label="成功数量">
          <el-tag type="success">{{ result.successCount }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="失败数量">
          <el-tag :type="result.failCount > 0 ? 'danger' : 'success'">{{ result.failCount }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="状态">{{ result.message }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<style scoped>
.student-batch-insert {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.insert-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-header h2 {
  margin: 0;
  font-size: 20px;
  color: var(--el-text-color-primary);
}

.subtitle {
  margin: 0;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.insert-form {
  max-width: 600px;
  margin-top: 20px;
}

.form-tip {
  margin-left: 12px;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.preview-card {
  margin-bottom: 20px;
}

.result-card {
  margin-bottom: 20px;
}
</style>
