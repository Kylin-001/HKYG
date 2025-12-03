<template>
  <div class="marketing-banner-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>轮播图管理</span>
        <el-button type="primary" size="small" @click="handleAdd">
          <i class="el-icon-plus"></i> 添加轮播图
        </el-button>
      </div>

      <el-form :inline="true" :model="searchForm" class="banner-search-form">
        <el-form-item label="轮播图名称">
          <el-input v-model="searchForm.name" placeholder="请输入轮播图名称"></el-input>
        </el-form-item>
        <el-form-item label="位置">
          <el-select v-model="searchForm.position" placeholder="请选择位置">
            <el-option value="" label="全部"></el-option>
            <el-option value="home" label="首页"></el-option>
            <el-option value="category" label="分类页"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option value="" label="全部"></el-option>
            <el-option value="1" label="启用"></el-option>
            <el-option value="0" label="禁用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchBanners">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="banners" style="width: 100%">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="name" label="轮播图名称" width="200"></el-table-column>
        <el-table-column label="图片" width="150">
          <template slot-scope="scope">
            <el-image
              :src="scope.row.imageUrl"
              :preview-src-list="[scope.row.imageUrl]"
              style="width: 100px; height: 100px"
              fit="cover"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="linkUrl" label="链接地址" width="250"></el-table-column>
        <el-table-column prop="sort" label="排序" width="100">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.sort"
              :min="0"
              :step="1"
              @change="handleSortChange(scope.row)"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="confirmDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        :page-size.sync="pagination.pageSize"
        :current-page.sync="pagination.currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="banner-pagination"
      ></el-pagination>
    </el-card>

    <!-- 添加/编辑轮播图对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="700px">
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="轮播图名称" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入轮播图名称"
            maxlength="50"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="轮播图片" prop="imageUrl">
          <el-upload
            class="upload-demo"
            action="#"
            list-type="picture-card"
            :file-list="fileList"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            :auto-upload="false"
            :http-request="customUpload"
            :limit="1"
            accept="image/*"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <div class="el-upload__text">点击上传<br />图片尺寸建议：1920x500px</div>
          <el-dialog :visible.sync="dialogVisiblePreview" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="链接地址" prop="linkUrl">
          <el-input
            v-model="formData.linkUrl"
            placeholder="请输入点击后的跳转链接"
            maxlength="200"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="formData.sort"
            :min="0"
            :step="1"
            placeholder="请输入排序，数字越小越靠前"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="formData.status"
            active-text="启用"
            inactive-text="禁用"
            active-value="1"
            inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            rows="3"
            placeholder="请输入备注信息"
            maxlength="200"
            show-word-limit
          ></el-input>
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 类型定义
interface BannerItem {
  id: number
  name: string
  imageUrl: string
  linkUrl: string
  sort: number
  status: number
  createTime: string
}

interface Pagination {
  currentPage: number
  pageSize: number
  total: number
}

interface SearchForm {
  name: string
  position: string
  status: string
}

interface FormData {
  name: string
  imageUrl: string
  linkUrl: string
  sort: number
  status: number
  remark: string
  id?: number
}

interface FileItem {
  name: string
  url: string
}

// 轮播图列表数据
const banners = ref<BannerItem[]>([])

// 分页信息
const pagination = reactive<Pagination>({
  currentPage: 1,
  pageSize: 10,
  total: 0,
})

// 加载状态
const loading = ref(false)

// 搜索表单
const searchForm = reactive<SearchForm>({
  name: '',
  position: '',
  status: '',
})

// 对话框显示状态
const dialogVisible = ref(false)
const editDialogVisible = ref(false)

// 表单加载状态
const submitLoading = ref(false)

// 是否编辑状态
const isEdit = ref(false)

// 文件列表
const fileList = ref<FileItem[]>([])

// 预览对话框
const dialogVisiblePreview = ref(false)
const dialogImageUrl = ref('')

// 表单数据
const formData = reactive<FormData>({
  name: '',
  imageUrl: '',
  linkUrl: '',
  sort: 0,
  status: 1,
  remark: '',
})

// 对话框标题
const dialogTitle = ref('添加轮播图')

// 表单引用
const formRef = ref()

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入轮播图名称', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' },
  ],
  imageUrl: [{ required: true, message: '请选择轮播图片', trigger: 'change' }],
  linkUrl: [{ type: 'url', message: '请输入正确的链接地址', trigger: 'blur' }],
  sort: [{ type: 'number', message: '排序必须为数字', trigger: 'blur' }],
}

// 获取轮播图列表
const fetchBanners = async () => {
  loading.value = true
  try {
    // 这里应该调用API获取数据
    // const response = await getBannerList(searchForm, pagination)
    // 模拟数据
    banners.value = [
      {
        id: 1,
        name: '首页轮播图1',
        imageUrl: 'https://via.placeholder.com/1920x500',
        linkUrl: 'https://www.example.com',
        sort: 1,
        status: 1,
        createTime: '2024-01-01 10:00:00',
      },
      {
        id: 2,
        name: '首页轮播图2',
        imageUrl: 'https://via.placeholder.com/1920x500',
        linkUrl: 'https://www.example.com',
        sort: 2,
        status: 1,
        createTime: '2024-01-02 10:00:00',
      },
    ]
    pagination.total = banners.value.length
  } catch (error) {
    ElMessage.error('获取轮播图列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索轮播图
const searchBanners = () => {
  pagination.currentPage = 1
  fetchBanners()
}

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  searchForm.position = ''
  searchForm.status = ''
  pagination.currentPage = 1
  fetchBanners()
}

// 添加轮播图
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '添加轮播图'
  resetForm()
  dialogVisible.value = true
}

// 编辑轮播图
const handleEdit = (row: BannerItem) => {
  isEdit.value = true
  dialogTitle.value = '编辑轮播图'
  Object.assign(formData, row)
  fileList.value = row.imageUrl ? [{ name: row.name, url: row.imageUrl }] : []
  dialogVisible.value = true
}

// 删除确认
const confirmDelete = (row: BannerItem) => {
  ElMessageBox.confirm('确定要删除该轮播图吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    handleDelete(row)
  })
}

// 删除轮播图
const handleDelete = async (row: BannerItem) => {
  try {
    // 这里应该调用API删除
    // await deleteBanner(row.id)
    ElMessage.success('删除成功')
    fetchBanners()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

// 排序改变
const handleSortChange = async (row: BannerItem) => {
  try {
    // 这里应该调用API更新排序
    // await updateBannerSort(row.id, row.sort)
    ElMessage.success('排序更新成功')
  } catch (error) {
    ElMessage.error('排序更新失败')
  }
}

// 状态改变
const handleStatusChange = async (row: BannerItem) => {
  try {
    // 这里应该调用API更新状态
    // await updateBannerStatus(row.id, row.status)
    ElMessage.success('状态更新成功')
  } catch (error) {
    ElMessage.error('状态更新失败')
  }
}

// 表单提交
const handleSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      submitLoading.value = true
      setTimeout(() => {
        submitLoading.value = false
        dialogVisible.value = false
        ElMessage.success(isEdit.value ? '更新成功' : '添加成功')
        fetchBanners()
      }, 1000)
    }
  })
}

// 重置表单
const resetForm = () => {
  formData.name = ''
  formData.imageUrl = ''
  formData.linkUrl = ''
  formData.sort = 0
  formData.status = 1
  formData.remark = ''
  fileList.value = []
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 文件上传前验证
const beforeUpload = (file: File) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('上传图片只能是 JPG/PNG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 2MB!')
  }
  return isJPG && isLt2M
}

// 自定义上传
const customUpload = (options: any) => {
  const { file, onSuccess, onError } = options
  // 这里应该实现文件上传逻辑
  setTimeout(() => {
    onSuccess({ url: URL.createObjectURL(file) })
  }, 1000)
}

// 文件预览
const handlePictureCardPreview = (file: FileItem) => {
  dialogImageUrl.value = file.url
  dialogVisiblePreview.value = true
}

// 文件删除
const handleRemove = (file: FileItem, fileList: FileItem[]) => {
  formData.imageUrl = ''
  fileList.value = fileList
}

// 分页大小改变
const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  fetchBanners()
}

// 页码改变
const handleCurrentChange = (val: number) => {
  pagination.currentPage = val
  fetchBanners()
}

// 组件挂载时获取数据
onMounted(() => {
  fetchBanners()
})
</script>

<style scoped>
.marketing-banner-container {
  padding: 20px;
}

.banner-search-form {
  margin-bottom: 20px;
}

.banner-pagination {
  margin-top: 20px;
  text-align: right;
}

.upload-demo {
  width: 100%;
}

.el-upload__text {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}
</style>
