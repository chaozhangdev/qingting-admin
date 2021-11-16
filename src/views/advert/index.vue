<template>
  <div class="app-container">
    <el-card>
      <div slot="header">广告列表</div>
      <el-form :inline="true">
        <div class="filter-container">
          <el-select v-model="listQuery.status" placeholder="全部" clearable style="width: 90px" class="filter-item">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select v-model="listQuery.type" placeholder="全部" clearable style="width: 140px" class="filter-item">
            <el-option v-for="(item, index) in typeOptions" :key="item" :label="item" :value="index" />
          </el-select>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
          <el-button class="filter-item" style="margin-left: 0px;" type="success" icon="el-icon-edit" @click="handleCreate">
            新增
          </el-button>
        </div>
      </el-form>
      <el-table ref="multipleTable" v-loading="loading" tooltip-effect="dark" :data="list" style="width: 100%;" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" stripe @selection-change="handleSelectionChange">
        <el-table-column align="left" type="selection" width="50" />
        <el-table-column align="left" label="ID" width="60">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="分类" width="80">
          <template slot-scope="scope">
            {{ typeOptions[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="推广商" width="100">
          <template slot-scope="scope">
            {{ scope.row.provider_name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="广告标题" width="140">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="广告图片" width="100">
          <template slot-scope="scope">
            <el-popover placement="right" title="" trigger="hover">
              <img :src="scope.row.img_url2" style="max-height: 200px">
              <img slot="reference" :src="scope.row.img_url2" :alt="scope.row.img_url2" style="max-height: 80px; max-width: 80px">
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="center" label="广告视频">
          <template slot-scope="scope">
            <el-link v-if="scope.row.video_url2" :href="scope.row.video_url2" target="_blank" type="primary">查看视频</el-link>
          </template>
        </el-table-column>
        <el-table-column align="center" label="跳转链接">
          <template slot-scope="scope">
            <el-link v-if="scope.row.add_url2" :href="scope.row.add_url2" target="_blank" type="primary">查看链接</el-link>
          </template>
        </el-table-column>
        <el-table-column align="center" label="到期时间" width="120">
          <template slot-scope="scope">
            {{ scope.row.end_time }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="浏览量" width="80">
          <template slot-scope="scope">
            {{ scope.row.view_num }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="排序" width="60">
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
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑广告':'新增广告'">
      <el-form :model="data" label-width="140px">
        <el-form-item label="分类">
          <el-select v-model="data.type" placeholder="全部" clearable style="width: 200px" class="filter-item">
            <el-option v-for="(item, index) in typeOptions" :key="parseInt(index)" :label="item" :value="parseInt(index)" />
          </el-select>
        </el-form-item>
        <el-form-item label="推广商">
          <el-input v-model="data.provider_name" placeholder="推广商名称" />
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="data.title" placeholder="推广商名称" />
        </el-form-item>
        <el-form-item label="广告图片">
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
        <el-form-item label="广告图地址">
          <el-input v-model="data.thumb_url_full" placeholder="广告图地址优先" />
        </el-form-item>
        <el-form-item label="广告视频">
          <el-upload
            ref="uploadVideo"
            class="upload-demo"
            :action="upVideoAction"
            :headers="upHeaders"
            :on-remove="handleVideoRemove"
            :file-list="fileList"
            list-type="picture"
            :limit="1"
            :on-success="handleVideoSuccess"
            :before-upload="beforeVideoUpload"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传MP4文件，且不超过10M</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="广告视频地址">
          <el-input v-model="data.video_url_full" placeholder="视频地址优先" />
        </el-form-item>
        <el-form-item label="广告链接">
          <el-input v-model="data.ad_url" placeholder="广告链接" />
        </el-form-item>
        <el-form-item label="广告打开方式">
          <el-select v-model="data.open_type" placeholder="全部" style="width: 200px" class="filter-item">
            <el-option v-for="item in openTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="广告到期时间">
          <el-date-picker v-model="data.end_time" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="广告描述">
          <el-input
            v-model="data.desc"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="广告描述"
          />
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
import { getDatas, addData, deleteData, updateData, batchDisable, getTypeOptions } from '@/api/advert'
import { getToken } from '../../utils/auth'

const defaultData = {
  id: '',
  type: '',
  title: '',
  provider_name: '',
  img_url: '',
  video_url: '',
  ad_url: '',
  desc: '',
  open_type: '',
  end_time: '',
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
      openTypeOptions: [
        {
          value: 1,
          label: '直接下载'
        }, {
          value: 2,
          label: '浏览器打开'
        }
      ],
      typeOptions: [],
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
      fileList: [],
      upAction: process.env.VUE_APP_BASE_API + '/upload',
      upVideoAction: process.env.VUE_APP_BASE_API + '/uploadVideo',
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
      this.imgUrl = this.data.img_url2
      this.fileList = []
      if (this.data.video_url2) {
        this.fileList.push({
          name: '视频',
          url: this.data.img_url2
        })
      }
      if (this.data.type === 0) {
        this.data.type = ''
      }
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
        this.data.img_url = res.data.img_url
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
    },
    beforeVideoUpload(file) {
      return true
    },
    handleVideoRemove(file, fileList) {
      this.fileList = []
      this.data.video_url = ''
    },
    handleVideoSuccess(res, file) {
      if (res.code === 200) {
        this.data.video_url = res.data.video_url
        this.fileList.push({
          name: res.data.name,
          url: res.data.img_url
        })
      } else {
        this.$message({
          type: 'error',
          message: res.msg
        })
      }
      this.$refs['uploadVideo'].clearFiles()
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
