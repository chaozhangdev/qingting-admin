<template>
  <div class="app-container">
    <el-card>
      <div slot="header">用户列表</div>
      <el-form :inline="true">
        <div class="filter-container">
          <el-select v-model="listQuery.status" placeholder="全部" clearable style="width: 90px" class="filter-item">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-input v-model="listQuery.keyword" placeholder="用户名/手机号/邮箱" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
          <!--
          <el-button class="filter-item" style="margin-left: 0px;" type="success" icon="el-icon-circle-plus" @click="handleCreate">
            新增
          </el-button>
          -->
        </div>
      </el-form>
      <el-table ref="multipleTable" v-loading="loading" tooltip-effect="dark" :data="list" style="width: 100%;" stripe @selection-change="handleSelectionChange">
        <el-table-column align="left" type="selection" width="50" />
        <el-table-column align="left" label="ID" width="80">
          <template slot-scope="scope">
            {{ scope.row.id }}
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
        <el-table-column align="center" label="头像">
          <template slot-scope="scope">
            <el-popover placement="right" title="" trigger="hover">
              <img :src="scope.row.avatar2" style="max-height: 200px">
              <img slot="reference" :src="scope.row.avatar2" :alt="scope.row.avatar2" style="max-height: 80px; max-width: 80px">
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column align="center" label="VIP过期时间">
          <template slot-scope="scope">
            {{ scope.row.vip_end_time ? scope.row.vip_end_time:'未开通' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="邀请码" width="80">
          <template slot-scope="scope">
            {{ scope.row.refcode }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="最后登录时间">
          <template slot-scope="scope">
            {{ (scope.row.last_login_time === '0000-00-00 00:00:00') ? '未登录':scope.row.last_login_time }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="注册时间">
          <template slot-scope="scope">
            {{ scope.row.created_at }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否可直播" width="60">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.can_live == 1" type="success" size="mini">是</el-tag>
            <el-tag v-else type="danger" size="mini">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="60">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 1" type="success" size="mini">正常</el-tag>
            <el-tag v-else type="danger" size="mini">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope)">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button class="el-pl" plain size="mini" style="margin-left: 0px;" type="success" @click="handleBatchDisable(1)">
        批量启用
      </el-button>
      <el-button class="el-pl" plain size="mini" style="margin-left: 0px;" type="warning" @click="handleBatchDisable(2)">
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
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑用户':'新增用户'">
      <el-form :model="data" label-width="140px">
        <el-form-item label="用户名">
          <el-input v-model="data.username" placeholder="用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="data.password" placeholder="密码" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="data.phone" placeholder="手机号" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="data.email" placeholder="邮箱" />
        </el-form-item>
        <el-form-item label="头像">
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
        <el-form-item label="VIP过期时间">
          <el-date-picker v-model="data.vip_end_time" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="用户标签">
          <el-select v-model="data.tags" filterable multiple placeholder="请选择" style="width: 400px;">
            <el-option v-for="item in tagsOption" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="data.sex" placeholder="请选择" style="width: 400px;">
            <el-option v-for="item in sexOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否可直播">
          <el-select v-model="data.can_live" placeholder="请选择" style="width: 400px;">
            <el-option v-for="item in canLiveOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否认证">
          <el-select v-model="data.is_auth" placeholder="请选择" style="width: 400px;">
            <el-option v-for="item in authOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否开通语音">
          <el-select v-model="data.is_audio" placeholder="请选择" style="width: 400px;">
            <el-option v-for="item in audioOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
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
import { getDatas, addData, deleteData, updateData, batchDisable } from '@/api/users'
import { getUserTags } from '@/api/userTags'
import { getToken } from '../../utils/auth'

const defaultData = {
  id: '',
  username: '',
  password: '',
  phone: '',
  email: '',
  avatar: '',
  sex: '0',
  vip_end_time: '',
  tags: [],
  can_live: '',
  is_auth: '',
  is_audio: ''
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
          label: '正常'
        }, {
          value: '2',
          label: '禁用'
        }
      ],
      sexOption: [
        {
          value: 0,
          label: '保密'
        },
        {
          value: 1,
          label: '男'
        }, {
          value: 2,
          label: '女'
        }
      ],
      canLiveOption: [
        {
          value: 0,
          label: '否'
        },
        {
          value: 1,
          label: '是'
        }
      ],
      authOption: [
        {
          value: 'NO',
          label: '否'
        },
        {
          value: 'YES',
          label: '是'
        }
      ],
      audioOption: [
        {
          value: '0',
          label: '否'
        },
        {
          value: '1',
          label: '是'
        }
      ],
      tagsOption: [],
      listQuery: {
        page: 1,
        limit: 10,
        keyword: '',
        status: '',
        order: 'DESC'
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
    this.getTags()
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
    async getTags() {
      const res = await getUserTags({
        page: 1,
        limit: 100,
        status: 2
      })
      this.tagsOption = res.data.data
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
      this.imgUrl = this.data.avatar2
      if (this.data.vip_end_time === '0') {
        this.data.vip_end_time = ''
      }
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
        this.getList()
      } else {
        await addData(this.data)
        this.getList()
      }
      this.dialogVisible = false
      this.$message({
        type: 'success',
        message: '保存成功'
      })
    },
    handleSuccess(res, file) {
      if (res.code === 200) {
        this.data.avatar = res.data.img_url
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
