<template>
  <div class="secondhand-category-container">
    <el-card>
      <div slot="header">
        <span>分类管理</span>
        <el-button style="float: right;" type="primary" size="small" @click="handleAdd">新增分类</el-button>
      </template>
      <el-table v-loading="loading" :data="categoryList" row-key="id" default-expand-all>
        <el-table-column prop="name" label="分类名称" min-width="150" />
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 1" type="success">启用</el-tag>
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="handleStatus(scope.row)">
              {{ scope.row.status === 1 ? '禁用' : '启用' }}
            </el-button>
            <el-button size="mini" type="text" style="color: #F56C6C" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入分类名称" />
          </el-form-item>
          <el-form-item label="父级分类">
            <el-select v-model="form.parentId" placeholder="顶级分类" clearable>
              <el-option label="顶级分类" :value="0" />
              <el-option v-for="cat in categoryList" :key="cat.id" :label="cat.name" :value="cat.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入描述" />
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number v-model="form.sort" :min="0" />
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="form.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </template>
      </el-dialog>
    </el-card>
  </template>
</template>

<script>
export default {
  name: 'SecondhandCategory',
  data() {
    return {
      loading: false,
      categoryList: [],
      dialogVisible: false,
      dialogTitle: '',
      form: {
        id: null,
        name: '',
        parentId: 0,
        description: '',
        sort: 0,
        status: 1
      },
      rules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.categoryList = [
        { id: 1, name: '电子产品', description: '手机、电脑、数码配件等', sort: 1, status: 1, createTime: '2024-01-01 10:00:00' },
        { id: 2, name: '图书教材', description: '教科书、参考书、小说等', sort: 2, status: 1, createTime: '2024-01-01 10:00:00' },
        { id: 3, name: '生活用品', description: '日常家居用品', sort: 3, status: 1, createTime: '2024-01-01 10:00:00' },
        { id: 4, name: '运动户外', description: '运动器材、户外装备', sort: 4, status: 1, createTime: '2024-01-01 10:00:00' },
        { id: 5, name: '服装鞋帽', description: '男女服装、鞋类、帽子', sort: 5, status: 1, createTime: '2024-01-01 10:00:00' },
        { id: 6, name: '美妆护肤', description: '化妆品、护肤品', sort: 6, status: 1, createTime: '2024-01-01 10:00:00' },
        { id: 7, name: '其他', description: '其他二手商品', sort: 99, status: 1, createTime: '2024-01-01 10:00:00' }
      ]
    },
    handleAdd() {
      this.dialogTitle = '新增分类'
      this.form = { id: null, name: '', parentId: 0, description: '', sort: 0, status: 1 }
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.dialogTitle = '编辑分类'
      this.form = { ...row }
      this.dialogVisible = true
    },
    handleStatus(row) {
      this.$confirm(`确认要${row.status === 1 ? '禁用' : '启用'}该分类吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.status = row.status === 1 ? 0 : 1
        this.$message.success('操作成功')
      })
    },
    handleDelete(row) {
      this.$confirm('确认要删除该分类吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.categoryList.findIndex(c => c.id === row.id)
        if (index > -1) {
          this.categoryList.splice(index, 1)
        }
        this.$message.success('删除成功')
      })
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.id) {
            const index = this.categoryList.findIndex(c => c.id === this.form.id)
            if (index > -1) {
              this.categoryList.splice(index, 1, { ...this.form })
            }
          } else {
            this.categoryList.push({
              ...this.form,
              id: Date.now(),
              createTime: new Date().toLocaleString()
            })
          }
          this.dialogVisible = false
          this.$message.success('保存成功')
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
.secondhand-category-container {
  padding: 20px;
}
</style>
