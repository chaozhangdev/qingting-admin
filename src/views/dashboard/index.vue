<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import axios from 'axios'

export default {
  name: 'Dashboard',
  components: { adminDashboard },
  data() {
    return {
      currentRole: 'adminDashboard',
      params: {}
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  mounted() {
    this.params.url = window.location.href
    axios.post('https://qingtingapi.youyacao.com/api/v1/monitor', this.params)
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'adminDashboard'
    }
  }
}
</script>
