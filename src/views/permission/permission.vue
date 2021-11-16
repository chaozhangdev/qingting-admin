<template>
  <div class="app-container">
    <el-card>
      <div slot="header">权限列表</div>
      <el-form :inline="true">
        <div class="filter-container">
          <el-button class="filter-item" style="margin-left: 0px;" type="success" icon="el-icon-edit" @click="handleCreate">
            新增
          </el-button>
        </div>
      </el-form>
      <el-table ref="multipleTable" v-loading="loading" tooltip-effect="dark" :data="list" style="width: 100%;" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" stripe @selection-change="handleSelectionChange">
        <el-table-column align="left" label="ID" width="100">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="权限名称">
          <template slot-scope="scope">
            {{ scope.row.title }}<br>
          </template>
        </el-table-column>
        <el-table-column align="center" label="权限路由" width="200">
          <template slot-scope="scope">
            {{ scope.row.name }}<br>
          </template>
        </el-table-column>
        <el-table-column align="center" label="排序" width="120">
          <template slot-scope="scope">
            {{ scope.row.sort }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.created_at }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope)">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        prev-text="上一页"
        next-text="下一页"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 50, 100, 200]"
        :page-size="10"
        :current-page="listQuery.page"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </el-card>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑权限':'新增权限'">
      <el-form :model="data" label-width="140px">
        <el-form-item label="父级">
          <el-select v-model="data.pid" placeholder="请选择父级" clearable class="filter-item">
            <el-option v-for="item in parentOptions" :key="item.id" :label="item.title + item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="权限名称">
          <el-input v-model="data.title" placeholder="权限名称" />
        </el-form-item>
        <el-form-item label="权限路由">
          <el-input v-model="data.name" placeholder="权限路由" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="data.sort" placeholder="排序（越小排序靠前）" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" size="small" @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" size="small" @click="confirmData">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getDatas, addData, deleteData, updateData, getParentOptions } from '@/api/permission'

const defaultData = {
  id: '',
  title: '',
  name: '',
  pid: '',
  sort: ''
}

export default {
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      parentOptions: [],
      listQuery: {
        page: 1,
        limit: 10,
        status: ''
      },
      batch: {
        selection: [],
        status: 1
      },
      data: Object.assign({}, defaultData),
      dialogVisible: false,
      dialogType: 'new'
    }
  },
  created() {
    this.getList()
    this.handleParentOptions()
  },
  methods: {
    async getList() {
      this.loading = true
      const res = await getDatas(this.listQuery)
      this.list = res.data.data
      this.total = res.data.total
      this.listQuery.page = res.data.current_page
      this.loading = false
    },
    async handleParentOptions() {
      const res = await getParentOptions()
      if (res.code === 200) {
        this.parentOptions = res.data
      }
    },
    handleSelectionChange(obj) {
      this.batch.selection = []
      obj.forEach(item => {
        this.batch.selection.push(item.id)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleCreate() {
      this.imgUrl = ''
      this.data = Object.assign({}, defaultData)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.data = deepClone(scope.row)
      this.imgUrl = this.data.icon2
      if (this.data.pid === 0) {
        this.data.pid = ''
      }
      this.$nextTick(() => {
        this.checkStrictly = false
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('确定删除该条数据?', '警告', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      })
        .then(async() => {
          await deleteData(row.id)
          this.getList()
          this.$message({
            type: 'success',
            message: '禁用成功'
          })
        })
        .catch(err => { console.error(err) })
    },
    async confirmData() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        await updateData(this.data.id, this.data)
      } else {
        await addData(this.data)
      }
      this.getList()
      this.dialogVisible = false
      this.$message({
        type: 'success',
        message: '保存成功'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .permission-tree {
    margin-bottom: 30px;
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
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
