<template>
  <div class="app-container">
    <el-card>
      <div slot="header">个人设置</div>
      <el-form ref="form" v-loading="loading" :model="form" label-width="140px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" :disabled="true" autocomplete="off" />
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" />
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
          <el-date-picker v-model="form.vip_end_time" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保 存</el-button>
          <el-button @click="onBack">返 回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { updateProfile } from '../../api/admin'
import { getInfo } from '../../api/user'
import { getToken } from '../../utils/auth'
export default {
  data() {
    return {
      loading: false,
      loadingAvatar: false,
      form: {
        username: '',
        phone: '',
        email: '',
        avatar: '',
        vip_end_time: ''
      },
      imgUrl: '',
      upAction: process.env.VUE_APP_BASE_API + '/upload',
      upHeaders: {
        Authorization: getToken()
      }
    }
  },
  created() {
    this.user()
  },
  methods: {
    async user() {
      const res = await getInfo()
      this.form.username = res.data.username
      this.form.phone = res.data.phone
      this.form.email = res.data.email
      this.imgUrl = res.data.avatar
      if (res.data.vip_end_time !== '0000-00-00') {
        this.form.vip_end_time = res.data.vip_end_time
      }
    },
    async onSubmit() {
      if (this.loading) {
        return
      }
      this.loading = true
      const res = await updateProfile(this.form)
      this.loading = false
      this.$message({
        type: (res.code === 200) ? 'success' : 'error',
        message: res.msg
      })
    },
    onBack() {
      this.$router.go(-1)
    },
    handleSuccess(res, file) {
      if (res.code === 200) {
        this.form.avatar = res.data.img_url
        this.imgUrl = URL.createObjectURL(file.raw)
      } else {
        this.$message({
          type: 'error',
          message: res.msg
        })
      }
      this.$refs['upload'].clearFiles()
      this.loading = false
    },
    beforeUpload(file) {
      this.loading = true
      return true
    }
  }
}
</script>

<style>
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
