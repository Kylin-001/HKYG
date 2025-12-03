<template>
  <div class="errand-request-container">
    <div class="page-header">
      <h2>跑腿服务管理</h2>
    </div>

    <el-card class="mt-20">
      <div class="search-form">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="请求编号">
            <el-input
              v-model="searchForm.requestNo"
              placeholder="请输入请求编号"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table v-loading="loading" :data="requestList" style="width: 100%">
        <el-table-column prop="id" label="请求ID" width="80"></el-table-column>
        <el-table-column prop="requestNo" label="请求编号" width="180"></el-table-column>
        <el-table-column prop="userName" label="用户名称" width="120"></el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleViewDetail(scope.row)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          :current-page.sync="pagination.currentPage"
          :page-size.sync="pagination.pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'ErrandRequestList',
  data() {
    return {
      loading: false,
      searchForm: {
        requestNo: '',
        userName: '',
      },
      pagination: {
        currentPage: 1,
        pageSize: 10,
      },
    }
  },
  computed: {
    ...mapState('campus', ['errandRequestList', 'errandRequestTotal']),
    total() {
      return this.errandRequestTotal
    },
    requestList() {
      return this.errandRequestList
    },
  },
  created() {
    this.loadData()
  },
  methods: {
    ...mapActions('campus', ['getErrandRequests']),

    // 加载数据
    async loadData() {
      this.loading = true
      try {
        await this.loadRequestList()
      } catch (error) {
        this.$message.error('数据加载失败')
      } finally {
        this.loading = false
      }
    },

    // 加载请求列表
    async loadRequestList() {
      try {
        const searchParams = {
          ...this.searchForm,
          page: this.pagination.currentPage,
          pageSize: this.pagination.pageSize,
        }
        await this.getErrandRequests(searchParams)
      } catch (error) {
        this.$message.error('获取请求列表失败')
      }
    },

    // 搜索
    handleSearch() {
      this.pagination.currentPage = 1
      this.loadRequestList()
    },

    // 重置搜索
    resetSearch() {
      this.searchForm = {
        requestNo: '',
        userName: '',
      }
      this.handleSearch()
    },

    // 分页大小变化
    handleSizeChange(size) {
      this.pagination.pageSize = size
      this.loadRequestList()
    },

    // 分页页码变化
    handleCurrentChange(current) {
      this.pagination.currentPage = current
      this.loadRequestList()
    },

    // 查看请求详情
    handleViewDetail(row) {
      this.$message.info('查看详情功能待实现')
    },
  },
}
</script>

<style lang="scss" scoped>
.errand-request-container {
  padding: 20px;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }
  }

  .search-form {
    margin-bottom: 20px;
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
