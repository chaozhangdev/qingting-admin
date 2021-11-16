<template>
  <div class="app-container">
    <el-card>
      <div slot="header">卡密列表</div>
      <el-form :inline="true">
        <div class="filter-container">
          <el-select v-model="listQuery.status" placeholder="全部" clearable style="width: 90px" class="filter-item">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-form-item label="兑换账户">
            <el-select v-model="listQuery.account_type" clearable placeholder="请选择">
              <el-option v-for="(item,index) in accountOption" :key="index" :label="item" :value="index" />
            </el-select>
          </el-form-item>
          <el-form-item label="卡密">
            <el-input v-model="listQuery.code" placeholder="卡密" style="width: 300px;" />
          </el-form-item>
          <el-form-item label="领取人user_id">
            <el-input v-model="listQuery.get_user_id" placeholder="领取人user_id" />
          </el-form-item>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
          <el-button class="filter-item" style="margin-left: 0px;" type="success" icon="el-icon-edit" @click="handleCreate">
            批量生成
          </el-button>
          <el-button class="filter-item" style="float: right" type="warning" icon="el-icon-download" @click="handleExport">
            导出Execl
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
        <el-table-column align="center" label="卡密" width="200">
          <template slot-scope="scope">
            {{ scope.row.code }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="兑换账户类型" width="120">
          <template slot-scope="scope">
            {{ accountOption[scope.row.account_type] }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="兑换额度" width="120">
          <template slot-scope="scope">
            {{ scope.row.amount }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="过期时间" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.over_time">{{ scope.row.over_time }}</span>
            <span v-else>永不过期</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="领取人uid" width="120">
          <template slot-scope="scope">
            {{ scope.row.get_username }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="领取时间" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.get_time">{{ scope.row.get_time }}</span>
            <span v-else>未领取</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.created_at }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="70">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 2" type="primary" size="mini">已用</el-tag>
            <el-tag v-if="scope.row.status == 1" type="success" size="mini">可用</el-tag>
            <el-tag v-else-if="scope.row.status == 0" type="warning" size="mini">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
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
    <el-dialog :visible.sync="dialogVisible" title="批量生成卡密">
      <el-form :model="data" label-width="140px">
        <el-form-item label="卡密数量">
          <el-input-number v-model="data.num" :min="1" :max="500" placeholder="一次最大500" />
        </el-form-item>
        <el-form-item label="兑换账户">
          <el-select v-model="data.account_type" placeholder="请选择">
            <el-option v-for="(item,index) in accountOption" :key="index" :label="item" :value="index" />
          </el-select>
        </el-form-item>
        <el-form-item label="兑换额度">
          <el-input v-model="data.amount" placeholder="兑换金额" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="兑换过期时间">
          <el-date-picker v-model="data.over_time" type="date" value-format="yyyy-MM-dd" placeholder="空为不过期" />
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
import { deepClone, parseTime } from '@/utils'
import { getDatas, addData, deleteData, batchDisable } from '@/api/cipher'
import { accountType } from '@/api/users'
import { export_json_to_excel } from '@/vendor/Export2Excel'

const defaultData = {
  id: '',
  user_id: '',
  code: '',
  account_type: '',
  amount: '',
  over_time: '',
  get_user_id: '',
  get_time: ''
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
          label: '可用'
        }, {
          value: '2',
          label: '已用'
        }
      ],
      accountOption: [],
      listQuery: {
        page: 1,
        limit: 10,
        status: '1',
        code: '',
        get_user_id: '',
        export: 0
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
      const res = await accountType({})
      this.accountOption = res.data
    },
    async getList() {
      this.loading = true
      this.listQuery.export = 0
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
        await addData(this.data)
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
    async handleExport() {
      this.loading = true
      const tHeader = ['卡密']
      const filterVal = ['code']
      this.listQuery.export = 1
      const res = await getDatas(this.listQuery)
      const list = res.data
      console.log(res.data)
      const data = this.formatJson(filterVal, list)
      export_json_to_excel({
        header: tHeader,
        data,
        filename: '卡密文件',
        autoWidth: true,
        bookType: 'xlsx'
      })
      this.loading = false
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
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
