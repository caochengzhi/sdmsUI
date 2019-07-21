
<template>
  <div class="container">
    <div>
      <el-form :model="searchFrm">
        <el-row :gutter="50">
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="PO：">
              <el-input v-model="searchForm.poNumber" placeholder="PO"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="产地：">
              <dict-select @getDictVal="getOriginPlace" v-bind:dictCode="'origin'"></dict-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="8">
            <el-form-item label="采购日期：">
              <el-date-picker
                v-model="searchForm.dateOfPurchase"
                align="right"
                type="date"
                placeholder="发车日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
    
<script>
export default {
  name: "",
  data() {
    return {
      searchFrm: {}
    };
  },

  components: {},

  computed: {},

  beforeMount() {},

  mounted() {},

  methods: {},

  watch: {}
};
</script>

