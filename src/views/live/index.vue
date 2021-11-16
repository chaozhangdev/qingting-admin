<template>
  <div class="app-container">
    <el-card>
      <div slot="header">正在直播</div>
      <el-table ref="multipleTable" v-loading="loading" tooltip-effect="dark" :data="list" style="width: 100%;" stripe>
        <el-table-column align="left" label="ID" width="80">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="发布用户" width="120">
          <template slot-scope="scope">
            {{ scope.row.username }}<br>
            {{ scope.row.phone }}<br>
            {{ scope.row.email }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="标题">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="预览图" width="200">
          <template slot-scope="scope">
            <el-popover placement="right" title="" trigger="hover">
              <img :src="scope.row.thumb" style="max-height: 200px">
              <img slot="reference" :src="scope.row.thumb" :alt="scope.row.thumb" style="max-height: 80px; max-width: 80px">
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="center" label="开播时间" width="200">
          <template slot-scope="scope">
            {{ scope.row.updated_at }}
          </template>
        </el-table-column>
      </el-table>
      <el-button class="el-pl" plain style="margin-left: 0px;" type="default" @click="firstPage()">
        第一页
      </el-button>
      <el-button class="el-pl" plain style="margin-left: 0px;" type="default" @click="perPage()">
        上一页
      </el-button>
      <el-button class="el-pl" plain style="margin-left: 0px;" type="default" @click="nextPage()">
        下一页
      </el-button>
      <el-button class="el-pl" plain style="margin-left: 0px;" type="default" @click="lastPage()">
        最后一页
      </el-button>
    </el-card>
  </div>
</template>

<script>
import { getDatas } from '@/api/live'

export default {
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      total_page: 0,
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loading = true
      const res = await getDatas(this.listQuery)
      this.list = res.data.data
      this.total = res.data.total
      this.total_page = res.data.total_page
      this.listQuery.page = res.data.current_page
      this.loading = false
    },
    firstPage() {
      this.listQuery.page = 1
      this.getList()
    },
    perPage() {
      if (this.listQuery.page > 1) {
        this.listQuery.page--
        this.getList()
      }
    },
    nextPage() {
      if (this.listQuery.page < this.total_page) {
        this.listQuery.page++
        this.getList()
      }
    },
    lastPage() {
      this.listQuery.page = this.total_page
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
