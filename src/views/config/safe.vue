<template>
  <div class="app-container">
    <el-tabs v-model="activeTab" v-loading="loading" type="border-card">
      <el-tab-pane label="护驾卫士" name="safe">
        <el-form ref="mForm" :model="form" label-width="200px">
          <el-form-item label="开关">
            <el-switch v-model="form.safe_cy_status" active-color="#13ce66" inactive-color="#ff4949" />
          </el-form-item>
          <el-form-item label="客户代码">
            <el-input v-model="form.safe_cy_n" placeholder="创宇客户代码" />
          </el-form-item>
          <el-form-item label="客户密钥">
            <el-input v-model="form.safe_cy_app_key" placeholder="创宇客户密钥" />
          </el-form-item>
          <el-form-item label="客户业务编码">
            <el-input v-model="form.safe_cy_customer_code" placeholder="创宇客户业务编码" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保 存</el-button>
            <el-button @click="onBack">返 回</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { saveData, getData } from '../../api/config'
import { deepClone } from '../../utils'
export default {
  data() {
    return {
      activeTab: 'safe',
      loading: false,
      form: {
        safe_cy_status: '',
        safe_cy_n: '',
        safe_cy_app_key: '',
        safe_cy_customer_code: ''
      }
    }
  },
  created() {
    this.getConfig()
  },
  methods: {
    async getConfig() {
      if (this.$store.getters.username !== 'demo') {
        const res = await getData()
        this.form = deepClone(res.data)
      }
    },
    async onSubmit() {
      if (this.loading) {
        return
      }
      this.loading = true
      const res = await saveData(this.form)
      this.loading = false
      this.$message({
        type: (res.code === 200) ? 'success' : 'error',
        message: res.msg
      })
    },
    onBack() {
      this.$router.go(-1)
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
