<template>
  <div class="container">
    <el-form ref="form" :model="form" label-width="auto">
      <el-tabs>
        <el-tab-pane label="编辑角色" name="first">角色管理</el-tab-pane>
        <el-tab-pane label="编辑权限" name="second">权限管理</el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>
    
<script>
export default {
  name: "modifyRole",
  data() {
    return {};
  },

  components: {},

  computed: {},

  beforeMount() {},

  mounted() {},

  methods: {}
};
</script>
    <style lang='' scoped>
</style>
