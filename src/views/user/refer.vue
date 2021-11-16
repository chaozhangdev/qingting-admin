<template>
  <div class="app-container">
    <el-card>
      <div slot="header">推广列表</div>
      <el-form :inline="true">
        <div class="filter-container">
          <el-input v-model="listQuery.keyword" placeholder="推荐人用户ID（用户名/手机号/邮箱）" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
        <el-table-column align="center" label="推荐人(用户名/手机号/邮箱)">
          <template slot-scope="scope">
            {{ scope.row.refer_username }}/
            {{ scope.row.refer_phone }}/
            {{ scope.row.refer_email }}
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
        <el-table-column align="center" label="昵称">
          <template slot-scope="scope">
            {{ scope.row.nickname }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="50">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 1" type="success" size="mini">正常</el-tag>
            <el-tag v-else type="danger" size="mini">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="注册时间">
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
import { refer } from '@/api/users'

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
      const res = await refer(this.listQuery)
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
