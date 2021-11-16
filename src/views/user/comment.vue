<template>
  <div class="app-container">
    <el-card>
      <div slot="header">评论列表</div>
      <el-form :inline="true">
        <div class="filter-container">
          <el-select v-model="listQuery.status" placeholder="全部" clearable style="width: 90px" class="filter-item">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select v-model="listQuery.type" placeholder="全部" clearable style="width: 90px" class="filter-item">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-input v-model="listQuery.keyword" placeholder="用户名/手机号/邮箱" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
        </div>
      </el-form>
      <el-table ref="multipleTable" v-loading="loading" tooltip-effect="dark" :data="list" style="width: 100%;" stripe @selection-change="handleSelectionChange">
        <el-table-column align="left" type="selection" width="50" />
        <el-table-column align="left" label="ID" width="60">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="用户名/手机号/邮箱" width="200">
          <template slot-scope="scope">
            {{ scope.row.username }}<br>
            {{ scope.row.phone }}<br>
            {{ scope.row.email }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="评论分类" width="100">
          <template slot-scope="scope">
            {{ scope.row.type_str }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="评论对象ID" width="120">
          <template slot-scope="scope">
            {{ scope.row.vid }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="评论内容">
          <template slot-scope="scope">
            {{ scope.row.content }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.created_at }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="70">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 2" type="success" size="mini">审核通过</el-tag>
            <el-tag v-else-if="scope.row.status == 1" type="warning" size="mini">待审核</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope)">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button class="el-pl" plain size="mini" style="margin-left: 0px;" type="success" @click="handleBatchDisable(2)">
        批量审核
      </el-button>
      <el-button class="el-pl" plain size="mini" style="margin-left: 0px;" type="warning" @click="handleBatchDisable(0)">
        批量删除
      </el-button>
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
        <el-form-item label="评论内容">
          <el-input v-model="data.content" type="textarea" :autosize="{ minRows: 2, maxRows: 10}" placeholder="" />
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
import { getDatas, addData, deleteData, updateData, batchDisable } from '@/api/comment'

const defaultData = {
  id: '',
  content: ''
}

export default {
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      statusOptions: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '1',
          label: '待审核'
        }, {
          value: '2',
          label: '审核通过'
        }
      ],
      typeOptions: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '1',
          label: '短视频'
        },
        {
          value: '2',
          label: '图文'
        },
        {
          value: '3',
          label: '直播'
        }
      ],
      listQuery: {
        page: 1,
        limit: 10,
        keyword: '',
        type: '',
        order: 'DESC'
      },
      batch: {
        selection: [],
        status: 1
      },
      data: Object.assign({}, defaultData),
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false
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
      this.listQuery.page = res.data.current_page
      this.loading = false
    },
    async handleBatchDisable(status) {
      if (this.batch.selection.length <= 0) {
        this.$message({
          type: 'error',
          message: '至少选中一个选项'
        })
        return
      }
      this.batch.status = status
      await batchDisable(this.batch)
      this.getList()
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
      this.data = Object.assign({}, defaultData)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.data = deepClone(scope.row)
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
