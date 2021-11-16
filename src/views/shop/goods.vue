<template>
  <div class="app-container">
    <el-card>
      <div slot="header">商品列表</div>
      <el-form :inline="true">
        <div class="filter-container">
          <el-select v-model="listQuery.status" placeholder="全部" clearable style="width: 90px" class="filter-item">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select v-model="listQuery.type" placeholder="全部" clearable style="width: 120px" class="filter-item">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
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
        <el-table-column align="center" label="商品名称" width="200">
          <template slot-scope="scope">
            {{ scope.row.goods_name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="预览图">
          <template slot-scope="scope">
            <el-popover placement="right" title="" trigger="hover">
              <img :src="scope.row.thumb_url" style="max-height: 200px">
              <img slot="reference" :src="scope.row.thumb_url" :alt="scope.row.thumb_url" style="max-height: 80px; max-width: 80px">
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="center" label="价格" width="120">
          <template slot-scope="scope">
            {{ scope.row.price }}
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
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑商品':'新增商品'">
      <el-form :model="data" label-width="140px">
        <el-form-item label="分类">
          <el-select v-model="data.type" placeholder="全部" clearable style="width: 200px" class="filter-item">
            <el-option v-for="(item,index) in typeOptions" :key="parseInt(index)" :label="item" :value="parseInt(index)" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="data.goods_name" placeholder="商品名称" />
        </el-form-item>
        <el-form-item label="预览图">
          <el-upload
            ref="upload"
            class="avatar-uploader"
            :action="upAction"
            :headers="upHeaders"
            :limit="1"
            :show-file-list="false"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
          >
            <img v-if="imgUrl" :src="imgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="data.price" placeholder="价格" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="data.content" type="textarea" :autosize="{ minRows: 5, maxRows: 20}" placeholder="" />
        </el-form-item>
        <el-form-item label="打开方式">
          <el-select v-model="data.open_type" placeholder="全部" clearable style="width: 200px" class="filter-item">
            <el-option v-for="item in openTypeOptions" :key="parseInt(item.value)" :label="item.label" :value="parseInt(item.value)" />
          </el-select>
        </el-form-item>
        <el-form-item label="外链">
          <el-input v-model="data.out_url" placeholder="外链" />
        </el-form-item>
        <el-form-item label="购买数">
          <el-input v-model="data.buy_num" placeholder="购买数" />
        </el-form-item>
        <el-form-item label="浏览量">
          <el-input v-model="data.view_num" placeholder="浏览量" />
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
import { getDatas, addData, deleteData, updateData, batchDisable,getTypeOptions } from '@/api/goods'
import { getToken } from '../../utils/auth'

const defaultData = {
  id: '',
  type: '',
  goods_name: '',
  thumb: '',
  price: '',
  images: '',
  content: '',
  open_type: '',
  out_url: '',
  buy_num: '',
  view_num: '',
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
      openTypeOptions: [
        {
          value: '1',
          label: '外链跳转'
        }
      ],
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
      imgUrl: '',
      upAction: process.env.VUE_APP_BASE_API + '/upload',
      upHeaders: {
        Authorization: getToken()
      },
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false
    }
  },
  created() {
    this.getList()
    this.handleTypeOptions()
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
    async handleTypeOptions() {
      const res = await getTypeOptions()
      if (res.code === 200) {
        this.typeOptions = res.data
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
      this.imgUrl = this.data.thumb_url
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
        this.data.thumb = res.data.img_url
        this.imgUrl = URL.createObjectURL(file.raw)
      } else {
        this.$message({
          type: 'error',
          message: res.msg
        })
      }
      this.$refs['upload'].clearFiles()
    },
    beforeUpload(file) {
      return true
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
