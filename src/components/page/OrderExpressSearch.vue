<template>
  <div class="container">
    <div>
      <el-form ref="form" :model="searchForm" label-width="auto">
        <el-row :gutter="50">
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="店铺选择:">
              <dict-select @getDictVal="getSearchCustomerList" v-bind:dictCode="'customerList'"></dict-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
    
<script>
export default {
  name: "OrderExpressManagement",
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {},

  watch: {}
};
</script>