<template>
  <div class="marketing-activity-container">
    <el-card class="filter-card">
      <el-form :inline="true" :model="queryParams" class="filter-form">
        <el-form-item label="活动名称">
          <el-input v-model="queryParams.keyword" placeholder="活动名称" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="活动类型">
          <el-select v-model="queryParams.type" placeholder="请选择类型" clearable>
            <el-option label="全部" :value="null" />
            <el-option label="折扣活动" :value="0" />
            <el-option label="满减活动" :value="1" />
            <el-option label="秒杀活动" :value="2" />
            <el-option label="抽奖活动" :value="3" />
            <el-option label="积分活动" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
            <el-option label="全部" :value="null" />
            <el-option label="待开始" :value="0" />
            <el-option label="进行中" :value="1" />
            <el-option label="已结束" :value="2" />
            <el-option label="已取消" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <div slot="header" class="clearfix">
        <span>营销活动列表</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="handleAdd">创建活动</el-button>
      </template>
      <el-table v-loading="loading" :data="activityList" stripe>
        <el-table-column prop="name" label="活动名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="type" label="活动类型" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type === 0">折扣活动</el-tag>
            <el-tag v-else-if="scope.row.type === 1">满减活动</el-tag>
            <el-tag v-else-if="scope.row.type === 2">秒杀活动</el-tag>
            <el-tag v-else-if="scope.row.type === 3">抽奖活动</el-tag>
            <el-tag v-else-if="scope.row.type === 4">积分活动</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="活动时间" width="200">
          <template slot-scope="scope">
            {{ scope.row.startTime }} ~ {{ scope.row.endTime }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="info">待开始</el-tag>
            <el-tag v-else-if="scope.row.status === 1" type="success">进行中</el-tag>
            <el-tag v-else-if="scope.row.status === 2">已结束</el-tag>
            <el-tag v-else-if="scope.row.status === 3" type="danger">已取消</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="participantCount" label="参与人数" width="100" />
        <el-table-column prop="orderCount" label="订单数" width="80" />
        <el-table-column prop="discountAmount" label="优惠金额" width="100">
          <template slot-scope="scope">
            ¥{{ scope.row.discountAmount }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleView(scope.row)">查看</el-button>
            <el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button v-if="scope.row.status === 0" size="mini" type="text" @click="handleStart(scope.row)">开始</el-button>
            <el-button v-if="scope.row.status === 1" size="mini" type="text" @click="handleEnd(scope.row)">结束</el-button>
            <el-button v-if="scope.row.status !== 3" size="mini" type="text" style="color: #F56C6C" @click="handleCancel(scope.row)">取消</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入活动名称" />
        </el-form-item>
        <el-form-item label="活动类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择活动类型">
            <el-option label="折扣活动" :value="0" />
            <el-option label="满减活动" :value="1" />
            <el-option label="秒杀活动" :value="2" />
            <el-option label="抽奖活动" :value="3" />
            <el-option label="积分活动" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间" prop="timeRange">
          <el-date-picker
            v-model="form.timeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="活动规则" prop="rules">
          <el-input v-model="form.rules" type="textarea" :rows="3" placeholder="请输入活动规则" />
        </el-form-item>
        <el-form-item label="优惠内容" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="2" placeholder="请输入优惠内容描述" />
        </el-form-item>
        <el-form-item label="参与条件">
          <el-input v-model="form.condition" placeholder="如：订单满100元" />
        </el-form-item>
        <el-form-item label="活动商品">
          <el-button @click="selectProducts">选择商品</el-button>
          <div v-if="form.products && form.products.length" class="selected-products">
            <el-tag v-for="product in form.products" :key="product.id" style="margin-right: 8px">
              {{ product.name }}
            </el-tag>
          </template>
        </el-form-item>
        <el-form-item label="活动 Banner">
          <el-upload
            action="/api/upload"
            list-type="picture-card"
            :file-list="bannerList"
            :on-success="handleBannerSuccess"
            :on-remove="handleBannerRemove"
            :limit="1"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="活动说明">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入活动说明" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </template>
    </el-dialog>
  </template>
</template>

<script>
export default {
  name: 'MarketingActivity',
  data() {
    return {
      loading: false,
      total: 0,
      activityList: [],
      dialogVisible: false,
      dialogTitle: '',
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        keyword: null,
        type: null,
        status: null
      },
      form: {
        id: null,
        name: '',
        type: null,
        timeRange: [],
        startTime: '',
        endTime: '',
        rules: '',
        content: '',
        condition: '',
        products: [],
        banner: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
        timeRange: [{ required: true, message: '请选择活动时间', trigger: 'change' }]
      },
      bannerList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      setTimeout(() => {
        this.activityList = [
          {
            id: 1,
            name: '春季大促',
            type: 1,
            startTime: '2024-03-01 00:00:00',
            endTime: '2024-03-31 23:59:59',
            status: 2,
            participantCount: 156,
            orderCount: 89,
            discountAmount: 5670,
            createTime: '2024-02-25 10:00:00'
          },
          {
            id: 2,
            name: '新品首发优惠',
            type: 0,
            startTime: '2024-03-15 00:00:00',
            endTime: '2024-03-20 23:59:59',
            status: 1,
            participantCount: 234,
            orderCount: 156,
            discountAmount: 8900,
            createTime: '2024-03-10 14:30:00'
          },
          {
            id: 3,
            name: '会员积分兑换',
            type: 4,
            startTime: '2024-03-01 00:00:00',
            endTime: '2024-12-31 23:59:59',
            status: 1,
            participantCount: 456,
            orderCount: 0,
            discountAmount: 12300,
            createTime: '2024-02-28 09:00:00'
          }
        ]
        this.total = 3
        this.loading = false
      }, 500)
    },
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        keyword: null,
        type: null,
        status: null
      }
      this.getList()
    },
    handleAdd() {
      this.dialogTitle = '创建活动'
      this.form = {
        id: null,
        name: '',
        type: null,
        timeRange: [],
        startTime: '',
        endTime: '',
        rules: '',
        content: '',
        condition: '',
        products: [],
        banner: '',
        description: ''
      }
      this.bannerList = []
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.dialogTitle = '编辑活动'
      this.form = {
        ...row,
        timeRange: [row.startTime, row.endTime]
      }
      this.bannerList = row.banner ? [{ url: row.banner }] : []
      this.dialogVisible = true
    },
    handleView(row) {
      this.$router.push(`/marketing/activity/detail/${row.id}`)
    },
    handleStart(row) {
      this.$confirm('确认要开始该活动吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.status = 1
        this.$message.success('活动已开始')
      })
    },
    handleEnd(row) {
      this.$confirm('确认要结束该活动吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.status = 2
        this.$message.success('活动已结束')
      })
    },
    handleCancel(row) {
      this.$confirm('确认要取消该活动吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.status = 3
        this.$message.success('活动已取消')
      })
    },
    selectProducts() {
      this.$message.info('商品选择功能开发中')
    },
    handleBannerSuccess(response) {
      this.form.banner = response.url
    },
    handleBannerRemove() {
      this.form.banner = ''
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.timeRange && this.form.timeRange.length === 2) {
            this.form.startTime = this.form.timeRange[0]
            this.form.endTime = this.form.timeRange[1]
          }
          this.dialogVisible = false
          this.$message.success(this.form.id ? '修改成功' : '创建成功')
          this.getList()
        }
      })
    },
    cancel() {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
.marketing-activity-container {
  padding: 20px;
}
.filter-card {
  margin-bottom: 20px;
}
.selected-products {
  margin-top: 10px;
}
</style>
