<template>
  <div class="app-container">
    <el-card>
      <div slot="header">影视列表</div>
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
        <el-table-column align="center" label="类别" width="100">
          <template slot-scope="scope">
            {{ typeOptions[scope.row.type].value }}
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
            <el-button type="text" size="mini" @click="handleDetail(scope)">管理视频</el-button>
            <el-button type="text" size="mini" @click="handleEdit(scope)">编辑</el-button>
            <el-button type="text" size="mini" @click="handleDelete(scope)">删除</el-button>
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
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑影视':'新增影视'" width="80%">
      <el-form v-loading="loadingForm" :model="data" label-width="140px">
        <el-form-item label="发布用户ID">
          <el-input v-model="data.user_id" placeholder="发布用户ID" />
        </el-form-item>
        <el-form-item label="分类" style="width: 400px;">
          <el-cascader v-model="data.category_id" :options="categoryOptions" :props="{ checkStrictly: true, emitPath: false, label:'name', value:'id'}" style="float:left;" clearable placeholder="请选择分类" />
        </el-form-item>
        <el-form-item label="类别" style="width: 400px;">
          <el-select v-model="data.type" placeholder="请选择">
            <el-option
              v-for="(item) in typeOptions"
              :key="item.value"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="地区" style="width: 400px;">
          <el-select v-model="data.region" placeholder="请选择">
            <el-option
              v-for="(item) in regionOptions"
              :key="item.value"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="年份" style="width: 400px;">
          <el-select v-model="data.year" placeholder="请选择">
            <el-option
              v-for="(item) in yearOptions"
              :key="item.value"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="data.title" placeholder="标题" />
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="data.subtitle" placeholder="副标题" />
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
        <el-form-item label="影视介绍">
          <el-input v-model="data.intro" type="textarea" placeholder="影视介绍" />
        </el-form-item>
        <el-form-item label="时长">
          <el-input v-model="data.duration" placeholder="时长" />
        </el-form-item>
        <el-form-item label="评分">
          <el-input v-model="data.score" placeholder="评分" />
        </el-form-item>
        <el-form-item label="上映时间">
          <el-input v-model="data.release_date" placeholder="上映时间" />
        </el-form-item>
        <el-form-item label="上映地点">
          <el-input v-model="data.release_address" placeholder="上映地点" />
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="data.tags" placeholder="标签" />
        </el-form-item>
        <el-form-item label="浏览量">
          <el-input v-model="data.view_num" placeholder="浏览量" />
        </el-form-item>
        <el-form-item label="点赞数">
          <el-input v-model="data.like_num" placeholder="点赞数" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" size="small" @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" size="small" @click="confirmData">确 认</el-button>
      </div>
    </el-dialog>

    <el-dialog title="视频管理" :visible.sync="dialogTableVisible" width="80%">
      <el-button class="filter-item" style="margin-left: 0px;" type="success" icon="el-icon-edit" @click="handleDetailCreate">
        新增
      </el-button>
      <el-table v-loading="loadingDetail" :data="detailList" width="100%">
        <el-table-column prop="id" label="ID" width="80">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="当前集" width="300">
          <template slot-scope="scope">
            {{ scope.row.sort }}
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="视频链接" width="200">
          <template slot-scope="scope">
            <el-link v-if="scope.row.url2" :href="scope.row.url2" target="_blank" type="primary">查看视频</el-link>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleDetailEdit(scope)">编辑</el-button>
            <el-button type="text" size="mini" @click="handleDetailDelete(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog :visible.sync="dialogDetailVisible" :title="dialogType==='edit'?'编辑':'新增'" width="60%">
      <el-form v-loading="loadingDetailForm" :model="detailListData" label-width="140px">
        <el-form-item label="标题">
          <el-input v-model="detailListData.title" placeholder="标题" />
        </el-form-item>
        <el-form-item label="当前集">
          <el-input v-model="detailListData.sort" placeholder="当前集（排序，越小越靠前，1开始）" />
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
          <el-input v-model="detailListData.url" placeholder="视频地址优先" />
        </el-form-item>
        <el-form-item label="介绍">
          <el-input v-model="detailListData.intro" type="textarea" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" size="small" @click="dialogDetailVisible=false">取 消</el-button>
        <el-button type="primary" size="small" @click="confirmDetailData">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getDatas, addData, deleteData, updateData, batchDisable, getTypeOptions } from '@/api/movie'
import { getDetailDatas, addDetailData, deleteDetailData, updateDetailData } from '@/api/movieDetail'
import { getCategoryOptions } from '../../api/movieCategory'
import { getToken } from '../../utils/auth'

const defaultData = {
  id: '',
  user_id: '',
  category_id: '',
  type: '',
  region: '',
  year: '',
  title: '',
  subtitle: '',
  thumb: '',
  url: '',
  thumb_url: '',
  intro: '',
  duration: '',
  score: '',
  releasee_date: '',
  release_address: '',
  tags: '',
  view_num: '',
  like_num: ''
}

export default {
  data() {
    return {
      loading: false,
      loadingDetail: false,
      loadingForm: false,
      loadingDetailForm: false,
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
      typeOptions: {},
      regionOptions: {},
      yearOptions: {},
      categoryOptions: [],
      listQuery: {
        page: 1,
        limit: 10,
        keyword: '',
        username: '',
        category_id: '',
        status: ''
      },
      listDetailQuery: {
        page: 1,
        limit: 10,
        movie_id: '',
        status: ''
      },
      batch: {
        selection: [],
        status: 1
      },
      batchDetail: {
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
      checkStrictly: false,
      detailData: {},
      detailList: [],
      detailListData: {},
      dialogTableVisible: false,
      dialogDetailVisible: false
    }
  },
  created() {
    this.getList()
    this.handleCategoryOptions()
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
    async handleCategoryOptions() {
      const res = await getCategoryOptions()
      if (res.code === 200) {
        this.categoryOptions = res.data
      }
    },
    async handleTypeOptions() {
      const res = await getTypeOptions()
      if (res.code === 200) {
        this.typeOptions = res.data.type_list
        this.regionOptions = res.data.region_list
        this.yearOptions = res.data.year_list
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
    handleDetail(row) {
      const that = this
      that.detailData = row.row
      that.getDetailList()
      that.dialogTableVisible = true
    },
    async getDetailList() {
      this.loadingDetail = true
      this.listDetailQuery.movie_id = this.detailData.id
      const res = await getDetailDatas(this.listDetailQuery)
      this.detailList = res.data
      this.listDetailQuery.page = res.data.current_page
      this.loadingDetail = false
    },
    handleDetailCreate() {
      this.detailListData = {}
      this.fileList = []
      this.dialogType = 'new'
      this.dialogDetailVisible = true
    },
    handleDetailEdit(scope) {
      this.dialogType = 'edit'
      this.dialogDetailVisible = true
      this.checkStrictly = true
      this.detailListData = deepClone(scope.row)
      this.imgUrl = this.data.thumb2
      this.$nextTick(() => {
        this.checkStrictly = false
      })
    },
    handleDetailDelete({ $index, row }) {
      this.$confirm('确定删除该条数据?', '警告', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      })
        .then(async() => {
          await deleteDetailData(row.id)
          this.getDetailList()
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
        .catch(err => { console.error(err) })
    },
    async confirmDetailData() {
      const isEdit = this.dialogType === 'edit'
      this.detailListData.movie_id = this.detailData.id
      if (isEdit) {
        await updateDetailData(this.detailListData.id, this.detailListData)
      } else {
        await addDetailData(this.detailListData)
      }
      this.getDetailList()
      this.dialogDetailVisible = false
      this.$message({
        type: 'success',
        message: '保存成功'
      })
    },
    beforeVideoUpload(file) {
      return true
    },
    handleVideoRemove(file, fileList) {
      this.fileList = []
      this.detailListData.url = ''
    },
    handleVideoSuccess(res, file) {
      if (res.code === 200) {
        this.detailListData.url = res.data.video_url
        this.detailListData.thumb = res.data.img
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
