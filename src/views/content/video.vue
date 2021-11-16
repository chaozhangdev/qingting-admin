<template>
  <div class="app-container">
    <el-card>
      <div slot="header">视频列表</div>
      <el-form :inline="true">
        <div class="filter-container">
          <el-cascader v-model="listQuery.category_id" :options="categoryOptions" :props="{ checkStrictly: true, emitPath: false, label:'name', value:'id'}" style="float:left;" clearable placeholder="请选择分类" />
          <el-input v-model="listQuery.username" placeholder="用户ID/手机号/邮箱" style="width: 240px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-input v-model="listQuery.keyword" placeholder="关键字" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-select v-model="listQuery.status" placeholder="全部" clearable style="width: 90px" class="filter-item">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
          <el-button class="filter-item" style="margin-left: 0px;" type="success" icon="el-icon-edit" @click="handleCreate">
            新增
          </el-button>
        </div>
      </el-form>
      <el-table ref="multipleTable" v-loading="loading" tooltip-effect="dark" :data="list" style="width: 100%;" stripe @selection-change="handleSelectionChange">
        <el-table-column align="left" type="selection" width="50" />
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
        <el-table-column align="center" label="分类" width="100">
          <template slot-scope="scope">
            {{ scope.row.category_name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="标题">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="预览图" width="80">
          <template slot-scope="scope">
            <el-popover placement="right" title="" trigger="hover">
              <img :src="scope.row.thumb2" style="max-height: 200px">
              <img slot="reference" :src="scope.row.thumb2" :alt="scope.row.thumb2" style="max-height: 80px; max-width: 80px">
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="center" label="视频链接" width="80">
          <template slot-scope="scope">
            <el-link v-if="scope.row.video_url2" :href="scope.row.video_url2" target="_blank" type="primary">查看视频</el-link>
          </template>
        </el-table-column>
        <el-table-column align="center" label="发布时间" width="100">
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
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑视频':'新增视频'">
      <el-form v-loading="loadingForm" :model="data" label-width="140px">
        <el-form-item label="发布用户ID">
          <el-input v-model="data.user_id" placeholder="发布用户ID" />
        </el-form-item>
        <el-form-item label="分类" style="width: 400px;">
          <el-cascader v-model="data.category_id" :options="categoryOptions" :props="{ checkStrictly: true, emitPath: false, label:'name', value:'id'}" style="float:left;" clearable placeholder="请选择分类" />
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="data.title" placeholder="标题" />
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
        <el-form-item label="预览图地址">
          <el-input v-model="data.thumb_url_full" placeholder="预览图地址优先" />
        </el-form-item>
        <el-form-item label="视频">
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
          </el-upload>
        </el-form-item>
        <el-form-item label="视频地址">
          <el-input v-model="data.video_url_full" placeholder="视频地址优先" />
        </el-form-item>
        <el-form-item label="短视频地址">
          <el-input v-model="data.short_video_url" placeholder="短视频地址" />
        </el-form-item>
        <el-form-item label="关联话题">
          <el-select v-model="data.topic_id" filterable placeholder="请选择话题" style="width: 400px;">
            <el-option v-for="item in topicOption" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="浏览量">
          <el-input v-model="data.view_num" placeholder="浏览量" />
        </el-form-item>
        <el-form-item label="点赞数">
          <el-input v-model="data.like_num" placeholder="点赞数" />
        </el-form-item>
        <el-form-item label="视频时长s">
          <el-input v-model="data.duration" placeholder="视频时长" />
        </el-form-item>
        <el-form-item label="视频标签">
          <el-input v-model="data.tags" placeholder="英文逗号分隔" />
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
import { getDatas, addData, deleteData, updateData, batchDisable } from '@/api/video'
import { getCategoryOptions } from '../../api/category'
import { getTopicList } from '../../api/topic'
import { getToken } from '../../utils/auth'

const defaultData = {
  id: '',
  user_id: '',
  category_id: '',
  topic_id: '',
  title: '',
  thumb: '',
  video_url: '',
  short_video_url: '',
  video_thumb_url: '',
  view_num: '',
  like_num: '',
  duration: '',
  tags: ''
}

export default {
  data() {
    return {
      loading: false,
      loadingForm: false,
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
      categoryOptions: [],
      topicOption: [],
      listQuery: {
        page: 1,
        limit: 10,
        keyword: '',
        username: '',
        category_id: '',
        status: ''
      },
      batch: {
        selection: [],
        status: 1
      },
      imgUrl: '',
      fileList: [],
      upAction: process.env.VUE_APP_BASE_API + '/upload',
      upVideoAction: process.env.VUE_APP_BASE_API + '/uploadVideo',
      upHeaders: {
        Authorization: getToken()
      },
      data: Object.assign({}, defaultData),
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false
    }
  },
  created() {
    this.getList()
    this.handleCategoryOptions()
    this.getTopic()
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
    async handleCategoryOptions() {
      const res = await getCategoryOptions()
      if (res.code === 200) {
        this.categoryOptions = res.data
      }
    },
    async getTopic() {
      const res = await getTopicList({
        page: 1,
        limit: 1000,
        status: 2
      })
      if (res.code === 200) {
        this.topicOption = res.data.data
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
      this.fileList = []
      this.data = Object.assign({}, defaultData)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.data = deepClone(scope.row)
      this.imgUrl = this.data.thumb2
      this.fileList = []
      this.fileList.push({
        name: '视频',
        url: this.data.thumb2
      })
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
          this.getList()
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
      } else {
        await addData(this.data)
      }
      this.getList()
      this.dialogVisible = false
      this.$message({
        type: 'success',
        message: '保存成功'
      })
      this.$refs['uploadVideo'].clearFiles()
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
      this.loadingForm = false
    },
    beforeUpload(file) {
      this.loadingForm = true
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
        this.data.video_thumb_url = res.data.img
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
