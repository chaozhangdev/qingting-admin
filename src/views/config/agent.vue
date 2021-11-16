<template>
  <div class="app-container">
    <el-tabs v-model="activeTab" v-loading="loading" type="border-card">
      <el-tab-pane label="代理设置" name="agent">
        <el-form ref="form" :model="form" label-width="200px">
          <el-form-item label="返利账户">
            <el-select v-model="form.agent_account" placeholder="请选择">
              <el-option v-for="(item,index) in accountOption" :key="index" :label="item" :value="index" />
            </el-select>
          </el-form-item>
          <el-form-item label="邀请返现基数">
            <el-input v-model="form.agent_back_amount" placeholder="邀请返现基数(如填100，上级返利就是乘以返利比例)" />
          </el-form-item>
          <el-form-item label="代理级数">
            <el-select v-model="form.agent_level" placeholder="请选择" @change="changeAgent">
              <el-option v-for="item in agentOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item v-for="item in config" :key="item.title" :label="item.title">
            <el-input v-model="item.rate" placeholder="返利比例（%）" />
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
import { accountType } from '../../api/users'
import { deepClone } from '../../utils'
export default {
  data() {
    return {
      activeTab: 'agent',
      loading: false,
      form: {
        agent_level: '0',
        agent_account: '0',
        agent_back_amount: '0',
        agent_config: ''
      },
      config: [
      ],
      agents: {
        1: '一级代理',
        2: '二级代理',
        3: '三级代理',
        4: '四级代理',
        5: '五级代理'
      },
      agentOption: [
        {
          label: '关闭代理',
          value: '0'
        },
        {
          label: '一级代理',
          value: '1'
        },
        {
          label: '二级代理',
          value: '2'
        },
        {
          label: '三级代理',
          value: '3'
        },
        {
          label: '四级代理',
          value: '4'
        },
        {
          label: '五级代理',
          value: '5'
        }
      ],
      accountOption: []
    }
  },
  created() {
    this.getInit()
    this.getConfig()
  },
  methods: {
    async getInit() {
      const res = await accountType({})
      this.accountOption = res.data
    },
    async getConfig() {
      if (this.$store.getters.username !== 'demo') {
        const res = await getData()
        this.form = deepClone(res.data)
        this.config = JSON.parse(this.form.agent_config)
      }
    },
    async onSubmit() {
      if (this.loading) {
        return
      }
      this.loading = true
      this.form.agent_config = JSON.stringify(this.config)
      const res = await saveData(this.form)
      this.loading = false
      this.$message({
        type: (res.code === 200) ? 'success' : 'error',
        message: res.msg
      })
    },
    changeAgent(val) {
      this.config = []
      if (val <= 0) {
        return
      }
      for (let i = 1; i <= val; i++) {
        this.config.push({
          title: this.agents[i] + '返利比例（%）',
          rate: 0
        })
      }
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
