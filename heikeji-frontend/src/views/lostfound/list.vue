<template>
  <div class="lostfound-list-container">
    <el-card class="filter-card">
      <el-form :inline="true" :model="queryParams" class="filter-form">
        <el-form-item label="类型">
          <el-select v-model="queryParams.type" placeholder="请选择类型" clearable>
            <el-option label="全部" :value="null" />
            <el-option label="失物" :value="0" />
            <el-option label="招领" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="queryParams.keyword" placeholder="标题/描述" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
            <el-option label="全部" :value="null" />
            <el-option label="待审核" :value="0" />
            <el-option label="进行中" :value="1" />
            <el-option label="已找到" :value="2" />
            <el-option label="已过期" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-select v-model="queryParams.sort" placeholder="排序方式">
            <el-option label="最新发布" value="newest" />
            <el-option label="热门" value="hot" />
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
        <span>失物招领列表</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="handlePublish">发布信息</el-button>
      </template>
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="全部" name="all" />
        <el-tab-pane label="失物" name="lost" />
        <el-tab-pane label="招领" name="found" />
      </el-tabs>
      <el-table v-loading="loading" :data="list" stripe>
        <el-table-column prop="title" label="标题" min-width="180" show-overflow-tooltip />
        <el-table-column prop="type" label="类型" width="80">
          <template slot-scope="scope">
            <el-tag :type="scope.row.type === 0 ? 'danger' : 'success'">
              {{ scope.row.type === 0 ? '失物' : '招领' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="分类" width="100" />
        <el-table-column prop="location" label="丢失/拾取地点" width="150" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="warning">待审核</el-tag>
            <el-tag v-else-if="scope.row.status === 1" type="primary">进行中</el-tag>
            <el-tag v-else-if="scope.row.status === 2" type="success">已找到</el-tag>
            <el-tag v-else type="info">已过期</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reward" label="悬赏" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.reward">¥{{ scope.row.reward }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="viewCount" label="浏览" width="60" />
        <el-table-column prop="contact" label="联系方式" width="120" />
        <el-table-column prop="createTime" label="发布时间" width="160" />
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleView(scope.row)">查看</el-button>
            <el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" style="color: #F56C6C" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.page"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>
  </template>
</template>

<script>
import { getLostFoundList, deleteLostFound } from '@/api/lostfound'

export default {
  name: 'LostFoundList',
  data() {
    return {
      loading: true,
      total: 0,
      list: [],
      activeTab: 'all',
      queryParams: {
        page: 1,
        pageSize: 10,
        type: null,
        keyword: null,
        status: null,
        sort: 'newest'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      const params = { ...this.queryParams }
      if (this.activeTab === 'lost') {
        params.type = 0
      } else if (this.activeTab === 'found') {
        params.type = 1
      }
      
      getLostFoundList(params).then(response => {
        this.list = response.data.records || []
        this.total = response.data.total || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleQuery() {
      this.queryParams.page = 1
      this.getList()
    },
    resetQuery() {
      this.queryParams = {
        page: 1,
        pageSize: 10,
        type: null,
        keyword: null,
        status: null,
        sort: 'newest'
      }
      this.activeTab = 'all'
      this.getList()
    },
    handleTabClick() {
      this.getList()
    },
    handlePublish() {
      this.$router.push('/lostfound/publish')
    },
    handleView(row) {
      this.$router.push(`/lostfound/detail/${row.id}`)
    },
    handleEdit(row) {
      this.$router.push(`/lostfound/edit/${row.id}`)
    },
    handleDelete(row) {
      this.$confirm('确认要删除该信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteLostFound(row.id).then(() => {
          this.$message.success('删除成功')
          this.getList()
        })
      })
    }
  }
}
</script>

<style scoped>
.lostfound-list-container {
  padding: 20px;
}
.filter-card {
  margin-bottom: 20px;
}
</style>
