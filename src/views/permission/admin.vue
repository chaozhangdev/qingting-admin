<template>
  <div class="app-container">
    <el-card>
      <div slot="header">管理员列表</div>
      <el-form :inline="true">
        <div class="filter-container">
          <el-input v-model="listQuery.keyword" placeholder="用户名/手机号/邮箱" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
          <el-button class="filter-item" style="margin-left: 0px;" type="success" icon="el-icon-edit" @click="handleCreate">
            新增
          </el-button>
        </div>
      </el-form>
      <el-table v-loading="loading" :data="list" style="width: 100%;" stripe>
        <el-table-column align="left" label="ID" width="100">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="用户名">
          <template slot-scope="scope">
            {{ scope.row.username }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="手机号">
          <template slot-scope="scope">
            {{ scope.row.phone }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="邮箱">
          <template slot-scope="scope">
            {{ scope.row.email }}
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
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑用户':'新增用户'">
      <el-form :model="data" label-width="140px">
        <el-form-item label="用户名">
          <el-input v-model="data.username" placeholder="用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="data.password" placeholder="密码" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="data.phone" placeholder="手机号" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="data.email" placeholder="邮箱" />
        </el-form-item>
        <el-form-item label="所属角色">
          <el-checkbox-group v-model="checkedRoles" @change="handleCheckedChange">
            <el-checkbox v-for="role in rolesList" :key="role.name" :label="role.name" :value="role.name">{{ role.name }}</el-checkbox>
          </el-checkbox-group>
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
import { getDatas, addData, deleteData, updateData } from '@/api/admin'
import { getRoles } from '@/api/role'

const defaultData = {
  id: '',
  username: '',
  password: '',
  phone: '',
  email: '',
  roles: []
}

export default {
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        keyword: ''
      },
      data: Object.assign({}, defaultData),
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      rolesList: [],
      checkedRoles: []
    }
  },
  created() {
    this.getList()
    this.getRoles()
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
    async getRoles() {
      const res = await getRoles()
      this.rolesList = res.data.data
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCheckedChange(val) {
      this.data.roles = val
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
      this.checkedRoles = []
      this.data = Object.assign({}, defaultData)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.data = deepClone(scope.row)
      this.checkedRoles = this.data.roles
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
          this.list.splice($index, 1)
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
        .catch(err => { console.error(err) })
    },
    async confirmData() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        await updateData(this.data.id, this.data)
        for (let index = 0; index < this.list.length; index++) {
          if (this.list[index].id === this.data.id) {
            this.list.splice(index, 1, Object.assign({}, this.data))
            break
          }
        }
      } else {
        await addData(this.data)
        this.getList()
      }
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
</style>
