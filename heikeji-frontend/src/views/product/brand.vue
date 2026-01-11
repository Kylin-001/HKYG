<template>
  <div class="product-brand-container">
    <el-card class="box-card">
      <template v-slot:header>
        <div class="clearfix">
          <span>品牌管理</span>
          <el-button type="primary" size="small" @click="handleAdd">
            <i class="el-icon-plus"></i> 添加品牌
          </el-button>
        </div>
      </template>

      <div class="table-container">
        <el-table :data="brandList" style="width: 100%" border stripe>
          <el-table-column prop="id" label="品牌ID" width="100" align="center"></el-table-column>
          <el-table-column label="品牌Logo" width="120" align="center">
            <template v-slot:default="scope">
              <img :src="scope.row.logo || defaultLogo" :alt="scope.row.name" class="brand-logo" />
            </template>
          </el-table-column>
          <el-table-column prop="name" label="品牌名称" min-width="150"></el-table-column>
          <el-table-column prop="description" label="品牌描述" min-width="200"></el-table-column>
          <el-table-column prop="sort" label="排序" width="100" align="center"></el-table-column>
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template v-slot:default="scope">
              <el-switch
                v-model="scope.row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="handleStatusChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="180"></el-table-column>
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template v-slot:default="scope">
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">
                编辑
              </el-button>
              <el-button type="danger" size="small" @click="handleDelete(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination-container">
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          :total="total"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="600px">
      <el-form :model="formData" :rules="rules" ref="formDataRef">
        <el-form-item label="品牌名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入品牌名称"></el-input>
        </el-form-item>
        <el-form-item label="品牌Logo" prop="logo">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
          >
            <img v-if="formData.logo" :src="formData.logo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="品牌描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            rows="3"
            placeholder="请输入品牌描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="formData.sort"
            :min="0"
            :step="1"
            placeholder="请输入排序值"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// 导入必要的API和类型
import { ref, reactive, onMounted } from 'vue'
import { useProductStore } from '@/store/modules/product'
import { ElMessage, ElMessageBox } from 'element-plus'
import { FormInstance, FormRules } from 'element-plus'

// 导入日志工具
import logger from '@/utils/logger'

// 类型定义
interface Brand {
  id: string
  name: string
  logo: string
  description: string
  sort: number
  status: boolean
  createTime: string
}

interface FormData {
  id: string
  name: string
  logo: string
  description: string
  sort: number
  status: boolean
}

// 响应式数据
const brandList = ref<Brand[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const dialogTitle = ref('添加品牌')
const defaultLogo = ref('/static/images/default-logo.png')
const uploadUrl = ref('/api/upload/brand')
const loading = ref(false)

const formData = reactive<FormData>({
  id: '',
  name: '',
  logo: '',
  description: '',
  sort: 0,
  status: true,
})

const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入品牌名称', trigger: 'blur' },
    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
  ],
  logo: [{ required: true, message: '请上传品牌Logo', trigger: 'change' }],
})

// 表单引用
const formDataRef = ref<FormInstance | null>(null)

// 状态管理
const productStore = useProductStore()

// 生命周期钩子
onMounted(() => {
  fetchBrandList()
})

// 获取品牌列表
async function fetchBrandList() {
  try {
    loading.value = true
    // 使用真实API调用
    const response = await productStore.getBrands(currentPage.value, pageSize.value)

    brandList.value = productStore.brands || []
    total.value = productStore.brandTotal || 0
  } catch (error) {
    logger.error('获取品牌列表失败', error)
    ElMessage.error('获取品牌列表失败')
    // 发生错误时显示空数据
    brandList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 处理添加
function handleAdd() {
  dialogTitle.value = '添加品牌'
  Object.assign(formData, {
    id: '',
    name: '',
    logo: '',
    description: '',
    sort: 0,
    status: true,
  })
  dialogVisible.value = true
}

// 处理编辑
function handleEdit(row: Brand) {
  dialogTitle.value = '编辑品牌'
  Object.assign(formData, { ...row })
  dialogVisible.value = true
}

// 处理上传成功
async function handleUploadSuccess(response: any, file: File) {
  try {
    // 使用真实API上传文件
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'brand')

    const uploadResponse = await productStore.uploadBrandLogo(formData)
    formData.logo = uploadResponse.data.url

    ElMessage.success('上传成功')
  } catch (error) {
    logger.error('上传失败', error)
    ElMessage.error('上传失败')

    // 如果上传失败，清空logo
    formData.logo = ''
  }
}

// 上传前检查
function beforeUpload(file: File) {
  const isJPG = file.type === 'image/jpeg'
  const isPNG = file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG && !isPNG) {
    ElMessage.error('上传头像图片只能是 JPG/PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
    return false
  }

  // 实际项目中应该返回true允许上传
  return true
}

// 处理提交
async function handleSubmit() {
  if (!formDataRef.value) return

  try {
    await formDataRef.value.validate()
    loading.value = true

    if (formData.id) {
      // 编辑操作
      await productStore.updateBrand(formData)
      ElMessage.success('编辑成功')
    } else {
      // 添加操作
      await productStore.createBrand(formData)
      ElMessage.success('添加成功')
    }

    dialogVisible.value = false
    // 刷新列表
    fetchBrandList()
  } catch (error) {
    logger.error('提交失败', error)
    ElMessage.error('操作失败')
  } finally {
    loading.value = false
  }
}

// 处理状态改变
async function handleStatusChange(row: Brand) {
  try {
    await productStore.updateBrandStatus(row.id, !row.status)
    row.status = !row.status
    ElMessage.success(`状态已更新为${row.status ? '启用' : '禁用'}`)
  } catch (error) {
    logger.error('状态更新失败', error)
    ElMessage.error('状态更新失败')
  }
}

// 处理删除
async function handleDelete(row: Brand) {
  try {
    await ElMessageBox.confirm(`确定要删除品牌"${row.name}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await productStore.deleteBrand(row.id)
    ElMessage.success('删除成功')

    // 刷新列表
    fetchBrandList()
  } catch (error) {
    if (error !== 'cancel') {
      logger.error('删除失败', error)
      ElMessage.error('删除失败')
    }
  }
}

// 处理页码变化
function handleCurrentChange(val: number) {
  currentPage.value = val
  fetchBrandList()
}

// 处理每页大小变化
function handleSizeChange(val: number) {
  pageSize.value = val
  currentPage.value = 1
  fetchBrandList()
}
</script>

<style scoped>
.product-brand-container {
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

.brand-logo {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
