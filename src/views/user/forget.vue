<template>
  <div class="app-container">
    <el-card>
      <div slot="header">修改密码</div>
      <el-form ref="form" v-loading="loading" :model="form" label-width="140px">
        <el-form-item label="原密码">
          <el-input v-model="form.old_password" show-password autocomplete="off" />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="form.password" show-password autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="form.password_confirmation" show-password autocomplete="off" />
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
import { forget } from '../../api/user'
export default {
  data() {
    return {
      loading: false,
      form: {
        old_password: '',
        password: '',
        password_confirmation: ''
      }
    }
  },
  created() {
  },
  methods: {
    async onSubmit() {
      if (this.form.old_password === '') {
        this.$message({
          type: 'error',
          message: '原密码不能为空'
        })
        return
      }
      if (this.form.password === '') {
        this.$message({
          type: 'error',
          message: '新密码不能为空'
        })
        return
      }
      if (this.form.password !== this.form.password_confirmation) {
        this.$message({
          type: 'error',
          message: '两次密码不一样'
        })
        return
      }
      if (this.loading) {
        return
      }
      this.loading = true
      const res = await forget(this.form)
      this.$message({
        type: (res.code === 200) ? 'success' : 'error',
        message: res.msg
      })
      this.loading = false
    },
    onBack() {
      this.$router.go(-1)
    }
  }
}
</script>
