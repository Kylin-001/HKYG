<template>
  <div class="user-address-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>用户地址管理</span>
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="用户ID">
            <el-input v-model="searchForm.userId" placeholder="请输入用户ID"></el-input>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="searchForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="searchForm.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="table-container">
        <el-table :data="addressList" style="width: 100%" border stripe>
          <el-table-column prop="id" label="地址ID" width="100" align="center"></el-table-column>
          <el-table-column
            prop="userId"
            label="用户ID"
            width="100"
            align="center"
          ></el-table-column>
          <el-table-column prop="username" label="用户名" min-width="120"></el-table-column>
          <el-table-column prop="consignee" label="收货人" min-width="100"></el-table-column>
          <el-table-column prop="phone" label="手机号" min-width="120"></el-table-column>
          <el-table-column prop="region" label="所在地区" min-width="150"></el-table-column>
          <el-table-column prop="address" label="详细地址" min-width="200"></el-table-column>
          <el-table-column prop="isDefault" label="是否默认" width="120" align="center">
            <template v-slot="scope">
              <el-tag v-if="scope.row.isDefault" type="success">是</el-tag>
              <el-tag v-else type="info">否</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="180"></el-table-column>
          <el-table-column label="操作" width="120" align="center" fixed="right">
            <template v-slot="scope">
              <el-button type="primary" size="small" @click="handleView(scope.row)">
                查看
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

    <!-- 查看地址对话框 -->
    <el-dialog title="地址详情" v-model:visible="dialogVisible" width="600px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="地址ID">{{ detailData.id }}</el-descriptions-item>
        <el-descriptions-item label="用户ID">{{ detailData.userId }}</el-descriptions-item>
        <el-descriptions-item label="用户名">{{ detailData.username }}</el-descriptions-item>
        <el-descriptions-item label="收货人">{{ detailData.consignee }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ detailData.phone }}</el-descriptions-item>
        <el-descriptions-item label="所在地区">{{ detailData.region }}</el-descriptions-item>
        <el-descriptions-item label="详细地址">{{ detailData.address }}</el-descriptions-item>
        <el-descriptions-item label="邮政编码">{{
          detailData.zipCode || '-'
        }}</el-descriptions-item>
        <el-descriptions-item label="是否默认">
          <el-tag v-if="detailData.isDefault" type="success">是</el-tag>
          <el-tag v-else type="info">否</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detailData.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{
          detailData.updateTime || '-'
        }}</el-descriptions-item>
      </el-descriptions>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 定义类型接口
interface SearchForm {
  userId: string
  username: string
  phone: string
}

interface Address {
  id: number
  userId: number
  username: string
  consignee: string
  phone: string
  region: string
  address: string
  isDefault: boolean
  createTime: string
  updateTime?: string
  zipCode?: string
}

// 状态管理
const addressList = ref<Address[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const searchForm = reactive<SearchForm>({
  userId: '',
  username: '',
  phone: '',
})
const dialogVisible = ref(false)
const detailData = reactive<Address>({} as Address)

// 获取地址列表
const fetchAddressList = async () => {
  try {
    // 调用Vuex Store中的getUserAddressList方法（使用当前用户ID或者参数）
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      ...searchForm,
    }
    // 模拟API调用 - 实际项目中应使用Vuex或Pinia
    // const result = await store.dispatch('user/getUserAddressList', params)

    // 模拟数据
    const result = {
      list: Array.from({ length: 10 }, (_, i) => ({
        id: (currentPage.value - 1) * pageSize.value + i + 1,
        userId: 1000 + Math.floor(Math.random() * 9000),
        username: `user${Math.floor(Math.random() * 1000)}`,
        consignee: `收货人${i + 1}`,
        phone: `138${Math.floor(Math.random() * 100000000)}`,
        region: '北京市海淀区',
        address: `科技园区${i + 1}号楼`,
        isDefault: i === 0,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        zipCode: '100000',
      })),
      total: 100,
    }

    if (result && result.list) {
      addressList.value = result.list
      total.value = result.total || 0
    } else {
      addressList.value = []
      total.value = 0
    }
  } catch (error: any) {
    ElMessage.error(`获取地址列表失败: ${error.message || '未知错误'}`)
    addressList.value = []
    total.value = 0
  }
}

// 处理查询
const handleSearch = () => {
  currentPage.value = 1
  fetchAddressList()
}

// 重置搜索
const resetSearch = () => {
  searchForm.userId = ''
  searchForm.username = ''
  searchForm.phone = ''
  currentPage.value = 1
  fetchAddressList()
}

// 处理页码变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchAddressList()
}

// 处理每页大小变化
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  fetchAddressList()
}

// 查看详情
const handleView = (row: Address) => {
  Object.assign(detailData, row)
  dialogVisible.value = true
}

// 删除地址
const handleDelete = async (row: Address) => {
  try {
    await ElMessageBox.confirm('确定要删除这个地址吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    if (row.id) {
      // 调用删除API
      // await store.dispatch('user/deleteUserAddress', row.id)
      ElMessage.success('删除成功')
      fetchAddressList() // 重新加载列表
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(`删除失败: ${error.message || '未知错误'}`)
    } else {
      ElMessage.info('已取消删除')
    }
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchAddressList()
})
</script>

<style scoped>
.user-address-container {
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
</style>
