<template>
  <div class="address-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1><i class="el-icon-map-location"></i> 收货地址管理</h1>
    </div>

    <!-- 地址列表 -->
    <el-card class="address-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <h3>我的收货地址</h3>
          <el-button type="primary" @click="showAddAddressDialog">
            <i class="el-icon-plus"></i> 新增地址
          </el-button>
        </div>
      </template>

      <!-- 地址列表 -->
      <div v-if="addressList.length > 0" class="address-list">
        <div
          v-for="address in addressList"
          :key="address.id"
          class="address-item"
          :class="{ active: address.isDefault }"
        >
          <div class="address-info">
            <div class="address-header">
              <h4 class="consignee-name">{{ address.consignee }} {{ address.phone }}</h4>
              <el-tag v-if="address.isDefault" type="primary" size="small">默认</el-tag>
            </div>
            <p class="address-detail">
              {{ address.province }}{{ address.city }}{{ address.district }}{{ address.detail }}
            </p>
          </div>
          <div class="address-actions">
            <el-button type="primary" size="small" @click="showEditAddressDialog(address)">
              <i class="el-icon-edit"></i> 编辑
            </el-button>
            <el-button type="danger" size="small" @click="deleteAddress(address.id)">
              <i class="el-icon-delete"></i> 删除
            </el-button>
            <el-button
              v-if="!address.isDefault"
              type="success"
              size="small"
              @click="setDefaultAddress(address.id)"
            >
              <i class="el-icon-star-off"></i> 设为默认
            </el-button>
          </div>
        </div>
      </div>

      <!-- 空地址状态 -->
      <div v-else class="empty-address">
        <div class="empty-icon">
          <i class="el-icon-location-outline"></i>
        </div>
        <h3>暂无收货地址</h3>
        <p>添加收货地址，方便您的购物</p>
        <el-button type="primary" @click="showAddAddressDialog">
          <i class="el-icon-plus"></i> 新增地址
        </el-button>
      </div>
    </el-card>

    <!-- 新增/编辑地址对话框 -->
    <el-dialog
      v-model="addressDialogVisible"
      :title="editAddressId ? '编辑收货地址' : '新增收货地址'"
      width="500px"
      destroy-on-close
    >
      <el-form ref="addressFormRef" :model="addressForm" label-width="80px" :rules="addressRules">
        <el-form-item label="收货人" prop="consignee">
          <el-input v-model="addressForm.consignee" placeholder="请输入收货人姓名" />
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="addressForm.phone" placeholder="请输入手机号" />
        </el-form-item>

        <el-form-item label="所在地区" prop="region">
          <el-cascader
            v-model="regionValue"
            :options="regionOptions"
            placeholder="请选择省/市/区"
            @change="handleRegionChange"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="详细地址" prop="detail">
          <el-input
            v-model="addressForm.detail"
            type="textarea"
            :rows="3"
            placeholder="请输入详细地址"
          />
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="addressForm.isDefault">设为默认地址</el-checkbox>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="addressDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveAddress">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

// 路由
const router = useRouter()

// 地址列表
const addressList = ref([])

// 新增/编辑对话框
const addressDialogVisible = ref(false)
const editAddressId = ref(null)
const addressFormRef = ref(null)

// 省市区选择器值
const regionValue = ref([])

// 省市区选项（模拟数据，实际项目中替换为真实API数据）
const regionOptions = ref([
  {
    value: '黑龙江',
    label: '黑龙江',
    children: [
      {
        value: '哈尔滨',
        label: '哈尔滨',
        children: [
          { value: '南岗区', label: '南岗区' },
          { value: '道里区', label: '道里区' },
          { value: '道外区', label: '道外区' },
        ],
      },
    ],
  },
  {
    value: '北京',
    label: '北京',
    children: [
      {
        value: '北京',
        label: '北京',
        children: [
          { value: '朝阳区', label: '朝阳区' },
          { value: '海淀区', label: '海淀区' },
          { value: '东城区', label: '东城区' },
        ],
      },
    ],
  },
])

// 地址表单
const addressForm = reactive({
  consignee: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false,
})

// 地址表单验证规则
const addressRules = reactive({
  consignee: [{ required: true, message: '请输入收货人姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' },
  ],
  detail: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
})

// 生命周期钩子：页面加载时获取地址列表
onMounted(() => {
  fetchAddressList()
})

// 获取地址列表
const fetchAddressList = async () => {
  try {
    // 模拟API请求，实际项目中替换为真实API
    // const response = await addressApi.getAddressList()
    // addressList.value = response.data

    // 模拟数据
    setTimeout(() => {
      addressList.value = [
        {
          id: 1,
          consignee: '张三',
          phone: '13800138000',
          province: '黑龙江',
          city: '哈尔滨',
          district: '南岗区',
          detail: '黑科技大学主校区',
          isDefault: true,
        },
        {
          id: 2,
          consignee: '李四',
          phone: '13800138001',
          province: '北京',
          city: '北京',
          district: '朝阳区',
          detail: '某某小区1号楼1单元101',
          isDefault: false,
        },
      ]
    }, 500)
  } catch (error) {
    ElMessage.error('获取地址列表失败')
  }
}

// 显示新增地址对话框
const showAddAddressDialog = () => {
  editAddressId.value = null
  resetAddressForm()
  addressDialogVisible.value = true
}

// 显示编辑地址对话框
const showEditAddressDialog = address => {
  editAddressId.value = address.id
  Object.assign(addressForm, address)
  regionValue.value = [address.province, address.city, address.district]
  addressDialogVisible.value = true
}

// 重置地址表单
const resetAddressForm = () => {
  Object.assign(addressForm, {
    consignee: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detail: '',
    isDefault: false,
  })
  regionValue.value = []
  if (addressFormRef.value) {
    addressFormRef.value.resetFields()
  }
}

// 省市区选择变化处理
const handleRegionChange = value => {
  if (value && value.length === 3) {
    addressForm.province = value[0]
    addressForm.city = value[1]
    addressForm.district = value[2]
  }
}

// 保存地址
const saveAddress = async () => {
  if (!addressFormRef.value) return

  await addressFormRef.value.validate(valid => {
    if (valid) {
      try {
        // 模拟API请求，实际项目中替换为真实API
        // if (editAddressId.value) {
        //   await addressApi.updateAddress(editAddressId.value, addressForm)
        //   ElMessage.success('编辑地址成功')
        // } else {
        //   await addressApi.addAddress(addressForm)
        //   ElMessage.success('添加地址成功')
        // }

        // 模拟数据
        setTimeout(() => {
          if (editAddressId.value) {
            // 更新现有地址
            const index = addressList.value.findIndex(item => item.id === editAddressId.value)
            if (index !== -1) {
              addressList.value[index] = { ...addressForm, id: editAddressId.value }
            }
            ElMessage.success('编辑地址成功')
          } else {
            // 添加新地址
            const newAddress = {
              ...addressForm,
              id: Date.now(),
            }
            addressList.value.unshift(newAddress)
            ElMessage.success('添加地址成功')
          }
          addressDialogVisible.value = false
          fetchAddressList()
        }, 500)
      } catch (error) {
        ElMessage.error(editAddressId.value ? '编辑地址失败' : '添加地址失败')
      }
    }
  })
}

// 删除地址
const deleteAddress = addressId => {
  ElMessageBox.confirm('确定要删除该收货地址吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      try {
        // 模拟API请求，实际项目中替换为真实API
        // await addressApi.deleteAddress(addressId)

        // 模拟数据
        setTimeout(() => {
          addressList.value = addressList.value.filter(item => item.id !== addressId)
          ElMessage.success('删除地址成功')
        }, 500)
      } catch (error) {
        ElMessage.error('删除地址失败')
      }
    })
    .catch(() => {
      // 用户取消操作
    })
}

// 设置默认地址
const setDefaultAddress = addressId => {
  try {
    // 模拟API请求，实际项目中替换为真实API
    // await addressApi.setDefaultAddress(addressId)

    // 模拟数据
    setTimeout(() => {
      addressList.value.forEach(item => {
        item.isDefault = item.id === addressId
      })
      ElMessage.success('设置默认地址成功')
    }, 500)
  } catch (error) {
    ElMessage.error('设置默认地址失败')
  }
}
</script>

<style scoped>
.address-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  margin-bottom: 20px;
  padding: 15px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.page-header h1 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

/* 地址卡片 */
.address-card {
  margin-bottom: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

/* 地址列表 */
.address-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.address-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 15px;
  background: #f9f9f9;
  border: 2px solid transparent;
  border-radius: 8px;
  transition: all 0.3s;
}

.address-item:hover {
  background: #f0f0f0;
  border-color: #409eff;
}

.address-item.active {
  border-color: #409eff;
  background: #ecf5ff;
}

.address-info {
  flex: 1;
  margin-right: 15px;
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.consignee-name {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.address-detail {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.address-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 空地址状态 */
.empty-address {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  margin-bottom: 20px;
}

.empty-icon i {
  font-size: 80px;
  color: #ddd;
}

.empty-address h3 {
  margin: 0 0 10px 0;
  color: #666;
}

.empty-address p {
  margin: 0 0 30px 0;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .address-container {
    padding: 10px;
  }

  .page-header {
    padding: 10px 15px;
  }

  .address-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .address-actions {
    flex-direction: row;
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
