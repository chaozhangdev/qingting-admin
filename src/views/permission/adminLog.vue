<template>
  <div class="app-container">
    <el-card>
      <div slot="header">管理员日志</div>
      <el-form :inline="true">
        <div class="filter-container">
          <el-input v-model="listQuery.keyword" placeholder="操作用户ID（用户名/手机号/邮箱）" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
        </div>
      </el-form>
      <el-table ref="multipleTable" v-loading="loading" tooltip-effect="dark" :data="list" style="width: 100%;" stripe>
        <el-table-column align="left" type="selection" width="50" />
        <el-table-column align="left" label="ID" width="80">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作账号" width="120">
          <template slot-scope="scope">
            {{ scope.row.username }}<br>
            {{ scope.row.phone }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="code" width="80">
          <template slot-scope="scope">
            {{ scope.row.code }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="msg" width="100">
          <template slot-scope="scope">
            {{ scope.row.msg }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="requests">
          <template slot-scope="scope">
            {{ scope.row.requests }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="action">
          <template slot-scope="scope">
            {{ scope.row.action }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="IP" width="120">
          <template slot-scope="scope">
            {{ scope.row.ip }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="时间" width="160">
          <template slot-scope="scope">
            {{ scope.row.created_at }}
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
  </div>
</template>

<script>
import { adminLog } from '@/api/admin'

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
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loading = true
      const res = await adminLog(this.listQuery)
      this.list = res.data.data
      this.total = res.data.total
      this.listQuery.page = res.data.current_page
      this.loading = false
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
