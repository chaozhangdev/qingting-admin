<template>
  <div class="app-container">
    <el-card>
      <div slot="header">角色管理</div>
      <el-form :inline="true">
        <el-button type="success" size="small" @click="handleAddData">新增</el-button>
      </el-form>
      <el-table v-loading="loading" :data="list" style="width: 100%;" stripe>
        <el-table-column align="left" label="ID" width="100">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="角色名称" width="220">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="描述">
          <template slot-scope="scope">
            {{ scope.row.description }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope)">编 辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope)">删 除</el-button>
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
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑角色':'新增角色'">
      <el-form :model="data" label-width="140px">
        <el-form-item label="角色名称">
          <el-input v-model="data.name" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input
            v-model="data.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="角色描述"
          />
        </el-form-item>
        <el-form-item label="权限分配">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            class="permission-tree"
            @check-change="handleCheckChange"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" size="small" @click="handleCancel">取 消</el-button>
        <el-button type="primary" size="small" @click="confirmData">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getDatas, addData, deleteData, updateData } from '@/api/role'
import { getRoutes } from '@/api/permission'

const defaultData = {
  id: '',
  name: '',
  description: '',
  routes: []
}

export default {
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      data: Object.assign({}, defaultData),
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      routes: [],
      routesData: []
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    this.getRoutes()
    this.getList()
  },
  methods: {
    async getList() {
      this.loading = true
      const res = await getDatas(this.page, this.limit)
      this.list = res.data.data
      this.total = res.data.total
      this.listQuery.page = res.data.current_page
      this.loading = false
    },
    async getRoutes() {
      const res = await getRoutes(this.page, this.limit)
      this.routesData = res.data
      this.loading = false
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleAddData() {
      this.data = Object.assign({}, defaultData)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleCancel() {
      this.getRoutes()
      this.routes = []
      this.dialogVisible = false
      this.routes = []
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.data = deepClone(scope.row)
      this.routes = []
      this.routes = this.data.routes
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(this.routes)
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
          this.list.splice($index, 1)
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
        .catch(err => { console.error(err) })
    },
    async confirmData() {
      this.data.routes = this.routes
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        await updateData(this.data.id, this.data)
      } else {
        await addData(this.data)
      }
      this.getRoutes()
      this.getList()
      this.routes = []
      this.dialogVisible = false
      this.$message({
        type: 'success',
        message: '保存成功'
      })
    },
    handleCheckChange(data, checked, indeterminate) {
      if (checked) {
        this.routes.push(data.id)
      } else {
        this.delRoute(data.id)
      }
    },
    delRoute(i) {
      const index = this.routes.indexOf(i)
      this.routes.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
