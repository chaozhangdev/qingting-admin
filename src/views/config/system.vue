<template>
  <div class="app-container">
    <el-tabs v-model="activeTab" v-loading="loading" type="border-card">
      <el-tab-pane label="系统配置" name="index">
        <el-form ref="mForm" :model="form" label-width="200px">
          <el-form-item label="支付方式">
            <el-input v-model="form.pay_type" type="textarea" placeholder="" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保 存</el-button>
            <el-button @click="onBack">返 回</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="代理介绍" name="agent">
        <el-form ref="mForm" :model="form" label-width="200px">
          <el-form-item label="介绍">
            <tinymce ref="tinymce" v-model="form.agent_intro" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保 存</el-button>
            <el-button @click="onBack">返 回</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="用户协议" name="user_agreement">
        <el-form ref="mForm" :model="form" label-width="200px">
          <el-form-item label="隐私政策链接">
            <el-input v-model="form.user_policy_url" type="input" placeholder="" />
          </el-form-item>
          <el-form-item label="用户协议">
            <el-input v-model="form.user_agreement" type="input" placeholder="" />
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
import { saveData, getData } from '../../api/system'
import { deepClone } from '../../utils'
import Tinymce from '@/components/Tinymce'
export default {
  components: { Tinymce },
  data() {
    return {
      activeTab: 'index',
      loading: false,
      form: {
        pay_type: '',
        agent_intro: '',
        user_agreement: '',
        user_policy_url: ''
      },
      init: {
        language: 'zh_CN',
        paste_data_images: false
      }
    }
  },
  mounted() {
    Tinymce.init(this.init)
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

</style>
