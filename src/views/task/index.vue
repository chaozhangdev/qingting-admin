<template>
  <div class="app-container">
    <el-card>
      <div slot="header">任务列表</div>
      <el-form :inline="true">
        <div class="filter-container">
          <el-select v-model="listQuery.status" placeholder="全部" clearable style="width: 90px" class="filter-item">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select v-model="listQuery.type" placeholder="全部" clearable style="width: 120px" class="filter-item">
            <el-option v-for="item in typeOptions" :key="item.name" :label="item.title" :value="item.name" />
          </el-select>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
          <el-button class="filter-item" style="margin-left: 0px;" type="success" icon="el-icon-edit" @click="handleCreate">
            新增
          </el-button>
        </div>
      </el-form>
      <el-table ref="multipleTable" v-loading="loading" tooltip-effect="dark" :data="list" style="width: 100%;" row-key="id" stripe @selection-change="handleSelectionChange">
        <el-table-column align="left" type="selection" width="50" />
        <el-table-column align="left" label="ID" width="60">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="任务类型" width="120">
          <template slot-scope="scope">
            {{ scope.row.type_str }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="任务名">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="任务标识" width="200">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="完成任务需求量" width="200">
          <template slot-scope="scope">
            {{ scope.row.need_num }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="完成任务获得积分" width="200">
          <template slot-scope="scope">
            {{ scope.row.integral }}
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
        <el-table-column align="center" label="状态" width="70">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 1" type="success" size="mini">正常</el-tag>
            <el-tag v-else-if="scope.row.status == 0" type="warning" size="mini">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope)">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope)">禁用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button class="el-pl" plain size="mini" style="margin-left: 0px;" type="success" @click="handleBatchDisable(1)">
        批量启用
      </el-button>
      <el-button class="el-pl" plain size="mini" style="margin-left: 0px;" type="warning" @click="handleBatchDisable(0)">
        批量禁用
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
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑':'新增'">
      <el-form :model="data" label-width="140px">
        <el-form-item label="分类">
          <el-select v-model="data.type" placeholder="全部" clearable style="width: 200px" class="filter-item" @change="changeType">
            <el-option v-for="item in typeOptions" :key="item.name" :label="item.title" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="绑定任务">
          <el-select v-model="data.name" placeholder="全部" clearable style="width: 200px" class="filter-item">
            <el-option v-for="item in taskOptions" :key="item.name" :label="item.title" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务名">
          <el-input v-model="data.title" placeholder="任务名" />
        </el-form-item>
        <el-form-item label="完成任务需求量">
          <el-input v-model="data.need_num" placeholder="完成任务需求量" />
        </el-form-item>
        <el-form-item label="完成任务获得积分">
          <el-input v-model="data.integral" placeholder="完成任务获得积分" />
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
import { getDatas, addData, deleteData, updateData, batchDisable, getInit } from '@/api/task'

const defaultData = {
  id: '',
  type: '',
  name: '',
  price: '',
  title: '',
  need_num: '',
  integral: '',
  sort: ''
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
          value: '0',
          label: '禁用'
        }, {
          value: '1',
          label: '正常'
        }
      ],
      typeOptions: [],
      taskOptions: [],
      dailyTask: [],
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
      dialogType: 'new',
      checkStrictly: false
    }
  },
  created() {
    this.getInit()
    this.getList()
  },
  methods: {
    async getInit() {
      const res = await getInit()
      this.typeOptions = res.data.TASK_TYPE
      this.dailyTask = res.data.DAILY_TASK
    },
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
    changeType(val) {
      if (val === 'DAILY_TASK') {
        this.taskOptions = this.dailyTask
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
      this.$nextTick(() => {
        this.checkStrictly = false
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('确定禁用该条数据?', '警告', {
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
    },
    handleSuccess(res, file) {
      if (res.code === 200) {
        this.data.icon = res.data.img_url
        this.imgUrl = URL.createObjectURL(file.raw)
      } else {
        this.$message({
          type: 'error',
          message: res.msg
        })
      }
      this.$refs['upload'].clearFiles()
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
