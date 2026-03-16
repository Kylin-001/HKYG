<template>
  <div class="secondhand-list-container">
    <el-card class="filter-card">
      <el-form :inline="true" :model="queryParams" class="filter-form">
        <el-form-item label="关键词">
          <el-input v-model="queryParams.keyword" placeholder="商品名称" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="queryParams.categoryId" placeholder="请选择分类" clearable>
            <el-option label="全部" :value="null" />
            <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="成色">
          <el-select v-model="queryParams.condition" placeholder="请选择成色" clearable>
            <el-option label="全新" :value="0" />
            <el-option label="九成新" :value="1" />
            <el-option label="八成新" :value="2" />
            <el-option label="七成新" :value="3" />
            <el-option label="六成新及以下" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-select v-model="queryParams.sort" placeholder="排序方式">
            <el-option label="最新上架" value="newest" />
            <el-option label="价格从低到高" value="price_asc" />
            <el-option label="价格从高到低" value="price_desc" />
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
        <span>二手商品列表</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="handlePublish">发布商品</el-button>
      </template>
      <el-table v-loading="loading" :data="productList" stripe>
        <el-table-column label="商品图片" width="100">
          <template slot-scope="scope">
            <el-image v-if="scope.row.images" :src="scope.row.images.split(',')[0]" style="width: 60px; height: 60px" fit="cover" />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="商品名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="categoryName" label="分类" width="100" />
        <el-table-column prop="price" label="价格" width="100">
          <template slot-scope="scope">
            ¥{{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="condition" label="成色" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.condition === 0" type="success">全新</el-tag>
            <el-tag v-else-if="scope.row.condition === 1">九成新</el-tag>
            <el-tag v-else-if="scope.row.condition === 2">八成新</el-tag>
            <el-tag v-else-if="scope.row.condition === 3">七成新</el-tag>
            <el-tag v-else type="info">六成新及以下</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="warning">待审核</el-tag>
            <el-tag v-else-if="scope.row.status === 1" type="success">上架</el-tag>
            <el-tag v-else-if="scope.row.status === 2">下架</el-tag>
            <el-tag v-else-if="scope.row.status === 3" type="info">已售出</el-tag>
            <el-tag v-else type="danger">审核失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="viewCount" label="浏览量" width="80" />
        <el-table-column prop="createTime" label="发布时间" width="160" />
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleView(scope.row)">查看</el-button>
            <el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="handleStatus(scope.row)">
              {{ scope.row.status === 1 ? '下架' : '上架' }}
            </el-button>
            <el-button size="mini" type="text" style="color: #F56C6C" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.page"
        :limit.sync="queryParams.size"
        @pagination="getList"
      />
    </el-card>
  </template>
</template>

<script>
import { getSecondhandList, updateSecondhandStatus, deleteSecondhand } from '@/api/secondhand'

export default {
  name: 'SecondhandList',
  data() {
    return {
      loading: true,
      total: 0,
      productList: [],
      categories: [],
      queryParams: {
        page: 1,
        size: 10,
        keyword: null,
        categoryId: null,
        condition: null,
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
      getSecondhandList(this.queryParams).then(response => {
        this.productList = response.data.records || []
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
        size: 10,
        keyword: null,
        categoryId: null,
        condition: null,
        sort: 'newest'
      }
      this.getList()
    },
    handlePublish() {
      this.$router.push('/secondhand/publish')
    },
    handleView(row) {
      this.$router.push(`/secondhand/detail/${row.id}`)
    },
    handleEdit(row) {
      this.$router.push(`/secondhand/edit/${row.id}`)
    },
    handleStatus(row) {
      const status = row.status === 1 ? 2 : 1
      this.$confirm(`确认要${status === 1 ? '上架' : '下架'}该商品吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateSecondhandStatus(row.id, status).then(() => {
          this.$message.success('操作成功')
          this.getList()
        })
      })
    },
    handleDelete(row) {
      this.$confirm('确认要删除该商品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSecondhand(row.id).then(() => {
          this.$message.success('删除成功')
          this.getList()
        })
      })
    }
  }
}
</script>

<style scoped>
.secondhand-list-container {
  padding: 20px;
}
.filter-card {
  margin-bottom: 20px;
}
.filter-form {
  margin-bottom: 0;
}
</style>
