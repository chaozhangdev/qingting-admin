<template>
  <div class="app-container">
    <el-card>
      <div slot="header">账变记录</div>
      <el-form :inline="true">
        <div class="filter-container">
          <el-input v-model="listQuery.keyword" placeholder="用户ID（用户名/手机号/邮箱）" style="width: 300px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
        <el-table-column align="center" label="账号(用户名/手机号/邮箱)">
          <template slot-scope="scope">
            {{ scope.row.username }}/
            {{ scope.row.phone }}/
            {{ scope.row.email }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="类型">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type == 1" type="success" size="mini">余额</el-tag>
            <el-tag v-else-if="scope.row.type == 2" type="info" size="mini">积分</el-tag>
            <el-tag v-else type="warning" size="mini">金币</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="余额">
          <template slot-scope="scope">
            {{ scope.row.amount }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="积分">
          <template slot-scope="scope">
            {{ scope.row.integral }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="金币">
          <template slot-scope="scope">
            {{ scope.row.gold }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="50">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 1" type="success" size="mini">增加</el-tag>
            <el-tag v-else type="danger" size="mini">扣除</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="提交时间">
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
import { accountLog } from '@/api/users'

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
      const res = await accountLog(this.listQuery)
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
